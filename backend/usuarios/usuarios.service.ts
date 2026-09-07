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

  
  
  
  atualizarPerfil(usuarioId: number, dto: AtualizarPerfilDto) {
    
    
    
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

    
    this.auditoria.registrarLog(usuarioId, 'perfil_atualizado', JSON.stringify(dto));

    return { mensagem: 'Perfil atualizado com sucesso.' };
  }

  
  
  
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

  
  
  
  trocarSenha(usuarioId: number, senhaAtual: string, novaSenha: string) {
    this.confirmarSenha(usuarioId, senhaAtual); 

    const novaSenhaHash = bcrypt.hashSync(novaSenha, 10);
    this.db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(novaSenhaHash, usuarioId);
    this.auditoria.registrarLog(usuarioId, 'senha_alterada');

    return { mensagem: 'Senha alterada com sucesso.' };
  }

  
  
  
  desativarConta(usuarioId: number, senhaAtual: string, res: Response, jti?: string) {
    this.confirmarSenha(usuarioId, senhaAtual); 

    this.db.prepare('UPDATE usuarios SET ativo = 0 WHERE id = ?').run(usuarioId);
    this.auditoria.registrarLog(usuarioId, 'conta_desativada');

    if (jti) this.sessoes.invalidar(jti, new Date(Date.now() + 30 * 60 * 1000)); 
    res.clearCookie('token');
    return { mensagem: 'Conta desativada com sucesso.' };
  }

  
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

  
  alterarPapel(adminId: number, usuarioIdAlvo: number, role: 'usuario' | 'prestador' | 'admin') {
    const resultado = this.db.prepare('UPDATE usuarios SET role = ? WHERE id = ?').run(role, usuarioIdAlvo);
    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Usuário não encontrado.' });
    }

    this.auditoria.registrarLog(adminId, 'papel_alterado', `id ${usuarioIdAlvo} -> role=${role}`);
    return { mensagem: `Papel do usuário atualizado para "${role}".` };
  }

  
  
  
  excluirConta(usuarioId: number, senhaAtual: string, res: Response, jti?: string) {
    this.confirmarSenha(usuarioId, senhaAtual); 

    
    
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

    
    

    this.auditoria.registrarLog(usuarioId, 'conta_excluida_lgpd');

    if (jti) this.sessoes.invalidar(jti, new Date(Date.now() + 30 * 60 * 1000)); 
    res.clearCookie('token');
    return { mensagem: 'Conta excluída e dados pessoais removidos conforme LGPD.' };
  }
}
