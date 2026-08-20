# Explora+ — API em NestJS

Back-end do Explora+ migrado de Express para NestJS, com todas as regras de
negócio auditadas e implementadas (veja `AUDITORIA_REGRAS_DE_NEGOCIO.md`
para o detalhamento completo, regra por regra).

## Como rodar

```bash
npm install
cp .env.example .env      # ajuste os segredos e, se quiser, SMTP/HTTPS
npm run build
npm run start:prod
```

Ou em desenvolvimento (com watch):

```bash
npm install
npm run start:dev
```

O servidor sobe em `http://localhost:3000` (ou na porta de `PORTA`), serve o
front-end estático em `/`, fotos em `/uploads`, e a API em `/api/...`.

## Principais recursos de segurança

- **Autenticação:** cadastro com validação de idade mínima, confirmação de
  e-mail obrigatória, bloqueio por tentativas, cookie de sessão **assinado**
  com expiração por inatividade (30 min), 2FA opcional (TOTP), logout com
  invalidação real de sessão (blacklist de JWT).
- **Autorização:** papéis `usuario` / `prestador` / `admin`; ações sensíveis
  (excluir/desativar conta, desabilitar 2FA) exigem confirmação de senha.
- **Infraestrutura:** CORS restritivo por whitelist, rate limiting global +
  reforçado no login, `helmet` com HSTS, suporte nativo a HTTPS, logging de
  erros no servidor sem expor detalhes ao cliente.
- **Uploads:** foto de perfil validada por MIME/tamanho (multer); galeria de
  fotos de evento com upload **streaming via busboy** (processa em chunks,
  sem carregar o arquivo inteiro na memória) e limite de 15 fotos.

## Principais recursos de negócio

- **Eventos:** geolocalização obrigatória, mídia de capa obrigatória,
  classificação etária obrigatória, moderação administrativa (eventos de
  usuários comuns nascem "pendentes" até um admin aprovar), edição com
  histórico completo (autor + campo + valor anterior/novo) e notificação
  automática (in-app + e-mail) quando data/local mudam, eventos recorrentes
  com geração automática da próxima ocorrência, arquivamento automático de
  eventos expirados, controle de lotação com status "esgotado" automático.
- **Busca:** texto (sem acento/caixa), filtros combináveis (categoria,
  gratuito, raio geográfico), ordenação (data/preço/avaliação/distância),
  autocomplete de sugestões, destaques do dia, paginação em todas as
  listagens.
- **E-mail:** infraestrutura real via `nodemailer` (cadastro, recuperação de
  senha, cancelamento/alteração de evento) — sem SMTP configurado, cai
  graciosamente em modo dev (loga no console / devolve o código na resposta
  para facilitar testes).

## Estrutura

```
src/
  main.ts                  # bootstrap: helmet, HTTPS opcional, CORS, cookies assinados
  app.module.ts
  database/                # provider node:sqlite + schema.sql
  auditoria/                # log de auditoria
  email/                     # EmailService (nodemailer + fallback dev)
  common/
    guards/                 # AuthGuard (sessão deslizante + blacklist), AdminGuard, AppThrottlerGuard
    sessoes/                 # blacklist de JWT (logout real)
    decorators/, filters/, pipes/, dto/ (paginação), utils/ (geo, paginação)
  auth/                      # cadastro, confirmação de e-mail, login, 2FA, recuperação de senha
  usuarios/                  # perfil, foto, papel, ações sensíveis com confirmação de senha
  categorias/
  eventos/                   # CRUD completo + moderação + galeria de fotos (busboy) + recorrência
  preferencias/, favoritos/, historico/, inscricoes/, avaliacoes/, comentarios/, notificacoes/
  recomendacoes/
  lembretes/                 # cron: lembretes de evento + arquivamento + recorrência

public/                     # front-end estático (com confirmar-email.html e banner de cookies)
uploads/fotos/, uploads/eventos/
```

## Variáveis de ambiente

Veja `.env.example` para a lista completa (JWT, cookie, CORS, SMTP, HTTPS).

## Formato de erros

O front-end lê `dados.erro` (string) ou `dados.erros` (lista com `.msg`).
Um `HttpExceptionFilter` global garante esse formato sempre, além de logar
o erro completo no servidor quando é um 500 inesperado.
