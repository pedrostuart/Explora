Create database `explora`;

use `explora`;
create table `usuarios`(
    `id` int not null auto_increment PRIMARY KEY,
    `nome` varchar(240) not null,
    `sobrenome` varchar(240) not null,
    `email` varchar(140) not null,
    `telefone` varchar(12) not null,
    `senha` VARCHAR(255) not null,
    `estado` varchar(100) not null,
    `data_nascimento`date not null,
    `orcamento` decimal(10, 2),
    `notificacoes_email` boolean not null,
    `alertas_eventos` boolean not null,
    `notificacoes_ofertas` boolean not null
    
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table `categorias`(
    `id` int not null PRIMARY KEY,
    `nome` varchar(60) not null
);

create table `usuario_categoria`(
    `usuario_id` int not null,
    `categoria_id` int not null,

    PRIMARY KEY (usuario_id, categoria_id),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
create table `eventos`(
    `id` int not null auto_increment PRIMARY KEY,
    `nome_evento` varchar(240) not null,
    `descricao` text not null,
    `data` date not null,
    `hora_inicio` time not null,
    `hora_fim` time not null,
    `logradouro` varchar(240) not null,
    `numero_local` int not null,
    `cidade` varchar(240) not null,
    `estado` varchar(240) not null,
    `capacidade` float not null,
    `classificacao_etaria` int not null,
    `destaque_evento` varchar(200) not null,
    `imagem` varchar(500) not null,
    `link_compra` VARCHAR(500) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table `evento_categoria`(
    `evento_id` int not null,
    `categoria_id` int not null,

    PRIMARY KEY (evento_id, categoria_id),

    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);
create table `ingressos`(
    `id` int auto_increment not null PRIMARY KEY,
    `evento_id` int not null,
    `nome_ingresso` varchar(200) not null,
    `preco` decimal(10,2) not null,
    `status` VARCHAR(70) not null,
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

create table `artistas`(
    `id` int auto_increment not null PRIMARY KEY,
    `nome` varchar(250) not null,
    `imagem` varchar(500) not null
);
create table `evento_artista`(
    `evento_id` int not null,
    `artista_id` int not null,

    PRIMARY key(evento_id, artista_id),

    FOREIGN KEY (evento_id) REFERENCES eventos(id),
    FOREIGN KEY (artista_id) REFERENCES artistas(id)
);
create table `favoritos`(
    `id` int auto_increment not null PRIMARY KEY,
    `usuario_id` int not null,
    `evento_id` int not null,

    FOREIGN KEY (evento_id) REFERENCES eventos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

create table `eventos_visitados`(
    `id` int auto_increment not null PRIMARY KEY,
    `usuario_id` int not null,
    `evento_id` int not null,
    `data_visita` date not null,
    FOREIGN KEY (evento_id) REFERENCES eventos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

create table `conquistas`(
    `id` int auto_increment not null PRIMARY KEY,
    `nome` varchar(200) not null,
    `descricao` varchar(200) not null
);

create table `usuario_conquista`(
    `usuario_id` int not null,
    `conquista_id` int not null,

    PRIMARY KEY(usuario_id, conquista_id),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (conquista_id) REFERENCES conquistas(id)
)