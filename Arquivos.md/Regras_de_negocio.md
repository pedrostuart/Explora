# Regras de Negócio – Explora+

Documento reescrito a partir do comportamento real do sistema (NestJS + SQLite), validado executando o projeto de ponta a ponta. Substitui integralmente a numeração e o conteúdo das versões anteriores.

## 🔑 Módulo 1: Usuários e Autenticação (RN-001 a RN-013)

- **RN-001 (Unicidade de E-mail):** cada e-mail cadastrado é único na plataforma.
- **RN-002 (Unicidade de Nome de Usuário):** quando informado, o nome de usuário não pode se repetir.
- **RN-003 (Idade Mínima):** o cadastro exige data de nascimento válida e idade igual ou superior a 18 anos; datas futuras são rejeitadas.
- **RN-004 (Senha):** a senha deve ter no mínimo 6 caracteres e é armazenada com hash e salt via `bcryptjs`. Não há exigência de letras maiúsculas, minúsculas ou caractere especial.
- **RN-005 (Confirmação de Cadastro):** a conta nasce com e-mail não confirmado e não pode concluir o login normal até ser confirmada. A confirmação usa um código numérico de 6 dígitos, válido por 10 minutos, com indicador de uso (não pode ser reaproveitado).
- **RN-006 (Bloqueio por Tentativas Incorretas):** após 5 tentativas de login incorretas consecutivas, a conta fica bloqueada por 15 minutos.
- **RN-007 (Sessão de Autenticação):** a navegação autenticada é mantida por Token JWT em cookie assinado digitalmente e `HttpOnly`, com expiração automática após 30 minutos contínuos de inatividade.
- **RN-008 (Recuperação de Senha):** a redefinição de senha usa um código numérico de 6 dígitos, válido por 1 hora, com indicador de uso.
- **RN-009 (Confirmação de Identidade para Operações Sensíveis):** trocar senha, desativar conta ou excluir conta exigem a senha atual válida.
- **RN-010 (Perfis de Acesso):** todo usuário possui um papel: `usuario`, `prestador` ou `admin`.
- **RN-011 (Autenticação Multifator Opcional):** o usuário pode habilitar verificação em duas etapas (TOTP) nas configurações de segurança; uma vez habilitada, o login exige o código válido além da senha.
- **RN-012 (Encerramento de Sessão):** o logout invalida a sessão no servidor (registrando o identificador do token como invalidado) e limpa o cookie do navegador.
- **RN-013 (Acesso à Página de Confirmação):** a página de confirmação de conta é acessível sem sessão ativa, para permitir concluir o cadastro antes do login; demais páginas fora de uma lista pública exigem cookie de sessão válido.

## 🛡️ Módulo 2: Privacidade e Segurança — LGPD (RN-014 a RN-026)

- **RN-014 (Consentimento de Cookies):** um banner de privacidade é exibido em todas as páginas no primeiro acesso; a escolha do usuário é persistida no navegador (`localStorage`) e não é solicitada novamente.
- **RN-015 (Exclusão de Conta):** ao excluir a conta, o sistema anonimiza os dados pessoais do usuário (nome, e-mail, telefone, foto, cidade, biografia, data de nascimento e senha) e marca a conta como inativa, em vez de remover fisicamente o registro.
- **RN-016 (Anonimização de Históricos):** como a conta é anonimizada e não apagada, o histórico de interações permanece vinculado ao registro, porém sem dados pessoais identificáveis.
- **RN-017 (Log de Auditoria):** ações críticas — cadastro, login, alterações de perfil, exclusão de conta, moderação de eventos, tentativas de acesso inválidas — são registradas com timestamp em log de auditoria.
- **RN-018 (Limitação de Requisições):** a API limita o número de requisições por IP em janelas de tempo, para mitigar ataques de negação de serviço.
- **RN-019 (Validação e Sanitização de Entradas):** toda entrada via parâmetro, formulário ou corpo JSON é validada e higienizada antes de chegar à camada de negócio.
- **RN-020 (Rejeição Estruturada de Requisições Inválidas):** requisições que falham na validação são interrompidas com HTTP 400 e uma lista estruturada dos erros.
- **RN-021 (Política de CORS):** o acesso à API por origens externas é restrito às origens configuradas para o ambiente.
- **RN-022 (Ocultação de Erros Internos):** falhas técnicas não tratadas não expõem detalhes internos (stack trace, estrutura do banco, caminhos do servidor) na resposta ao cliente.
- **RN-023 (Validação de Tipo de Arquivo):** uploads de imagem (foto de perfil e fotos de evento) aceitam exclusivamente os formatos JPG, PNG ou WEBP.
- **RN-024 (Processamento de Upload por Streaming):** o recebimento de arquivos de imagem é processado por fluxo contínuo, sem carregar o arquivo inteiro em memória antes da validação.
- **RN-025 (Limite de Tamanho de Upload):** arquivos de imagem acima de 5 MB são rejeitados.
- **RN-026 (Tráfego Seguro):** em produção, o tráfego entre cliente e servidor deve ocorrer sobre HTTPS/TLS — garantido pela infraestrutura de implantação, não pelo código da aplicação.

## 📅 Módulo 3: Eventos e Agenda Cultural (RN-027 a RN-045)

- **RN-027 (Geolocalização Obrigatória):** todo evento deve possuir latitude e longitude válidas.
- **RN-028 (Cálculo de Distância):** o sistema calcula a distância entre a localização do usuário e a do evento, usada para ordenação por proximidade.
- **RN-029 (Moderação de Novos Eventos):** eventos cadastrados por usuários não administradores entram com status pendente até aprovação.
- **RN-030 (Imagem de Capa Obrigatória):** todo evento precisa de ao menos uma imagem principal.
- **RN-031 (Horários Estruturados):** os horários de funcionamento podem ser definidos separadamente para dias úteis, sábados, domingos e feriados.
- **RN-032 (Indicador "Aberto Agora"):** o sistema compara o horário atual do servidor com os horários cadastrados para indicar se o evento está aberto ou fechado no momento.
- **RN-033 (Moderação de Edições):** a edição de um evento ativo por um usuário não administrador gera uma edição pendente de aprovação; administradores podem editar diretamente.
- **RN-034 (Acessibilidade):** o cadastro permite declarar recursos de acessibilidade física, visual e auditiva.
- **RN-035 (Categoria Obrigatória):** todo evento deve estar vinculado a exatamente uma categoria ativa.
- **RN-036 (Transparência de Custos):** o evento deve indicar explicitamente se é gratuito ou informar a faixa de preço.
- **RN-037 (Endereço Estruturado):** o cadastro exige CEP, logradouro, número, bairro, cidade e estado válidos.
- **RN-038 (Validação de Link Externo):** links para ingressos ou informações externas são validados quanto ao formato de URL antes de serem salvos.
- **RN-039 (Encerramento de Eventos):** eventos com status encerrado ou cancelado são ocultados das buscas padrão.
- **RN-040 (Histórico de Edições):** alterações em um evento são registradas com o autor, o campo alterado e os valores anterior e novo.
- **RN-041 (Limite de Fotos):** a galeria de um evento aceita no máximo 15 fotos.
- **RN-042 (Consistência Temporal):** a data/hora de término de um evento deve ser posterior à data/hora de início.
- **RN-043 (Eventos Recorrentes):** um evento pode ser configurado como recorrente, com repetição diária, semanal ou mensal.
- **RN-044 (Arquivamento e Expansão Automática):** uma tarefa agendada, executada a cada 15 minutos, encerra automaticamente eventos cuja data já passou e gera a próxima ocorrência de eventos recorrentes.
- **RN-045 (Capacidade e Esgotamento):** o organizador pode definir capacidade máxima de participantes; o status do evento muda automaticamente para esgotado ao atingir o limite.

## 🔔 Módulo 4: Notificações e Classificação de Eventos (RN-046 a RN-048)

- **RN-046 (Classificação Etária):** todo evento deve indicar a faixa etária recomendada.
- **RN-047 (Alerta de Cancelamento e Encerramento):** ao cancelar ou encerrar um evento, o sistema notifica (dentro do aplicativo e por e-mail) todos os usuários que o haviam favoritado.
- **RN-048 (Moderação de Programação Externa):** eventos cadastrados por produtores/prestadores passam por aprovação administrativa antes da publicação.

## 🔍 Módulo 5: Busca, Filtros e Navegação (RN-049 a RN-058)

- **RN-049 (Filtros Combinados):** quando múltiplos filtros são aplicados simultaneamente, o resultado deve atender a todos os critérios ao mesmo tempo.
- **RN-050 (Busca Textual):** a busca por palavra-chave verifica título, descrição e categoria do evento, ignorando diferença entre maiúsculas e minúsculas. Não há normalização de acentuação — termos com e sem acento são tratados como diferentes.
- **RN-051 (Ordenação por Proximidade):** os resultados podem ser ordenados pela menor distância em relação à localização de referência do usuário.
- **RN-052 (Ordenação por Avaliação):** os resultados podem ser ordenados pela média de avaliação, do maior para o menor.
- **RN-053 (Sugestões de Busca):** a partir do 3º caractere digitado, o campo de busca exibe sugestões automáticas.
- **RN-054 (Paginação):** listagens extensas são paginadas no backend para reduzir o volume de dados transferido.
- **RN-055 (Busca Sem Resultado):** quando uma busca não encontra nenhum item correspondente, a interface sugere eventos bem avaliados em vez de uma tela vazia.
- **RN-056 (Preservação de Filtros):** os filtros aplicados ficam salvos na URL, permitindo compartilhar o link e restaurá-los ao voltar no navegador.
- **RN-057 (Raio de Busca no Mapa):** o usuário pode ajustar a distância máxima de varredura no mapa entre opções pré-definidas.
- **RN-058 (Filtro de Gratuidade):** um filtro de um clique isola apenas os eventos gratuitos.

## ⭐ Módulo 6: Avaliações, Favoritos e Interações (RN-059 a RN-064)

- **RN-059 (Favorito Único):** um mesmo evento não pode ser favoritado mais de uma vez pelo mesmo usuário.
- **RN-060 (Autenticação para Interações):** favoritar, comentar e avaliar exigem sessão autenticada e válida.
- **RN-061 (Avaliação Única):** cada usuário pode manter apenas uma nota/resenha ativa por evento.
- **RN-062 (Escala de Avaliação):** a nota de avaliação é um número inteiro entre 1 e 5.
- **RN-063 (Recálculo de Média):** a média de avaliações de um evento é recalculada sempre que uma nota é criada, alterada ou removida.
- **RN-064 (Integridade Referencial):** o banco de dados mantém restrições de chave estrangeira ativas, impedindo registros órfãos de favoritos, avaliações, comentários ou inscrições.
