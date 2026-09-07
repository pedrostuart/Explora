import { Logger } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';

const logger = new Logger('DatabaseSeed');




const CATEGORIAS_PADRAO = ['Cinema', 'Arte', 'Festivais', 'Esportes', 'Gastronomia', 'Teatro', 'Música'];



const IMAGENS_DEMO = {
  caetanoVeloso: 'img/img-caetano-veloso.jpg',
  orquestraSinfonica: 'img/img-orquestra-sinfonica.jpg',
  djavan: 'img/img-djavan.avif',
  marisaMonte: 'img/img-MARISA-MONTE.webp',
  nandoReis: 'img/img-nando-reis.jfif',
  tiagoIorc: 'img/img-tiago-iorc.jpeg',
  cinema: 'img/mostra_de_cinema.jpg',
  arte: 'img/exposicao-arte-contemporanea.jpg',
  festival: 'img/festival-cultura-urbana.jpg',
  corridaDeRua: 'img/corrida-de-rua.jpg',
  gastronomia: 'img/feira-gastronomica.jpg',
  teatro: 'img/o-auto-da-compadecida.jpg',
};





function dataRelativa(dias: number, horas = 20): string {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  data.setHours(horas, 0, 0, 0);
  return data.toISOString();
}

interface EventoSeed {
  categoria: string;
  nome: string;
  descricao: string;
  localNome: string;
  bairro: string;
  latitude: number;
  longitude: number;
  diasAPartirDeHoje: number;
  preco: number;
  gratuito: boolean;
  imagem: string;
}






const EVENTOS_SEED: EventoSeed[] = [

  {
    categoria: 'Música',
    nome: 'Caetano Veloso',
    descricao: 'Show exclusivo de MPB celebrando 5 décadas de carreira.',
    localNome: 'Teatro Municipal',
    bairro: 'Centro',
    latitude: -23.5453,
    longitude: -46.6383,
    diasAPartirDeHoje: 0,
    preco: 150,
    gratuito: false,
    imagem: IMAGENS_DEMO.caetanoVeloso,
  },
  {
    categoria: 'Música',
    nome: 'Orquestra Sinfônica Municipal',
    descricao: 'Apresentação clássica especial com repertório emocionante de compositores brasileiros.',
    localNome: 'Sala São Paulo',
    bairro: 'Campos Elíseos',
    latitude: -23.5362,
    longitude: -46.6401,
    diasAPartirDeHoje: 1,
    preco: 80,
    gratuito: false,
    imagem: IMAGENS_DEMO.orquestraSinfonica,
  },
  {
    categoria: 'Música',
    nome: 'Djavan',
    descricao: 'Turnê nacional trazendo grandes sucessos e clássicos da sua carreira.',
    localNome: 'Espaço das Américas',
    bairro: 'Barra Funda',
    latitude: -23.5270,
    longitude: -46.6768,
    diasAPartirDeHoje: 5,
    preco: 200,
    gratuito: false,
    imagem: IMAGENS_DEMO.djavan,
  },
  {
    categoria: 'Música',
    nome: 'Marisa Monte',
    descricao: 'A voz marcante e sofisticada da MPB em uma noite emocionante.',
    localNome: 'Vibra São Paulo',
    bairro: 'Santo Amaro',
    latitude: -23.6493,
    longitude: -46.7214,
    diasAPartirDeHoje: 12,
    preco: 250,
    gratuito: false,
    imagem: IMAGENS_DEMO.marisaMonte,
  },
  {
    categoria: 'Música',
    nome: 'Nando Reis',
    descricao: 'Show intimista e pulsante com os maiores sucessos do pop rock nacional.',
    localNome: 'Audio Club',
    bairro: 'Barra Funda',
    latitude: -23.5255,
    longitude: -46.6669,
    diasAPartirDeHoje: 35,
    preco: 120,
    gratuito: false,
    imagem: IMAGENS_DEMO.nandoReis,
  },
  {
    categoria: 'Música',
    nome: 'Tiago Iorc',
    descricao: 'Apresentação acústica e intimista para os fãs paulistanos.',
    localNome: 'Teatro Bradesco',
    bairro: 'Perdizes',
    latitude: -23.5268,
    longitude: -46.6836,
    diasAPartirDeHoje: 80,
    preco: 90,
    gratuito: false,
    imagem: IMAGENS_DEMO.tiagoIorc,
  },


  {
    categoria: 'Cinema',
    nome: 'Mostra de Cinema Independente',
    descricao: 'Sessões especiais de filmes independentes com debate após a exibição.',
    localNome: 'Centro Cultural São Paulo',
    bairro: 'Vila Mariana',
    latitude: -23.5729,
    longitude: -46.6339,
    diasAPartirDeHoje: 2,
    preco: 30,
    gratuito: false,
    imagem: IMAGENS_DEMO.cinema,
  },
  {
    categoria: 'Arte',
    nome: 'Exposição de Arte Contemporânea',
    descricao: 'Obras de artistas emergentes em cartaz por tempo limitado.',
    localNome: 'MASP',
    bairro: 'Jardins',
    latitude: -23.5614,
    longitude: -46.6559,
    diasAPartirDeHoje: 4,
    preco: 0,
    gratuito: true,
    imagem: IMAGENS_DEMO.arte,
  },
  {
    categoria: 'Festivais',
    nome: 'Festival de Cultura Urbana',
    descricao: 'Grafite, skate, dança de rua e muito mais em um só lugar.',
    localNome: 'Vale do Anhangabaú',
    bairro: 'Centro',
    latitude: -23.5450,
    longitude: -46.6408,
    diasAPartirDeHoje: 9,
    preco: 40,
    gratuito: false,
    imagem: IMAGENS_DEMO.festival,
  },
  {
    categoria: 'Esportes',
    nome: 'Corrida de Rua 10km',
    descricao: 'Corrida com percurso pelo parque, aberta para todos os níveis.',
    localNome: 'Parque Ibirapuera',
    bairro: 'Ibirapuera',
    latitude: -23.5874,
    longitude: -46.6576,
    diasAPartirDeHoje: 20,
    preco: 50,
    gratuito: false,
    imagem: IMAGENS_DEMO.corridaDeRua,
  },
  {
    categoria: 'Gastronomia',
    nome: 'Feira Gastronômica Internacional',
    descricao: 'Food trucks e chefs convidados de várias partes do mundo.',
    localNome: 'Parque Vila Olímpia',
    bairro: 'Vila Olímpia',
    latitude: -23.5955,
    longitude: -46.6870,
    diasAPartirDeHoje: 60,
    preco: 25,
    gratuito: false,
    imagem: IMAGENS_DEMO.gastronomia,
  },
  {
    categoria: 'Teatro',
    nome: 'O Auto da Compadecida, A peça',
    descricao: 'Clássico do teatro brasileiro em nova montagem, com elenco renomado.',
    localNome: 'Teatro Renaissance',
    bairro: 'Higienópolis',
    latitude: -23.5423,
    longitude: -46.6558,
    diasAPartirDeHoje: 150,
    preco: 100,
    gratuito: false,
    imagem: IMAGENS_DEMO.teatro,
  },
];




export function seedDadosDemo(db: DatabaseSync): void {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM eventos').get() as { total: number };
  if (total > 0) {
    const atualizarImagem = db.prepare('UPDATE eventos SET imagem_capa = ? WHERE nome = ?');
    const imagensPorEvento = [
      ['img/exposicao-arte-contemporanea.jpg', 'Exposição de Arte Contemporânea'],
      ['img/festival-cultura-urbana.jpg', 'Festival de Cultura Urbana'],
      ['img/corrida-de-rua.jpg', 'Corrida de Rua'],
      ['img/feira-gastronomica.jpg', 'Feira Gastronômica Internacional'],
      ['img/o-auto-da-compadecida.jpg', 'O Auto da Compadecida, A peça'],
      ['img/o-auto-da-compadecida.jpg', 'O Auto da Compadecida'],
    ];
    imagensPorEvento.forEach(([imagem, nome]) => atualizarImagem.run(imagem, nome));
    return;
  }

  logger.log('Banco de eventos vazio — populando com dados de demonstração...');

  const inserirCategoria = db.prepare('INSERT OR IGNORE INTO categorias (nome, ativa) VALUES (?, 1)');
  CATEGORIAS_PADRAO.forEach((nome) => inserirCategoria.run(nome));

  const categoriaIdPorNome: Record<string, number> = {};
  const linhasCategorias = db.prepare('SELECT id, nome FROM categorias').all() as { id: number; nome: string }[];
  linhasCategorias.forEach((linha) => {
    categoriaIdPorNome[linha.nome] = linha.id;
  });


  const emailOrganizador = 'demo@explora.app';
  db.prepare(
    `INSERT OR IGNORE INTO usuarios
      (nome, email, senha_hash, role, ativo, email_confirmado)
     VALUES (?, ?, ?, 'admin', 1, 1)`,
  ).run('Explora+ Demo', emailOrganizador, 'seed-nao-faz-login');

  const organizador = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailOrganizador) as { id: number };

  const inserirEvento = db.prepare(`
    INSERT INTO eventos (
      organizador_id, categoria_id, nome, descricao,
      endereco, cep, logradouro, numero, bairro, cidade, estado,
      latitude, longitude, data_hora, capacidade, preco, gratuito,
      imagem_capa, classificacao_etaria, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  EVENTOS_SEED.forEach((evento) => {
    const categoriaId = categoriaIdPorNome[evento.categoria];
    if (!categoriaId) return;



    const enderecoCompleto = `${evento.localNome} - ${evento.bairro}, São Paulo - SP`;

    inserirEvento.run(
      organizador.id,
      categoriaId,
      evento.nome,
      evento.descricao,
      enderecoCompleto,
      '01001000',
      evento.localNome,
      '100',
      evento.bairro,
      'São Paulo',
      'SP',
      evento.latitude,
      evento.longitude,
      dataRelativa(evento.diasAPartirDeHoje),
      100,
      evento.preco,
      evento.gratuito ? 1 : 0,
      evento.imagem,
      'Livre',
      'ativo',
    );
  });

  logger.log(`${EVENTOS_SEED.length} eventos de demonstração inseridos.`);
}
