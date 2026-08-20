# 📋Regras de Negócio – Explora+

**Objetivo:** Estabelecer as diretrizes de funcionamento, restrições e comportamentos do sistema Explora+, garantindo sincronia total entre a interface (Frontend), a API (Backend) e a persistência de dados (Banco de Dados SQLite).

---

## 🔑 Módulo 1: Gestão de Usuários e Autenticação (RN-001 a RN-015)

* **RN-001 (Unicidade de E-mail):** Cada endereço de e-mail cadastrado deve ser único na plataforma, sendo vedada a criação de múltiplas contas com o mesmo e-mail. *(Controlado em `server/routes/auth.js`)*.
* **RN-002 (Validação de Idade Mínima):** O cadastro exige a validação da data de nascimento para verificar se o usuário atinge a idade mínima de 18 anos para utilização de recursos específicos da plataforma. *(Validado em `public/javascript/cadastro.js`)*.
* **RN-003 (Criptografia de Senhas com Salt):** Todas as senhas devem passar por hash criptográfico com *salt* utilizando a biblioteca `bcryptjs` antes de qualquer persistência no banco de dados. *(Executado em `server/routes/auth.js`)*.
* **RN-004 (Bloqueio por Tentativas Incorretas):** O sistema deve aplicar bloqueio temporário por 15 minutos na conta do usuário após 5 tentativas incorretas consecutivas de login para prevenir ataques de força bruta. *(Persistido em `server/db/database.sqlite`)*.
* **RN-005 (Complexidade de Senha):** As senhas cadastradas devem conter no mínimo 6 caracteres, incluindo letras maiúsculas, minúsculas e pelo menos um caractere especial, em conformidade estrita com o layout frontend da plataforma. *(Validado em `cadastro.html` e `cadastro.js`)*.
* **RN-006 (Confirmação de Cadastro):** A conta recém-criada permanece com status "Pendente" até que o usuário valide o token ou código enviado ao e-mail informado. *(Controlado por flag no banco de dados)*.
* **RN-007 (Gestão de Sessão Segura):** A navegação autenticada deve ser mantida via Token JWT armazenado em cookies assinados digitalmente através das bibliotecas `cookie-signature` e `cookie-parser`. *(Configurado em `server/server.js` e `server/middlewares/autenticacao.js`)*.
* **RN-008 (Expiração por Inatividade):** A sessão do usuário deve expirar automaticamente após 30 minutos contínuos sem interação ativa com o sistema. *(Gerenciado via tempo de vida do cookie HTTP-Only)*.
* **RN-009 (Validade de Token de Recuperação):** A solicitação de redefinição de senha gera um código numérico temporário de 4 dígitos com validade máxima de 15 minutos. *(Controlado em `server/routes/auth.js` e `inserir-token.html`)*.
* **RN-010 (Invalidação de Tokens Utilizados):** O código numérico de recuperação deve ser marcado como usado e permanentemente inutilizado imediatamente após o primeiro uso com sucesso. *(Tratado em `server/routes/auth.js`)*.
* **RN-011 (Confirmação de Senha para Dados Sensíveis):** Alterações críticas do perfil, como a redefinição de uma nova senha, exigem a digitação prévia da credencial atual ou do token validado. *(Controlado em `mudar-senha.html`)*.
* **RN-012 (Perfis de Acesso Nativos):** Todo usuário deve possuir ao menos um perfil de acesso definido no banco de dados, mapeado entre as funções de Turista/Visitante, Prestador de Serviço ou Administrador. *(Definido no campo `role` em `server/db/schema.sql`)*.
* **RN-013 (Autenticação Multifator Opcional):** O usuário pode ativar a verificação em duas etapas (2FA) nas configurações de segurança de seu painel de perfil. *(Gerenciado em `server/routes/usuarios.js`)*.
* **RN-014 (Unicidade do Nome de Usuário):** O nome de exibição público ou e-mail de identificação não pode gerar duplicidades que entrem em conflito no momento do login. *(Bloqueado no backend de autenticação)*.
* **RN-015 (Encerramento Centralizado de Sessão):** O procedimento de *logout* deve invalidar os tokens ativos no servidor e limpar os cookies do navegador. *(Executado em `server/routes/auth.js` através de `res.clearCookie`)*.

---

## 🛡️ Módulo 2: Privacidade, Segurança e Infraestrutura (LGPD) (RN-016 a RN-028)

* **RN-016 (Consentimento de Cookies):** O primeiro acesso do visitante à plataforma exige o aceite explícito das políticas de cookies e privacidade através de um banner informativo. *(Exibido via `public/javascript/index.js`)*.
* **RN-017 (Direito ao Esquecimento):** A solicitação de exclusão definitiva da conta exige a remoção permanente de todos os dados pessoais do usuário das tabelas SQLite, atendendo à LGPD. *(Executado em `server/routes/usuarios.js`)*.
* **RN-018 (Anonimização de Dados Históricos):** Ao excluir uma conta, dados transacionais de históricos e estatísticas são desvinculados do usuário e anonimizados para fins de relatórios internos. *(Tratado em `server/routes/historico.js`)*.
* **RN-019 (Retenção Legal de Logs):** Alterações críticas de perfil e tentativas de acessos inválidos devem ser registradas com timestamp e salvas na tabela de auditoria. *(Inserido na tabela `logs_auditoria` via `server/routes/auth.js`)*.
* **RN-020 (Limitação de Requisições - Rate Limiting):** A API deve limitar o número de requisições por endereço IP em janelas de tempo pré-fixadas utilizando o pacote `express-rate-limit` para evitar ataques de negação de serviço. *(Middleware aplicado em `server/routes/auth.js`)*.
* **RN-021 (Sanitização Universal de Dados):** Qualquer entrada via parâmetro, formulário ou objeto JSON deve ser higienizada e validada no backend com a biblioteca `express-validator`. *(Implementado em `server/routes/auth.js`)*.
* **RN-022 (Rejeição com Status 400):** Requisições que falharem nos testes do `express-validator` devem ter a execução interrompida com retorno imediato do status HTTP `400 Bad Request` e a lista de erros estruturada. *(Verificado em todas as rotas através de `validationResult(req)`)*.
* **RN-023 (Política CORS Restritiva):** O acesso à API por requisições de origens externas ao domínio do Explora+ deve ser estritamente gerenciado e limitado via middleware `cors`. *(Declarado em `server/server.js`)*.
* **RN-024 (Ocultação de Erros Internos):** Falhas técnicas não tratadas no backend (status 500) não podem expor detalhes da estrutura do banco SQLite ou caminhos do servidor, delegando a resposta genérica segura ao middleware `finalhandler`. *(Integrado em `server/server.js`)*.
* **RN-025 (Validação de Tipo MIME):** O upload de arquivos de imagem exige a verificação rigorosa do tipo de conteúdo, aceitando exclusivamente mídias formatadas como JPG, PNG ou WEBP. *(Validado em `server/routes/usuarios.js`)*.
* **RN-026 (Uploads por Streaming):** O processamento e recebimento de mídias de imagem no servidor deve ser feito por fluxo contínuo de streaming utilizando a biblioteca `busboy`. *(Gerenciado no barramento de uploads do arquivo `server/server.js`)*.
* **RN-027 (Limite do Tamanho do Arquivo):** Requisições de upload de arquivos que ultrapassarem o peso máximo de 5MB devem ser bloqueadas imediatamente na entrada do servidor. *(Tratado pelo middleware de upload)*.
* **RN-028 (Criptografia em Trânsito):** Toda a navegação no frontend do Explora+ e o tráfego de dados nas chamadas de API (`fetch`) devem ocorrer obrigatoriamente sob protocolo seguro HTTPS/TLS. *(Aplicável no servidor de produção)*.

---

## 🗺️ Módulo 3: Cadastro de Pontos Turísticos e Atrações (RN-029 a RN-043)

* **RN-029 (Obrigatoriedade de Geolocalização):** Toda atração ou ponto turístico cadastrado no sistema deve possuir coordenadas geográficas de latitude e longitude válidas para plotagem de tela. *(Utilizado em `mapa.html` e `server/routes/eventos.js`)*.
* **RN-030 (Cálculo Geográfico de Distância):** O sistema deve calcular dinamicamente a distância geográfica em quilômetros (km) entre a geolocalização do dispositivo do usuário e o local consultado. *(Mapeado em `public/javascript/barra-pesquisa-mapa.js`)*.
* **RN-031 (Aprovação Administrativa de Atrações):** Pontos turísticos cadastrados na plataforma por colaboradores ou terceiros ficam com status pendente até a revisão e aprovação da administração. *(Controlado em `server/routes/eventos.js`)*.
* **RN-032 (Presença de Mídia Principal):** Cada ponto turístico cadastrado precisa conter ao menos uma imagem principal ou banner promocional em alta definição para renderização dos carrosséis visuais. *(Gerenciado via `slick.js` nas listagens)*.
* **RN-033 (Horários por Dia da Semana):** A entidade local do banco de dados deve permitir o cadastro estruturado de horários diferenciados de funcionamento para dias de semana, sábados, domingos e feriados. *(Estruturado em `server/db/schema.sql`)*.
* **RN-034 (Indicador de Status em Tempo Real):** O sistema deve processar o horário atual do servidor e exibir de forma dinâmica na interface se o local está "Aberto Agora" ou "Fechado". *(Calculado via rotinas de interface)*.
* **RN-035 (Moderação de Alterações):** Edições em atrações turísticas ativas devem passar por uma fila de reavaliação administrativa antes que as novas informações fiquem visíveis ao público. *(Controlado via flags na tabela de eventos)*.
* **RN-036 (Declaração de Acessibilidade):** O cadastro do local exige a marcação explícita de metadados referentes aos recursos de acessibilidade física, visual ou auditiva disponíveis no estabelecimento. *(Campos estruturados na tabela de locais)*.
* **RN-037 (Categorização Obrigatória):** Toda atração ou evento deve estar rigidamente vinculada a pelo menos uma categoria temática ativa no sistema (ex: Museus, Parques, Gastronomia). *(Validado por FK e tratado em `server/routes/categorias.js`)*.
* **RN-038 (Transparência de Custos):** O cadastro do local deve indicar claramente se a entrada é franca (gratuita com valor igual a zero) ou exibir a faixa de preço praticada para acesso. *(Mapeado nos campos numéricos de preço)*.
* **RN-039 (Endereço Estruturado):** O cadastro exige os campos de CEP, logradouro, número, bairro, cidade e estado válidos e preenchidos de forma consistente. *(Mapeado nos formulários de inclusão de pontos)*.
* **RN-040 (Validação de Links Externos):** URLs para sites oficiais dos organizadores ou perfis de redes sociais cadastradas na atração devem passar por uma validação sintática antes de serem salvas. *(Validado via regex no backend)*.
* **RN-041 (Desativação de Atrações Encerradas):** Locais que encerraram permanentemente suas atividades devem ser marcados como "Inativos", ocultando-os automaticamente do motor de busca padrão do site. *(Filtrado nas rotas de busca de `server/routes/eventos.js`)*.
* **RN-042 (Histórico de Edições):** O sistema deve manter o registro do histórico de edições e do identificador do usuário administrador ou prestador de serviço responsável pelas alterações no cadastro. *(Registrado via tabelas de log auxiliares)*.
* **RN-043 (Limite Máximo de Fotos):** Cada atração turística ou ponto de interesse pode ter no máximo 15 fotos armazenadas na sua galeria oficial do servidor. *(Limitado nas checagens do backend de arquivos)*.

---

## 📅 Módulo 4: Gestão de Eventos e Agenda Cultural (RN-044 a RN-055)

* **RN-044 (Vínculo com Local Físico):** Todo evento cadastrado na agenda cultural deve estar associado a um ponto turístico existente ou a um endereço válido no mapa por integridade de dados. *(Garantido por Foreign Keys em `server/db/schema.sql`)*.
* **RN-045 (Destaque de Eventos do Dia):** Eventos cadastrados cuja data de realização coincida com a data atual do servidor devem receber sinalização visual e destaque prioritário nos carrosséis do site. *(Controlado em `public/javascript/index.js`)*.
* **RN-046 (Consistência Temporal):** A data e o horário de encerramento do evento configurados no banco de dados devem ser obrigatoriamente posteriores à data e horário de início. *(Validado pelas regras do `express-validator`)*.
* **RN-047 (Suporte a Eventos Recorrentes):** O sistema deve permitir a configuração de agendas e datas recorrentes que se repitam automaticamente em intervalos semanais ou mensais. *(Mapeado no arquivo de esquema do banco de dados)*.
* **RN-048 (Arquivamento Automático):** Eventos cuja data e horário finais de cronograma já expiraram devem ser movidos automaticamente para o repositório de eventos passados nas buscas do site. *(Filtrado dinamicamente em `server/routes/eventos.js`)*.
* **RN-049 (Capacidade e Lotação):** O organizador pode definir a lotação máxima permitida de ingressos, fazendo com que o sistema mude o status do evento para "Esgotado" de forma automática assim que o limite for atingido. *(Validado em `server/routes/inscricoes.js`)*.
* **RN-050 (Classificação Etária Compulsória):** Todo evento inserido na plataforma deve conter a indicação clara e obrigatória da faixa etária recomendada ou permitida por lei. *(Campo obrigatório no banco SQLite)*.
* **RN-051 (Alerta de Cancelamento):** Caso um evento seja alterado para o status "Cancelado", e-mails ou notificações automáticas devem ser enviadas aos usuários que o favoritaram. *(Processado via `server/routes/notificacoes.js`)*.
* **RN-052 (Notificação de Alteração de Horário):** Mudanças críticas de última hora na programação, data ou local de um evento geram alertas no painel de notificações dos usuários interessados. *(Gerenciado em `server/routes/notificacoes.js`)*.
* **RN-053 (Direcionamento de Ingressos):** O botão de redirecionamento para a compra de ingressos externos deve abrir a bilheteria oficial do parceiro estritamente em uma nova guia do navegador (`target="_blank"`). *(Mapeado nas páginas de informações dos eventos)*.
* **RN-054 (Filtro de Eventos Gratuitos):** A plataforma deve disponibilizar um filtro rápido e exclusivo no frontend que isola e exibe apenas as programações culturais gratuitas (preço igual a zero). *(Validado em `public/javascript/filtros-eventos.js`)*.
* **RN-055 (Moderação de Programação):** Eventos submetidos por produtores externos necessitam de validação e aprovação manual da equipe administrativa do Explora+ antes da publicação oficial. *(Restrito pelas permissões de rotas de administração)*.

---

## 🔍 Módulo 5: Sistema de Busca, Filtros e Navegação (RN-056 a RN-064)

* **RN-056 (Lógica AND em Filtros Combinados):** Ao selecionar múltiplos critérios de busca em paralelo (como categoria e faixa de preço), a listagem deve trazer apenas os itens que atendam a todas as condições conjuntamente. *(Estruturado via queries SQL em `server/routes/eventos.js`)*.
* **RN-057 (Busca Textual Abrangente):** O campo de busca por palavra-chave deve pesquisar simultaneamente nos campos de título, descrição e nome da categoria do evento, ignorando letras maiúsculas/minúsculas e acentos gráficos. *(Implementado com operadores textuais tolerantes no SQLite)*.
* **RN-058 (Ordenação por Proximidade GPS):** A listagem de busca por raio de distância do mapa deve exibir em primeiro lugar as atrações geograficamente mais próximas da coordenada de referência do usuário. *(Validado em `public/javascript/filtros-mapa.js`)*.
* **RN-059 (Ordenação por Melhor Avaliados):** O sistema deve permitir ordenar os resultados das buscas com base na média de notas decrescente de avaliações (estrelas) atribuídas pela comunidade. *(Validado em `public/javascript/filtros-eventos.js`)*.
* **RN-060 (Sugestões Automáticas de Busca):** O campo de pesquisa textual deve disparar requisições assíncronas e sugerir termos de categorias e locais a partir do 3º caractere digitado pelo usuário. *(Controlado em `public/javascript/barra-pesquisa.js`)*.
* **RN-061 (Paginação de Resultados):** Listagens volumosas com mais de 20 itens devem ser paginadas pelo backend para otimizar o tempo de carregamento no frontend e o consumo de dados de rede. *(Utiliza comandos `LIMIT` e `OFFSET` no banco SQLite)*.
* **RN-062 (Tratamento para Busca Sem Retorno):** Caso uma busca não retorne nenhum resultado correspondente, a interface deve exibir uma mensagem amigável apropriada e sugerir locais em alta na plataforma. *(Mapeado em `public/javascript/barra-pesquisa.js`)*.
* **RN-063 (Manutenção do Estado dos Filtros):** Ao clicar em um local para ver os detalhes e usar o botão voltar do cabeçalho, o sistema deve preservar o estado dos filtros e o posicionamento que o usuário aplicou anteriormente. *(Mapeado na navegação das páginas HTML)*.
* **RN-064 (Ajuste de Raio de Pesquisa):** O usuário pode customizar a distância máxima de varredura geográfica no mapa através de opções pré-definidas (ex: 2km, 5km, 10km, 50km) para filtrar as atrações exibidas. *(Controlado em `public/javascript/filtros-mapa.js`)*.

---

## ⭐ Módulo 6: Avaliações, Favoritos e Integridade (RN-065 a RN-070)

* **RN-065 (Exclusividade do Favorito):** Um mesmo ponto turístico ou evento não pode ser inserido mais de uma vez na tabela de favoritos de um mesmo usuário, evitando duplicidades. *(Garantido por restrição de chave única composta e verificado em `server/routes/favoritos.js`)*.
* **RN-066 (Autenticação para Ações de Interação):** Apenas usuários devidamente logados com sessão ativa e Token JWT válido possuem permissão para salvar favoritos, enviar comentários ou registrar notas de avaliação. *(Garantido pelo middleware de autenticação no servidor)*.
* **RN-067 (Avaliação Única por Local):** Cada usuário cadastrado só pode enviar e manter 1 (uma) nota e resenha ativa por ponto turístico ou evento específico. *(Validado em `server/routes/avaliacoes.js`)*.
* **RN-068 (Escala de Pontuação Padrão):** As notas de avaliação de reputação enviadas pelos usuários devem consistir estritamente em valores inteiros variando no intervalo fechado entre 1 e 5 estrelas. *(Validado no backend através do `express-validator`)*.
* **RN-069 (Recálculo Imediato da Média):** A nota média global exibida publicamente no banner de uma atração deve ser recalculada e atualizada no banco de dados automaticamente a cada nova avaliação postada, editada ou deletada. *(Processado em `server/routes/avaliacoes.js`)*.
* **RN-070 (Preservação de Consistência Geral - ACID):** Toda e qualquer operação de gravação, modificação ou exclusão executada no ecossistema Explora+ deve preservar a integridade referencial das chaves estrangeiras configuradas no SQLite, impedindo a sobrevivência de registros órfãos de favoritos, comentários ou avaliações após a deleção de um usuário ou evento. *(Garantido pelas restrições de integridade ativas do banco de dados)*.