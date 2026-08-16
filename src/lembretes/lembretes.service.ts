import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { EventosService } from '../eventos/eventos.service';

interface EventoRow {
  id: number;
  nome: string;
  data_hora: string;
}

// RN082 — eventos próximos (nas próximas 24h) podem gerar lembrete para quem
// os favoritou. RN-047/048 — nesta mesma rotina periódica, também arquivamos
// eventos expirados automaticamente e geramos a próxima ocorrência de
// eventos recorrentes. Antes rodava com setInterval a cada 15 minutos; agora
// usa o agendador nativo do Nest (@nestjs/schedule), rodando também uma vez
// na inicialização, como no server.js original.
@Injectable()
export class LembretesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(LembretesService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
    private readonly eventosService: EventosService,
  ) {}

  onApplicationBootstrap() {
    this.verificarLembretes(); // roda uma vez já na inicialização
    this.executarArquivamentoERecorrencias();
  }

  @Cron('*/15 * * * *') // a cada 15 minutos, igual ao setInterval original
  verificarLembretes() {
    const agora = new Date();
    const em24h = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

    const eventosProximos = (
      this.db.prepare("SELECT id, nome, data_hora FROM eventos WHERE status = 'ativo'").all() as unknown as EventoRow[]
    ).filter((evento) => {
      const dataEvento = new Date(evento.data_hora);
      return dataEvento >= agora && dataEvento <= em24h;
    });

    for (const evento of eventosProximos) {
      const favoritantes = this.db
        .prepare('SELECT usuario_id FROM favoritos WHERE evento_id = ?')
        .all(evento.id) as { usuario_id: number }[];

      for (const f of favoritantes) {
        const jaEnviado = this.db
          .prepare('SELECT 1 FROM lembretes_enviados WHERE evento_id = ? AND usuario_id = ?')
          .get(evento.id, f.usuario_id);

        if (!jaEnviado) {
          this.db
            .prepare("INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'lembrete', ?)")
            .run(f.usuario_id, `Lembrete: o evento "${evento.nome}" começa em menos de 24 horas!`);

          this.db
            .prepare('INSERT INTO lembretes_enviados (evento_id, usuario_id) VALUES (?, ?)')
            .run(evento.id, f.usuario_id);
        }
      }
    }
  }

  // RN-047 (eventos recorrentes) e RN-048 (arquivamento automático de
  // eventos expirados) — roda na mesma cadência dos lembretes.
  @Cron('*/15 * * * *')
  executarArquivamentoERecorrencias() {
    const resultado = this.eventosService.arquivarEExpandirRecorrencias();
    if (resultado.eventosArquivados > 0) {
      this.logger.log(`${resultado.eventosArquivados} evento(s) arquivado(s) automaticamente (RN-048).`);
    }
  }
}
