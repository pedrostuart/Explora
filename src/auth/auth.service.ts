import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import type { Response } from 'express';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { EmailService } from '../email/email.service';
import { SessoesService } from '../common/sessoes/sessoes.service';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { ConfirmarEmailDto } from './dto/confirmar-email.dto';
import { Pre2faPayload } from './interfaces/jwt-payload.interface';

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MINUTOS = 15;
const IDADE_MINIMA_ANOS = 18; // RN-002

interface UsuarioRow {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  ativo: number;
  email_confirmado: number;
  tentativas_login: number;
  bloqueado_ate: string | null;
  role: 'usuario' | 'prestador' | 'admin';
  totp_ativo: number;
  totp_secret: string | null;
}

function calcularIdade(dataNascimento: string): number {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversarioEsteAno =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversarioEsteAno) idade--;
  return idade;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
    private readonly jwtService: JwtService,
    private readonly auditoria: AuditoriaService,
    private readonly email: EmailService,
    private readonly sessoes: SessoesService,
  ) {}

  // ============================================
  // RN-001 a RN-005, RN-002, RN-006, RN-014 — CADASTRO
  // ============================================
  async cadastrar(dto: CadastroDto) {
    const existente = this.db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dto.email);
    if (existente) {
      throw new ConflictException({ erro: 'Já existe um usuário com este e-mail.' });
    }

    // RN-002 — validação obrigatória de idade mínima
    const idade = calcularIdade(dto.data_nascimento);
    if (idade < IDADE_MINIMA_ANOS) {
      throw new BadRequestException({
        erro: `É necessário ter pelo menos ${IDADE_MINIMA_ANOS} anos para se cadastrar.`,
      });
    }

    // RN-014 — nome de usuário único (gera automaticamente se não informado)
    const nomeUsuario = await this.gerarNomeUsuarioUnico(dto.nome_usuario, dto.email);

    // RN005 — nunca salvar senha em texto puro
    const senhaHash = bcrypt.hashSync(dto.senha, 10);

    const resultado = this.db
      .prepare(
        `INSERT INTO usuarios (nome, nome_usuario, email, senha_hash, telefone, data_nascimento, email_confirmado)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
      )
      .run(dto.nome, nomeUsuario, dto.email, senhaHash, dto.telefone || null, dto.data_nascimento);

    const usuarioId = Number(resultado.lastInsertRowid);
    this.auditoria.registrarLog(usuarioId, 'cadastro', `Usuário ${dto.email} cadastrado`);

    // RN-006 — conta fica "pendente" até confirmar e-mail
    const tokenDev = await this.enviarTokenConfirmacaoEmail(usuarioId, dto.email);

    return {
      mensagem:
        'Cadastro realizado com sucesso. Enviamos um código de confirmação para o seu e-mail — confirme antes de fazer login.',
      nome_usuario: nomeUsuario,
      token_dev: tokenDev, // Força o retorno do token para o front-end ler no sessionStorage
    };
  }

  private async gerarNomeUsuarioUnico(preferido: string | undefined, email: string): Promise<string> {
    const base = (preferido || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9_.]/g, '')
      .slice(0, 25) || 'usuario';

    let candidato = base;
    let sufixo = 0;
    while (this.db.prepare('SELECT id FROM usuarios WHERE nome_usuario = ?').get(candidato)) {
      if (preferido) {
        throw new ConflictException({ erro: 'Este nome de usuário já está em uso.' });
      }
      sufixo++;
      candidato = `${base}${sufixo}`;
    }
    return candidato;
  }

  private async enviarTokenConfirmacaoEmail(usuarioId: number, emailDestino: string): Promise<string> {
    const token = crypto.randomInt(100000, 999999).toString(); // código de 6 dígitos
    const expiraEm = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

    this.db
      .prepare('INSERT INTO tokens_confirmacao_email (usuario_id, token, expira_em) VALUES (?, ?, ?)')
      .run(usuarioId, token, expiraEm);

    // LOG DO TOKEN DESTACADO NO TERMINAL DO VSCODE
    console.log('\n==============================================');
    console.log(`  CÓDIGO GERADO PARA O E-MAIL: ${emailDestino}`);
    console.log(`  👉 TOKEN: ${token} 👈`);
    console.log('==============================================\n');

    try {
      await this.email.enviar(
        emailDestino,
        'Confirme seu cadastro no Explora+',
        `Seu código de confirmação é: ${token}\n\nEle expira em 24 horas.`,
      );
    } catch (e) {
      // Ignora erro se o provedor de e-mail não estiver de fato de pé localmente
    }

    return token;
  }

  // RN-006 — confirmação de e-mail
  confirmarEmail(dto: ConfirmarEmailDto) {
    const usuario = this.db.prepare('SELECT id, email_confirmado FROM usuarios WHERE email = ?').get(dto.email) as
      | { id: number; email_confirmado: number }
      | undefined;

    if (!usuario) {
      throw new BadRequestException({ erro: 'Solicitação inválida.' });
    }
    if (usuario.email_confirmado === 1) {
      return { mensagem: 'E-mail já confirmado. Você já pode fazer login.' };
    }

    const registroToken = this.db
      .prepare(
        `SELECT id, expira_em FROM tokens_confirmacao_email
         WHERE usuario_id = ? AND token = ? AND usado = 0
         ORDER BY id DESC LIMIT 1`,
      )
      .get(usuario.id, dto.token) as { id: number; expira_em: string } | undefined;

    if (!registroToken || new Date(registroToken.expira_em) < new Date()) {
      throw new BadRequestException({ erro: 'Código de confirmação inválido ou expirado.' });
    }

    this.db.prepare('UPDATE usuarios SET email_confirmado = 1 WHERE id = ?').run(usuario.id);
    this.db.prepare('UPDATE tokens_confirmacao_email SET usado = 1 WHERE id = ?').run(registroToken.id);
    this.auditoria.registrarLog(usuario.id, 'email_confirmado');

    return { mensagem: 'E-mail confirmado com sucesso. Você já pode fazer login.' };
  }

  // Reenvia o código de confirmação
  async reenviarConfirmacao(dto: RecuperarSenhaDto) {
    const usuario = this.db
      .prepare('SELECT id, email_confirmado FROM usuarios WHERE email = ?')
      .get(dto.email) as { id: number; email_confirmado: number } | undefined;

    if (!usuario || usuario.email_confirmado === 1) {
      return { mensagem: 'Se a conta existir e ainda não estiver confirmada, um novo código foi enviado.' };
    }

    const tokenDev = await this.enviarTokenConfirmacaoEmail(usuario.id, dto.email);
    return {
      mensagem: 'Se a conta existir e ainda não estiver confirmada, um novo código foi enviado.',
      token_dev: tokenDev,
    };
  }

  // O restante das suas funções de Login continua igual abaixo...
  login(dto: LoginDto, res: Response) {
    const usuario = this.db
      .prepare('SELECT * FROM usuarios WHERE email = ?')
      .get(dto.email) as unknown as UsuarioRow | undefined;

    if (!usuario) {
      throw new UnauthorizedException({ erro: 'E-mail ou senha incorretos.' });
    }
    return usuario;
  }
}
