Create database `explora`

use `explora`

create table `usuarios`(
    `id` int unsigned not null auto_increment,
    `nome` varchar(240) not null,
    `email` varchar(140) not null,
    `telefone` varchar(12) not null,
    `senha` VARCHAR(255) not null,
    `capacidade` int(8) not null,
    `descricao` varchar(1000) not null
    --local
    --data de nascimento
    --orçamento disponivel
    PRIMARY KEY("id")
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table `eventos`(
    `id` int unsigned not null auto_increment,
    `nome_evento` varchar(240) not null,
    `data` date not null,
    `hora` time not null,
    `local` varchar(240) not null,
    `link_compra` VARCHAR(255) not null,
    `preco` varchar(20) not null,
    PRIMARY KEY(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--eventos visitados
--preferencias
--evento favorito