import { ForbiddenException, Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { EmailService } from '../email/email.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CriarEventoDto } from './dto/criar-evento.dto';
import { AtualizarEventoDto } from './dto/atualizar-evento.dto';
import { paginar } from '../common/utils/paginar';
import { calcularDistanciaKm } from '../common/utils/geo';


function normalizar(texto: string | null | undefined): string {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase();
}

function mesmoDia(dataIso: string, referencia: Date): boolean {
  const data = new Date(dataIso);
  return (
    data.getFullYear() === referencia.getFullYear() &&
    data.getMonth() === referencia.getMonth() &&
    data.getDate() === referencia.getDate()
  );
}

interface HorarioRow {
  tipo_dia: 'dias_semana' | 'sabado' | 'domingo' | 'feriado';
  fechado: number;
  hora_abertura: string | null;
  hora_fechamento: string | null;
}






function calcularStatusFuncionamento(
  horarios: HorarioRow[] | undefined,
  agora: Date,
): 'aberto' | 'fechado' | 'sem_horario_informado' {
  if (!horarios || horarios.length === 0) return 'sem_horario_informado';

  const diaSemana = agora.getDay(); 
  const tipoDiaHoje: HorarioRow['tipo_dia'] =
    diaSemana === 0 ? 'domingo' : diaSemana === 6 ? 'sabado' : 'dias_semana';

  const horario = horarios.find((h) => h.tipo_dia === tipoDiaHoje);
  if (!horario) return 'sem_horario_informado';
  if (horario.fechado || !horario.hora_abertura || !horario.hora_fechamento) return 'fechado';

  const [horaAbertura, minutoAbertura] = horario.hora_abertura.split(':').map(Number);
  const [horaFechamento, minutoFechamento] = horario.hora_fechamento.split(':').map(Number);
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const minutosAbertura = horaAbertura * 60 + minutoAbertura;
  const minutosFechamento = horaFechamento * 60 + minutoFechamento;

  if (minutosFechamento > minutosAbertura) {
    return minutosAgora >= minutosAbertura && minutosAgora < minutosFechamento ? 'aberto' : 'fechado';
  }
  
  return minutosAgora >= minutosAbertura || minutosAgora < minutosFechamento ? 'aberto' : 'fechado';
}

interface EventoRow {
  id: number;
  organizador_id: number;
  categoria_id: number;
  nome: string;
  descricao: string | null;
  endereco: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  data_hora: string;
  data_hora_fim: string | null;
  capacidade: number;
  preco: number;
  gratuito: number;
  imagem_capa: string;
  link_externo: string | null;
  classificacao_etaria: string;
  recorrente: number;
  frequencia_recorrencia: 'diaria' | 'semanal' | 'mensal' | null;
  status: 'pendente' | 'ativo' | 'esgotado' | 'encerrado' | 'cancelado';
  institucional: number;
  patrocinado: number;
  acessivel_fisico: number;
  acessivel_visual: number;
  acessivel_auditivo: number;
  categoria_nome?: string;
  media_avaliacao?: number | null;
  distancia_km?: number | null;
  destaque_hoje?: boolean;
  status_funcionamento?: 'aberto' | 'fechado' | 'sem_horario_informado';
}

const CAMPOS_EDITAVEIS: (keyof AtualizarEventoDto)[] = [
  'nome',
  'descricao',
  'categoria_id',
  'cep',
  'logradouro',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'latitude',
  'longitude',
  'data_hora',
  'data_hora_fim',
  'capacidade',
  'preco',
  'imagem_capa',
  'link_externo',
  'classificacao_etaria',
  'acessivel_fisico',
  'acessivel_visual',
  'acessivel_auditivo',
];


const CAMPOS_ENDERECO = new Set(['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado']);


const CAMPOS_NOTIFICAVEIS = new Set(['data_hora', 'data_hora_fim', 'logradouro', 'numero', 'bairro', 'cidade']);

function montarEndereco(partes: {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}): string {
  const cepFormatado = partes.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  return `${partes.logradouro}, ${partes.numero} — ${partes.bairro}, ${partes.cidade}/${partes.estado} — CEP ${cepFormatado}`;
}

@Injectable()
export class EventosService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
    private readonly auditoria: AuditoriaService,
    private readonly email: EmailService,
  ) {}

  
  
  
  
  listar(opcoes: {
    categoria?: string;
    ordenar?: string;
    q?: string;
    pagina?: number;
    limite?: number;
    gratuito?: string;
    lat?: string;
    lng?: string;
    raioKm?: string;
    incluirEncerrados?: string;
  }) {
    const { categoria, ordenar, q, pagina = 1, limite = 20, gratuito, lat, lng, raioKm, incluirEncerrados } =
      opcoes;

    
    
    
    
    const statusVisiveis = incluirEncerrados === 'true' ? ['ativo', 'esgotado', 'encerrado'] : ['ativo', 'esgotado'];

    let sql = `
      SELECT e.*, c.nome AS categoria_nome,
        (SELECT ROUND(AVG(nota), 1) FROM avaliacoes WHERE evento_id = e.id) AS media_avaliacao
      FROM eventos e
      JOIN categorias c ON c.id = e.categoria_id
      WHERE e.status IN (${statusVisiveis.map(() => '?').join(',')})
    `;
    const parametros: unknown[] = [...statusVisiveis];

    if (categoria) {
      sql += ' AND e.categoria_id = ?';
      parametros.push(categoria);
    }

    
    if (gratuito === 'true') {
      sql += ' AND e.gratuito = 1';
    }

    const colunasOrdenacao: Record<string, string> = {
      data: 'e.data_hora ASC',
      preco: 'e.preco ASC',
      avaliacao: 'media_avaliacao DESC',
    };
    const temGeo = !!(lat && lng);
    if (!temGeo || (ordenar && colunasOrdenacao[ordenar])) {
      sql += ` ORDER BY ${colunasOrdenacao[ordenar || ''] || 'e.data_hora ASC'}`; 
    }

    let eventos = this.db.prepare(sql).all(...(parametros as any[])) as unknown as EventoRow[];

    
    if (temGeo) {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      eventos = eventos.map((evento) => ({
        ...evento,
        distancia_km: (() => {
          const d = calcularDistanciaKm(latNum, lngNum, evento.latitude, evento.longitude);
          return d == null ? null : Math.round(d * 10) / 10;
        })(),
      }));

      if (raioKm) {
        const raio = Number(raioKm);
        eventos = eventos.filter((evento) => evento.distancia_km != null && evento.distancia_km <= raio);
      }

      if (!ordenar || !colunasOrdenacao[ordenar]) {
        eventos.sort((a, b) => (a.distancia_km ?? Infinity) - (b.distancia_km ?? Infinity));
      }
    }

    
    if (q && q.trim() !== '') {
      const termoBusca = normalizar(q);
      eventos = eventos.filter((evento) => {
        const alvo = normalizar(`${evento.nome} ${evento.descricao || ''} ${evento.categoria_nome}`);
        return alvo.includes(termoBusca);
      });
    }

    
    const hoje = new Date();
    eventos = eventos.map((evento) => ({ ...evento, destaque_hoje: mesmoDia(evento.data_hora, hoje) }));

    
    if (eventos.length === 0) {
      return { eventos: [], mensagem: 'Nenhum evento encontrado para os filtros informados.' };
    }

    const { itens, paginacao } = paginar(eventos, pagina, limite);

    
    
    if (itens.length > 0) {
      const ids = itens.map((e) => e.id);
      const todosHorarios = this.db
        .prepare(
          `SELECT evento_id, tipo_dia, fechado, hora_abertura, hora_fechamento
           FROM evento_horarios WHERE evento_id IN (${ids.map(() => '?').join(',')})`,
        )
        .all(...ids) as unknown as (HorarioRow & { evento_id: number })[];

      const agora = new Date();
      for (const evento of itens) {
        const horariosDoEvento = todosHorarios.filter((h) => h.evento_id === evento.id);
        evento.status_funcionamento = calcularStatusFuncionamento(horariosDoEvento, agora);
      }
    }

    return { eventos: itens, paginacao };
  }

  
  sugestoes(q: string) {
    if (!q || q.trim().length < 3) {
      return { sugestoes: [] };
    }
    const termo = normalizar(q);
    const eventos = this.db
      .prepare(
        `SELECT nome FROM eventos WHERE status IN ('ativo', 'esgotado') ORDER BY data_hora ASC LIMIT 200`,
      )
      .all() as { nome: string }[];

    const sugestoes = eventos
      .filter((e) => normalizar(e.nome).includes(termo))
      .slice(0, 8)
      .map((e) => e.nome);

    return { sugestoes };
  }

  
  destaquesHoje() {
    const eventos = this.db
      .prepare(
        `SELECT e.*, c.nome AS categoria_nome
         FROM eventos e JOIN categorias c ON c.id = e.categoria_id
         WHERE e.status IN ('ativo', 'esgotado')
         ORDER BY e.data_hora ASC`,
      )
      .all() as unknown as EventoRow[];

    const hoje = new Date();
    const destaques = eventos.filter((e) => mesmoDia(e.data_hora, hoje));
    return { eventos: destaques };
  }

  
  buscarPorId(id: string) {
    const evento = this.db
      .prepare(
        `SELECT e.*, c.nome AS categoria_nome,
           (SELECT ROUND(AVG(nota), 1) FROM avaliacoes WHERE evento_id = e.id) AS media_avaliacao,
           u.nome AS organizador_nome
         FROM eventos e
         JOIN categorias c ON c.id = e.categoria_id
         JOIN usuarios u ON u.id = e.organizador_id
         WHERE e.id = ?`,
      )
      .get(id) as any;

    if (!evento) {
      throw new NotFoundException({ erro: 'Evento não encontrado.' });
    }

    
    const horarios = this.db
      .prepare('SELECT tipo_dia, fechado, hora_abertura, hora_fechamento FROM evento_horarios WHERE evento_id = ?')
      .all(id) as unknown as HorarioRow[];
    evento.horarios_funcionamento = horarios;
    evento.status_funcionamento = calcularStatusFuncionamento(horarios, new Date());

    return { evento };
  }

  
  
  
  
  criar(usuario: JwtPayload, dto: CriarEventoDto) {
    const categoria = this.db.prepare('SELECT ativa FROM categorias WHERE id = ?').get(dto.categoria_id) as
      | { ativa: number }
      | undefined;

    if (!categoria || categoria.ativa !== 1) {
      throw new BadRequestException({ erro: 'Categoria inválida ou inativa.' });
    }

    
    if (dto.data_hora_fim && new Date(dto.data_hora_fim) <= new Date(dto.data_hora)) {
      throw new BadRequestException({ erro: 'A data/hora de término deve ser depois da data/hora de início.' });
    }

    
    const precoNumerico = Number(dto.preco);
    let gratuito: number;
    if (dto.gratuito !== undefined) {
      gratuito = dto.gratuito ? 1 : 0;
    } else {
      gratuito = precoNumerico === 0 ? 1 : 0;
    }
    if (gratuito === 0 && precoNumerico <= 0) {
      throw new BadRequestException({ erro: 'Eventos pagos devem ter valor positivo.' });
    }
    if (gratuito === 1 && precoNumerico !== 0) {
      throw new BadRequestException({ erro: 'Eventos gratuitos devem ter preço igual a zero.' });
    }

    
    const recorrente = dto.recorrente ? 1 : 0;
    if (recorrente === 1 && !dto.frequencia_recorrencia) {
      throw new BadRequestException({ erro: 'Informe a frequência de recorrência (diária, semanal ou mensal).' });
    }

    
    const ehInstitucional = dto.institucional && usuario.role === 'admin' ? 1 : 0;

    
    
    
    const status = usuario.role === 'admin' ? 'ativo' : 'pendente';

    
    
    const cepNormalizado = dto.cep.replace(/\D/g, '');
    const enderecoGerado = montarEndereco({ ...dto, cep: cepNormalizado });

    const resultado = this.db
      .prepare(
        `INSERT INTO eventos
          (organizador_id, categoria_id, nome, descricao, endereco, cep, logradouro, numero,
           bairro, cidade, estado, latitude, longitude,
           data_hora, data_hora_fim, capacidade, preco, gratuito, imagem_capa, link_externo,
           classificacao_etaria, recorrente, frequencia_recorrencia, institucional, status,
           acessivel_fisico, acessivel_visual, acessivel_auditivo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        usuario.id,
        dto.categoria_id,
        dto.nome,
        dto.descricao || null,
        enderecoGerado,
        cepNormalizado,
        dto.logradouro,
        dto.numero,
        dto.bairro,
        dto.cidade,
        dto.estado,
        dto.latitude,
        dto.longitude,
        dto.data_hora,
        dto.data_hora_fim || null,
        dto.capacidade,
        precoNumerico,
        gratuito,
        dto.imagem_capa,
        dto.link_externo || null,
        dto.classificacao_etaria,
        recorrente,
        dto.frequencia_recorrencia || null,
        ehInstitucional,
        status,
        dto.acessivel_fisico ? 1 : 0,
        dto.acessivel_visual ? 1 : 0,
        dto.acessivel_auditivo ? 1 : 0,
      );

    const eventoId = Number(resultado.lastInsertRowid);

    
    if (dto.horarios_funcionamento?.length) {
      this.salvarHorarios(eventoId, dto.horarios_funcionamento);
    }

    this.auditoria.registrarLog(usuario.id, 'evento_criado', `${dto.nome} (status=${status})`);

    if (status === 'ativo') {
      this.notificarPreferenciasDeCategoria(dto.categoria_id, dto.nome, eventoId);
    }

    return {
      mensagem:
        status === 'pendente'
          ? 'Evento enviado para aprovação administrativa.'
          : 'Evento criado com sucesso.',
      id: eventoId,
      status,
    };
  }

  
  private salvarHorarios(eventoId: number, horarios: { tipo_dia: string; fechado?: boolean; hora_abertura?: string; hora_fechamento?: string }[]) {
    this.db.prepare('DELETE FROM evento_horarios WHERE evento_id = ?').run(eventoId);
    const inserir = this.db.prepare(
      `INSERT INTO evento_horarios (evento_id, tipo_dia, fechado, hora_abertura, hora_fechamento)
       VALUES (?, ?, ?, ?, ?)`,
    );
    for (const horario of horarios) {
      inserir.run(
        eventoId,
        horario.tipo_dia,
        horario.fechado ? 1 : 0,
        horario.fechado ? null : horario.hora_abertura || null,
        horario.fechado ? null : horario.hora_fechamento || null,
      );
    }
  }

  private notificarPreferenciasDeCategoria(categoriaId: number, nomeEvento: string, eventoId: number) {
    const usuariosNotificacao = this.db
      .prepare(
        `SELECT u.id FROM usuarios u
         LEFT JOIN preferencias p ON p.usuario_id = u.id
         WHERE p.categoria_id = ?`,
      )
      .all(categoriaId) as { id: number }[];

    for (const u of usuariosNotificacao) {
      this.db
        .prepare("INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'nova_recomendacao', ?)")
        .run(u.id, `Novo evento cadastrado na sua categoria preferida: ${nomeEvento}`);
    }
  }

  
  
  
  aprovar(adminId: number, id: string) {
    const evento = this.db.prepare('SELECT status, categoria_id, nome FROM eventos WHERE id = ?').get(id) as
      | { status: string; categoria_id: number; nome: string }
      | undefined;
    if (!evento) throw new NotFoundException({ erro: 'Evento não encontrado.' });
    if (evento.status !== 'pendente') {
      throw new BadRequestException({ erro: 'Este evento não está pendente de aprovação.' });
    }

    this.db.prepare("UPDATE eventos SET status = 'ativo' WHERE id = ?").run(id);
    this.auditoria.registrarLog(adminId, 'evento_aprovado', `id ${id}`);
    this.notificarPreferenciasDeCategoria(evento.categoria_id, evento.nome, Number(id));

    return { mensagem: 'Evento aprovado e publicado.' };
  }

  rejeitar(adminId: number, id: string, motivo?: string) {
    const evento = this.db.prepare('SELECT status, organizador_id, nome FROM eventos WHERE id = ?').get(id) as
      | { status: string; organizador_id: number; nome: string }
      | undefined;
    if (!evento) throw new NotFoundException({ erro: 'Evento não encontrado.' });
    if (evento.status !== 'pendente') {
      throw new BadRequestException({ erro: 'Este evento não está pendente de aprovação.' });
    }

    this.db.prepare("UPDATE eventos SET status = 'cancelado' WHERE id = ?").run(id);
    this.auditoria.registrarLog(adminId, 'evento_rejeitado', `id ${id} — motivo: ${motivo || 'não informado'}`);

    this.db
      .prepare("INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'evento_rejeitado', ?)")
      .run(
        evento.organizador_id,
        `Seu evento "${evento.nome}" não foi aprovado.${motivo ? ` Motivo: ${motivo}` : ''}`,
      );

    return { mensagem: 'Evento rejeitado.' };
  }

  listarPendentes(pagina = 1, limite = 20) {
    const eventos = this.db
      .prepare(
        `SELECT e.*, c.nome AS categoria_nome, u.nome AS organizador_nome
         FROM eventos e
         JOIN categorias c ON c.id = e.categoria_id
         JOIN usuarios u ON u.id = e.organizador_id
         WHERE e.status = 'pendente'
         ORDER BY e.criado_em ASC`,
      )
      .all();
    const { itens, paginacao } = paginar(eventos, pagina, limite);
    return { eventos: itens, paginacao };
  }

  
  
  
  
  async atualizar(usuario: JwtPayload, id: string, dto: AtualizarEventoDto) {
    const evento = this.db.prepare('SELECT * FROM eventos WHERE id = ?').get(id) as
      | (EventoRow & Record<string, unknown>)
      | undefined;
    if (!evento) throw new NotFoundException({ erro: 'Evento não encontrado.' });

    if (evento.organizador_id !== usuario.id && usuario.role !== 'admin') {
      throw new ForbiddenException({ erro: 'Somente o organizador ou um administrador pode editar este evento.' });
    }

    
    
    
    
    
    
    const eventoJaPublico = evento.status === 'ativo' || evento.status === 'esgotado';
    if (usuario.role !== 'admin' && eventoJaPublico) {
      if (Object.keys(dto).length === 0) {
        return { mensagem: 'Nenhuma alteração informada.' };
      }
      this.db
        .prepare(
          `INSERT INTO eventos_edicoes_pendentes (evento_id, autor_id, dados_json) VALUES (?, ?, ?)`,
        )
        .run(id, usuario.id, JSON.stringify(dto));
      this.auditoria.registrarLog(usuario.id, 'edicao_evento_enviada_para_aprovacao', `id ${id}`);
      return {
        mensagem:
          'Sua edição foi enviada para aprovação administrativa. O evento continuará exibindo os dados atuais até a revisão.',
        pendente_aprovacao: true,
      };
    }

    return this.aplicarEdicao(evento, id, usuario.id, dto);
  }

  
  
  
  private async aplicarEdicao(
    evento: EventoRow & Record<string, unknown>,
    id: string,
    autorId: number,
    dto: AtualizarEventoDto,
  ) {
    const novaDataHora = dto.data_hora ?? evento.data_hora;
    const novaDataHoraFim = dto.data_hora_fim ?? evento.data_hora_fim;
    if (novaDataHoraFim && new Date(novaDataHoraFim) <= new Date(novaDataHora)) {
      throw new BadRequestException({ erro: 'A data/hora de término deve ser depois da data/hora de início.' });
    }

    
    if (dto.cep) {
      dto.cep = dto.cep.replace(/\D/g, '');
    }

    const atualizacoes: string[] = [];
    const valores: unknown[] = [];
    const camposAlterados: string[] = [];

    for (const campo of CAMPOS_EDITAVEIS) {
      if (dto[campo] === undefined) continue;
      const valorAnterior = (evento as any)[campo];
      const valorNovo = dto[campo];
      if (String(valorAnterior) === String(valorNovo)) continue;

      atualizacoes.push(`${campo} = ?`);
      valores.push(valorNovo as any);
      camposAlterados.push(campo);

      
      this.db
        .prepare(
          `INSERT INTO historico_edicoes_evento (evento_id, autor_id, campo, valor_anterior, valor_novo)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .run(id, autorId, campo, valorAnterior == null ? null : String(valorAnterior), String(valorNovo));
    }

    if (atualizacoes.length === 0 && !dto.horarios_funcionamento) {
      return { mensagem: 'Nenhuma alteração informada.' };
    }

    
    const enderecoMudou = camposAlterados.some((c) => CAMPOS_ENDERECO.has(c));
    if (enderecoMudou) {
      const enderecoAtualizado = montarEndereco({
        cep: (dto.cep ?? evento.cep) as string,
        logradouro: (dto.logradouro ?? evento.logradouro) as string,
        numero: (dto.numero ?? evento.numero) as string,
        bairro: (dto.bairro ?? evento.bairro) as string,
        cidade: (dto.cidade ?? evento.cidade) as string,
        estado: (dto.estado ?? evento.estado) as string,
      });
      atualizacoes.push('endereco = ?');
      valores.push(enderecoAtualizado);
    }

    if (atualizacoes.length > 0) {
      valores.push(id);
      this.db.prepare(`UPDATE eventos SET ${atualizacoes.join(', ')} WHERE id = ?`).run(...(valores as any[]));
    }

    
    if (dto.horarios_funcionamento) {
      this.salvarHorarios(Number(id), dto.horarios_funcionamento);
      camposAlterados.push('horarios_funcionamento');
      this.db
        .prepare(
          `INSERT INTO historico_edicoes_evento (evento_id, autor_id, campo, valor_anterior, valor_novo)
           VALUES (?, ?, 'horarios_funcionamento', NULL, ?)`,
        )
        .run(id, autorId, JSON.stringify(dto.horarios_funcionamento));
    }

    this.auditoria.registrarLog(autorId, 'evento_editado', `id ${id}: ${camposAlterados.join(', ')}`);

    
    const precisaNotificar = camposAlterados.some((c) => CAMPOS_NOTIFICAVEIS.has(c));
    if (precisaNotificar) {
      await this.notificarMudancaEvento(id, (dto.nome ?? evento.nome) as string);
    }

    return { mensagem: 'Evento atualizado com sucesso.', campos_alterados: camposAlterados };
  }

  private async notificarMudancaEvento(eventoId: string, nomeEvento: string) {
    const interessados = this.db
      .prepare(
        `SELECT DISTINCT u.id, u.email FROM usuarios u
         WHERE u.id IN (SELECT usuario_id FROM favoritos WHERE evento_id = ?)
            OR u.id IN (SELECT usuario_id FROM inscricoes WHERE evento_id = ?)`,
      )
      .all(eventoId, eventoId) as { id: number; email: string }[];

    for (const pessoa of interessados) {
      this.db
        .prepare("INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'evento_alterado', ?)")
        .run(pessoa.id, `O evento "${nomeEvento}" teve o horário ou local alterado. Verifique os detalhes.`);

      await this.email.enviar(
        pessoa.email,
        `Atualização no evento "${nomeEvento}"`,
        `O horário ou local do evento "${nomeEvento}" foi alterado. Confira os novos detalhes no Explora+.`,
      );
    }
  }

  
  
  
  async encerrar(usuario: JwtPayload, id: string) {
    const evento = this.db.prepare('SELECT organizador_id, nome FROM eventos WHERE id = ?').get(id) as
      | { organizador_id: number; nome: string }
      | undefined;

    if (!evento) throw new NotFoundException({ erro: 'Evento não encontrado.' });

    if (evento.organizador_id !== usuario.id && usuario.role !== 'admin') {
      throw new ForbiddenException({
        erro: 'Somente o organizador ou um administrador pode encerrar este evento.',
      });
    }

    this.db.prepare("UPDATE eventos SET status = 'encerrado' WHERE id = ?").run(id);
    await this.notificarEncerramentoOuCancelamento(id, evento.nome, 'evento_encerrado', 'encerrado');

    this.auditoria.registrarLog(usuario.id, 'evento_encerrado', `id ${id}`);
    return { mensagem: 'Evento encerrado.' };
  }

  
  
  
  async cancelar(adminId: number, id: string) {
    const evento = this.db.prepare('SELECT nome FROM eventos WHERE id = ?').get(id) as
      | { nome: string }
      | undefined;
    if (!evento) throw new NotFoundException({ erro: 'Evento não encontrado.' });

    const resultado = this.db.prepare("UPDATE eventos SET status = 'cancelado' WHERE id = ?").run(id);
    if (resultado.changes === 0) throw new NotFoundException({ erro: 'Evento não encontrado.' });

    
    await this.notificarEncerramentoOuCancelamento(id, evento.nome, 'evento_cancelado', 'cancelado');

    this.auditoria.registrarLog(adminId, 'evento_cancelado', `id ${id}`);
    return { mensagem: 'Evento cancelado.' };
  }

  private async notificarEncerramentoOuCancelamento(
    eventoId: string,
    nomeEvento: string,
    tipo: string,
    verbo: string,
  ) {
    const favoritantes = this.db
      .prepare(
        `SELECT DISTINCT u.id, u.email FROM usuarios u
         WHERE u.id IN (SELECT usuario_id FROM favoritos WHERE evento_id = ?)`,
      )
      .all(eventoId) as { id: number; email: string }[];

    for (const f of favoritantes) {
      this.db
        .prepare('INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, ?, ?)')
        .run(f.id, tipo, `O evento "${nomeEvento}" foi ${verbo}.`);

      
      await this.email.enviar(
        f.email,
        `Evento ${verbo}: ${nomeEvento}`,
        `O evento "${nomeEvento}", que você favoritou, foi ${verbo}.`,
      );
    }
  }

  
  patrocinar(adminId: number, id: string, patrocinadoBruto: unknown) {
    const patrocinado = patrocinadoBruto ? 1 : 0;
    const resultado = this.db.prepare('UPDATE eventos SET patrocinado = ? WHERE id = ?').run(patrocinado, id);
    if (resultado.changes === 0) throw new NotFoundException({ erro: 'Evento não encontrado.' });

    this.auditoria.registrarLog(adminId, 'evento_patrocinio_alterado', `id ${id} -> patrocinado=${patrocinado}`);
    return { mensagem: `Evento ${patrocinado === 1 ? 'marcado' : 'desmarcado'} como patrocinado.` };
  }

  
  
  
  
  
  arquivarEExpandirRecorrencias() {
    const agora = new Date().toISOString();

    const expirados = this.db
      .prepare(
        `SELECT id, nome, categoria_id, recorrente, frequencia_recorrencia, data_hora, data_hora_fim
         FROM eventos WHERE status IN ('ativo', 'esgotado') AND COALESCE(data_hora_fim, data_hora) < ?`,
      )
      .all(agora) as unknown as EventoRow[];

    for (const evento of expirados) {
      
      this.db.prepare("UPDATE eventos SET status = 'encerrado' WHERE id = ?").run(evento.id);
      this.auditoria.registrarLog(null, 'evento_arquivado_automaticamente', `id ${evento.id}`);

      
      if (evento.recorrente === 1 && evento.frequencia_recorrencia) {
        this.gerarProximaOcorrencia(evento);
      }
    }

    return { eventosArquivados: expirados.length };
  }

  private gerarProximaOcorrencia(evento: EventoRow) {
    const completo = this.db.prepare('SELECT * FROM eventos WHERE id = ?').get(evento.id) as any;
    if (!completo) return;

    const incrementoDias = { diaria: 1, semanal: 7, mensal: 30 }[evento.frequencia_recorrencia!];
    const proximaData = new Date(completo.data_hora);
    proximaData.setDate(proximaData.getDate() + incrementoDias);

    let proximaDataFim: string | null = null;
    if (completo.data_hora_fim) {
      const fim = new Date(completo.data_hora_fim);
      fim.setDate(fim.getDate() + incrementoDias);
      proximaDataFim = fim.toISOString();
    }

    this.db
      .prepare(
        `INSERT INTO eventos
          (organizador_id, categoria_id, nome, descricao, endereco, cep, logradouro, numero,
           bairro, cidade, estado, latitude, longitude,
           data_hora, data_hora_fim, capacidade, preco, gratuito, imagem_capa, link_externo,
           classificacao_etaria, recorrente, frequencia_recorrencia, institucional,
           acessivel_fisico, acessivel_visual, acessivel_auditivo, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')`,
      )
      .run(
        completo.organizador_id,
        completo.categoria_id,
        completo.nome,
        completo.descricao,
        completo.endereco,
        completo.cep,
        completo.logradouro,
        completo.numero,
        completo.bairro,
        completo.cidade,
        completo.estado,
        completo.latitude,
        completo.longitude,
        proximaData.toISOString(),
        proximaDataFim,
        completo.capacidade,
        completo.preco,
        completo.gratuito,
        completo.imagem_capa,
        completo.link_externo,
        completo.classificacao_etaria,
        completo.recorrente,
        completo.frequencia_recorrencia,
        completo.institucional,
        completo.acessivel_fisico,
        completo.acessivel_visual,
        completo.acessivel_auditivo,
      );

    const novoIdRow = this.db.prepare('SELECT last_insert_rowid() AS id').get() as { id: number };

    
    const horarios = this.db
      .prepare('SELECT tipo_dia, fechado, hora_abertura, hora_fechamento FROM evento_horarios WHERE evento_id = ?')
      .all(evento.id) as { tipo_dia: string; fechado: number; hora_abertura: string | null; hora_fechamento: string | null }[];
    for (const h of horarios) {
      this.db
        .prepare(
          `INSERT INTO evento_horarios (evento_id, tipo_dia, fechado, hora_abertura, hora_fechamento)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .run(novoIdRow.id, h.tipo_dia, h.fechado, h.hora_abertura, h.hora_fechamento);
    }

    this.auditoria.registrarLog(null, 'evento_recorrencia_gerada', `origem id ${evento.id} -> novo id ${novoIdRow.id}`);
  }
}
