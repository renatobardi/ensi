# Ways of Work — Especificação de UI para recriação

Documento descritivo, literal e exaustivo da interface atual da aplicação, para que
um designer a recrie fielmente em outro design system **sem ver o código**. Todos os
textos de interface são copiados literalmente. Descreve o que existe hoje, não uma
versão idealizada.

A aplicação tem **duas superfícies visuais distintas, com temas diferentes**:

- **A. Marketplace (dashboard/catálogo)** — página principal `index.html`. Tema
  escuro navy + toggle claro. Identidade Santander/Gluon (vermelho + teal).
- **B. Site de documentação** — pasta `docs/`. Tema claro azul, chrome próprio
  (cabeçalho azul, sem toggle de tema). 15 páginas HTML estáticas.

Elas se conectam: o botão **Docs** do marketplace leva a `docs/index.html`; o
cabeçalho da documentação tem **🚀 Ways of Work** e **Browse Catalog** de volta ao
marketplace.

---

## 1. Visão geral

- **Nome do app:** Ways of Work Marketplace. Subtítulo de marca: *"Reusable
  practices for every kind of work"*.
- **O que faz:** É um catálogo/marketplace de "pacotes" reutilizáveis (skills,
  prompts, instructions e bundles) para agentes de IA (plataforma APM — Agent
  Package Manager). O usuário navega o catálogo, filtra por categoria/tipo,
  busca, e obtém o comando de instalação de cada pacote. O site de documentação
  ensina a instalar/usar (consumidor) e a criar/contribuir (produtor), e descreve
  um ciclo de desenvolvimento de software (SDLC) em 5 fases.
- **Para quem:** Engenheiros/times que consomem pacotes (desenvolvedores,
  tech leads, arquitetos, product owners) e autores/mantenedores que publicam
  pacotes. Contexto corporativo Santander (rede interna, Artifactory, Windsurf/Cursor).

### Cores / tema

**A. Marketplace** — identidade **Santander red `#ec0000` + Gluon teal `#1fbecb`**.
Tema base é escuro (navy); tema claro é override. O tema é resolvido antes da
primeira pintura (escolha salva > preferência do SO > claro) e persiste em
`localStorage` (`catalog-theme`).

Tokens de cor (tema escuro / base):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0e1b2e` | fundo base (navy) |
| `--bg-2` | `#14263f` | fundo secundário / fundo de modal |
| `--panel` | `rgba(255,255,255,0.07)` | superfície de cards, campos |
| `--panel-2` | `rgba(255,255,255,0.10)` | superfície hover |
| `--panel-3` | `rgba(255,255,255,0.13)` | superfície mais clara |
| `--line` | `rgba(125,160,220,0.16)` | bordas (tom azulado) |
| `--line-2` | `rgba(125,160,220,0.26)` | bordas mais fortes |
| `--ink` | `#f4f7fc` | texto principal |
| `--muted` | `#b7c6e2` | texto secundário |
| `--muted-2` | `#9aabc9` | texto terciário |
| `--red` | `#ec0000` | marca (Santander) |
| `--red-2` | `#ff3838` | vermelho claro |
| `--red-deep` | `#b10010` | vermelho escuro |
| `--teal` | `#1fbecb` | marca (Gluon), acento de cards |
| `--teal-2` | `#5fe0ea` | teal claro (links, badges, números) |
| `--teal-deep` | `#137e84` | teal escuro (botão de view ativo) |
| `--amber` | `#f6a019` | âmbar (gradiente do botão Docs, env "pre") |
| `--green` | `#5ef0b0` | verde (status "stable", env "dev") |
| `--grad-warm` | `linear-gradient(100deg, amber→red)` | fundo do botão **Docs** |

Tokens de cor (tema claro / override): `--bg #e5eaf3`, `--bg-2 #ffffff`,
`--panel #ffffff`, `--panel-2 #eef2f9`, `--ink #0b1220`, `--muted #3b4a61`,
`--muted-2 #5e6d86`, `--teal-2 #0c757e` (teal mais escuro para contraste),
bordas em `rgba(12,20,36,0.15)`. Vermelho e teal de marca são preservados;
apenas superfícies e texto invertem. O CTA primário "Install" usa um teal
profundo dedicado: base `#0c7c85`, hover `#0a6f78`.

- **Onde a cor de marca (vermelho) aparece:** reservada — usada **apenas** no
  botão **Docs** da navbar (gradiente âmbar→vermelho) e no realce de seleção de
  texto (`::selection` vermelho translúcido). Não é usada em botões comuns.
- **Onde o teal aparece:** logo (gradiente), números das estatísticas da navbar,
  item de filtro ativo (fundo teal translúcido + barra lateral esquerda teal),
  badges de versão, links "See details →", foco (outline), botão primário Install
  (teal profundo), botão de view ativo.

**B. Documentação** — tema **claro azul**. Cor primária `--primary #2563eb`,
primária escura `#1d4ed8`. Cinzas: `#f8fafc` (fundo), `#f1f5f9`, `#e2e8f0`,
`#64748b`, `#475569`, `#0f172a` (texto), branco `#ffffff`. Cabeçalho em gradiente
diagonal azul `linear-gradient(135deg, #2563eb → #1d4ed8)`. Páginas de "fase" têm
cor de acento própria (ver seção 4).

### Tipografia

- **Marketplace** — Display (títulos): `"Santander Headline", "Space Grotesk",
  "Inter", system-ui`. Corpo: `"Santander Text", "Inter", system-ui`.
  Monoespaçada (comandos): `ui-monospace, "SF Mono", Menlo, Consolas`. Fontes web
  carregadas: Inter e Space Grotesk (Google Fonts).
- **Documentação** — corpo `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  sans-serif`; monoespaçada `"SF Mono"/Monaco` ou `"Courier New"`.

### Raios, sombras, movimento (marketplace)

- Raios: `--radius 12px`, `--radius-lg 16px`, `--radius-xl 22px`.
- Sombras: `--shadow 0 18px 44px rgba(0,0,0,.38)`, `--shadow-lg 0 26px 60px rgba(0,0,0,.5)`.
- Easing: `cubic-bezier(.16,1,.3,1)`.
- Altura da navbar: `--nav-h 61px`.
- Fundo da página: gradiente vertical navy + grade fina estática (linhas
  diagonais translúcidas, `44px` de célula). No tema claro a grade fica mais sutil.
- Animações: entrada escalonada dos cards (`cardIn`, fade + subida, delay 45ms por
  card); contagem animada (count-up, ~900ms) nos números da navbar. Ambas são
  desativadas sob `prefers-reduced-motion: reduce`.

### Logo / marca

- **Logo "Gluon" — pentágono** SVG, ~26–34px. Um pentágono preenchido com
  gradiente diagonal (`#5fe0ea` → `#1fbecb` → `#ec0000`, teal→vermelho), com um
  pentágono interno menor apenas em contorno branco translúcido. Tem leve sombra
  projetada (drop-shadow teal). Aparece no canto esquerdo da navbar do marketplace.
- **Logo da documentação** — texto **🚀 Ways of Work** (emoji foguete + nome), em
  branco, no cabeçalho azul.

---

## 2. Arquitetura de informação

### Navegação — A. Marketplace (`index.html`)

**Navbar (topo, fixa/sticky):**
- Esquerda (marca): logo pentágono · título **"Ways of Work Marketplace"** ·
  subtítulo **"Reusable practices for every kind of work"** · badge de ambiente
  (oculto em prod; "Dev" verde ou "Pre" âmbar).
- Direita (estatísticas + ações), nesta ordem:
  1. Estatística **Packages** (valor grande teal + rótulo "PACKAGES")
  2. Estatística **Categories** (valor + "CATEGORIES")
  3. Estatística **Version** (ex.: `v2.0.0` + "VERSION")
  4. Botão **toggle de tema** (ícone sol no escuro / lua no claro)
  5. Botão **Docs** (gradiente âmbar→vermelho) → `docs/index.html`

**Sidebar (barra lateral esquerda, 260px; oculta ≤900px):** três grupos de
filtros, na ordem:
- Grupo "All": um único item **All Packages** (ícone `◉`, contador total).
- Título **"Categories"** — um item por categoria derivada dos dados, ordenado
  alfabeticamente por rótulo. Cada item: ícone `◆` · rótulo · contador. Categorias
  atuais: **Authoring** (3), **Governance** (1), **Knowledge** (1),
  **Software Delivery** (6).
- Título **"Type"** — dois itens: **Package** (ícone `▤`, 10) e **Bundle**
  (ícone `◆`, 1).

Não há menu de topo com abas no marketplace além da navbar. O conteúdo principal
é uma única visão (catálogo) com alternância cards/tabela.

### Navegação — B. Documentação (`docs/`)

**Cabeçalho azul (todas as 15 páginas):** à esquerda o logo **🚀 Ways of Work**
(link para `../index.html`); à direita uma barra de navegação com 8 itens, nesta
ordem exata:

1. **Docs** → `index.html`
2. **Install & Use** → `getting-started.html`
3. **Create & Contribute** → `creator-guide.html`
4. **Software Delivery** → `phases.html` *(este rótulo aparece como "Software
   Delivery" em `index.html` e `getting-started.html`, mas como **"Software
   Delivery Phases"** nas outras 13 páginas — divergência real existente)*
5. **Architecture** → `architecture.html`
6. **FAQ** → `faq.html`
7. **Glossary** → `glossary.html`
8. **Browse Catalog** → `../index.html`

Estado ativo (fundo branco translúcido) só existe para as páginas que **são** itens
de nav. `apm-cli.html`, `schema-reference.html` e as 6 páginas de fase detalhada
não têm item ativo — o usuário se orienta pelo **breadcrumb** (ver seção 4).

### Rotas / URLs

O marketplace é servido na raiz (`/` → `index.html`). O site é estático (arquivos
`.html` relativos), pode ser publicado no GitHub Pages.

| Seção | Rota |
|---|---|
| Marketplace (catálogo) | `/index.html` (raiz) |
| Docs — hub | `/docs/index.html` |
| Getting Started | `/docs/getting-started.html` |
| Creator Guide | `/docs/creator-guide.html` |
| Software Delivery Phases (dashboard) | `/docs/phases.html` |
| Architecture | `/docs/architecture.html` |
| FAQ | `/docs/faq.html` |
| Glossary | `/docs/glossary.html` |
| APM CLI Reference | `/docs/apm-cli.html` |
| Schema Reference | `/docs/schema-reference.html` |
| Inception Phase | `/docs/inception.html` |
| Implement Phase | `/docs/implement.html` |
| Validate Phase | `/docs/validate.html` |
| Deploy Phase | `/docs/deploy.html` |
| Operate Phase | `/docs/operate.html` |
| Foundations (transversal) | `/docs/transversal.html` |

---

## 3. Inventário de telas

| # | Nome | Rota | Objetivo |
|---|---|---|---|
| 1 | Marketplace / Catálogo | `/index.html` | Navegar, filtrar, buscar e instalar pacotes |
| 1b | Modal de instalação | (overlay em `/index.html`) | Mostrar e copiar o comando `apm install` |
| 2 | Docs — Hub | `/docs/index.html` | Introdução, tipos de primitivos, escolha de caminho |
| 3 | Getting Started | `/docs/getting-started.html` | Instalar CLI e consumir pacotes (passo a passo) |
| 4 | Creator Guide | `/docs/creator-guide.html` | Fluxo do contribuidor em 10 passos |
| 5 | Software Delivery Phases | `/docs/phases.html` | Dashboard das 5 fases + fundação (pentágono) |
| 6 | Architecture | `/docs/architecture.html` | Como catálogo, CLI e projeto se encaixam |
| 7 | FAQ | `/docs/faq.html` | Perguntas frequentes (accordion) |
| 8 | Glossary | `/docs/glossary.html` | Glossário de termos por categoria |
| 9 | APM CLI Reference | `/docs/apm-cli.html` | Referência de comandos do CLI |
| 10 | Schema Reference | `/docs/schema-reference.html` | Schema de frontmatter dos primitivos |
| 11 | Inception Phase | `/docs/inception.html` | Documentação completa da fase Inception |
| 12 | Implement Phase | `/docs/implement.html` | Documentação da fase Implement (com screenshots) |
| 13 | Validate Phase | `/docs/validate.html` | Documentação da fase Validate |
| 14 | Deploy Phase | `/docs/deploy.html` | Página de escopo (em breve) |
| 15 | Operate Phase | `/docs/operate.html` | Página de escopo (em breve) |
| 16 | Foundations / Transversal | `/docs/transversal.html` | Skill de curadoria de conhecimento |

---

## 4. Detalhe de cada tela

### Tela 1 — Marketplace / Catálogo

- **Nome e rota:** Marketplace / `/index.html`
- **Objetivo:** navegar o catálogo de pacotes, filtrar/buscar e obter o comando de
  instalação.
- **Layout (de cima para baixo):**
  - **Navbar** sticky no topo (altura ~61px): marca à esquerda, estatísticas +
    toggle de tema + botão Docs à direita.
  - Abaixo, **layout de duas colunas**: **sidebar** de filtros (260px, esquerda) e
    **conteúdo** (flexível, direita). A sidebar some em telas ≤900px.
  - **Conteúdo:** cabeçalho de conteúdo (título+subtítulo à esquerda; busca +
    toggle de visão à direita) → linha de resultados ("Showing X of Y packages")
    → **grade de cards** (visão padrão) **ou** **tabela** (visão alternativa).
  - **Rodapé** centralizado no fim da página.
- **Componentes visuais presentes:** navbar; três blocos de estatística; botão de
  toggle de tema; botão CTA (Docs); sidebar com busca implícita e listas de
  filtros (botões); campo de busca; toggle de visão (dois botões ícone: cards /
  tabela); grade de cards; tabela; badge de versão; badge de status; tags;
  modal/dialog; rodapé com links.
- **Sidebar — filtros:**
  - **All Packages** (ícone `◉`) + contador total (ex.: `11`).
  - Título **"Categories"**: **Authoring** `3`, **Governance** `1`,
    **Knowledge** `1`, **Software Delivery** `6` (cada um com ícone `◆` e contador
    em pílula). Item ativo: fundo teal translúcido, texto teal, barra teal à
    esquerda, contador com fundo teal sólido.
  - Título **"Type"**: **Package** `10` (ícone `▤`) e **Bundle** `1` (ícone `◆`).
- **Cabeçalho de conteúdo:**
  - Título **"Marketplace Packages"**.
  - Subtítulo **"Reusable skills, prompts, instructions, and bundles across every
    category"**.
  - Campo de busca com ícone de lupa e placeholder **"Type anything..."**.
  - Toggle de visão: botão **Cards** (ícone grade 2×2, ativo por padrão, com título
    "Cards") e botão **Table** (ícone linhas horizontais, título "Table"). O botão
    ativo fica com fundo teal profundo e texto branco.
  - Linha de resultados: **"Showing 11 of 11 packages"** (os números em negrito;
    o primeiro número atualiza dinamicamente conforme filtro/busca).
- **Card de pacote (visão Cards):** grade responsiva (colunas de mín. 320px). Cada
  card contém:
  - Topo: **ícone** quadrado arredondado (`◇` para package, `◆` para bundle) +
    **título** (nome do pacote) + **badge de versão** (pílula teal, ex.: `v1.0.0`;
    quando é um SHA fica em pílula cinza `#abc1234`; monoespaçada).
  - **Descrição** (2 linhas, com reticências; tooltip com texto completo).
  - **Tags:** primeira tag é o tipo (`Package`/`Bundle`, estilo teal com borda),
    segunda é a categoria, seguidas das demais tags do pacote (role/tech/maturity/
    domínio, sem o prefixo `type:`).
  - **Rodapé do card:** link **"See details →"** (teal, abre o repositório do
    pacote em nova aba) e botão **"Install"** (primário, teal profundo).
- **Tabela (visão Table):** cabeçalho com colunas clicáveis (ordenação implícita).
  Colunas exatas:
  1. **Package Name ↕** (ícone + nome)
  2. **Description** (truncada a ~60 caracteres com "…"; tooltip completo)
  3. **Version** (pílula de versão, ou `—` em pílula cinza quando ausente)
  4. **Status** (badge **"✓ stable"** verde)
  5. **Tags** (duas pílulas: tipo e categoria)
  6. **Actions** (botão **"Install"** pequeno)
- **Ações (texto exato dos botões):**
  - **Docs** (navbar) → abre o site de documentação.
  - **Toggle de tema** (aria-label "Toggle color theme", title "Toggle light /
    dark theme") → alterna claro/escuro.
  - **Cards** / **Table** → alterna a visão.
  - **See details →** → abre o repositório do pacote (nova aba).
  - **Install** → abre o modal de instalação daquele pacote.
- **Textos exatos:** título "Marketplace Packages"; subtítulo (acima); placeholder
  "Type anything..."; "Showing N of 11 packages"; rótulos de estatística
  "Packages", "Categories", "Version"; rodapé **"Powered by APM · View Source"**
  (APM → github.com/microsoft/apm; View Source → repositório).
- **Estados:**
  - **Vazio (busca/filtro sem resultado):** a grade/tabela fica sem itens visíveis
    (cards/linhas com `display:none`) e a linha de resultados mostra
    **"Showing 0 of 11 packages"**. Não há ilustração/mensagem de "nenhum
    resultado" dedicada — apenas a contagem zero.
  - **Carregando:** não há estado de carregamento (site estático, tudo já
    renderizado). Há apenas a animação de entrada escalonada dos cards.
  - **Erro:** não há estado de erro na UI.
  - **Sucesso (copiar comando):** o botão "Copy" do modal vira **"Copied!"**
    (fundo verde) por 2s.
- **Ícones:** logo pentágono (marca); lupa (busca); grade 2×2 (visão cards);
  linhas horizontais (visão tabela); sol/lua (tema); `◉` (All), `◆` (categoria/
  bundle), `▤` (package) nos filtros; `◇`/`◆` nos ícones de card/linha; `↕` no
  cabeçalho "Package Name"; `✓` no status "stable"; `→` no link "See details".

### Tela 1b — Modal de instalação

- **Nome e rota:** Modal "Install" (overlay em `/index.html`).
- **Objetivo:** exibir e copiar o comando de instalação do pacote selecionado.
- **Layout:** overlay escuro translúcido com blur; caixa central (máx. 720px,
  90% de largura) com header, seção de comando, dica e rodapé de ações. Entra com
  leve escala (0.96→1).
- **Componentes:** dialog modal (com foco preso / focus-trap e fechamento por Esc
  ou clique fora), ícone, título, subtítulo, botão fechar (X), caixa de comando
  (code) com botão copiar, link de ajuda, dois botões de rodapé.
- **Conteúdo / textos exatos:**
  - Ícone: `◇` (fundo lilás claro definido via script).
  - Título: **nome do pacote** (ex.: `implement-core`).
  - Subtítulo: **"Install this package in your project"**.
  - Rótulo de seção: **"Installation Command"**.
  - Caixa de comando (monoespaçada, fundo quase preto, texto teal):
    **`apm install <nome>@<marketplace-alias> --target windsurf`**.
  - Botão **"Copy"** (vira **"Copied!"** ao clicar).
  - Dica: link **"Setup guide →"** → `docs/getting-started.html`.
  - Rodapé: botão **"Cancel"** (contorno) e botão **"Copy & Close"** (primário).
- **Ações:** "Copy" e "Copy & Close" copiam o comando para a área de transferência;
  "Cancel", o X e Esc fecham; clique no fundo fecha.
- **Estados:** sucesso = "Copied!" verde por 2s.
- **Ícones:** `◇` (ícone do modal), X (fechar), `→` (Setup guide).

---

### Tela 2 — Docs · Hub (`docs/index.html`)

- **Objetivo:** landing da documentação; apresenta o marketplace, os tipos de
  primitivos e dois caminhos de público.
- **Layout:** cabeçalho azul → hero centralizado → seção "Primitive Types" com dois
  grids de cards rotulados → seção full-width em gradiente "Choose Your Path" com
  dois cards de caminho → rodapé. Container centralizado (~1000px).
- **Componentes:** hero, títulos de seção, grade de cards (auto-fit, mín. 280px),
  cards grandes e pequenos, tiles de ícone coloridos, rótulos de grupo em
  maiúsculas, listas de links com marcador `→`.
- **Nav ativo:** **Docs**. Sem breadcrumb.
- **Textos / headings exatos:**
  - Hero h2: **"Ways of Work marketplace"**; subtítulo: *"A general marketplace
    for creating, validating, and distributing reusable skills, prompts,
    instructions, and bundles across any way of working."*
  - Título de seção: **"🧩 Primitive Types"**; nota abaixo: *"APM automatically
    transforms primitives to the format required by your target IDE (Windsurf,
    Cursor, etc.)"*.
  - Rótulo de grupo **"Core Primitives"** — três cards:
    - 🎯 **Skills** — *"Teach the AI agent **how to do something**. Step-by-step
      instructions, best practices, and templates for specific tasks."* — rodapé
      `→ .agents/skills/` (tile azul `#dbeafe`).
    - 📋 **Instructions** — *"Define **constraints and guidelines** the agent must
      follow. Security policies, coding standards, and compliance requirements."*
      — `→ .windsurf/rules/` (tile verde `#dcfce7`).
    - 💬 **Prompts** — *"**Reusable templates** with defined inputs and outputs.
      Standardized formats for generating documents or code."* — `→ .windsurf/prompts/`
      (tile amarelo `#fef3c7`).
  - Rótulo de grupo **"Extended Primitives"** — três cards pequenos:
    - ⚡ **Commands** — *"**Slash commands** that trigger multi-step workflows
      orchestrated by the agent."* — `→ .windsurf/workflows/` (tile rosa `#fce7f3`).
    - 🪝 **Hooks** — *"**Event triggers** that run automatically on specific
      actions (pre-commit, post-save, etc.)."* — `→ Git hooks / IDE events`
      (tile laranja `#ffedd5`).
    - 🔌 **MCP Servers** — *"**Tool servers** that extend agent capabilities with
      external APIs and services."* — `→ MCP configuration` (tile índigo `#e0e7ff`).
  - Título de seção: **"Choose Your Path"** — dois cards:
    - 📥 **Install & Use** — *"Install and use artifacts in your projects. Get
      started quickly with skills, instructions, and prompts from the catalog."* —
      links: Getting Started, APM CLI Reference, FAQ, Browse Catalog.
    - 📤 **Create & Contribute** — *"Build skills, instructions, and prompts for
      the platform. Contribute to the SDLC phases and help the community grow."* —
      links: Creator Guide, APM CLI Reference, Architecture, Schema Reference.
- **Rodapé (variante A):** **"Powered by APM · View Source"**.

---

### Tela 3 — Getting Started (`docs/getting-started.html`)

- **Objetivo:** guia passo a passo para instalar o CLI APM e consumir pacotes na
  rede corporativa.
- **Layout:** título + subtítulo → card de índice ("Contents") → cards de seção
  empilhados → régua → seção "Useful Commands" → rodapé. Container ~1100px.
- **Nav ativo:** **Install & Use**. Breadcrumb: **"Docs / Install & Use"**.
- **Componentes:** índice (lista de links); chips de fluxo numerados (pílulas azuis
  com `→`); grade de pré-requisitos (tiles de ícone); caixas colapsáveis
  (`<details>`); blocos de código (fundo escuro `#0f172a`, texto ciano `#a5f3fc`,
  saída em verde `#86efac`) com botão **"Copy"** (vira "Copied!"); caixa de dica
  (tip-box azul); caixa de aviso (warn-box âmbar); abas por SO; tabelas de comandos.
- **Headings exatos (em ordem):**
  - h2 **"🚀 Getting Started"**; subtítulo *"Install artifacts from the catalog
    into your project in minutes"*.
  - h3 **"📋 Overview"**
  - h3 **"⚙️ Prerequisites"**
  - h3 **"📥 Step 1: Install the APM CLI"** (h4: "1 · Get your Artifactory
    credentials", "2 · Point pip at Artifactory and install", "🔐 Trust the
    corporate certificate", "When is the CA actually needed?")
  - h3 **"🏪 Step 2: Add the Marketplace"**
  - h3 **"📦 Step 3: Install a Package or Bundle"**
  - h3 **"✅ Step 4: Verify Installation & Use"**
  - h3 **"🧰 Useful Commands"**
- **Chips de fluxo (Overview):** `1 Install CLI → 2 Add Marketplace → 3 Install →
  ✓ Use!` (último chip verde `#16a34a`).
- **Tiles de pré-requisito:** 🐍 **Python** "≥ 3.10"; 🌐 **Corporate proxy**
  "Configured (see below)"; 🔐 **GitHub Enterprise License** "Corporate account".
- **`<details>` (resumos):** "🐍 Install Python", "🌐 Configure your corporate
  proxy", "ℹ️ Known proxy caveats", "ℹ️ Why is `--ref` required?", "ℹ️ Pin an exact
  version `vX.Y.Z`", "🩺 Troubleshooting".
- **Abas:** proxy — "Windows (CMD)" / "macOS / Linux (bash · zsh)"; CA bundle —
  "Windows" / "macOS / Linux"; Useful Commands — Marketplace / Install / Update.
- **Tabelas:**
  - CA options — colunas **Option | What it fixes | When to use it** (5 linhas,
    incluindo uma marcada ⚠️ e uma ❌ "Disable TLS verification (Rejected —
    insecure)").
  - When is the CA needed — colunas **Operation | Reaches | Netskope/Santander CA?**
    (3 linhas).
  - Useful Commands por aba (comandos `apm marketplace …`, `apm install`,
    `apm update`, etc.).
- **Exemplos de comando (literais):** `apm marketplace add
  t708178-bsbr_sangroup/wow-ways-of-work --ref vX.Y.Z --name wow`;
  `apm install foundations-globalization@wow --target windsurf`; saída
  `Agent Package Manager (APM) CLI version 0.24.0`.
- **Rodapé:** variante A ("Powered by APM · View Source").

---

### Tela 4 — Creator Guide (`docs/creator-guide.html`)

- **Objetivo:** fluxo completo do contribuidor (escada de 10 passos) para autorar,
  validar e prever release de pacotes.
- **Layout:** título + subtítulo → seção "modelo mental" em gradiente (dois cards +
  chips de fluxo) → índice → "quick chooser" (3 cards de caminho) → 11 seções
  numeradas (0–10) → seção de checklist (tabela) → referências → rodapé + **modal
  "Demo" oculto** (stepper).
- **Nav ativo:** **Create & Contribute**. Breadcrumb: **"Docs / Create & Contribute"**.
- **Componentes:** cards informativos; chips de fluxo (1→10, passo 10 verde);
  índice agrupado com badges; cards de caminho clicáveis; seções de passo com
  âncoras numeradas e sub-pílulas (2a/2b/2c); blocos de código com Copy; tabela de
  checklist rolável; lista de links de referência; **modal stepper "Demo"**
  (contador "1 / 10", botões "← Prev" / "Next →", pontos/dots).
- **Headings exatos (em ordem):**
  - h2 **"🌱 Creator Guide"**; subtítulo *"End-to-end contributor flow — from local
    edit through validation and release preview"*.
  - h3 **"🧭 The mental model"** (h4 "🎯 Per-package versioning (each package
    versions on its own cadence)", h4 "🪞 The manifest is resolved at release, not
    in your PR").
  - h3 **"🎯 Quick chooser — what are you doing?"** — cards: ✏️ **Update an
    existing artifact**, ✨ **Create a new artifact**, 📦 **Migrate from another
    repo** (com links "Jump to 2a →", "Jump to 2b →", "Jump to 2c →").
  - h3 (0) **"Prerequisites & one-time setup"**
  - h3 (1) **"Create a feature branch"**
  - h3 (2) **"Author the change"** (h4 2a/2b/2c)
  - h3 (3) **"Register your package in `apm.yml`"**
  - h3 (4) **"Update `CHANGELOG.md`"**
  - h3 (5) **"Validate locally (before you push)"**
  - h3 (6) **"Commit & open a Pull Request"**
  - h3 (7) **"Local quality gate"**
  - h3 (8) **"CODEOWNERS review"**
  - h3 (9) **"Merge to `main`"**
  - h3 (10) **"Preview a release"**
  - h3 **"📋 Files checklist — what to touch when"**
  - h3 **"📚 References"**
  - (modal) h3 **"Demo"**
- **Chips de fluxo:** `1 Branch → 2 Author → 3 Register → 4 Changelog → 5 Validate →
  6 PR → 7 Local gate → 8 Review → 9 Merge → 10 Release`.
- **Tabela de checklist (rolável):** colunas **Scenario | `.apm/` | pkg `apm.yml` |
  pkg `README.md` | pkg `CHANGELOG.md` | root `apm.yml` | version |
  `marketplace.json`**. Linhas: "2a · Update artifact", "2b · New artifact
  (existing pkg)", "2c · New package", "2c · New bundle", "10 · Release". Células
  com ✓ / — / rótulos ("✓ (bump version)", "manual publication", "umbrella tag
  only").
- **Referências:** "APM Producer docs", "`meta-migrators` README",
  "`CONTRIBUTING.md`", "`CATALOG.md`".
- **Botões do modal:** "← Prev", "Next →", fechar "×".
- **Rodapé:** variante A.

---

### Tela 5 — Software Delivery Phases (`docs/phases.html`)

- **Objetivo:** dashboard das 5 fases do SDLC assistido por IA + uma fundação
  transversal, centrado num pentágono animado.
- **Layout:** hero → layout de três colunas: coluna esquerda (Inception, Implement)
  + centro com **canvas de pentágono animado** + coluna direita (Validate, Deploy,
  Operate) → seção full-width "Foundations" (Transversal) → rodapé. Cada fase é um
  **card accordion** colorido (chevron SVG).
- **Nav ativo:** **Software Delivery Phases**. Breadcrumb: **"Documentation /
  Software Delivery Phases"**.
- **Componentes:** hero; cards accordion (colapsáveis, cor por fase); blocos de
  estatística (valor + rótulo); pílulas/tags de pacote; links CTA ("Explore Phase"
  com seta); `<canvas>` com pentágono + pentagrama animado; badge ("Transversal").
- **Heading h2:** **"Software Delivery Phases"**; subtítulo *"A complete AI-assisted
  software development lifecycle from vision to production, structured in five
  collaborative phases where AI agents and human experts work together."*
- **Cards de fase (emoji · h3 · subtítulo · estatísticas · tags · CTA):**
  - 💡 **Inception** — "Phase 1 — Vision to Backlog" — 9 Packages / 6 Stages /
    30+ Skills — tags: vision, discovery, requirements, architecture,
    decision-records, delivery, knowledge-curation, rules, scaffold — CTA
    **"Explore Phase"** → `inception.html`.
  - ⚙️ **Implement** — "Phase 2 — Code & Build" — 3 Packages / 5 Stages /
    15 Skills — tags: core, springboot, santander-springboot → `implement.html`.
  - ✅ **Validate** — "Phase 3 — Test & Quality" — 1 Package / 1 Stage / 6 Skills —
    tag: scqa → `validate.html`.
  - 🚀 **Deploy** — "Phase 4 — Release & Rollout" — tag "Coming soon" → `deploy.html`.
  - 🔄 **Operate** — "Phase 5 — Monitor & Improve" — tag "Coming soon" → `operate.html`.
  - 📚 **Knowledge Curation** — "Foundation — Transversal Skill" — tag:
    knowledge-curation — CTA **"Explore"** → `transversal.html`.
- **Legenda do pentágono:** *"Not a sequence — a smart loop. Every phase feeds the
  shared knowledge and connects to every other phase."*
- **Foundations:** badge **"Transversal"**; texto *"Foundational skills that can be
  used independently of any specific phase. They support and enrich the entire
  lifecycle, plugging into Inception, Implement, Validate, Deploy or Operate as
  needed."*
- **Cores das fases (nós do pentágono):** Inception `#8b5cf6` (violeta), Implement
  `#3b82f6` (azul), Validate `#10b981` (verde), Deploy `#f59e0b` (âmbar), Operate
  `#ef4444` (vermelho), Foundation `#0d9488` (teal).
- **Rodapé:** variante B ("Part of the Ways of Work · GitHub").

---

### Tela 6 — Architecture (`docs/architecture.html`)

- **Objetivo:** explicar como catálogo, CLI APM e projeto do usuário se encaixam,
  o fluxo de distribuição e a transformação primitivo→IDE.
- **Layout:** título + subtítulo → cards de seção empilhados → rodapé.
- **Nav ativo:** **Architecture**. Breadcrumb: **"Docs / Architecture"**.
- **Componentes:** diagrama de caixas vertical (3 caixas + setas `↓`); grade de
  cards de componente; lista de fluxo numerada (números circulares); tabela.
- **Headings:** h2 **"🏗️ Architecture"**; subtítulo *"How the Ways of Work
  marketplace components work together"*; h3 **"Platform Overview"**,
  **"Components"**, **"Distribution Flow"**, **"Catalog Structure"**,
  **"Target Transformation"**.
- **Diagrama (caixas):** 📦 **Catalog** "Packages + Marketplace" (azul) →
  ⚙️ **APM CLI** "Install + Transform" (âmbar) → 💻 **User Project**
  ".agents/ .windsurf/ .cursor/" (verde).
- **Cards de componentes:**
  - 📦 **Catalog Repository** — *"Central repository containing all packages
    organized by SDLC phase. Includes marketplace.json for package discovery."*
  - ⚙️ **APM CLI** — *"Command-line tool that handles package installation,
    marketplace management, and primitive transformation."*
  - 🎯 **Primitives** — *"Skills, Instructions, Prompts, Agents, Commands, Hooks,
    and MCP — the artifact types that APM manages."*
  - 🔄 **Transformers** — *"APM plugins that convert primitives to IDE-specific
    formats (Windsurf, Cursor, etc.)."*
- **Distribution Flow (lista numerada 1–5):** **Resolve Package**, **Download
  Primitives**, **Transform**, **Install**, **Update Manifest** (cada uma com uma
  descrição de uma linha).
- **Catalog Structure (cards):** 🏛️ **Foundations**, 💡 **Inception**,
  🔧 **Implement**, 📦 **Bundles**.
- **Tabela Target Transformation:** colunas **APM Primitive | File Pattern |
  Windsurf Target**; linhas: Skill / `SKILL.md` / `.agents/skills/`; Instruction /
  `*.instructions.md` / `.windsurf/rules/`; Prompt / `*.prompt.md` /
  `.windsurf/workflows/` (e mais).
- **Rodapé:** variante A.

---

### Tela 7 — FAQ (`docs/faq.html`)

- **Objetivo:** perguntas frequentes agrupadas, com respostas expansíveis.
- **Layout:** título + subtítulo → 5 seções, cada uma com título + itens accordion
  (clicar na pergunta expande a resposta).
- **Nav ativo:** **FAQ**. Breadcrumb: **"Docs / FAQ"**.
- **Componentes:** itens accordion de pergunta/resposta; listas com marcadores;
  `code` inline; links.
- **Headings:** h2 **"❓ Frequently Asked Questions"**; subtítulo *"Common questions
  about the Ways of Work and APM"*; seções: **General**, **Installation**,
  **Troubleshooting**, **Inception Phase**, **Contributing**.
- **Perguntas (literais, em ordem):**
  - General: "What is the Ways of Work?", "What is APM?", "What are the three types
    of primitives?"
  - Installation: "How do I install APM CLI?", "What does the --name flag do when
    adding a marketplace?", "Where are artifacts installed?", "Should I let Devin
    Desktop rename the .windsurf folder to .devin?", "Can I install artifacts for
    multiple IDEs?"
  - Troubleshooting: "I get \"authentication failed\" when adding the marketplace",
    "APM command not found after installation", "How do I update installed
    packages?"
  - Inception Phase: "Do I need to complete all stages in order?", "Can I use
    Inception for existing projects?", "What if I don't have all the
    prerequisites?", "How do I know when Inception is complete?", "Can I customize
    the Inception workflow?", "What's the difference between a Package and a
    Bundle?", "How do I handle changes during Inception?"
  - Contributing: "How can I contribute artifacts to the catalog?", "Where can I
    report issues or request features?"
- **Rodapé:** variante A.

---

### Tela 8 — Glossary (`docs/glossary.html`)

- **Objetivo:** referência de termos, agrupados por categoria.
- **Layout:** hero (título + subtítulo + descrição) → 7 seções, cada uma com título
  + grade de cards de termo.
- **Nav ativo:** **Glossary**. Breadcrumb: **"Documentation / Glossary of Terms"**.
- **Componentes:** hero; cards de termo (emoji + nome + definição de 1–2 frases).
- **Headings:** h2 **"📖 Glossary of Terms"**; subtítulo *"Essential concepts for
  the Software Delivery"*; descrição *"A comprehensive reference of key terms,
  concepts, and terminology used throughout the Software Delivery Platform and
  catalog."*; seções: **AI Core Concepts**, **AI Interaction**, **Workflow
  Concepts**, **Package Structure**, **Quality & Setup**, **Tools & Artifacts**,
  **Knowledge & Resources**.
- **Termos (emoji · nome):**
  - AI Core Concepts: 🤖 AI Agent, 🧠 Model, 🔗 MCP (Model Context Protocol)
  - AI Interaction: 🪙 Token, ⚡ Prompt, 📝 Markdown (.md)
  - Workflow Concepts: 📄 Template, ⚖️ Rules, 🔢 Stage
  - Package Structure: 🎯 Skill, 📦 Package, 🎁 Bundle
  - Quality & Setup: ★ Gate, 🏗️ Scaffold, 📋 Boilerplate
  - Tools & Artifacts: 🛠️ APM (Agentic Package Manager), 📄 ADR (Architecture
    Decision Record), 📋 Backlog
  - Knowledge & Resources: 🏪 Marketplace, 📚 Knowledge Base, 🕸️ Knowledge Graph
- **Rodapé:** variante B.

---

### Tela 9 — APM CLI Reference (`docs/apm-cli.html`)

- **Objetivo:** referência de comandos do CLI APM.
- **Layout:** título + subtítulo → card de índice ("Commands") → seção Installation
  → três títulos de categoria (Project / Marketplace / Utility Commands) com seções
  de comando → "Getting Help" → rodapé.
- **Nav ativo:** **nenhum** (acessada por breadcrumb / cards de caminho).
  Breadcrumb: **"Docs / APM CLI Reference"**.
- **Componentes:** índice; blocos de comando (cabeçalho escuro + corpo com
  flag/descrição + exemplo); tip-box; títulos de categoria.
- **Headings:** h2 **"⚙️ APM CLI Reference"**; subtítulo *"Command reference for the
  Agent Package Manager"*; h3 **"Installation"**; categoria **"Project Commands"**
  → **apm init**, **apm install**, **apm uninstall**, **apm update**; categoria
  **"Marketplace Commands"** → **apm marketplace**; categoria **"Utility Commands"**
  → **apm list**, **apm self-update**; h3 **"Getting Help"**.
- **Comandos exibidos (literais):** `python -m pip install --upgrade apm-cli`,
  `apm init [OPTIONS]`, `apm install <package>@<marketplace> [OPTIONS]`,
  `apm uninstall <package>`, `apm update [PACKAGE]`, `apm marketplace add <repo>
  [OPTIONS]`, `apm marketplace list`, `apm marketplace browse <name>`,
  `apm marketplace remove <name>`, `apm list`, `apm self-update`, `apm --help`,
  `apm <command> --help`.
- **Exemplos:** `apm init --target windsurf`, `apm install inception-core@wow
  --target windsurf`, `apm uninstall inception-core`, `apm marketplace add
  t708178-bsbr_sangroup/wow-ways-of-work --ref vX.Y.Z --name wow`,
  `apm marketplace browse wow`, `apm install --help`.
- **Flags documentadas:** `--name`, `--target`, `--version`, `--ref`.
- **Tip-box:** "💡 Tip:" apontando para "Getting Started → Step 1".
- **Rodapé:** variante A.

---

### Tela 10 — Schema Reference (`docs/schema-reference.html`)

- **Objetivo:** referência de schema de frontmatter dos três primitivos + convenção
  de nomes de arquivo.
- **Layout:** título + subtítulo → card de índice ("Primitives") → 3 seções de
  schema + seção de nomes → rodapé.
- **Nav ativo:** **nenhum**. Breadcrumb: **"Docs / Schema Reference"**.
- **Componentes:** índice; blocos de código de schema (YAML colorido); tabelas de
  campos (com badges Required/Optional); tip-box.
- **Headings:** h2 **"📐 Schema Reference"**; subtítulo *"Frontmatter schemas for
  APM primitives"*; h3 **"🎯 Skill Schema"**, **"📋 Instruction Schema"**,
  **"💬 Prompt Schema"**, **"File Naming Convention"**.
- **Tabelas de campos:** colunas **Field | Type | Status | Description**. Skill e
  Instruction: `name` (Required), `description` (Required). Prompt: `name`
  (Optional), `description` (Required), `input` (Optional), `input[].name`
  (Required), `input[].description` (Optional), `input[].required` (Optional),
  `metadata` (Optional), `metadata.tags` (Optional).
- **Badges:** `Required` / `Optional`.
- **Tabela File Naming:** colunas **Type | Extension | Example**; linhas Skill /
  `.skill.md` / `macro-architecture.skill.md`; Instruction / `.instruction.md` /
  `security-policy.instruction.md`; Prompt / `.prompt.md` / `adr-generator.prompt.md`.
- **Rodapé:** variante A.

---

### Telas 11–15 — Páginas de fase (padrão comum)

As páginas **Inception, Implement, Validate** (e a transversal **Foundations**)
usam um **layout de duas colunas**: **sidebar de índice (TOC) fixa à esquerda** +
**conteúdo à direita**, colapsando para uma coluna em ≤1024px. Cada uma tem cor de
**acento própria** e um **hero** com um pentágono em `<canvas>` (destacando o nó da
fase) e um emoji grande. **Deploy** e **Operate** são páginas de escopo ("em
breve") em coluna única. Rodapé de todas: variante B ("Part of the Ways of Work ·
GitHub"). Nenhuma tem item de nav ativo — orientam-se por breadcrumb.

Cores de acento por página: Inception `#8b5cf6`; Implement `#3b82f6`; Validate
`#10b981`; Deploy `#f59e0b`; Operate `#ef4444`; Foundations `#0d9488`.
Caixas recorrentes: **tip-box** (fundo `#eff6ff`, borda `#bfdbfe`, borda-esquerda
primária) e **warn-box** (fundo `#fffbeb`, borda `#fde68a`, borda-esquerda `#f59e0b`,
texto forte `#b45309`).

#### Tela 11 — Inception Phase (`docs/inception.html`)

- **Objetivo:** documentação completa da fase Inception (visão → backlog) com fluxo
  de 6 estágios. Acento violeta.
- **Breadcrumb:** **"Documentation / Software Delivery Phases / Inception Phase"**.
- **Componentes:** sidebar TOC; hero com canvas pentágono + 💡; info-boxes
  (default/success/warning); listas de resultados; cards de papel (Who Is This
  For); cards de passo (Discover/Install/Activate/Run com badges "STEP 0x");
  diagrama de framework (estágio→skill); cards de estágio; checklist de conclusão;
  bloco de artefatos gerados; cards de boas práticas; cards de integração.
- **Headings:** h2 **"Inception Phase"** (subtítulo *"Phase 1 — From Vision to
  Actionable Backlog"*); h3 **"Phase Overview"**, **"Who Is This For?"**,
  **"Getting Started"**, **"Inception Workflow"**, **"Best Practices"**,
  **"Integration with Other Phases"**.
- **Cards de estágio (emoji · nome · rótulo com id de código):**
  - 🏗️ **Scaffold** — "Stage -1 · Bootstrap · `inception-scaffold`"
  - 💡 **Vision** — "Stage 0 · `inception-vision`"
  - 🔍 **Discovery** — "Stage 1 · `inception-discovery`"
  - 📝 **Requirements & Risk** — "Stage 2 · `inception-requirements`"
  - 🏛️ **Architecture** — "Stage 3 · `inception-architecture`"
  - 🚚 **Delivery** — "Stage 4 · `inception-delivery`"
  - ⚖️ **Rules** — "Governance · always-on · `inception-rules`"
  - 📐 **Decision Records** — "Cross-cutting · ADRs · `inception-decision-records`"
- **Boas práticas (h4, literais):** "1. 🎯 Start with a Clear Problem Statement";
  "2. 👥 Engage Stakeholders Early and Often"; "3. 🔄 Iterate, Don't Settle for
  First Draft"; "4. 📝 Document Decisions as You Go"; "5. 🔍 Validate Assumptions
  with Real Data"; "6. ⚖️ Configure Governance Rules from Day One"; "7. 🕸️ Maintain
  Your Knowledge Graph Continuously"; "8. 🚫 Don't Skip Stages (Even If You're in a
  Hurry)".
- **Imagens:** nenhuma (apenas o gráfico em canvas).

#### Tela 12 — Implement Phase (`docs/implement.html`)

- **Objetivo:** documentação da fase Implement (item de backlog → PR mergeado) via
  o loop TDD S1–S5, incluindo um playbook de consumidor com **screenshots**. Acento
  azul. **Única página com screenshots reais.**
- **Breadcrumb:** **"Documentation / Software Delivery Phases / Implement Phase"**.
- **Sidebar TOC (links):** 🎯 Phase Overview, 👥 Who Is This For?, 🚀 Getting
  Started, 📖 Consumer Playbook, 🔄 Implement Workflow, 🧩 Skill Catalog,
  🎛️ Flavor Packages, ⭐ Best Practices, 🔗 Integration with Other Phases.
- **Componentes:** sidebar TOC; hero (canvas pentágono + ⚙️); info-boxes; tooltips
  `<abbr>` (glossário de acrônimos); passos numerados de playbook com **imagens de
  screenshot** e **caixas placeholder tracejadas** (marcador 📷); chips de comando
  escuros inline; diagrama de loop; cards de catálogo de skills com ids + badges;
  listas de atributos de flavor; algoritmo de resolução.
- **Headings:** h2 **"Implement Phase"** (subtítulo *"Phase 2 — From Backlog to
  Merged Code"*); h3 **"Phase Overview"**, **"Who Is This For?"**, **"Getting
  Started"**, **"Consumer Playbook"**, **"Implement Workflow"**, **"Skill
  Catalog"**, **"Flavor Packages"**, **"Best Practices"**, **"Integration with
  Other Phases"**.
- **Skill Catalog (id · nome):** `implement-plan` — Implementation Plan (Definition
  of Ready); `implement-harness` — Test Harness (TDD Red); `implement-code` — Code
  Generation; (+ execute, harden); gates: `implement-review-security` — Security
  Review Gate; `implement-review-architecture` — Architecture Review Gate;
  `implement-review-reliability` — Reliability Review Gate; `implement-review-product`
  — Product Review Gate.
- **Screenshots / placeholders (Consumer Playbook):**
  - Passo 1: imagem `assets/implement/01-marketplace-browse.png` — alt *"Ways of
    Work Marketplace sidebar filtered to the Implement phase, showing the
    implement-core package card with its Install button."*; legenda "Marketplace →
    filter by **Implement** → `implement-core` card."
  - Passo 2: chip `apm install implement-core@<marketplace-alias> --target
    windsurf`; imagem `assets/implement/02-marketplace-install-dialog.png` — alt
    *"Install dialog for implement-core showing the generated apm install command
    with Copy and Copy & Close actions."*; legenda "Click **Install** → the dialog
    shows the ready-to-copy install command."
  - Passo 3: chip `/implement`; **placeholder** tracejado âmbar (📷) "Screenshot
    pending — Cascade running `/implement` … Save as
    `assets/implement/03-cascade-running.png`".
  - Passo de saída/PR: **placeholder** (📷) "Screenshot pending — a real Pull
    Request … Save as `assets/implement/04-pull-request.png`".
  - Estilo do screenshot: bloco com borda `1px solid #e2e8f0`, raio 8px, sombra;
    legenda 0.8rem cinza itálico. Placeholder: borda `1.5px dashed #f59e0b`, fundo
    `#fffbeb`, texto `#92400e` itálico.
- **Glossário de acrônimos (`<abbr>` em warn-box):** S1–S5, TDD, DoR, CI, PR, ADR,
  INVEST, FR/NFR, US, S-SDLC, SAST, SCA, CSA, DAST, GHAS, BDD, ALM, ITSM, APM, KB,
  SCQA.

#### Tela 13 — Validate Phase (`docs/validate.html`)

- **Objetivo:** documentação da fase Validate — transformar achados do SonarQube em
  PR em correções/testes gerados por IA e num PR pronto para revisão. Acento verde.
- **Breadcrumb:** **"Documentation / Software Delivery Phases / Validate Phase"**.
- **Sidebar TOC:** 🎯 Phase Overview, 👥 Who Is This For?, 🚀 Getting Started,
  🔄 Validate Workflow, 📊 AI Estimation Report, ⭐ Best Practices, 🔗 Integration
  with Other Phases.
- **Componentes:** sidebar TOC; hero (canvas pentágono + ✅); info-boxes; cards de
  papel; cards de passo (Discover/Install/Configure/Run — badges STEP 01–04);
  diagrama de framework ("SAN-SDLC VALIDATE-QA FRAMEWORK" — colunas STAGES | SKILLS
  | OUTCOMES | GATES, pílulas de skill verdes, setas `↓`, legenda "Skill (commits
  its own work)"); cards de skill; tabelas de inputs suportados / artefatos gerados.
- **Headings:** h2 **"Validate Phase"** (subtítulo *"Phase 3 — Automated
  Quality-Gate Validation & Remediation"*); h3 **"Phase Overview"**, **"Who Is This
  For?"**, **"Getting Started"**, **"Validate Workflow"**, **"AI Estimation
  Report"**, **"Best Practices"**, **"Integration with Other Phases"**.
- **Cards de skill (nome · rótulo):**
  - **san-sdlc-validate-qa** — "Orchestrator · Trigger: `sonar, sonarqube, quality
    gate, PR validation`"
  - **san-sdlc-validate-qa-bugs** — "Child skill · BUG-type AUTO_FIX reliability
    fixer"
  - **san-sdlc-validate-qa-bugs-review** — "Child skill · BUG-type NEEDS_INPUT
    conservative fixer"
  - **san-sdlc-validate-qa-codesmells** — "Child skill · CODE_SMELL maintainability
    fixer"
  - **san-sdlc-validate-qa-coverage** — "Child skill · Missing-tests generator"
  - **san-sdlc-validate-qa-coverage-deep** — "Child skill · Behaviour-driven test
    generator"
- **Boas práticas (h4):** "1. 🔑 Export Tokens Safely, Never in Chat"; "2. 🧰 Verify
  the Toolchain Before You Run"; "3. 🎚️ Scope What Gets Auto-Fixed"; "4. 🌿 Keep the
  Working Tree Clean"; "5. ✅ Always Review the Generated PR"; "6. 🧭 Trust FLAGGED
  Over Speculative Fixes".
- **Imagens:** nenhuma.

#### Tela 14 — Deploy Phase (`docs/deploy.html`)

- **Objetivo:** página de escopo/placeholder da fase Deploy (ainda indisponível).
  Acento âmbar.
- **Breadcrumb:** **"Documentation / Software Delivery Phases / Deploy Phase"**.
- **Layout:** coluna única (sem sidebar TOC): hero (canvas pentágono + 🚀) → caixa
  de aviso "Coming Soon" → Overview (grade input/atividades/output) → Integration →
  rodapé.
- **Componentes:** hero; warn-box **"🚧 Coming Soon"**; flow-grid (3 cards: Input /
  Activities / Output, o do meio destacado); cards de integração (⬅️ fase anterior /
  ➡️ próxima, com borda-esquerda de acento); info-box.
- **Headings:** h2 **"Deploy Phase"** (subtítulo *"Phase 4 — Release & Rollout"*);
  h3 **"Phase Overview"** (subtítulo "What is the Deploy Phase?"); h3 **"Integration
  with Other Phases"** (subtítulo "Where Deploy fits in the Software Delivery
  lifecycle").
- **Texto "Coming Soon":** *"The skills and packages for the Deploy phase are **not
  yet available** in the catalog. This page describes the scope of the phase;
  detailed documentation, skills and workflows will be published here as they are
  released."*
- **Flow-grid:** **Input** = Merged PR; **Activities** = Artifact / image publish,
  Deployment, Integration · performance · DAST, Release; **Output** = Product in
  production.
- **Integração:** ⬅️ **Validate (Phase 3)** → "Validate Phase docs →"; ➡️ **Operate
  (Phase 5)** → "Operate Phase docs →"; info-box "🌐 See the Full Picture" →
  "Software Delivery Phases".

#### Tela 15 — Operate Phase (`docs/operate.html`)

- **Objetivo:** página de escopo/placeholder da fase Operate (indisponível).
  Acento vermelho. Espelha Deploy.
- **Breadcrumb:** **"Documentation / Software Delivery Phases / Operate Phase"**.
- **Componentes:** hero (canvas pentágono + 🔄); warn-box; flow-grid; um card de
  integração (⬅️ apenas anterior); info-box.
- **Headings:** h2 **"Operate Phase"** (subtítulo *"Phase 5 — Monitor & Improve"*);
  h3 **"Phase Overview"** (subtítulo "What is the Operate Phase?"); h3 **"Integration
  with Other Phases"** (subtítulo "Where Operate fits in the Software Delivery
  lifecycle").
- **Flow-grid:** **Input** = Production product; **Activities** = Observability,
  Service management, FinOps, AIOps; **Output** = Signals → Learn.
- **Integração:** ⬅️ **Deploy (Phase 4)** → "Deploy Phase docs →"; info-box
  "🌐 View All Phases" → "Software Delivery Phases".

#### Tela 16 — Foundations / Transversal (`docs/transversal.html`)

- **Objetivo:** documenta a skill transversal "Foundations" (Knowledge Curation),
  usável independentemente de qualquer fase. Acento teal.
- **Breadcrumb:** **"Documentation / Software Delivery Phases / Foundations"**.
- **Layout:** sidebar TOC + conteúdo. Hero tem **badge "Transversal"** + título +
  emoji 🧩 à direita (sem canvas pentágono aqui).
- **Sidebar TOC:** 🎯 Overview, 🚀 Getting Started, 🔄 The curation workflow,
  🎁 What you get & where it goes, 🔒 Sensitive data & guardrails, ⭐ Best Practices,
  🌱 How it can evolve.
- **Componentes:** sidebar TOC; hero com hero-badge + emoji; info-boxes; io-grid
  (📥 Inputs / 📤 Outputs); output-box (primitivos-chave); listas de passos.
- **Headings:** h2 **"Foundations"** (subtítulo *"Skills that can be used
  independently of any phase"*); h3 **"Knowledge Curation"** (subtítulo "Before
  Inception workflows"); h3 **"Getting Started"**, **"The curation workflow"**,
  **"What you get & where it goes"**, **"Sensitive data & guardrails"**, **"Best
  Practices"**, **"How it can evolve"**.
- **io-grid — Inputs:** documento fonte revisado (text, Markdown, HTML, JSON, YAML,
  CSV, PDF, Word, PowerPoint, Excel); pasta de destino; pasta opcional de artefatos
  já curados. **Outputs:** artefatos `.md` curados com frontmatter YAML; PNGs
  portadores de conhecimento; validados/rastreáveis. output-box "Key primitives:"
  cita a skill `knowledge-curation` + o prompt `/curate` + scripts auxiliares.
- **Imagens:** nenhuma.

---

## 5. Modelos de dados / entidades

O domínio central é o **Pacote de marketplace**. Todos os dados exibidos no
marketplace vêm de `apm.yml > marketplace.packages` (fonte única de verdade).

### Entidade: Package (entrada do marketplace)

`Package {`
- `name: texto` (obrigatório) — identificador kebab-case, ex.: `implement-core`.
- `source: texto` (obrigatório) — repositório de origem (dono/repo).
- `subdir: texto` (obrigatório) — caminho do pacote no repo.
- `version: texto` (obrigatório) — range semver (ex.: `^1.0.0`). No dashboard é
  exibida a versão resolvida do manifesto folha (ex.: `v1.0.0`) como badge teal; se
  for um SHA, badge cinza (ex.: `#abc1234`); se ausente, `—`.
- `category: texto` (open-ended) — ex.: Governance, Authoring, Knowledge, Software
  Delivery. Não é enum fechado.
- `description: texto` (obrigatório) — 1 parágrafo.
- `tags: lista de texto` (opcional) — pares `chave:valor` como `type:package` /
  `type:bundle`, `phase:*`, `role:*`, `tech:*`, `maturity:*`, ou palavras livres.
`}`

Campos derivados na UI: **type** (`package`|`bundle`, a partir da tag `type:bundle`),
**status** (sempre exibido como **"✓ stable"** na tabela), ícone (`◇`/`◆`).

### Valores reais (os 11 pacotes atuais — para popular as telas)

| name | category | type | version | descrição (resumo) |
|---|---|---|---|---|
| `foundations-core` | Governance | package | v1.0.0 | Governance rules, quality standards, and shared instructions for consumers that choose this baseline. |
| `foundations-meta-creators` | Authoring | package | v1.0.0 | Foundation — package-authoring tooling (skill/prompt/instruction meta-creators + validator). |
| `implement-core` | Software Delivery | package | v1.0.0 | IMPLEMENT phase — framework-agnostic core. TDD loop (S1-S5), gates, FlavorProfile contract. |
| `implement-springboot` | Software Delivery | package | v1.0.0 | FlavorProfile — vanilla Spring Boot (hexagonal, JUnit 5/Mockito, SonarQube gate). |
| `implement-santander-springboot` | Software Delivery | package | v1.0.0 | FlavorProfile — Santander Spring Boot (SAT/BDD, S-SDLC gates, portal scaffolding). |
| `implement-bug-seeker` | Software Delivery | package | v1.0.0 | Disciplined diagnosis loop for hard bugs/perf regressions (reproduce→minimise→fix). |
| `foundations-meta-migrators` | Authoring | package | v1.0.0 | Migration toolkit: migration-planner + artifact-migrator + migrate-skills workflow. |
| `foundations-globalization` | Authoring | package | v1.0.0 | Globalization analysis: portability-analyzer + redundancy-analyzer + pipeline. |
| `inception-knowledge-curation` | Knowledge | package | v1.0.0 | Knowledge curation: turns a reviewed doc into curated artifacts (/curate). |
| `validate-scqa` | Software Delivery | package | v1.0.0 | VALIDATE phase — SonarQube quality-gate validation & remediation for Java/Spring Boot. |
| `inception` | Software Delivery | **bundle** | v1.0.0 | Bundle — Complete Inception (Stages -1→4): 8 inception packages driven by one workflow. |

Tags de exemplo (para popular pílulas): `phase:implement`, `role:developer`,
`maturity:experimental`, `maturity:stable`, `tech:agnostic`, `tech:java`,
`role:tech-lead`, `role:product-owner`, `role:solution-architect`, `arc42`,
`c4-model`, `ddd`, `knowledge-base`, `curation`.

### Metadados de catálogo (para navbar)

`Catalog { name: "wow-ways-of-work", version: "v2.0.0", totalPackages: 11,
totalCategories: 4, owner: "Ways of Work", repo:
"github.com/t708178-bsbr_sangroup/wow-ways-of-work" }`.

### Entidade secundária: Primitive (na documentação)

`Primitive { type: enum[Skill, Instruction, Prompt, Command, Hook, MCP Server],
frontmatter: { name, description, input[...], metadata.tags } }`. Skill/Instruction
exigem `name` e `description`; Prompt tem `description` obrigatória e demais campos
opcionais.

---

## 6. Fluxos principais

1. **Descobrir e instalar um pacote (marketplace):**
   Abre `index.html` → vê a grade de cards → (opcional) filtra pela sidebar
   (categoria/tipo) ou digita na busca "Type anything..." → clica **Install** num
   card → abre o modal → clica **Copy** (ou **Copy & Close**) → cola o comando
   `apm install <nome>@<alias> --target windsurf` no terminal.

2. **Alternar visão e tema:**
   No cabeçalho de conteúdo, clica **Table** para ver a tabela (colunas Package
   Name / Description / Version / Status / Tags / Actions) → clica **Cards** para
   voltar. Na navbar, clica o **toggle de tema** para alternar claro/escuro (a
   escolha persiste).

3. **Ir do marketplace à documentação:**
   Clica **Docs** na navbar → chega em `docs/index.html` → escolhe um caminho:
   **Install & Use** (Getting Started) ou **Create & Contribute** (Creator Guide).

4. **Consumidor — instalar o CLI e um pacote (Getting Started):**
   Segue os 4 passos: Step 1 instala o CLI (pip + Artifactory + CA), Step 2 adiciona
   o marketplace (`apm marketplace add … --ref vX.Y.Z --name wow`), Step 3 instala
   (`apm install <pkg>@wow --target windsurf`), Step 4 verifica e usa. Copia comandos
   pelos botões **Copy**; alterna abas por SO.

5. **Produtor — contribuir um pacote (Creator Guide):**
   Segue a escada de 10 passos: Branch → Author → Register em `apm.yml` → Changelog
   → Validate local → PR → Local gate → Review (CODEOWNERS) → Merge → Preview
   release. Usa o "Quick chooser" para pular a 2a/2b/2c conforme o cenário; consulta
   a tabela de checklist de arquivos.

6. **Explorar as fases do SDLC:**
   Em `docs/phases.html` clica **Explore Phase** num card de fase → abre a página de
   fase (ex.: Implement) com sidebar TOC → navega Overview / Playbook (com
   screenshots) / Workflow / Skill Catalog / Best Practices / Integration. Deploy e
   Operate exibem "🚧 Coming Soon".

---

## 7. Interações e comportamentos

- **Busca (marketplace):** campo único "Type anything..." filtra cards e linhas por
  nome e tags (case-insensitive), em tempo real (evento input). Atualiza a contagem
  "Showing N of 11".
- **Filtros (sidebar):** clicar um item torna-o ativo (só um ativo por vez) e filtra
  por categoria ou por tipo (`type:package`/`type:bundle`). "All Packages" limpa o
  filtro. Filtro e busca combinam (E lógico).
- **Ordenação (tabela):** cabeçalhos são clicáveis (cursor pointer, hover teal) e o
  cabeçalho "Package Name ↕" indica ordenação; o comportamento visual de ordenação
  existe no cabeçalho.
- **Toggle de visão:** Cards ↔ Table; botão ativo destacado (teal).
- **Toggle de tema:** claro/escuro; resolução system-first (escolha salva > SO >
  claro); persiste em `localStorage`; `aria-pressed` sincronizado (pressed = dark);
  transição suave de cores.
- **Modal:** foco preso (focus-trap com Tab/Shift+Tab), abre com foco no primeiro
  elemento, fecha com Esc / clique fora / X / Cancel; restaura o foco anterior.
- **Copiar comando:** botão "Copy" → "Copied!" (verde) por 2s; usa a área de
  transferência.
- **Animações:** entrada escalonada de cards; count-up nos números da navbar; ambas
  desativadas sob `prefers-reduced-motion`.
- **Badge de ambiente (navbar):** oculto em prod; "Dev" (verde) ou "Pre" (âmbar),
  definido em build a partir da identidade do repositório.
- **Responsivo:** sidebar do marketplace some ≤900px; layout de fase colapsa para
  uma coluna ≤1024px.
- **Documentação — interações:** botões Copy em blocos de código; abas por SO
  (Windows / macOS·Linux); accordions de FAQ e de fases; `<details>` colapsáveis;
  modal stepper "Demo" no Creator Guide (contador "1 / 10", Prev/Next, dots);
  pentágono animado em canvas (dashboard) e estático com nó destacado (páginas de
  fase).
- **Acessibilidade:** foco visível (outline teal, offset 2px); aria-labels em
  botões-ícone; roles de dialog; nav com estados hover/active; respeito a
  reduced-motion.
- **Permissões/papéis:** não há autenticação nem papéis na UI; é um site estático
  público. Papéis aparecem apenas como conteúdo (tags `role:*` e as seções "Who Is
  This For?"). O ciclo de contribuição (CODEOWNERS review, merge) é descrito, não
  aplicado pela UI.

---

## 8. Observações

- **Dois design systems distintos e propositais.** O marketplace é escuro/navy com
  identidade Santander (vermelho reservado) + Gluon (teal como cor de ação). A
  documentação é clara/azul (`#2563eb`) com fontes de sistema. Um designer deve
  tratá-los como dois temas irmãos, unidos apenas pelo nome "Ways of Work" e pelos
  links de ida e volta.
- **Vermelho é reservado** no marketplace: aparece só no botão Docs e na seleção de
  texto. O CTA primário (Install) é teal, não vermelho.
- **Ícones são glifos/emoji**, não uma biblioteca de ícones vetoriais consistente: o
  marketplace usa caracteres geométricos (`◇ ◆ ◉ ▤ ↕ ✓ →`) e alguns SVGs inline
  (lupa, grade, linhas, sol, lua, X); a documentação usa emojis coloridos em
  praticamente todos os títulos e tiles.
- **Badge de status é sempre "✓ stable"** na tabela (valor fixo, não vem de dado
  por pacote hoje).
- **Divergência real de rótulo de nav:** o item 4 da doc aparece como "Software
  Delivery" em duas páginas e "Software Delivery Phases" nas demais. Preservar como
  está ou padronizar é decisão do designer/produto.
- **Duas variantes de rodapé na doc:** A ("Powered by APM · View Source") nas
  páginas "doc" e B ("Part of the Ways of Work · GitHub") nas páginas de fase e no
  glossary/phases.
- **Cores de fase reutilizadas** como identidade: violeta (Inception), azul
  (Implement), verde (Validate), âmbar (Deploy), vermelho (Operate), teal
  (Foundations) — aparecem no pentágono, nos cards do dashboard e como acento das
  páginas de fase.
- **Estados vazios são minimalistas:** o marketplace não tem tela de "nenhum
  resultado" dedicada — apenas "Showing 0 of 11 packages". Não há loading nem erro
  (site estático).
- **Screenshots reais existem só em 2** (`implement.html`, passos 1 e 2 do playbook);
  os passos 3 e 4 usam placeholders tracejados âmbar com marcador 📷. Convenção de
  mídia documentada em `docs/assets/README.md`: pasta por página, nomes
  `<NN>-<descrição-kebab>.png`, PNG < ~300KB, classe CSS `.doc-screenshot`.
- **Números do dashboard são dinâmicos** a partir do catálogo: hoje 11 packages,
  4 categories, versão v2.0.0. Os contadores por categoria/tipo também.
- **O pentágono/pentagrama** é uma marca visual recorrente (logo + dashboard + heros
  de fase) e simboliza as 5 fases como um "loop", não uma sequência.
