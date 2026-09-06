# 📘 Documento de Requisitos Funcionais Detalhado — Explora+

## 📌 1. Introdução
Este documento detalha minuciosamente o comportamento esperado da API do ecossistema **Explora+** hospedada em `backend/`. As especificações a seguir delimitam o escopo comprovado do backend, definindo rotas, regras de validação, fluxos transacionais e critérios de persistência de dados.

---

## 📊 2. Matriz Expandida de Requisitos Funcionais

### 📡 Módulo 01: Infraestrutura e Status

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-001** | `GET /api/status` | O sistema deve disponibilizar um endpoint público para verificação de *health check*, retornando o estado ativo e operacional da API. |

### 🔐 Módulo 02: Autenticação, Segurança e Controle de Acesso

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-002** | Cadastro de Usuário | Permitir a criação de novas contas coletando e-mail, senha e data de nascimento. Deve aplicar **validação compulsória de idade mínima**. |
| **RF03** | Segurança de Senha | O sistema deve interceptar a senha em texto claro e aplicar **criptografia via função hash** antes do armazenamento no banco de dados. |
| **RF-004** | Confirmação de E-mail | Emitir e validar tokens para a confirmação de novas contas, incluindo fluxos para o **reenvio do e-mail de confirmação**. |
| **RF-005** | Autenticação (Login) | Autenticar usuários baseando-se em credenciais válidas. O sistema deve emitir um **cookie seguro contendo o token JWT** de sessão. |
| **RF-006** | Bloqueio de Conta | Monitorar acessos e disparar o **bloqueio temporário da conta** após sucessivas tentativas consecutivas de login inválidas. |
| **RF-007** | Recuperação de Senha | Permitir que o usuário solicite a recuperação de acesso, gerando um token temporário enviado por e-mail para autorizar a redefinição. |
| **RF-008** | Redefinição de Senha | Processar a troca de senha utilizando o token temporário validado no fluxo de recuperação. |
| **RF-009** | Enrolamento 2FA | Permitir a **habilitação e confirmação** da Autenticação de Dois Fatores (2FA) na conta do usuário através de chaves segundas. |
| **RF-010** | Verificação 2FA | Exigir e validar o segundo fator de autenticação (OTP/Token) durante o fluxo de login caso o recurso esteja ativo. |
| **RF-011** | Desabilitação 2FA | Permitir que um usuário autenticado remova a exigência de 2FA de sua conta após validação interna de segurança. |
| **RF-012** | Encerramento (Logout) | Invalidar o token JWT ativo e limpar os cookies de sessão no navegador do usuário. |

### 👥 Módulo 03: Gestão de Usuários e Perfis

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-013** | Consulta de Perfil | Permitir que o usuário autenticado consulte seus próprios dados cadastrais e de perfil. |
| **RF-014** | Atualização Cadastral | Permitir que o usuário modifique suas informações de perfil (nome, dados de contato, etc.). |
| **RF-015** | Upload de Foto | Suportar o envio, processamento e vinculação de uma foto de perfil para o usuário autenticado. |
| **RF-016** | Alteração de Credenciais| Permitir a substituição da senha de acesso ativa mediante validação de segurança interna. |
| **RF-017** | Desativação de Conta | Disponibilizar rotina para que o usuário suspenda voluntariamente a atividade de sua própria conta. |
| **RF-018** | Exclusão de Conta | Permitir a deleção da conta pelo próprio usuário, disparando os gatilhos de conformidade de dados. |
| **RF-019** | Moderação Administrativa| Permitir que usuários com papel de **Administrador** alterem o estado ativo/inativo de qualquer conta no sistema. |
| **RF-020** | Gestão de Papéis (*Roles*)| Permitir que Administradores alterem o nível de privilégio (ex: Usuário comum para Administrador) de terceiros. |

### 🏷️ Módulo 04: Categorias e Preferências

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-021** | Listagem Pública | Permitir a listagem de todas as categorias que estejam com o status marcado como **ativo** no sistema. |
| **RF-022** | Painel de Categorias | Disponibilizar rota restrita a Administradores para listar todas as categorias (ativas e inativas). |
| **RF-023** | Criação de Categorias | Permitir que Administradores criem novas categorias de eventos na plataforma. |
| **RF-024** | Estado da Categoria | Permitir que Administradores ativem ou desativem categorias existentes, afetando sua exibição pública. |
| **RF-025** | Preferências do Usuário | Permitir que o usuário autenticado gerencie e consulte sua lista de categorias de interesse preferenciais. |

### 📅 Módulo 05: Gestão de Eventos e Agendamentos

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-026** | Listagem Geral | Disponibilizar a busca paramétrica e listagem pública de eventos cadastrados no sistema. |
| **RF-027** | Eventos em Destaque | Filtrar e expor a listagem de eventos marcados com a flag de destaque na plataforma. |
| **RF-028** | Recomendações e Sugestões| Retornar eventos sugeridos baseados em afinidade, popularidade ou regras internas. |
| **RF-029** | Pendências de Moderação | Rota administrativa para listar eventos criados que aguardam revisão antes da publicação. |
| **RF-030** | Detalhes do Evento | Permitir a consulta detalhada de um evento específico através do seu identificador único ID. |
| **RF-031** | Criação de Evento | Permitir a submissão de novos eventos, capturando metadados obrigatórios de infraestrutura e negócio. |
| **RF-032** | Edição de Evento | Permitir que o organizador ou administrador altere as informações de um evento existente. |
| **RF-033** | Fluxo de Aprovação | Rota administrativa para **aprovar ou rejeitar** eventos submetidos que estão na fila de pendências. |
| **RF-034** | Ciclo de Vida do Evento | Disponibilizar mecanismos automáticos ou manuais para **encerrar ou cancelar** eventos. |
| **RF-035** | Patrocínio de Eventos | Permitir a atribuição de status "patrocinado" a um evento para fins de priorização na listagem. |
| **RF-036** | Atributos Avançados | O sistema deve reter e validar para cada evento os seguintes parâmetros: **horários, acessibilidade, classificação etária, recorrência, capacidade máxima e preço**. |
| **RF-037** | Mídias e Links | Suportar a associação de uma **imagem de capa**, links externos oficiais e gerenciamento de uma **galeria de fotos** do evento. |

### 📍 Módulo 06: Fotos, Mídias e Geolocalização

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-038** | Listagem de Fotos | Listar os arquivos de imagem associados à galeria de mídia de um evento específico. |
| **RF-039** | Upload de Mídia | Permitir o upload e processamento de arquivos de imagem diretamente para a galeria de um evento. |
| **RF-040** | Remoção de Mídia | Permitir a exclusão de imagens específicas vinculadas à galeria do evento. |
| **RF-041** | Busca por CEP | Integrar e resolver dados de endereço completo (Logradouro, Bairro) a partir de um CEP fornecido. |
| **RF-042** | Resolução de Cidades | Consultar e estruturar dados geográficos a partir da parametrização de uma Cidade. |
| **RF-043** | Coordenadas Geográficas | Processar e associar **coordenadas de latitude e longitude** mapeadas diretamente ao CEP correspondente. |

### 🎯 Módulo 07: Interações, Engajamento e Histórico

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-044** | Favoritar Eventos | Permitir que o usuário autenticado adicione, liste e remova eventos de sua lista pessoal de favoritos. |
| **RF-045** | Inscrições em Eventos | Fornecer fluxo para controle de inscrições (criar solicitação, listar inscrições ativas e realizar cancelamentos/remoções). |
| **RF-046** | Histórico de Acesso | Registrar, listar e permitir que o usuário apague sua trilha de navegação e histórico dentro do app. |
| **RF-047** | Notificações do Usuário | Listar alertas direcionados ao usuário e permitir a marcação de mensagens como lidas (*read status*). |

### 💬 Módulo 08: Avaliações, Comentários e Moderação

| ID | Operação / Rota | Descrição Detalhada do Comportamento Técnico |
| :--- | :--- | :--- |
| **RF-048** | Consultar Avaliações | Exibir publicamente as notas corporativas e métricas de satisfação atribuídas a um evento. |
| **RF-049** | Atribuir Avaliação | Permitir que usuários autenticados enviem avaliações para eventos em conformidade com as regras de negócio. |
| **RF-050** | Remoção de Avaliações | Permitir a exclusão de uma avaliação existente (pelo autor ou moderação). |
| **RF-051** | Módulo de Comentários | Permitir a consulta, criação e exclusão de comentários textuais nos fóruns dos eventos, aplicando validações de permissão por perfil (Usuário comum vs. Administrador). |

---

## 💾 3. Diretrizes de Persistência (SQLite)
O sistema opera sob um modelo relacional centralizado utilizando o banco de dados **SQLite**, sendo obrigatória a persistência íntegra e isolada das seguintes entidades e logs:

* **Controle de Acessos:** `usuarios`, `tokens_temporarios`, `sessoes_invalidadas` (Blacklist de JWT).
* **Estrutura de Catálogo:** `categorias`, `preferencias_categorias`.
* **Regras de Evento:** `eventos`, `horarios_eventos`, `edicoes_pendentes`, `fotos_galeria`.
* **Relacionamentos e Logs:** `historicos_navegacao`, `inscricoes`, `favoritos`.
* **Feedback e Interação:** `avaliacoes`, `comentarios`.
* **Comunicação e Sistema:** `notificacoes`, `lembretes_agenda`, `logs_auditoria`.

---

## 🚫 4. Limites de Escopo (Fora do Escopo Comprovado)
As seguintes funções **não são atendidas isoladamente pelo backend** e estão expressamente fora do escopo desta especificação:
