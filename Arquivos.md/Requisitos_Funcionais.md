# 📋 Especificação de Requisitos de Sistema — Explora+

---

## ⚙️ Requisitos Funcionais (RF)

### Módulo 1: Gestão de Usuários e Autenticação

* **RF-001 (Cadastro com E-mail Único):** Permitir o cadastro de novos usuários garantindo que o endereço de e-mail informado seja único na plataforma, sendo vedada a criação de múltiplas contas com o mesmo e-mail.
* **RF-002 (Validação de Idade Mínima):** Exigir a verificação da data de nascimento no formulário de cadastro para assegurar a idade mínima de 18 anos para utilização de recursos específicos da plataforma.
* **RF-003 (Confirmação e Ativação de Cadastro):** Manter a conta criada com o status "Pendente" até que o usuário valide o token ou código enviado ao seu e-mail.
* **RF-004 (Autenticação de Usuário):** Permitir que usuários cadastrados realizem login fornecendo e-mail/nome de usuário e senha válidos.
* **RF-005 (Recuperação de Senha por Código Temporário):** Permitir a solicitação de redefinição de senha gerando um código numérico de 4 dígitos enviado por e-mail, com validade de 15 minutos.
* **RF-006 (Invalidação de Token de Recuperação):** Marcar o código de recuperação como utilizado e permanentemente inutilizado após o primeiro uso bem-sucedido.
* **RF-007 (Confirmação de Identidade para Operações Sensíveis):** Exigir a confirmação da senha atual ou validação prévia de token antes de efetuar alterações críticas no perfil, como a redefinição de senha.
* **RF-008 (Atribuição de Perfil de Acesso):** Associar obrigatoriamente todo usuário a pelo menos um perfil de acesso (Turista/Visitante, Prestador de Serviço ou Administrador).
* **RF-009 (Autenticação Multifator - 2FA Opcional):** Disponibilizar a opção de ativação da verificação em duas etapas no painel de configurações de segurança do perfil.
* **RF-010 (Garantia de Unicidade do Identificador):** Bloquear a criação ou edição de nome de exibição/e-mail que gere conflitos ou duplicidades no login.
* **RF-011 (Encerramento Centralizado de Sessão / Logout):** Permitir o encerramento da sessão ativa pelo usuário a qualquer momento, invalidando tokens no servidor e limpando os cookies do navegador.

---

### Módulo 2: Privacidade e Gestão de Dados (LGPD)

* **RF-012 (Gestão de Consentimento de Cookies):** Exibir banner informativo no primeiro acesso do visitante para obtenção do aceite explícito das políticas de cookies e privacidade.
* **RF-013 (Direito ao Esquecimento / Exclusão de Conta):** Permitir que o usuário solicite a exclusão definitiva de sua conta, com a remoção permanente de seus dados pessoais do banco de dados.
* **RF-014 (Anonimização de Históricos Transacionais):** Desvincular e anonimizar os dados de histórico e estatísticas ao excluir a conta de um usuário, mantendo-os despersonalizados apenas para relatórios internos.
* **RF-015 (Registro de Logs de Auditoria):** Gravar em tabela de auditoria (`logs_auditoria`) as alterações de perfil, tentativas de acesso inválidas e operações críticas com respectivo *timestamp*.

---

### Módulo 3: Cadastro de Pontos Turísticos e Atrações

* **RF-016 (Cadastro e Edição de Locais):** Permitir o cadastro e alteração de pontos turísticos incluindo nome, descrição, endereço estruturado (CEP, logradouro, número, bairro, cidade e estado), categorias, faixa de preço e recursos de acessibilidade.
* **RF-017 (Geolocalização Obrigatória):** Exigir o cadastro e armazenamento de coordenadas de latitude e longitude válidas para todos os pontos turísticos.
* **RF-018 (Cálculo Dinâmico de Distância):** Calcular dinamicamente a distância em quilômetros entre a localização GPS do usuário e a atração consultada.
* **RF-019 (Moderação Administrativa de Atrações):** Submeter cadastros e edições de pontos turísticos realizados por terceiros/colaboradores à aprovação prévia da administração antes de torná-los públicos.
* **RF-020 (Gestão de Mídias e Galeria):** Permitir o envio de até 15 fotos por atração turística, exigindo obrigatoriamente ao menos uma imagem principal ou banner.
* **RF-021 (Horários por Dia da Semana):** Permitir a definição estruturada de horários de funcionamento diferenciados para dias úteis, sábados, domingos e feriados.
* **RF-022 (Indicador Status "Aberto Agora"):** Processar o horário do servidor e exibir dinamicamente na interface se o local encontra-se "Aberto Agora" ou "Fechado".
* **RF-023 (Declaração de Acessibilidade):** Permitir a marcação explícita de metadados dos recursos de acessibilidade física, visual e auditiva disponíveis no estabelecimento.
* **RF-024 (Categorização Obrigatória):** Exigir o vínculo do ponto turístico a pelo menos uma categoria temática ativa no sistema.
* **RF-025 (Transparência de Custos):** Indicar explicitamente se a atração é gratuita (valor zerado) ou exibir a faixa de preço cobrada para acesso.
* **RF-026 (Inativação de Atrações Encerradas):** Permitir marcar como "Inativos" os pontos turísticos que encerraram atividades, ocultando-os das buscas padrão.
* **RF-027 (Rastreabilidade de Edições):** Registrar o histórico de alterações e o identificador do usuário responsável (administrador ou prestador) pelas edições efetuadas no cadastro.

---

### Módulo 4: Gestão de Eventos e Agenda Cultural

* **RF-028 (Vínculo com Local Físico):** Exigir que todo evento cadastrado esteja associado a um ponto turístico existente ou a um endereço válido no mapa.
* **RF-029 (Destaque de Eventos do Dia):** Sinalizar visualmente e priorizar nas listagens principais os eventos cuja data coincida com a data atual do servidor.
* **RF-030 (Consistência Temporal do Evento):** Validar se a data e o horário de encerramento do evento são estritamente posteriores à data e horário de início.
* **RF-031 (Suporte a Eventos Recorrentes):** Permitir a configuração de eventos com repetição automática em intervalos semanais ou mensais.
* **RF-032 (Arquivamento Automático):** Transferir automaticamente eventos cujo horário final expirou para o repositório de eventos passados nas pesquisas.
* **RF-033 (Controle de Lotação e Esgotamento):** Permitir a definição de capacidade máxima de ingressos e alterar o status para "Esgotado" automaticamente ao atingir o limite.
* **RF-034 (Classificação Etária Obrigatória):** Exigir a definição e exibição da faixa etária recomendada para todos os eventos da agenda cultural.
* **RF-035 (Notificação de Alterações e Cancelamento):** Disparar alertas automáticos no painel/e-mail dos usuários interessados que favoritaram o evento em caso de cancelamento ou mudança de horário/local.
* **RF-036 (Redirecionamento para Ingressos Externos):** Garantir que o botão de redirecionamento para bilheteria parceira abra a URL em uma nova guia (`target="_blank"`).
* **RF-037 (Moderação de Programação Cultural):** Submeter eventos cadastrados por produtores externos à revisão e aprovação manual do perfil administrador antes de sua publicação.

---

### Módulo 5: Busca, Filtros e Navegação

* **RF-038 (Filtro Combinado com Lógica AND):** Filtrar resultados garantindo que o item atenda cumulativamente a todos os critérios selecionados na busca.
* **RF-039 (Busca Textual Geral):** Pesquisar simultaneamente nos campos de título, descrição e categoria do evento, ignorando diferença entre maiúsculas/minúsculas e acentuação.
* **RF-040 (Ordenação por Proximidade GPS):** Permitir a ordenação dos resultados por ordem de menor distância em relação à localização de referência do usuário.
* **RF-041 (Ordenação por Melhor Avaliados):** Permitir a ordenação dos locais e eventos com base na média decrescente de avaliação por estrelas.
* **RF-042 (Sugestões Automáticas de Busca):** Exibir sugestões assíncronas de categorias e locais a partir do 3º caractere digitado na caixa de pesquisa.
* **RF-043 (Paginação de Resultados):** Paginá listagens superiores a 20 itens no backend via comandos SQL para otimizar transferência de dados.
* **RF-044 (Tratamento para Pesquisas Sem Retorno):** Exibir mensagem amigável e recomendações de locais populares quando uma consulta não encontrar resultados.
* **RF-045 (Preservação de Estado da Navegação):** Manter os filtros selecionados e a posição do scroll ao retornar da página de detalhes de uma atração.
* **RF-046 (Ajuste de Raio de Pesquisa no Mapa):** Permitir ao usuário personalizar a distância máxima de varredura no mapa (ex: 2km, 5km, 10km, 50km).
* **RF-047 (Filtro Rápido de Gratuidade):** Oferecer um filtro de clique único para listar apenas os eventos e atrações com valor de acesso gratuito.

---

### Módulo 6: Avaliações, Favoritos e Interações

* **RF-048 (Gestão de Favoritos):** Permitir adicionar ou remover itens da lista de favoritos, impedindo duplicidades para um mesmo usuário e atração/evento.
* **RF-049 (Autenticação para Interações):** Exigir login ativo e Token JWT válido para permitir ações de favoritar, comentar e avaliar.
* **RF-050 (Avaliação Única por Usuário):** Permitir apenas 1 (uma) nota e resenha ativa por usuário para cada ponto turístico ou evento.
* **RF-051 (Escala de Pontuação Padrão):** Restringir a nota de avaliação a valores inteiros entre 1 e 5 estrelas.
* **RF-052 (Recálculo Automático da Média):** Recalcular automaticamente e atualizar a média global de pontuação exibida no local a cada nova nota cadastrada, alterada ou removida.

---