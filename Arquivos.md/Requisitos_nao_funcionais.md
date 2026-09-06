# ⚙️ Documento de Requisitos Não Funcionais Detalhado — Explora+

## 📌 1. Introdução
Este documento estabelece os Requisitos Não Funcionais (RNF) para o ecossistema **Explora+**. As diretrizes a seguir delimitam as restrições arquiteturais, padrões de segurança, estratégias de validação de dados, critérios de manutenibilidade e limites operacionais que governam a execução e evolução do código em `backend/`.

---

## 📊 2. Matriz Expandida de Requisitos Não Funcionais

### 🏗️ Módulo 01: Arquitetura, Plataforma e Persistência

| ID | Categoria | Descrição Detalhada do Requisito Técnico / Qualidade |
| :--- | :--- | :--- |
| **RNF-001** | Stack Tecnológica | O ecossistema backend deve ser integralmente desenvolvido em **TypeScript**, executado sobre o ambiente de *runtime* **Node.js** e estruturado utilizando o *framework* empresarial **NestJS**. |
| **RNF-002** | Motor de Banco | O armazenamento persistente principal deve utilizar o banco de dados relacional **SQLite**. |
| **RNF-003** | Integridade Relacional | O esquema do banco de dados deve forçar ativamente o uso de **chaves estrangeiras** (*foreign keys*) para garantir a integridade referencial entre as entidades. |
| **RNF-004** | Restrições de Dados | A camada de banco de dados deve aplicar de forma estrita as **restrições de unicidade** (*unique constraints*), índices de busca otimizados e verificações de domínio (*check constraints*). |

### 🔐 Módulo 02: Segurança, Autorização e Proteção contra Abuso

| ID | Categoria | Descrição Detalhada do Requisito Técnico / Qualidade |
| :--- | :--- | :--- |
| **RNF-005** | Hash de Credenciais | O sistema de autenticação deve proteger as senhas dos usuários utilizando a função hash criptográfica **bcryptjs** antes de qualquer persistência. |
| **RNF-006** | Token de Sessão | O controle de estado de sessões deve trafegar via **JSON Web Tokens (JWT)**. |
| **RNF-007** | Segurança de Cookies | Os tokens JWT devem ser injetados exclusivamente através de **cookies assinados**, marcados obrigatoriamente com as diretivas de segurança **HTTP-only** e *Secure*. |
| **RNF-008** | Injeção de Segredos | A chave secreta de assinatura dos tokens JWT e demais dados sensíveis não podem estar em *hardcode*; devem ser injetados estritamente por variáveis de ambiente em produção. |
| **RNF-009** | Controle via Guards | O acesso a rotas privadas e a execução de rotas administrativas devem ser interceptados e protegidos por componentes de segurança do NestJS (**Guards**). |
| **RNF-010** | Ciclo da Sessão | O mecanismo de validação de sessão deve inspecionar ativamente o estado de atividade da conta, a expiração cronológica do token, o tempo de inatividade e rejeitar tokens presentes em listas de invalidação (**`jti` invalidado/Blacklist**). |
| **RNF-011** | Proteção de Borda | A API deve implementar proteção contra ataques de força bruta e negação de serviço por meio de **Rate Limiting** baseado no endereço IP de origem. |
| **RNF-012** | Bloqueio de Login | Mecanismos de segurança no backend devem monitorar tentativas sucessivas de login inválidas e disparar o bloqueio temporário do usuário no banco. |

### 🛠️ Módulo 03: Validação, Entrada e Manipulação de Arquivos

| ID | Categoria | Descrição Detalhada do Requisito Técnico / Qualidade |
| :--- | :--- | :--- |
| **RNF-013** | Filtro de Requisição | Todas as requisições de entrada devem passar de forma compulsória pelo pipeline global **`ValidationPipe`** do NestJS. |
| **RNF-014** | Contratos de Dados | Os payloads devem ser mapeados utilizando Objetos de Transferência de Dados (**DTOs**) validados pelas anotações da biblioteca **`class-validator`**. |
| **RNF-015** | Sanitização de Entrada | O pipeline de validação deve ser configurado para realizar a transformação de tipos automática e **rejeitar de forma estrita** quaisquer propriedades não permitidas (filtragem de campos injetados). |
| **RNF-016** | Consumo de Mídia | O recebimento de imagens para a plataforma deve ser processado em formato de **streaming de arquivos**, aliviando o consumo de memória RAM do servidor. |
| **RNF-017** | Isolamento de Mídia | Os arquivos de imagens recebidos devem ser armazenados de forma isolada em um diretório próprio em disco (`uploads/`), fora da raiz do código da aplicação. |
| **RNF-018** | Governança de Mídia | A API deve impor limites rigorosos quanto à quantidade e ao tamanho em bytes dos arquivos trafegados nos endpoints de upload. |

### 🌐 Módulo 04: Redes, Roteamento e Ativos Estáticos

| ID | Categoria | Descrição Detalhada do Requisito Técnico / Qualidade |
| :--- | :--- | :--- |
| **RNF-019** | Política de CORS | O controle de compartilhamento de recursos de origens cruzadas (CORS) deve ser dinâmico e parametrizado através da variável de ambiente `CORS_ORIGIN`. |
| **RNF-020** | Restrição de Origem | Por padrão de segurança de ambiente, a política de CORS deve restringir o acesso apenas a origens locais (*localhost*) caso nenhuma configuração explícita de produção seja informada. |
| **RNF-021** | Ativos Estáticos | O servidor web interno da aplicação NestJS deve servir e rotear adequadamente os arquivos de visualização (`views/`), os scripts do cliente (`javascript/`) e as mídias salvas (`uploads/`) em seus caminhos estáticos correspondentes. |

### 📊 Módulo 05: Observabilidade, Manutenibilidade e Testabilidade

| ID | Categoria | Descrição Detalhada do Requisito Técnico / Qualidade |
| :--- | :--- | :--- |
| **RNF-022** | Trilha de Auditoria | Operações críticas de negócio e modificações de estado do sistema devem obrigatoriamente registrar logs estruturados na tabela de banco de dados `logs_auditoria`. |
| **RNF-023** | Idempotência de Agenda | As rotinas e tarefas agendadas (*cron jobs*) de lembretes devem conter mecanismos que garantam a idempotência, impedindo o disparo ou envio duplicado de notificações para o mesmo evento. |
| **RNF-024** | Arquitetura de Software | O código-fonte deve ser segregado estritamente por **Módulos de Domínio** (*Domain-Driven modules*), mantendo a separação clara de responsabilidades entre *Controllers*, *Services*, *DTOs*, *Guards*, Filtros de exceção e arquivos utilitários. |
| **RNF-025** | Framework de Testes | O ambiente para concepção e execução de testes automatizados unitários e de integração deve ser o **Jest**. |
| **RNF-026** | Cobertura de Testes | O sistema conta atualmente com testes automatizados focados no módulo de localização. A garantia de cobertura técnica de testes para os demais módulos de domínio permanece como pendência **não comprovada** pelo código atual. |
| **RNF-027** | Configuração por Ambiente | O comportamento operacional do software deve se adaptar dependendo do ambiente (`development`, `production`). Segredos de chaves, parâmetros de rede CORS, strings de conexão do banco SQLite e credenciais de e-mail não podem possuir valores fixos no código. |

---

## 🚫 3. Limitações de Infraestrutura (Fora do Escopo Técnico Atual)
Os critérios de qualidade abaixo elencados **não são garantidos e nem providos nativamente pela base de código atual do backend**, sendo sua responsabilidade delegada de forma exclusiva à camada de infraestrutura de implantação (*DevOps* / Nuvem):

1. **Camada HTTPS / SSL:** A aplicação backend opera em protocolo HTTP simples. A terminação de segurança TLS, criptografia de trânsito em porta de rede e gestão de certificados digitais dependem de um proxy reverso (ex: Nginx) ou Gateway de Nuvem.
2. **Monitoramento Externo e APM:** Métricas de saúde do sistema em tempo real, telemetria de latência profunda e alertas de erros não são coletados pelo ecossistema nativo da aplicação.
3. **Estratégias de Backup:** Rotinas de clonagem de banco de dados, snapshots incrementais e segurança física do arquivo do SQLite contra perdas catastróficas devem ser implementadas via scripts externos à aplicação NestJS.
4. **Alta Disponibilidade (HA):** Mecanismos de failover automatizado, redundância ativa de múltiplos nós e balanceamento de carga horizontal dependem de orquestradores de infraestrutura (como Kubernetes ou instâncias gerenciadas em nuvem).
5. **Desempenho sob Carga de Estresse:** O comportamento de escalabilidade e latência controlada sob concorrência massiva de usuários não é coberto ou mitigado pelas limitações intrínsecas da arquitetura concorrente sobre o arquivo físico unificado do SQLite.
