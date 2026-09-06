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
import { Pre2faPayload, JwtPayload } from './interfaces/jwt-payload.interface';

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MINUTOS = 15;
const IDADE_MINIMA_ANOS = 18; 

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

  
  
  
  async cadastrar(dto: CadastroDto) {
    const existente = this.db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dto.email);
    if (existente) {
      throw new ConflictException({ erro: 'Já existe um usuário com este e-mail.' });
    }

    
    const idade = calcularIdade(dto.data_nascimento);
    if (idade < IDADE_MINIMA_ANOS) {
      throw new BadRequestException({
        erro: `É necessário ter pelo menos ${IDADE_MINIMA_ANOS} anos para se cadastrar.`,
      });
    }

    
    const nomeUsuario = await this.gerarNomeUsuarioUnico(dto.nome_usuario, dto.email);

    
    const senhaHash = bcrypt.hashSync(dto.senha, 10);

    const resultado = this.db
      .prepare(
        `INSERT INTO usuarios (nome, nome_usuario, email, senha_hash, telefone, data_nascimento, email_confirmado)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
      )
      .run(dto.nome, nomeUsuario, dto.email, senhaHash, dto.telefone || null, dto.data_nascimento);

    const usuarioId = Number(resultado.lastInsertRowid);
    this.auditoria.registrarLog(usuarioId, 'cadastro', `Usuário ${dto.email} cadastrado`);

    
    const tokenDev = await this.enviarTokenConfirmacaoEmail(usuarioId, dto.email);

    return {
      mensagem:
        'Cadastro realizado com sucesso. Enviamos um código de confirmação para o seu e-mail — confirme antes de fazer login.',
      nome_usuario: nomeUsuario,
      token_dev: tokenDev, 
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
    const token = crypto.randomInt(100000, 999999).toString(); 
    const expiraEm = new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(); 

    this.db
      .prepare('INSERT INTO tokens_confirmacao_email (usuario_id, token, expira_em) VALUES (?, ?, ?)')
      .run(usuarioId, token, expiraEm);

    
    console.log('\n==============================================');
    console.log(`  CÓDIGO GERADO PARA O E-MAIL: ${emailDestino}`);
    console.log(`  👉 TOKEN: ${token} 👈`);
    console.log('==============================================\n');

    try {
      await this.email.enviar(
        emailDestino,
        'Confirme seu cadastro no Explora+',
        `Seu código de confirmação é: ${token}\n\nEle expira em 10 minutos.`,
      );
    } catch (e) {
      
    }

    return token;
  }

  
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

  
  
  
  async solicitarRecuperacaoSenha(dto: RecuperarSenhaDto) {
    const usuario = this.db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dto.email) as
      | { id: number }
      | undefined;

    
    
    const respostaGenerica = {
      mensagem: 'Se este e-mail estiver cadastrado, enviamos um link de redefinição de senha.',
    };

    if (!usuario) {
      return respostaGenerica;
    }

    const token = crypto.randomInt(100000, 999999).toString();
    const expiraEm = new Date(Date.now() + 10 * 60 * 1000).toISOString(); 

    this.db
      .prepare('INSERT INTO tokens_recuperacao (usuario_id, token, expira_em) VALUES (?, ?, ?)')
      .run(usuario.id, token, expiraEm);

    console.log('\n==============================================');
    console.log(`  CÓDIGO DE RECUPERAÇÃO DE SENHA PARA: ${dto.email}`);
    console.log(`  👉 TOKEN: ${token} 👈`);
    console.log('==============================================\n');

    try {
      await this.email.enviar(
        dto.email,
        'Recuperação de senha — Explora+',
        `Seu código para redefinir a senha é: ${token}\n\nEle expira em 10 minutos. Se você não pediu isso, ignore este e-mail.`,
      );
    } catch (e) {
      
    }

    this.auditoria.registrarLog(usuario.id, 'recuperacao_senha_solicitada');

    return { ...respostaGenerica, token_dev: token };
  }

  
  
  
  redefinirSenha(dto: RedefinirSenhaDto) {
    const usuario = this.db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dto.email) as
      | { id: number }
      | undefined;

    if (!usuario) {
      throw new BadRequestException({ erro: 'Solicitação inválida.' });
    }

    const registroToken = this.db
      .prepare(
        `SELECT id, expira_em FROM tokens_recuperacao
         WHERE usuario_id = ? AND token = ? AND usado = 0
         ORDER BY id DESC LIMIT 1`,
      )
      .get(usuario.id, dto.token) as { id: number; expira_em: string } | undefined;

    if (!registroToken || new Date(registroToken.expira_em) < new Date()) {
      throw new BadRequestException({ erro: 'Código de recuperação inválido ou expirado.' });
    }

    
    const novaSenhaHash = bcrypt.hashSync(dto.novaSenha, 10);

    this.db
      .prepare(
        'UPDATE usuarios SET senha_hash = ?, tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?',
      )
      .run(novaSenhaHash, usuario.id);
    this.db.prepare('UPDATE tokens_recuperacao SET usado = 1 WHERE id = ?').run(registroToken.id);

    this.auditoria.registrarLog(usuario.id, 'senha_redefinida');

    return { mensagem: 'Senha redefinida com sucesso. Faça login com a nova senha.' };
  }

  
  
  
  async login(dto: LoginDto, res: Response) {
    const usuario = this.db
      .prepare('SELECT * FROM usuarios WHERE email = ?')
      .get(dto.email) as unknown as UsuarioRow | undefined;

    
    
    const erroCredenciais = { erro: 'E-mail ou senha incorretos.' };

    if (!usuario) {
      throw new UnauthorizedException(erroCredenciais);
    }

    
    if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
      const minutosRestantes = Math.ceil(
        (new Date(usuario.bloqueado_ate).getTime() - Date.now()) / 60000,
      );
      throw new ForbiddenException({
        erro: `Muitas tentativas de login incorretas. Tente novamente em ${minutosRestantes} minuto(s).`,
      });
    }

    const senhaCorreta = bcrypt.compareSync(dto.senha, usuario.senha_hash);

    if (!senhaCorreta) {
      const tentativas = usuario.tentativas_login + 1;
      const bloquear = tentativas >= MAX_TENTATIVAS;

      this.db
        .prepare('UPDATE usuarios SET tentativas_login = ?, bloqueado_ate = ? WHERE id = ?')
        .run(
          bloquear ? 0 : tentativas,
          bloquear ? new Date(Date.now() + BLOQUEIO_MINUTOS * 60000).toISOString() : null,
          usuario.id,
        );

      this.auditoria.registrarLog(usuario.id, 'login_falhou', `Tentativa ${tentativas} de ${MAX_TENTATIVAS}`);

      if (bloquear) {
        throw new ForbiddenException({
          erro: `Muitas tentativas de login incorretas. Sua conta foi bloqueada por ${BLOQUEIO_MINUTOS} minutos.`,
        });
      }
      throw new UnauthorizedException(erroCredenciais);
    }

    
    if (usuario.tentativas_login > 0 || usuario.bloqueado_ate) {
      this.db
        .prepare('UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?')
        .run(usuario.id);
    }

    if (usuario.ativo !== 1) {
      throw new ForbiddenException({ erro: 'Esta conta está desativada.' });
    }

    
    if (usuario.email_confirmado !== 1) {
      throw new ForbiddenException({
        erro: 'Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.',
      });
    }

    
    
    if (usuario.totp_ativo === 1) {
      const tokenPre2fa = this.jwtService.sign(
        { id: usuario.id, pre2fa: true } as Pre2faPayload,
        { expiresIn: '5m' },
      );
      return {
        pre2fa: true,
        token_pre2fa: tokenPre2fa,
        mensagem: 'Informe o código do seu aplicativo autenticador para concluir o login.',
      };
    }

    
    this.emitirSessao(usuario, res);
    this.auditoria.registrarLog(usuario.id, 'login', `Login bem-sucedido de ${usuario.email}`);

    return {
      mensagem: 'Login realizado com sucesso.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }

  
  
  private emitirSessao(usuario: { id: number; email: string; role: string }, res: Response) {
    const jti = crypto.randomUUID();
    const token = this.jwtService.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role, jti },
      { expiresIn: '30m' },
    );
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      signed: true,
      maxAge: 30 * 60 * 1000,
    });
  }

  
  
  
  async habilitar2fa(usuarioId: number) {
    const usuario = this.db.prepare('SELECT email, totp_ativo FROM usuarios WHERE id = ?').get(usuarioId) as
      | { email: string; totp_ativo: number }
      | undefined;

    if (!usuario) {
      throw new BadRequestException({ erro: 'Usuário não encontrado.' });
    }
    if (usuario.totp_ativo === 1) {
      throw new BadRequestException({ erro: 'A autenticação em duas etapas já está ativa nesta conta.' });
    }

    const segredo = authenticator.generateSecret();
    this.db.prepare('UPDATE usuarios SET totp_secret = ? WHERE id = ?').run(segredo, usuarioId);

    const otpauthUrl = authenticator.keyuri(usuario.email, 'Explora+', segredo);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    return {
      mensagem: 'Escaneie o QR code no seu aplicativo autenticador e confirme com o código gerado.',
      segredo,
      qr_code: qrCodeDataUrl,
    };
  }

  
  
  
  confirmar2fa(usuarioId: number, codigo: string) {
    const usuario = this.db.prepare('SELECT totp_secret FROM usuarios WHERE id = ?').get(usuarioId) as
      | { totp_secret: string | null }
      | undefined;

    if (!usuario || !usuario.totp_secret) {
      throw new BadRequestException({ erro: 'Inicie a ativação do 2FA antes de confirmar o código.' });
    }

    const valido = authenticator.verify({ token: codigo, secret: usuario.totp_secret });
    if (!valido) {
      throw new BadRequestException({ erro: 'Código inválido. Verifique o app autenticador e tente novamente.' });
    }

    this.db.prepare('UPDATE usuarios SET totp_ativo = 1 WHERE id = ?').run(usuarioId);
    this.auditoria.registrarLog(usuarioId, '2fa_ativado');

    return { mensagem: 'Autenticação em duas etapas ativada com sucesso.' };
  }

  
  
  
  desativar2fa(usuarioId: number, senhaAtual: string) {
    const usuario = this.db.prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(usuarioId) as
      | { senha_hash: string }
      | undefined;

    if (!usuario || !bcrypt.compareSync(senhaAtual, usuario.senha_hash)) {
      throw new UnauthorizedException({ erro: 'Senha atual incorreta.' });
    }

    this.db.prepare('UPDATE usuarios SET totp_ativo = 0, totp_secret = NULL WHERE id = ?').run(usuarioId);
    this.auditoria.registrarLog(usuarioId, '2fa_desativado');

    return { mensagem: 'Autenticação em duas etapas desativada.' };
  }

  
  
  
  verificarLoginComTotp(tokenPre2fa: string, codigo: string, res: Response) {
    let payload: Pre2faPayload;
    try {
      payload = this.jwtService.verify<Pre2faPayload>(tokenPre2fa);
    } catch (erro) {
      throw new UnauthorizedException({ erro: 'Sessão de login expirada. Faça login novamente.' });
    }

    if (!payload.pre2fa) {
      throw new UnauthorizedException({ erro: 'Token inválido.' });
    }

    const usuario = this.db
      .prepare('SELECT id, nome, email, role, totp_secret, totp_ativo FROM usuarios WHERE id = ?')
      .get(payload.id) as
      | { id: number; nome: string; email: string; role: 'usuario' | 'prestador' | 'admin'; totp_secret: string | null; totp_ativo: number }
      | undefined;

    if (!usuario || usuario.totp_ativo !== 1 || !usuario.totp_secret) {
      throw new UnauthorizedException({ erro: 'Não foi possível concluir o login.' });
    }

    const valido = authenticator.verify({ token: codigo, secret: usuario.totp_secret });
    if (!valido) {
      this.auditoria.registrarLog(usuario.id, '2fa_codigo_invalido');
      throw new UnauthorizedException({ erro: 'Código inválido.' });
    }

    this.emitirSessao(usuario, res);
    this.auditoria.registrarLog(usuario.id, 'login_2fa', `Login com 2FA concluído para ${usuario.email}`);

    return {
      mensagem: 'Login realizado com sucesso.',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
    };
  }

  
  
  
  logout(usuario: JwtPayload, res: Response) {
    if (usuario.jti) {
      this.sessoes.invalidar(usuario.jti, new Date(Date.now() + 30 * 60 * 1000));
    }
    res.clearCookie('token');
    this.auditoria.registrarLog(usuario.id, 'logout', `Logout de ${usuario.email}`);
    return { mensagem: 'Você saiu da sua conta.' };
  }
}
