import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
    private readonly auditoria: AuditoriaService,
  ) {}

  // RN044 — LISTAR CATEGORIAS ATIVAS (público, para novos cadastros/preferências)
  listarAtivas() {
    const categorias = this.db.prepare('SELECT * FROM categorias WHERE ativa = 1 ORDER BY nome').all();
    return { categorias };
  }

  // Lista todas (incluindo inativas) — só para administração
  listarTodas() {
    const categorias = this.db.prepare('SELECT * FROM categorias ORDER BY nome').all();
    return { categorias };
  }

  // RN084, RN041 — SOMENTE ADMIN CADASTRA, NOME ÚNICO
  criar(adminId: number, dto: CriarCategoriaDto) {
    const existente = this.db.prepare('SELECT id FROM categorias WHERE nome = ?').get(dto.nome);
    if (existente) {
      throw new ConflictException({ erro: 'Já existe uma categoria com esse nome.' }); // RN041
    }

    const resultado = this.db.prepare('INSERT INTO categorias (nome) VALUES (?)').run(dto.nome);
    this.auditoria.registrarLog(adminId, 'categoria_criada', dto.nome);

    return { mensagem: 'Categoria criada com sucesso.', id: resultado.lastInsertRowid };
  }

  // RN043 — ATIVAR/DESATIVAR CATEGORIA (admin)
  alterarStatus(adminId: number, id: number, ativaBruto: unknown) {
    const ativa = Number(ativaBruto);
    if (ativa !== 0 && ativa !== 1) {
      throw new BadRequestException({ erro: 'Campo "ativa" deve ser 0 ou 1.' });
    }

    const resultado = this.db.prepare('UPDATE categorias SET ativa = ? WHERE id = ?').run(ativa, id);
    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Categoria não encontrada.' });
    }

    this.auditoria.registrarLog(adminId, 'categoria_status_alterado', `id ${id} -> ativa=${ativa}`);
    return { mensagem: 'Status da categoria atualizado.' };
  }
}
