Create database `explora`

use `explora`

create table `usuarios`(
    `id` int unsigned not null auto_increment,
    `nome` varchar(240) not null,
    `email` varchar(140) not null,
    `telefone` varchar(12) not null,
    `senha` VARCHAR(255) not null
    PRIMARY KEY("id")
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;