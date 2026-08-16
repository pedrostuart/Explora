import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { paginar } from '../common/utils/paginar';

interface EventoStatusRow {
  status: 'ativo' | 'esgotado' | 'encerrado' | 'cancelado';
  capacidade: number;
}

@Injectable()
export class InscricoesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  // RN-049 — lotação máxima: o evento fica "esgotado" automaticamente quando
  // o número de inscrições atinge a capacidade definida pelo organizador.
  // RN036 — eventos encerrados/cancelados/esgotados não aceitam mais inscrições
  inscrever(usuarioId: number, eventoId: string) {
    const evento = this.db
      .prepare('SELECT status, capacidade FROM eventos WHERE id = ?')
      .get(eventoId) as unknown as EventoStatusRow | undefined;

    if (!evento) {
      throw new NotFoundException({ erro: 'Evento não encontrado.' });
    }

    if (evento.status === 'esgotado') {
      throw new BadRequestException({ erro: 'Este evento está esgotado (lotação máxima atingida).' });
    }
    if (evento.status !== 'ativo') {
      throw new BadRequestException({ erro: 'Este evento não está mais aceitando inscrições.' }); // RN036
    }

    try {
      this.db
        .prepare('INSERT INTO inscricoes (usuario_id, evento_id) VALUES (?, ?)')
        .run(usuarioId, eventoId);
    } catch (erro) {
      throw new ConflictException({ erro: 'Você já está inscrito neste evento.' });
    }

    // RN-049 — assim que a lotação é atingida, o evento muda para "esgotado"
    // automaticamente, impedindo novas inscrições a partir de agora.
    const { total } = this.db
      .prepare('SELECT COUNT(*) AS total FROM inscricoes WHERE evento_id = ?')
      .get(eventoId) as { total: number };

    if (total >= evento.capacidade) {
      this.db.prepare("UPDATE eventos SET status = 'esgotado' WHERE id = ? AND status = 'ativo'").run(eventoId);
    }

    return { mensagem: 'Inscrição realizada com sucesso.' };
  }

  // Usuário pode cancelar a própria inscrição — libera vaga e reabre o evento
  // (RN-049) caso ele estivesse esgotado por causa dessa vaga.
  cancelar(usuarioId: number, eventoId: string) {
    const resultado = this.db
      .prepare('DELETE FROM inscricoes WHERE usuario_id = ? AND evento_id = ?')
      .run(usuarioId, eventoId);

    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Inscrição não encontrada.' });
    }

    this.db.prepare("UPDATE eventos SET status = 'ativo' WHERE id = ? AND status = 'esgotado'").run(eventoId);

    return { mensagem: 'Inscrição cancelada com sucesso.' };
  }

  // RN-061 — paginação
  listar(usuarioId: number, pagina = 1, limite = 20) {
    const inscricoes = this.db
      .prepare(
        `SELECT e.*, i.data_inscricao FROM inscricoes i
         JOIN eventos e ON e.id = i.evento_id
         WHERE i.usuario_id = ?
         ORDER BY i.data_inscricao DESC`,
      )
      .all(usuarioId);

    const { itens, paginacao } = paginar(inscricoes, pagina, limite);
    return { inscricoes: itens, paginacao };
  }
}
