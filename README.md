# Explora+ — API em NestJS

Back-end da plataforma **Explora+**, desenvolvido com **NestJS** e estruturado para oferecer gerenciamento de usuários, eventos, inscrições, avaliações, favoritos, recomendações e notificações.

O projeto conta com autenticação, autorização por níveis de acesso, segurança de sessão, validações, moderação de eventos, busca avançada, envio de e-mails e processamento de imagens.

## Como rodar

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/pedrostuart/Explora.git
cd Explora
npm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Depois, execute o projeto em modo de desenvolvimento:

```bash
npm run start:dev
```

Para executar em produção:

```bash
npm run build
npm run start:prod
```

O servidor utiliza, por padrão:

```text
http://localhost:3000
```

A porta pode ser alterada através da variável `PORTA`.

A aplicação disponibiliza:

```text
/             → Front-end
/api/...      → API
/uploads      → Arquivos enviados
```

## Principais recursos

### Usuários

* Cadastro e gerenciamento de usuários.
* Validação dos dados obrigatórios.
* Confirmação de e-mail.
* Recuperação de senha.
* Alteração e gerenciamento de perfil.
* Upload de foto de perfil.
* Definição de diferentes níveis de acesso.
* Desativação e exclusão de conta.
* Confirmação de senha para operações sensíveis.

### Autenticação e segurança

* Autenticação utilizando JWT.
* Sessão armazenada em cookie assinado.
* Expiração da sessão por inatividade.
* Renovação da sessão durante a utilização.
* Bloqueio após múltiplas tentativas de login.
* Logout com invalidação da sessão.
* Blacklist de tokens JWT.
* Autenticação em dois fatores utilizando TOTP.
* Controle de acesso baseado em papéis.
* Rate limiting.
* Proteção através do Helmet.
* HSTS.
* CORS configurado por whitelist.
* Suporte opcional a HTTPS.
* Tratamento global de exceções.

## Eventos

O sistema permite o gerenciamento completo de eventos, incluindo:

* Criação de eventos.
* Edição e exclusão.
* Geolocalização.
* Categoria.
* Classificação etária.
* Data e horário.
* Localização.
* Valor.
* Capacidade.
* Imagem de capa.
* Galeria de fotos.
* Eventos gratuitos.
* Eventos recorrentes.
* Controle de inscrições.
* Controle automático de lotação.
* Arquivamento automático de eventos expirados.

Eventos criados por usuários comuns passam por **moderação administrativa** antes de serem publicados.

Alterações relevantes em eventos também são registradas no histórico para permitir auditoria.

## Busca e descoberta

A plataforma possui sistema de busca com:

* Pesquisa por texto.
* Busca sem diferenciação entre maiúsculas e minúsculas.
* Busca ignorando acentuação.
* Filtro por categoria.
* Filtro por eventos gratuitos.
* Filtro por localização.
* Busca por raio geográfico.
* Ordenação por data.
* Ordenação por preço.
* Ordenação por avaliação.
* Ordenação por distância.
* Paginação.
* Sugestões e autocomplete.
* Destaques de eventos.

Os filtros podem ser utilizados de forma combinada para facilitar a localização de eventos.

## Interações

Os usuários podem interagir com os eventos através de:

* Inscrições.
* Avaliações.
* Comentários.
* Favoritos.
* Preferências.
* Recomendações personalizadas.
* Notificações.
* Lembretes de eventos.

## Notificações

O sistema possui notificações para informar o usuário sobre alterações importantes.

Entre os principais casos estão:

* Alteração de data do evento.
* Alteração de localização.
* Cancelamento de evento.
* Confirmações relacionadas a eventos.
* Lembretes de eventos.
* Outras ações relevantes da plataforma.

As notificações podem ser disponibilizadas dentro da aplicação e, quando configurado, através de e-mail.

## E-mails

O envio de e-mails é realizado através do **Nodemailer**.

A aplicação possui suporte para mensagens relacionadas a:

* Confirmação de cadastro.
* Recuperação de senha.
* Alterações em eventos.
* Cancelamento de eventos.
* Outras comunicações do sistema.

Quando o SMTP não está configurado, a aplicação possui um **fallback para ambiente de desenvolvimento**, facilitando os testes sem a necessidade de um servidor de e-mail real.

## Upload de arquivos

O sistema possui mecanismos específicos para processamento de arquivos.

### Foto de perfil

As imagens de perfil são validadas antes de serem armazenadas, considerando:

* Tipo MIME.
* Tamanho máximo.
* Validação do arquivo recebido.

O processamento utiliza `multer`.

### Fotos de eventos

A galeria de eventos utiliza `busboy` para realizar o processamento através de **streaming**.

Dessa forma, os arquivos são processados em partes, evitando o carregamento completo da imagem na memória.

Também existe um limite de **15 fotos por evento**.

## Banco de dados

O projeto utiliza **SQLite** através do provider `node:sqlite`.

O esquema do banco está organizado no arquivo:

```text
src/database/schema.sql
```

Entre os principais módulos relacionados ao banco estão:

```text
usuarios
categorias
eventos
preferencias
favoritos
historico
inscricoes
avaliacoes
comentarios
notificacoes
```

As entidades possuem relacionamentos através de identificadores e chaves utilizadas para manter a integridade dos dados.

## Auditoria

O projeto possui um módulo específico para auditoria:

```text
src/auditoria/
```

A auditoria permite registrar operações importantes realizadas no sistema, incluindo alterações relacionadas aos eventos.

Nas alterações de eventos são armazenadas informações como:

* Autor da alteração.
* Campo alterado.
* Valor anterior.
* Novo valor.

Isso permite acompanhar o histórico das modificações realizadas.

## Arquitetura

A aplicação segue uma arquitetura modular baseada no NestJS:

```text
src/
├── main.ts
├── app.module.ts
│
├── database/
│   └── schema.sql
│
├── auditoria/
├── email/
│
├── common/
│   ├── guards/
│   ├── sessoes/
│   ├── decorators/
│   ├── filters/
│   ├── pipes/
│   ├── dto/
│   └── utils/
│
├── auth/
├── usuarios/
├── categorias/
├── eventos/
├── preferencias/
├── favoritos/
├── historico/
├── inscricoes/
├── avaliacoes/
├── comentarios/
├── notificacoes/
├── recomendacoes/
└── lembretes/

public/
└── front-end estático

uploads/
├── fotos/
└── eventos/
```

## Principais módulos

| Módulo          | Responsabilidade                                                   |
| --------------- | ------------------------------------------------------------------ |
| `auth`          | Cadastro, login, confirmação de e-mail, 2FA e recuperação de senha |
| `usuarios`      | Perfil e gerenciamento dos usuários                                |
| `categorias`    | Gerenciamento das categorias                                       |
| `eventos`       | CRUD, moderação, recorrência e galeria                             |
| `inscricoes`    | Controle de participação nos eventos                               |
| `avaliacoes`    | Avaliação dos eventos                                              |
| `comentarios`   | Comentários dos usuários                                           |
| `favoritos`     | Eventos favoritos                                                  |
| `preferencias`  | Preferências dos usuários                                          |
| `historico`     | Histórico das alterações                                           |
| `notificacoes`  | Notificações da plataforma                                         |
| `recomendacoes` | Sistema de recomendações                                           |
| `lembretes`     | Lembretes e tarefas automáticas                                    |
| `auditoria`     | Registro de operações importantes                                  |
| `email`         | Comunicação através de e-mail                                      |

## Níveis de acesso

O sistema possui três papéis principais:

| Papel       | Acesso                                                       |
| ----------- | ------------------------------------------------------------ |
| `usuario`   | Utilização das funcionalidades destinadas aos usuários       |
| `prestador` | Recursos adicionais relacionados ao gerenciamento de eventos |
| `admin`     | Administração, moderação e gerenciamento da plataforma       |

As permissões são controladas através de guards específicos da aplicação.

## Tarefas automáticas

O projeto utiliza o módulo de agendamento do NestJS para executar tarefas automaticamente.

Entre elas:

* Arquivamento de eventos expirados.
* Geração de próximas ocorrências de eventos recorrentes.
* Processamento de lembretes.
* Outras rotinas periódicas do sistema.

## Variáveis de ambiente

As configurações da aplicação são controladas através de variáveis de ambiente.

Consulte:

```text
.env.example
```

Entre as configurações disponíveis estão:

```text
PORTA
JWT
COOKIE
CORS
SMTP
HTTPS
```

Os valores sensíveis não devem ser armazenados diretamente no código-fonte.

## Tratamento de erros

A aplicação utiliza um `HttpExceptionFilter` global para padronizar as respostas de erro da API.

Os erros podem ser retornados no formato:

```json
{
  "erro": "Mensagem do erro"
}
```

ou:

```json
{
  "erros": [
    {
      "msg": "Mensagem do erro"
    }
  ]
}
```

Erros inesperados do servidor são registrados internamente para facilitar a identificação de problemas, sem expor informações sensíveis ao cliente.

## Scripts

Principais comandos disponíveis:

```bash
npm run start
```

Executa a aplicação.

```bash
npm run start:dev
```

Executa a aplicação em modo de desenvolvimento com watch.

```bash
npm run start:debug
```

Executa a aplicação em modo debug.

```bash
npm run build
```

Compila o projeto.

```bash
npm run start:prod
```

Executa a versão compilada em produção.

```bash
npm run format
```

Formata o código do projeto.

## Tecnologias utilizadas

### Back-end

* NestJS
* TypeScript
* Node.js

### Banco de dados

* SQLite
* `node:sqlite`

### Autenticação e segurança

* JWT
* bcrypt
* Helmet
* CORS
* Rate Limiting
* TOTP

### Validação

* class-validator
* class-transformer

### Uploads

* Multer
* Busboy

### Comunicação

* Nodemailer

### Agendamento

* NestJS Schedule

## Objetivo do projeto

O **Explora+** tem como objetivo centralizar a descoberta e o gerenciamento de eventos, permitindo que usuários encontrem experiências de acordo com seus interesses e localização.

A plataforma também oferece recursos para gerenciamento de eventos, interação entre usuários, recomendações e administração do conteúdo.

## Status

🚧 **Projeto em desenvolvimento**

O sistema encontra-se em evolução, com implementação contínua de novas funcionalidades, melhorias de segurança, regras de negócio e estrutura do banco de dados.

## Autor

Desenvolvido por **Pedro Stuart**.

---

**Explora+ — descubra novos lugares, eventos e experiências.**
