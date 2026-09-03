CREATE DATABASE `explora`;

USE `explora`;

CREATE TABLE `usuarios` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(240) NOT NULL,
    `sobrenome` VARCHAR(240) NOT NULL,
    `email` VARCHAR(140) NOT NULL,
    `telefone` VARCHAR(12) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `estado` VARCHAR(100) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `orcamento` DECIMAL(10, 2),
    `notificacoes_email` BOOLEAN NOT NULL,
    `alertas_eventos` BOOLEAN NOT NULL,
    `notificacoes_ofertas` BOOLEAN NOT NULL,
    CONSTRAINT `uk_usuarios_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `usuarios` (
    `nome`,
    `sobrenome`,
    `email`,
    `telefone`,
    `senha`,
    `estado`,
    `data_nascimento`,
    `orcamento`,
    `notificacoes_email`,
    `alertas_eventos`,
    `notificacoes_ofertas`
) VALUES
    ('Pedro', 'Moura', 'pedro@email.com', '11987654321', '123456', 'São Paulo', '2008-05-15', 1500.00, TRUE, TRUE, FALSE),
    ('João', 'Silva', 'joao@email.com', '11912345678', 'senha123', 'Rio de Janeiro', '2005-10-20', 2500.00, TRUE, FALSE, TRUE),
    ('Maria', 'Santos', 'maria@email.com', '11998765432', 'maria123', 'Minas Gerais', '2007-03-10', 1000.00, FALSE, TRUE, TRUE);


CREATE TABLE `categorias` (
    `id` INT NOT NULL PRIMARY KEY,
    `nome` VARCHAR(60) NOT NULL,
    CONSTRAINT `uk_categorias_nome` UNIQUE (`nome`)
);

INSERT INTO `categorias` (`id`, `nome`) VALUES
    (1, 'Cinema'),
    (2, 'Arte'),
    (3, 'Festivais'),
    (4, 'Esportes'),
    (5, 'Gastronomia'),
    (6, 'Teatro'),
    (7, 'Música');


CREATE TABLE `usuario_categoria` (
    `usuario_id` INT NOT NULL,
    `categoria_id` INT NOT NULL,
    PRIMARY KEY (`usuario_id`, `categoria_id`),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
);

INSERT INTO `usuario_categoria` (`usuario_id`, `categoria_id`) VALUES
    (1, 1),
    (1, 6),
    (2, 2),
    (2, 1);


CREATE TABLE `eventos` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome_evento` VARCHAR(240) NOT NULL,
    `descricao` TEXT NOT NULL,
    `data` DATE NOT NULL,
    `hora_inicio` TIME NOT NULL,
    `hora_fim` TIME NOT NULL,
    `logradouro` VARCHAR(240) NOT NULL,
    `numero_local` INT NOT NULL,
    `cidade` VARCHAR(240) NOT NULL,
    `estado` VARCHAR(240) NOT NULL,
    `capacidade` FLOAT NOT NULL,
    `classificacao_etaria` INT NOT NULL,
    `destaque_evento` VARCHAR(200) NOT NULL,
    `imagem` VARCHAR(500) NOT NULL,
    `link_compra` VARCHAR(500) NOT NULL,
    CONSTRAINT `chk_evento_horario`
        CHECK (`hora_fim` > `hora_inicio`),
    CONSTRAINT `chk_evento_capacidade`
        CHECK (`capacidade` > 0),
    CONSTRAINT `chk_evento_classificacao`
        CHECK (`classificacao_etaria` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `eventos` (
    `nome_evento`,
    `descricao`,
    `data`,
    `hora_inicio`,
    `hora_fim`,
    `logradouro`,
    `numero_local`,
    `cidade`,
    `estado`,
    `capacidade`,
    `classificacao_etaria`,
    `destaque_evento`,
    `imagem`,
    `link_compra`
) VALUES
(
    'Tech Conference 2026',
    'Evento sobre tecnologia, programação e inovação.',
    '2026-10-15',
    '09:00:00',
    '18:00:00',
    'Avenida Paulista',
    1000,
    'São Paulo',
    'SP',
    500,
    16,
    'Palestras com profissionais da área de tecnologia',
    'https://exemplo.com/imagens/tech-conference.jpg',
    'https://exemplo.com/ingressos/tech-conference'
),
(
    'Festival de Música',
    'Festival com apresentações de diversos artistas.',
    '2026-11-20',
    '14:00:00',
    '23:00:00',
    'Rua das Flores',
    500,
    'São Paulo',
    'SP',
    2000,
    18,
    'Shows de artistas nacionais',
    'https://exemplo.com/imagens/festival.jpg',
    'https://exemplo.com/ingressos/festival'
),
(
    'Workshop de Programação',
    'Workshop prático sobre desenvolvimento web.',
    '2026-12-05',
    '10:00:00',
    '16:00:00',
    'Rua Vergueiro',
    1200,
    'São Paulo',
    'SP',
    100,
    14,
    'Aprenda HTML, CSS e JavaScript na prática',
    'https://exemplo.com/imagens/workshop.jpg',
    'https://exemplo.com/ingressos/workshop'
);


CREATE TABLE `evento_categoria` (
    `evento_id` INT NOT NULL,
    `categoria_id` INT NOT NULL,
    PRIMARY KEY (`evento_id`, `categoria_id`),
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`),
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
);

INSERT INTO `evento_categoria` (`evento_id`, `categoria_id`) VALUES
    (1, 1),
    (2, 3),
    (3, 1),
    (3, 4);


CREATE TABLE `ingressos` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `evento_id` INT NOT NULL,
    `nome_ingresso` VARCHAR(200) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(70) NOT NULL,
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`),
    CONSTRAINT `chk_ingresso_preco`
        CHECK (`preco` >= 0)
);

INSERT INTO `ingressos` (
    `evento_id`,
    `nome_ingresso`,
    `preco`,
    `status`
) VALUES
    (1, 'Ingresso Inteiro', 80.00, 'Disponível'),
    (1, 'Meia-entrada', 40.00, 'Disponível'),
    (2, 'Pista', 120.00, 'Disponível'),
    (2, 'VIP', 250.00, 'Disponível'),
    (3, 'Ingresso Workshop', 50.00, 'Disponível');


CREATE TABLE `artistas` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(250) NOT NULL,
    `imagem` VARCHAR(500) NOT NULL,
    CONSTRAINT `uk_artistas_nome` UNIQUE (`nome`)
);


CREATE TABLE `evento_artista` (
    `evento_id` INT NOT NULL,
    `artista_id` INT NOT NULL,
    PRIMARY KEY (`evento_id`, `artista_id`),
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`),
    FOREIGN KEY (`artista_id`) REFERENCES `artistas`(`id`)
);


CREATE TABLE `favoritos` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `evento_id` INT NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`),
    CONSTRAINT `uk_favoritos_usuario_evento`
        UNIQUE (`usuario_id`, `evento_id`)
);


CREATE TABLE `eventos_visitados` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `evento_id` INT NOT NULL,
    `visitado` BOOLEAN NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`),
    CONSTRAINT `uk_eventos_visitados_usuario_evento`
        UNIQUE (`usuario_id`, `evento_id`)
);


CREATE TABLE `conquistas` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(200) NOT NULL,
    `descricao` VARCHAR(200) NOT NULL,
    CONSTRAINT `uk_conquistas_nome` UNIQUE (`nome`)
);


CREATE TABLE `usuario_conquista` (
    `usuario_id` INT NOT NULL,
    `conquista_id` INT NOT NULL,
    PRIMARY KEY (`usuario_id`, `conquista_id`),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`conquista_id`) REFERENCES `conquistas`(`id`)
);
