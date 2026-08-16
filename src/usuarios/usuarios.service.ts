import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';
import type { Response } from 'express';
import * as bcrypt from 'bcryptjs';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { SessoesService } from '../common/sessoes/sessoes.service';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
    private readonly auditoria: AuditoriaService,
    private readonly sessoes: SessoesService,
  ) {}

  // ============================================
  // RN011, RN012 — VER O PRÓPRIO PERFIL
  // ============================================
  meuPerfil(usuarioId: number) {
    const usuario = this.db
      .prepare(
        `SELECT id, nome, nome_usuario, email, telefone, foto, cidade, biografia,
                data_nascimento, data_cadastro, ativo, role, totp_ativo
         FROM usuarios WHERE id = ?`,
      )
      .get(usuarioId);

    if (!usuario) {
      throw new NotFoundException({ erro: 'Usuário não encontrado.' });
    }

    return { usuario };
  }

  // ============================================
  // RN012, RN013, RN014, RN021, RN022, RN024, RN025 — EDITAR PRÓPRIO PERFIL
  // ============================================
  atualizarPerfil(usuarioId: number, dto: AtualizarPerfilDto) {
    // RN012 — usuário só edita os próprios dados: usamos o id do token,
    // NUNCA um id vindo do corpo da requisição.
    // RN019 — nunca aceitamos alterar data_cadastro (nem está na lista de campos abaixo).
    const camposPermitidos: (keyof AtualizarPerfilDto)[] = ['nome', 'telefone', 'cidade', 'biografia'];
    const atualizacoes: string[] = [];
    const valores: unknown[] = [];

    for (const campo of camposPermitidos) {
      if (dto[campo] !== undefined) {
        atualizacoes.push(`${campo} = ?`);
        valores.push(dto[campo]);
      }
    }

    if (atualizacoes.length === 0) {
      throw new BadRequestException({ erro: 'Nenhum campo válido para atualizar.' });
    }

    valores.push(usuarioId);
    this.db.prepare(`UPDATE usuarios SET ${atualizacoes.join(', ')} WHERE id = ?`).run(...(valores as any[]));

    // RN024 — alterações registradas em log
    this.auditoria.registrarLog(usuarioId, 'perfil_atualizado', JSON.stringify(dto));

    return { mensagem: 'Perfil atualizado com sucesso.' };
  }

  // ============================================
  // RN015, RN016, RN023, RN024 — ALTERAR FOTO
  // ============================================
  atualizarFoto(usuarioId: number, arquivo: { filename: string } | undefined) {
    if (!arquivo) {
      throw new BadRequestException({ erro: 'Nenhuma imagem enviada.' });
    }

    const caminhoRelativo = `/uploads/fotos/${arquivo.filename}`;
    this.db.prepare('UPDATE usuarios SET foto = ? WHERE id = ?').run(caminhoRelativo, usuarioId);

    this.auditoria.registrarLog(usuarioId, 'foto_atualizada', caminhoRelativo);

    return { mensagem: 'Foto atualizada com sucesso.', foto: caminhoRelativo };
  }

  private confirmarSenha(usuarioId: number, senhaAtual: string) {
    const usuario = this.db.prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(usuarioId) as
      | { senha_hash: string }
      | undefined;
    if (!usuario || !bcrypt.compareSync(senhaAtual, usuario.senha_hash)) {
      throw new UnauthorizedException({ erro: 'Senha atual incorreta.' });
    }
  }

  // ============================================
  // RN020, RN-011, RN-015 — DESATIVAR CONTA (exige senha atual + encerra sessão)
  // ============================================
  desativarConta(usuarioId: number, senhaAtual: string, res: Response, jti?: string) {
    this.confirmarSenha(usuarioId, senhaAtual); // RN-011

    this.db.prepare('UPDATE usuarios SET ativo = 0 WHERE id = ?').run(usuarioId);
    this.auditoria.registrarLog(usuarioId, 'conta_desativada');

    if (jti) this.sessoes.invalidar(jti, new Date(Date.now() + 30 * 60 * 1000)); // RN-015
    res.clearCookie('token');
    return { mensagem: 'Conta desativada com sucesso.' };
  }

  // RN086 — administradores poderão bloquear/desbloquear usuários
  alterarAtivo(adminId: number, usuarioIdAlvo: number, ativaBruto: unknown) {
    const ativa = Number(ativaBruto);
    if (ativa !== 0 && ativa !== 1) {
      throw new BadRequestException({ erro: 'O campo "ativa" deve ser 0 ou 1.' });
    }

    const resultado = this.db.prepare('UPDATE usuarios SET ativo = ? WHERE id = ?').run(ativa, usuarioIdAlvo);
    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Usuário não encontrado.' });
    }

    this.auditoria.registrarLog(adminId, 'usuario_ativo_alterado', `id ${usuarioIdAlvo} -> ativa=${ativa}`);
    return { mensagem: `Usuário ${ativa === 1 ? 'ativado' : 'bloqueado'} com sucesso.` };
  }

  // RN-012 — admin promove/altera o papel de um usuário (usuario/prestador/admin)
  alterarPapel(adminId: number, usuarioIdAlvo: number, role: 'usuario' | 'prestador' | 'admin') {
    const resultado = this.db.prepare('UPDATE usuarios SET role = ? WHERE id = ?').run(role, usuarioIdAlvo);
    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Usuário não encontrado.' });
    }

    this.auditoria.registrarLog(adminId, 'papel_alterado', `id ${usuarioIdAlvo} -> role=${role}`);
    return { mensagem: `Papel do usuário atualizado para "${role}".` };
  }

  // ============================================
  // RN017, RN018, RN-011, RN-015 — EXCLUIR CONTA (LGPD, exige senha atual)
  // ============================================
  excluirConta(usuarioId: number, senhaAtual: string, res: Response, jti?: string) {
    this.confirmarSenha(usuarioId, senhaAtual); // RN-011

    // RN017 — remove dados pessoais (mantém a linha para não quebrar referências
    // em avaliações/comentários já feitos, mas anonimiza tudo que identifica a pessoa)
    this.db
      .prepare(
        `UPDATE usuarios
         SET nome = 'Usuário removido',
             nome_usuario = NULL,
             email = 'removido_' || id || '@anonimo.local',
             senha_hash = '',
             telefone = NULL,
             foto = NULL,
             cidade = NULL,
             biografia = NULL,
             data_nascimento = NULL,
             totp_secret = NULL,
             totp_ativo = 0,
             ativo = 0
         WHERE id = ?`,
      )
      .run(usuarioId);

    // RN018 — histórico já não guarda nome/e-mail, só o id, então nada extra a
    // anonimizar ali; a conta em si já ficou irreconhecível acima.

    this.auditoria.registrarLog(usuarioId, 'conta_excluida_lgpd');

    if (jti) this.sessoes.invalidar(jti, new Date(Date.now() + 30 * 60 * 1000)); // RN-015
    res.clearCookie('token');
    return { mensagem: 'Conta excluída e dados pessoais removidos conforme LGPD.' };
  }
}
