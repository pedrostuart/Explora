# 📖 Documento de Regras de Negócio (RN)

## 📌 1. Introdução e Escopo
Este documento cataloga o conjunto completo de Regras de Negócio (RN) aplicadas ao ecossistema da plataforma. As regras aqui descritas governam a validação de dados, restrições operacionais, fluxos transacionais, segurança, conformidade legal e políticas de governança corporativa.

---

## 📊 2. Repositório Consolidado de Regras de Negócio

### 🔐 Segurança, Autenticação e Sessão
| ID | Descrição da Regra |
| :--- | :--- |
| **RN01** | Validação obrigatória de e-mail único no cadastro de novos usuários. |
| **RN02** | Senhas de acesso devem conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais. |
| **RN03** | Bloqueio temporário da conta por 30 minutos após 5 tentativas consecutivas de login inválidas. |
| **RN04** | Sessão do usuário expira automaticamente após 30 minutos de inatividade contínua. |
| **RN05** | Perfis de acesso são divididos estritamente em: *Cliente*, *Prestador* e *Administrador*. |
| **RN06** | Alteração de senha requer a confirmação obrigatória da senha atual. |
| **RN07** | Recuperação de senha executada via token temporário com validade máxima de 15 minutos. |
| **RN09** | Proibição estrita de cadastro duplicado utilizando o mesmo CPF ou CNPJ. |
| **RN10** | Autenticação de dois fatores (2FA) obrigatória para contas com privilégio administrativo. |
| **RN11** | Logout automático disparado ao fechar o navegador ou expirar o token JWT de sessão. |
| **RN12** | Restrição de acesso geográfico ou por IP para funções críticas do painel administrativo. |
| **RN65** | Envio de alertas de segurança em caso de login detectado em dispositivo ou local desconhecido. |
| **RN70** | Exigência de reautenticação para ações críticas de segurança (ex: alteração de chaves PIX ou e-mail de cadastro). |
| **RN71** | Histórico de senhas impede a reutilização das últimas 3 senhas cadastradas pelo usuário. |

### 🛍️ Catálogo, Produtos e Estoque
| ID | Descrição da Regra |
| :--- | :--- |
| **RN13** | Todo serviço ou produto cadastrado deve pertencer obrigatoriamente a uma categoria ativa. |
| **RN14** | Preços de serviços não podem ser negativos ou iguais a zero, salvo campanhas promocionais oficiais. |
| **RN15** | Alterações de preços em serviços ativos entram em vigor apenas para novas solicitações futuras. |
| **RN16** | Itens descontinuados pelo prestador ocultam-se das buscas, mas permanecem visíveis no histórico de pedidos passados. |
| **RN18** | Descrições de serviços devem possuir no mínimo 30 caracteres para garantir clareza ao consumidor. |
| **RN19** | Prestadores podem suspender temporariamente a oferta de um serviço sem removê-lo do catálogo. |
| **RN20** | O sistema deve validar *tags* e palavras-chave para otimização da busca interna e indexação. |
| **RN21** | Produtos físicos vinculados a serviços exigem controle estrito de estoque mínimo configurável. |
| **RN22** | Atualizações de estoque disparam alertas automáticos ao atingir o limite crítico. |
| **RN26** | Serviços em destaque no catálogo exigem aprovação prévia da moderação do sistema. |
| **RN28** | Validação de compatibilidade entre o serviço ofertado e a região geográfica de atendimento do prestador. |
| **RN72** | Permissão de variação de preço por região geográfica ou deslocamento do prestador, devidamente discriminada ao cliente. |

### 🛠️ Operações, Agendamento e Fluxo de Atendimento
| ID | Descrição da Regra |
| :--- | :--- |
| **RN29** | Uma solicitação de serviço passa pelos estados: *Pendente*, *Confirmada*, *Em Andamento*, *Concluída* ou *Cancelada*. |
| **RN30** | Agendamentos não podem ser realizados em datas passadas ou horários fora da grade de disponibilidade do prestador. |
| **RN31** | O cancelamento de serviço pelo cliente com menos de 24 horas de antecedência incorre em taxa de conveniência/multa. |
| **RN32** | Se o prestador cancelar a solicitação, o cliente recebe reembolso integral imediato e opção de reagendamento prioritário. |
| **RN33** | O ciclo de atendimento é finalizado mediante confirmação digital do cliente ou encerramento automático após 48 horas. |
| **RN34** | Conflitos de horário na agenda do prestador bloqueiam automaticamente novas solicitações simultâneas. |
| **RN35** | O sistema permite renegociação de prazos e valores mediante aceite mútuo entre cliente e prestador. |
| **RN39** | Limite máximo de 5 solicitações ativas simultâneas por cliente para evitar sobrecarga operacional. |
| **RN40** | Prestadores possuem limite configurável de atendimento diário para garantir qualidade na prestação. |
| **RN42** | Bloqueio de novos agendamentos para clientes com histórico de inadimplência ou cancelamentos abusivos recorrentes. |
| **RN46** | Validação obrigatória de feriados nacionais e locais na grade de agendamentos do sistema. |
| **RN47** | O sistema impede o aceite de múltiplos serviços no mesmo intervalo de tempo pelo mesmo prestador. |
| **RN48** | Restrição de modificações em solicitações que já se encontram no estado ‘Em Andamento’. |
| **RN73** | Solicitações pendentes não respondidas pelo prestador em até 24 horas são canceladas automaticamente por decurso de prazo. |
| **RN74** | O cliente pode estender o escopo do serviço em andamento caso o prestador aceite e envie o aditivo financeiro via plataforma. |

### 💳 Financeiro, Fiscal e Repasses
| ID | Descrição da Regra |
| :--- | :--- |
| **RN36** | Transações com status pendente de pagamento expiram automaticamente após 30 minutos. |
| **RN49** | Toda transação financeira bem-sucedida retém uma taxa de comissão percentual configurável para a plataforma. |
| **RN50** | O repasse financeiro aos prestadores ocorre em D+14 dias após a conclusão e validação do serviço. |
| **RN51** | Estornos de pagamentos seguem estritamente a regra operacional da bandeira do cartão ou *gateway* integrado. |
| **RN52** | Cupons de desconto possuem validade temporal estrita e limite de utilização por CPF/conta. |
| **RN53** | Cupons promocionais não são acumulativos, salvo autorização explícita no regulamento da campanha. |
| **RN54** | O sistema calcula automaticamente impostos retidos na fonte quando aplicável à legislação tributária vigente. |
| **RN55** | Contas bancárias cadastradas para repasse devem pertencer obrigatoriamente ao mesmo CPF/CNPJ do prestador verificado. |
| **RN56** | Emissão de nota fiscal eletrônica automatizada para transações processadas pela plataforma. |
| **RN57** | Bloqueio preventivo de repasses financeiros em caso de disputa ou contestação (*chargeback*) aberta pelo cliente. |
| **RN58** | Taxas de serviço adicionais (ex: urgência) devem ser informadas explicitamente antes da confirmação do pagamento. |
| **RN60** | A moeda padrão do sistema é o Real Brasileiro (BRL), com arredondamento padronizado em duas casas decimals. |
| **RN75** | Retenção temporária de valores de repasse em contas de prestadores suspensos administrativamente por quebra de termos de uso. |
| **RN76** | Faturamento mínimo para solicitação de saque antecipado sujeito às taxas extras do gateway parceiro. |

### 💬 Comunicação, Chat e Suporte
| ID | Descrição da Regra |
| :--- | :--- |
| **RN43** | Notificação automática enviada via *push*/e-mail 2 horas antes do horário agendado do serviço. |
| **RN61** | Mensagens trocadas no chat interno entre cliente e prestador devem ser criptografadas em repouso e em trânsito. |
| **RN62** | O sistema envia notificações por e-mail para confirmações críticas (cadastro, pagamento aprovado, cancelamento). |
| **RN63** | Chamados de suporte abertos geram protocolos únicos de atendimento com rastreabilidade completa de status. |
| **RN64** | Prazo máximo de resposta da moderação para disputas abertas é de 48 horas úteis. |
| **RN66** | O usuário pode gerenciar suas preferências de recebimento de notificações (e-mail, *push*, SMS). |
| **RN67** | Mensagens contendo links externos suspeitos ou dados sensíveis no chat são bloqueadas por filtros automáticos. |

### 📝 Avaliações, Conteúdo e Mídia
| ID | Descrição da Regra |
| :--- | :--- |
| **RN17** | Imagens associadas aos serviços devem respeitar limite de tamanho (máximo 5MB) em formatos PNG ou JPEG. |
| **RN23** | Avaliações e comentários em serviços só podem ser realizados por clientes que concluíram a contratação. |
| **RN24** | Comentários ofensivos ou impróprios passam por moderação automática e revisão de administradores. |
| **RN25** | A média de avaliação de um serviço é recalculada automaticamente a cada nova nota inserida. |
| **RN27** | Limite máximo de 10 imagens por galeria de apresentação de serviço. |
| **RN44** | Registro de feedback obrigatório (nota de 1 a 5 estrelas) ao finalizar um ciclo de serviço. |
| **RN77** | O prestador possui direito a uma única resposta pública por comentário ou avaliação recebida, sem direito a réplica posterior pelo cliente. |

### ⚖️ Governança, Logs e Conformidade Legal
| ID | Descrição da Regra |
| :--- | :--- |
| **RN08** | Exclusão lógica de usuários (*soft delete*) mantendo histórico de transações para conformidade legal e fiscal. |
| **RN37** | Emissão de comprovante digital em PDF gerada automaticamente após a conclusão de cada transação. |
| **RN38** | Registro obrigatório de carimbo de data/hora (*timestamps*) em todas as etapas de mudança de estado da transação. |
| **RN41** | O sistema deve armazenar logs detalhados de todas as transações alteradas, estornadas ou canceladas. |
| **RN45** | Arquivamento automático de transações concluídas há mais de 12 meses para otimização de banco de dados. |
| **RN59** | O sistema deve registrar todas as falhas de transação financeira para análise de auditoria de *gateway*. |
| **RN68** | O histórico de atendimento de suporte é arquivado permanentemente para auditoria de qualidade. |
| **RN69** | Conformidade integral com a Lei Geral de Proteção de Dados (LGPD), garantindo os direitos de acesso, retificação e exclusão por parte do titular dos dados. |
| **RN78** | Auditoria anual de segurança e criptografia nos bancos de dados para renovação do selo de conformidade corporativa. |