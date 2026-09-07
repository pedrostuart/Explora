# Requisitos Funcionais (RF) – Explora+

Documento reescrito a partir do comportamento real do sistema (NestJS + SQLite), validado executando o projeto de ponta a ponta. Substitui integralmente a numeração e o conteúdo das versões anteriores; alinhado às regras de negócio em `Regras_de_negocio.md`.

## Módulo 1: Usuários e Autenticação

- **RF-001 (Cadastro de Usuário):** o sistema deve permitir o cadastro de um novo usuário com nome, e-mail, telefone, data de nascimento e senha (RN-001 a RN-004).
- **RF-002 (Confirmação de Cadastro):** o sistema deve enviar um código de confirmação por e-mail e bloquear o login até a confirmação (RN-005).
- **RF-003 (Reenvio de Código de Confirmação):** o sistema deve permitir solicitar um novo código de confirmação caso o anterior expire ou não seja recebido.
- **RF-004 (Autenticação):** o sistema deve autenticar o usuário por e-mail e senha, aplicando bloqueio temporário após tentativas incorretas repetidas (RN-006).
- **RF-005 (Recuperação de Senha):** o sistema deve permitir solicitar e concluir a redefinição de senha por meio de código temporário enviado por e-mail (RN-008).
- **RF-006 (Troca de Senha Autenticada):** o sistema deve permitir a troca de senha mediante confirmação da senha atual (RN-009).
- **RF-007 (Autenticação Multifator):** o sistema deve permitir habilitar, confirmar, verificar no login e desabilitar a autenticação em duas etapas (RN-011).
- **RF-008 (Encerramento de Sessão):** o sistema deve permitir logout, invalidando a sessão ativa (RN-012).
- **RF-009 (Perfis de Acesso):** o sistema deve diferenciar as permissões disponíveis para os perfis de usuário, prestador e administrador (RN-010).
- **RF-010 (Consulta e Edição do Próprio Perfil):** o sistema deve permitir que o usuário autenticado visualize e edite seus próprios dados de perfil, incluindo foto.

## Módulo 2: Privacidade e Gestão de Dados (LGPD)

- **RF-011 (Consentimento de Cookies):** o sistema deve exibir um aviso de consentimento de cookies no primeiro acesso e lembrar a escolha do usuário (RN-014).
- **RF-012 (Exclusão de Conta):** o sistema deve permitir que o usuário solicite a exclusão da própria conta, removendo seus dados pessoais identificáveis (RN-015, RN-016).
- **RF-013 (Registro de Auditoria):** o sistema deve manter um histórico de ações críticas realizadas por usuários e administradores (RN-017).

## Módulo 3: Cadastro e Gestão de Eventos

- **RF-014 (Cadastro de Evento):** o sistema deve permitir o cadastro de eventos com nome, descrição, endereço, categoria, geolocalização e metadados de acessibilidade (RN-027, RN-034, RN-035, RN-037).
- **RF-015 (Moderação de Novos Eventos e Edições):** o sistema deve exigir aprovação administrativa para eventos e edições enviados por usuários não administradores (RN-029, RN-033, RN-048).
- **RF-016 (Galeria de Imagens):** o sistema deve permitir o upload de até 15 fotos por evento, além de uma imagem de capa obrigatória (RN-030, RN-041).
- **RF-017 (Horários de Funcionamento):** o sistema deve permitir cadastrar horários distintos por dia da semana, sábado, domingo e feriado (RN-031).
- **RF-018 (Indicador de Status "Aberto Agora"):** o sistema deve calcular, em tempo real, se um evento está aberto no momento da consulta (RN-032).
- **RF-019 (Transparência de Custos):** o sistema deve exibir se o evento é gratuito ou sua faixa de preço (RN-036).
- **RF-020 (Link Externo):** o sistema deve validar o formato de links externos informados no cadastro do evento (RN-038).
- **RF-021 (Histórico de Edições):** o sistema deve manter o histórico de alterações de um evento, com autor e valores anterior/novo (RN-040).
- **RF-022 (Eventos Recorrentes):** o sistema deve permitir configurar um evento como recorrente, com frequência diária, semanal ou mensal (RN-043).
- **RF-023 (Encerramento e Arquivamento Automático):** o sistema deve encerrar automaticamente eventos expirados e gerar a próxima ocorrência de eventos recorrentes, sem intervenção manual (RN-044).
- **RF-024 (Controle de Capacidade):** o sistema deve controlar a capacidade máxima de um evento e sinalizar automaticamente o esgotamento de vagas (RN-045).
- **RF-025 (Classificação Etária):** o sistema deve exigir a classificação etária recomendada no cadastro do evento (RN-046).
- **RF-026 (Notificação de Cancelamento e Encerramento):** o sistema deve notificar, dentro do aplicativo e por e-mail, os usuários que favoritaram um evento cancelado ou encerrado (RN-047).
- **RF-027 (Destaques do Dia):** o sistema deve exibir uma seleção de eventos em destaque para a data atual.

## Módulo 4: Busca, Filtros e Navegação

- **RF-028 (Busca por Palavra-chave):** o sistema deve permitir buscar eventos por texto livre em título, descrição e categoria (RN-050).
- **RF-029 (Filtros Combinados):** o sistema deve permitir aplicar múltiplos filtros simultaneamente — categoria, preço, distância, gratuidade — de forma cumulativa (RN-049, RN-058).
- **RF-030 (Ordenação de Resultados):** o sistema deve permitir ordenar os resultados por proximidade geográfica ou por melhor avaliação (RN-051, RN-052).
- **RF-031 (Sugestões de Busca):** o sistema deve sugerir termos de busca automaticamente enquanto o usuário digita (RN-053).
- **RF-032 (Paginação):** o sistema deve paginar listagens extensas de resultados (RN-054).
- **RF-033 (Busca Sem Resultado):** o sistema deve sugerir alternativas relevantes quando uma busca não encontra nenhum resultado (RN-055).
- **RF-034 (Preservação de Filtros):** o sistema deve manter os filtros aplicados ao navegar entre páginas e permitir compartilhá-los por link (RN-056).
- **RF-035 (Raio de Busca):** o sistema deve permitir ajustar o raio de busca no mapa (RN-057).
- **RF-036 (Busca por Localização/CEP):** o sistema deve permitir localizar coordenadas geográficas a partir de um CEP informado.

## Módulo 5: Interações Sociais

- **RF-037 (Favoritar Eventos):** o sistema deve permitir que um usuário autenticado adicione e remova eventos de sua lista de favoritos (RN-059, RN-060).
- **RF-038 (Avaliação por Nota):** o sistema deve permitir que um usuário autenticado avalie um evento com nota de 1 a 5, mantendo apenas uma avaliação ativa por evento (RN-061, RN-062).
- **RF-039 (Recálculo de Média):** o sistema deve recalcular automaticamente a média de avaliações de um evento a cada mudança (RN-063).
- **RF-040 (Comentários):** o sistema deve permitir que usuários autenticados publiquem comentários em eventos, sujeitos a moderação administrativa.
- **RF-041 (Histórico de Visualizações):** o sistema deve registrar os eventos visualizados por um usuário autenticado.
- **RF-042 (Preferências de Categoria):** o sistema deve permitir que o usuário indique categorias de interesse, usadas como base para recomendações.
- **RF-043 (Inscrição/Registro de Presença):** o sistema deve permitir que um usuário registre interesse ou presença em um evento, respeitando a capacidade máxima configurada.
- **RF-044 (Notificações do Usuário):** o sistema deve manter uma central de notificações com estado lida/não lida para cada usuário.
- **RF-045 (Lembretes):** o sistema deve enviar lembretes automáticos sobre eventos de interesse do usuário, sem duplicidade.

## Módulo 6: Administração

- **RF-046 (Gestão de Categorias):** o sistema deve permitir que administradores criem, editem e removam categorias de eventos.
- **RF-047 (Fila de Aprovação):** o sistema deve disponibilizar aos administradores uma lista de eventos e edições pendentes de aprovação.
- **RF-048 (Gestão de Usuários):** o sistema deve permitir que administradores consultem usuários e alterem papéis de acesso.
- **RF-049 (Moderação de Comentários):** o sistema deve permitir que administradores removam comentários inadequados.
- **RF-050 (Status da API):** o sistema deve expor um endpoint de verificação de disponibilidade do serviço.
