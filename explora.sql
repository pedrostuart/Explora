-- Schema SQLite canônico do Explora+

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL CHECK(length(nome) BETWEEN 3 AND 100),
  nome_usuario TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  telefone TEXT,
  foto TEXT,
  cidade TEXT,
  biografia TEXT,
  data_nascimento TEXT,
  data_cadastro TEXT NOT NULL DEFAULT (datetime('now')),
  ativo INTEGER NOT NULL DEFAULT 1,
  email_confirmado INTEGER NOT NULL DEFAULT 0,
  tentativas_login INTEGER NOT NULL DEFAULT 0,
  bloqueado_ate TEXT,
  role TEXT NOT NULL DEFAULT 'usuario' CHECK(role IN ('usuario', 'prestador', 'admin')),
  totp_secret TEXT,
  totp_ativo INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tokens_recuperacao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expira_em TEXT NOT NULL,
  usado INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tokens_confirmacao_email (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expira_em TEXT NOT NULL,
  usado INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessoes_invalidadas (
  jti TEXT PRIMARY KEY,
  expira_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  ativa INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS preferencias (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, categoria_id)
);

CREATE TABLE IF NOT EXISTS eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organizador_id INTEGER NOT NULL REFERENCES usuarios(id),
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  nome TEXT NOT NULL,
  descricao TEXT,
  endereco TEXT NOT NULL,
  cep TEXT NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL CHECK(length(estado) = 2),
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  data_hora TEXT NOT NULL,
  data_hora_fim TEXT,
  capacidade INTEGER NOT NULL CHECK(capacidade > 0),
  preco REAL NOT NULL DEFAULT 0 CHECK(preco >= 0),
  gratuito INTEGER NOT NULL DEFAULT 0,
  imagem_capa TEXT NOT NULL,
  link_externo TEXT,
  classificacao_etaria TEXT NOT NULL DEFAULT 'Livre'
    CHECK(classificacao_etaria IN ('Livre', '10', '12', '14', '16', '18')),
  recorrente INTEGER NOT NULL DEFAULT 0,
  frequencia_recorrencia TEXT CHECK(frequencia_recorrencia IN ('diaria', 'semanal', 'mensal')),
  status TEXT NOT NULL DEFAULT 'ativo'
    CHECK(status IN ('pendente', 'ativo', 'esgotado', 'encerrado', 'cancelado')),
  institucional INTEGER NOT NULL DEFAULT 0,
  patrocinado INTEGER NOT NULL DEFAULT 0,
  acessivel_fisico INTEGER NOT NULL DEFAULT 0,
  acessivel_visual INTEGER NOT NULL DEFAULT 0,
  acessivel_auditivo INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS evento_horarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  tipo_dia TEXT NOT NULL CHECK(tipo_dia IN ('dias_semana', 'sabado', 'domingo', 'feriado')),
  fechado INTEGER NOT NULL DEFAULT 0,
  hora_abertura TEXT,
  hora_fechamento TEXT,
  UNIQUE(evento_id, tipo_dia)
);

CREATE TABLE IF NOT EXISTS eventos_edicoes_pendentes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  autor_id INTEGER NOT NULL REFERENCES usuarios(id),
  dados_json TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS evento_fotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  caminho TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS historico_edicoes_evento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  autor_id INTEGER NOT NULL REFERENCES usuarios(id),
  campo TEXT NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inscricoes (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  data_inscricao TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usuario_id, evento_id)
);

CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  data_favoritado TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usuario_id, evento_id)
);

CREATE TABLE IF NOT EXISTS historico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  data_visualizacao TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS avaliacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK(nota BETWEEN 1 AND 5),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(usuario_id, evento_id)
);

CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  texto TEXT NOT NULL CHECK(length(trim(texto)) > 0 AND length(texto) <= 500),
  removido_pela_admin INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lembretes_enviados (
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  PRIMARY KEY (evento_id, usuario_id)
);

CREATE TABLE IF NOT EXISTS logs_auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER REFERENCES usuarios(id),
  acao TEXT NOT NULL,
  detalhes TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_eventos_categoria ON eventos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_eventos_status ON eventos(status);
CREATE INDEX IF NOT EXISTS idx_comentarios_evento ON comentarios(evento_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_evento ON avaliacoes(evento_id);
CREATE INDEX IF NOT EXISTS idx_evento_fotos_evento ON evento_fotos(evento_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_invalidadas_expira ON sessoes_invalidadas(expira_em);
