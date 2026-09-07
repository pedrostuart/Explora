# Modelo Lógico Atual — Explora+

> **Nota de revisão:** o documento "Diagrama de Classe e Modelo Lógico" original (02/09) descreve um modelo em **MySQL** com 12 tabelas, elaborado numa fase de planejamento anterior à implementação real. O sistema efetivamente construído usa **SQLite** (`node:sqlite`) com **18 tabelas** (fora `sqlite_sequence`), estruturalmente diferente. Este documento registra o modelo real, extraído do banco em execução, e compara com o que foi planejado.

## Tabelas do sistema atual e seus relacionamentos (FKs)

| Tabela | Referencia | Observação |
|---|---|---|
| `usuarios` | — | Sem FK; entidade raiz. |
| `categorias` | — | Sem FK; entidade raiz. |
| `eventos` | `categorias.id`, `usuarios.id` (organizador) | Substitui a dupla "Atrações + Eventos" do plano original. |
| `evento_horarios` | `eventos.id` | Horários estruturados por dia da semana/sábado/domingo/feriado. |
| `evento_fotos` | `eventos.id` | Galeria, limitada a 15 fotos pela aplicação. |
| `eventos_edicoes_pendentes` | `eventos.id`, `usuarios.id` (autor) | Fila de moderação de edições. |
| `historico_edicoes_evento` | `eventos.id`, `usuarios.id` (autor) | Auditoria de alterações de evento. |
| `favoritos` | `eventos.id`, `usuarios.id` | Chave única composta (usuário + evento). |
| `avaliacoes` | `eventos.id`, `usuarios.id` | Chave única composta; nota 1–5. |
| `comentarios` | `eventos.id`, `usuarios.id` | Moderável pela administração. |
| `inscricoes` | `eventos.id`, `usuarios.id` | Registro de presença/interesse — **não é venda de ingresso**. |
| `historico` | `eventos.id`, `usuarios.id` | Visualizações de evento por usuário. |
| `preferencias` | `categorias.id`, `usuarios.id` | Categorias de interesse do usuário. |
| `notificacoes` | `usuarios.id` | Estado lida/não lida. |
| `lembretes_enviados` | `eventos.id`, `usuarios.id` | Evita envio duplicado de lembretes. |
| `tokens_confirmacao_email` | `usuarios.id` | Expira em 10 minutos; indicador de uso. |
| `tokens_recuperacao` | `usuarios.id` | Expira em 1 hora; indicador de uso. |
| `sessoes_invalidadas` | — | Guarda `jti` de tokens JWT invalidados (logout/exclusão/desativação). |
| `logs_auditoria` | `usuarios.id` | Ações críticas com timestamp. |

## O que mudou em relação ao modelo planejado (MySQL, 02/09)

| Planejado | Status no sistema atual |
|---|---|
| `usuarios` (com `orcamento`, `notificacoes_email`, `alertas_eventos`, `notificacoes_ofertas`) | 🔄 Implementado com colunas diferentes (`foto`, `cidade`, `biografia`, `totp_secret`, `totp_ativo`, `ativo`, `role`, `email_confirmado` etc.) — o modelo de preferências de notificação viraram a tabela `notificacoes`, não colunas booleanas fixas no usuário. |
| `eventos` (sem organizador, sem categoria única, com `link_compra`) | 🔄 Substituído por `eventos` com `organizador_id`, `categoria_id`, suporte a recorrência, status (`pendente/ativo/esgotado/encerrado/cancelado`), horários estruturados e edição pendente. |
| `evento_categoria` (N:N evento↔categoria) | 🔄 Simplificado para 1:N (`eventos.categoria_id`) — um evento tem uma única categoria no sistema atual. |
| `usuario_categoria` (N:N usuário↔categoria) | ✅ Evoluiu para `preferencias`, mesmo propósito. |
| `eventos_visitados` | ✅ Evoluiu para `historico`, mesmo propósito. |
| `ingressos` (venda de ingressos, preço, status) | ❌ Não implementado. Existe apenas `inscricoes` (registro de interesse/presença, sem preço/pagamento). |
| `artistas` / `evento_artista` (line-up) | ❌ Não implementado. |
| `conquistas` / `usuario_conquista` (gamificação) | ❌ Não implementado. |
| — | ➕ Novas tabelas sem equivalente no plano original: `comentarios`, `avaliacoes`, `notificacoes`, `lembretes_enviados`, `tokens_confirmacao_email`, `tokens_recuperacao`, `sessoes_invalidadas`, `logs_auditoria`, `evento_fotos`, `evento_horarios`, `eventos_edicoes_pendentes`, `historico_edicoes_evento`. |

## Diagrama de classe original

O PDF `Diagrama de classe.pdf` retrata fielmente o `.sql` do modelo planejado (mesmas 12 tabelas, mesmos relacionamentos) — nenhuma informação adicional além do que está na tabela comparativa acima. Ambos os artefatos (PDF e `.sql`) devem ser tratados como **histórico de planejamento**, não como documentação do sistema atual.
