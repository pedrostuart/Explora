# 📋 Especificação Detalhada de Casos de Uso — Explora+

Este documento detalha o comportamento funcional e técnico da plataforma Explora+, mapeando a interação entre atores, sistema e regras de persistência.

---

## 👥 Atores do Sistema

1.  **Visitante / Turista:** Usuário que consome conteúdos, realiza buscas e pode se autenticar para interagir (favoritos/resenhas).
2.  **Prestador de Serviço / Produtor:** Usuário autenticado que gerencia atrações e eventos (sujeito à moderação).
3.  **Administrador:** Gestor do sistema com poder de moderação, auditoria e gerenciamento de usuários.
4.  **Sistema (Backend):** O motor Node.js/SQLite que processa regras, segurança e automações.

---

## 🔑 Módulo 1: Gestão de Acessos e Autenticação

### UC01 – Cadastro de Novo Usuário
*   **Ator:** Visitante.
*   **Objetivo:** Criar uma identidade digital segura na plataforma.
*   **Pré-condições:** E-mail único (RN-001) e idade $\ge 18$ anos (RN-002).
*   **Fluxo Principal:**
    1. O usuário fornece nome, e-mail, data de nascimento e senha.
    2. O sistema valida a complexidade da senha: $\ge 6$ caracteres, [A-Z], [a-z] e [!@#$] (RNF-003).
    3. O sistema gera um *salt* e armazena o hash via `bcryptjs` (RNF-001).
    4. O registro é salvo no SQLite com `status: 'Pendente'`.
    5. Um e-mail de ativação é disparado.
*   **Fluxo de Exceção (E1):** E-mail já cadastrado. O sistema retorna HTTP 400 com mensagem padronizada (RNF-017).

### UC02 – Autenticação (Login)
*   **Ator:** Todos os usuários.
*   **Pré-condições:** Conta ativa e validada.
*   **Fluxo Principal:**
    1. Usuário insere credenciais.
    2. O sistema verifica se há bloqueio por força bruta (RNF-002: 5 falhas = 15 min bloqueio).
    3. O sistema valida o hash da senha.
    4. Em caso de sucesso, gera um **Token JWT** e o armazena em um **Cookie HTTP-Only** assinado (RNF-004).
*   **Pós-condições:** Sessão estabelecida por 30 minutos de inatividade (RNF-010).

---

## 🛡️ Módulo 2: Conformidade LGPD

### UC04 – Gestão de Consentimento (Cookies)
*   **Ator:** Visitante.
*   **Fluxo Principal:**
    1. No primeiro acesso, o sistema apresenta o Banner de Privacidade (RN-016).
    2. O usuário aceita ou gerencia preferências.
    3. O sistema armazena o estado do consentimento para evitar reexibição imediata.

### UC05 – Exclusão de Conta (Direito ao Esquecimento)
*   **Ator:** Usuário Autenticado.
*   **Objetivo:** Remover rastros de dados pessoais (Art. 18 LGPD).
*   **Fluxo Principal:**
    1. Usuário solicita exclusão no painel de perfil.
    2. O sistema remove o registro físico do usuário no SQLite (RN-017).
    3. Registros históricos (logs) são anonimizados (RN-018) para fins estatísticos.

---

## 🗺️ Módulo 3: Gestão de Conteúdo (Atrações e Pontos Turísticos)

### UC06 – Cadastro de Ponto Turístico
*   **Ator:** Prestador ou Administrador.
*   **Fluxo Principal:**
    1. O usuário preenche: nome, descrição, endereço completo (RN-039) e categoria (RN-037).
    2. Informa coordenadas GPS (Latitude/Longitude) e metadados de acessibilidade (RN-036).
    3. Realiza upload de imagens: Máx 15 arquivos, 5MB cada, formatos JPG/PNG/WEBP (RNF-016).
    4. O sistema processa imagens via *streaming* (`busboy`) (RNF-011).
    5. O local é salvo como `Pendente`.
*   **Fluxo de Exceção (E1):** Coordenadas inválidas. O sistema impede a persistência.

### UC07 – Moderação Administrativa
*   **Ator:** Administrador.
*   **Fluxo Principal:**
    1. Administrador acessa fila de aprovação.
    2. Analisa a qualidade do conteúdo e veracidade das informações.
    3. Aprova o local, alterando status para `Ativo`.
*   **Pós-condições:** O local passa a ser indexado pelo motor de busca.

---

## 📅 Módulo 4: Eventos e Agenda Cultural

### UC08 – Cadastro de Evento
*   **Ator:** Prestador ou Administrador.
*   **Pré-condições:** O local físico deve existir e estar ativo (RN-044).
*   **Fluxo Principal:**
    1. Usuário define: título, datas, horários, capacidade (RN-049) e faixa etária (RN-050).
    2. O sistema valida se `DataFim > DataInicio` (RN-046).
*   **Automação do Sistema (UC09):** Quando a data do evento expira, o sistema altera o status para `Encerrado` e remove-o da busca ativa (RN-048).

---

## 🔍 Módulo 5: Motor de Busca e Geolocalização

### UC10 – Busca Multicritério
*   **Ator:** Visitante/Turista.
*   **Fluxo Principal:**
    1. Usuário define filtros: texto, categoria, faixa de preço, raio geográfico.
    2. O sistema executa query SQL com `LIMIT` e `OFFSET` para paginação eficiente (RNF-012).
    3. Aplica lógica `AND` para filtros cumulativos (RN-056).
    4. Resultados são ordenados por proximidade (via cálculo de Haversine no servidor) ou relevância.

---

## ⭐ Módulo 6: Interação Social

### UC11 – Gerenciar Favoritos
*   **Ator:** Turista Autenticado.
*   **Fluxo Principal:**
    1. Usuário clica no ícone de "Coração".
    2. O sistema valida o token JWT.
    3. O banco de dados garante unicidade via **Chave Única Composta** (`ID_USUARIO` + `ID_LOCAL`) (RNF-015).
    4. O frontend faz um *Optimistic Update* (atualiza o ícone visualmente antes da resposta do servidor).

### UC12 – Avaliação e Resenha
*   **Ator:** Turista Autenticado.
*   **Regra:** Máximo de 1 avaliação por local (RN-067).
*   **Fluxo Principal:**
    1. Usuário envia nota (1 a 5) e texto.
    2. O sistema salva a resenha e dispara gatilho para recalcular a **Média Global** do local no SQLite (RN-069).