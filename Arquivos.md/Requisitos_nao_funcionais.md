# Requisitos Não Funcionais (RNF) – Explora+

Documento reescrito a partir do comportamento real do sistema (NestJS + SQLite), validado executando o projeto de ponta a ponta. Substitui integralmente a numeração e o conteúdo das versões anteriores; alinhado às regras de negócio em `Regras_de_negocio.md`.

## 🛡️ Segurança

- **RNF-001 (Armazenamento de Senhas):** senhas devem ser armazenadas apenas como hash criptográfico com salt, nunca em texto plano.
- **RNF-002 (Proteção Contra Força Bruta):** o sistema deve bloquear temporariamente uma conta após um número definido de tentativas de login incorretas.
- **RNF-003 (Sessão Segura):** a sessão do usuário deve ser mantida por token assinado digitalmente, transmitido em cookie `HttpOnly`, inacessível a scripts do navegador.
- **RNF-004 (Expiração de Sessão):** a sessão deve expirar automaticamente após um período definido de inatividade.
- **RNF-005 (Limitação de Requisições):** a API deve limitar o número de requisições por IP em uma janela de tempo, para mitigar abuso e ataques automatizados.
- **RNF-006 (Validação de Entradas):** toda entrada de dados deve ser validada quanto a tipo, formato e obrigatoriedade antes de ser processada.
- **RNF-007 (Política de CORS):** o acesso à API a partir de origens externas deve ser restrito a uma lista configurável de origens confiáveis.
- **RNF-008 (Ocultação de Erros Internos):** respostas de erro não devem expor detalhes internos do servidor, como stack trace ou estrutura de banco de dados.
- **RNF-009 (Validação de Upload):** uploads de imagem devem ser restritos a formatos e tamanhos seguros, processados por streaming.
- **RNF-010 (Tráfego Criptografado):** em ambiente de produção, toda comunicação entre cliente e servidor deve ocorrer sobre HTTPS/TLS.

## ⚡ Desempenho e Escalabilidade

- **RNF-011 (Eficiência em Consultas):** listagens com grande volume de dados devem ser paginadas para reduzir tempo de resposta e volume transferido.
- **RNF-012 (Processamento Assíncrono de Uploads):** o recebimento de arquivos deve ocorrer por streaming, sem bloquear o processamento de outras requisições.
- **RNF-013 (Tarefas em Segundo Plano):** rotinas periódicas (como arquivamento de eventos expirados) devem ser executadas automaticamente, sem exigir intervenção manual ou impactar o tempo de resposta das requisições do usuário.

## 🗄️ Persistência e Integridade de Dados

- **RNF-014 (Persistência Relacional):** os dados da aplicação devem ser armazenados em um banco de dados relacional, com suporte a transações e chaves estrangeiras.
- **RNF-015 (Integridade Referencial):** o banco de dados deve impedir a criação de registros que referenciem entidades inexistentes.
- **RNF-016 (Unicidade Composta):** o banco de dados deve impedir duplicidade de favoritos, avaliações e inscrições para o mesmo par usuário/evento.
- **RNF-017 (Configuração por Ambiente):** segredos de aplicação, origens permitidas, credenciais de e-mail e caminho do banco de dados devem ser configuráveis por variável de ambiente, sem necessidade de alterar código-fonte.

## 🧩 Manutenibilidade e Qualidade

- **RNF-018 (Organização por Domínio):** o código deve ser organizado em módulos independentes por domínio de negócio (usuários, eventos, avaliações, etc.), cada um com suas próprias camadas de controle, regras e acesso a dados.
- **RNF-019 (Testabilidade):** o projeto deve manter uma suíte de testes automatizados executável via linha de comando, cobrindo os principais fluxos de negócio.
- **RNF-020 (Rastreabilidade):** operações relevantes do sistema devem ser registradas com identificação do autor e data/hora, para fins de auditoria.

## 🖥️ Interface e Experiência

- **RNF-021 (Disponibilidade de Arquivos Estáticos):** páginas, scripts e arquivos enviados pelos usuários devem ser servidos de forma consistente e nos caminhos esperados pela aplicação.
- **RNF-022 (Controle de Acesso a Páginas):** páginas que dependem de sessão autenticada devem redirecionar usuários não autenticados para a tela de login; páginas de fluxo de cadastro/confirmação devem permanecer acessíveis sem sessão.
- **RNF-023 (Preferências Locais do Navegador):** preferências de interface sem caráter de sessão (como consentimento de cookies) devem ser mantidas no navegador do usuário, sem exigir uma conta ou chamada ao servidor.
