# SP-02: Validation Spike — Leptos SSR + WASM Viability

> **Type:** Spike (timeboxed investigation)
> **Timebox:** 1 dia
> **Agent Persona:** Frontend Dev
> **Roda em paralelo com:** SP-01, AP (Architecture)
> **Output:** `_bmad/spikes/sp-02-result.md` + projeto de prova em `_bmad/spikes/sp-02/`

---

## Objetivo

Validar se Leptos (SSR + WASM) é viável para o frontend do Ensi v1 dentro do constraint de 8 semanas — e identificar a complexidade real antes do SysArch desenhar a arquitetura do frontend.

---

## Contexto

A Mary (Analyst) flagou o Leptos WASM complexity como risco alto. O Ensi usa Leptos como diferencial (full-stack Rust, single binary), mas se a curva de aprendizado ou a DX forem proibitivas para o MVP, o SysArch precisa saber antes de fechar a arquitetura.

O PM (Curly) identificou isso como SP-02 — gate obrigatório.

---

## Perguntas a responder

1. Qual o tempo de setup de um projeto Leptos com SSR + WASM até ter uma página renderizando?
2. O modelo de reatividade (signals) é produtivo para as UIs do Ensi (board view, pipeline view, issue detail)?
3. Qual o tamanho do bundle WASM para uma página simples? É aceitável para first load?
4. Server functions (`#[server]`) funcionam bem para as chamadas de API do Ensi?
5. Hot reload / DX durante desenvolvimento é aceitável?
6. Leptos + Axum no mesmo binário: integração limpa ou friction significativa?

---

## Tarefa

### 1. Setup mínimo

Cria um projeto Leptos standalone em `_bmad/spikes/sp-02/` usando `cargo-leptos`:

```
sp-02/
├── Cargo.toml
├── src/
│   ├── main.rs         # Axum server entry
│   ├── app.rs          # Leptos app root
│   └── components/
│       ├── issue_board.rs   # Kanban board simulado
│       └── pipeline_view.rs # Pipeline stage view simulado
└── style/
    └── main.css
```

### 2. Implementar e avaliar

Constrói as 3 UIs mais críticas do Ensi em versão simplificada:

**UI 1 — Issue Board (Kanban)**
- Lista de issues por status (Backlog / In Progress / Done)
- Drag & drop básico entre colunas
- Mede: complexidade de implementação, linhas de código, tempo gasto

**UI 2 — Pipeline View**
- 5 stages em linha (Discovery → Planning → Architecture → Development → Review)
- Stage ativo destacado, stages completos marcados
- Mede: facilidade de composição de componentes

**UI 3 — Server Function**
- `#[server]` function que simula buscar issues do SurrealDB
- Reactive update quando dados chegam
- Mede: latência percebida, ergonomia do server/client boundary

### 3. Medir métricas

- Tempo de `cargo leptos build` (cold e warm)
- Tamanho do bundle WASM
- Tempo até first interactive (simulado)
- Linhas de código vs. equivalente Next.js estimado

---

## Output Esperado

Salvar em `_bmad/spikes/sp-02-result.md`:

```markdown
# SP-02 Result

## Verdict: GO | NO-GO | GO WITH CONSTRAINTS

## Findings
- Setup time (zero to first render): Xmin
- Bundle WASM size: XKB (gzipped: XKB)
- Cold build time: Xs | Warm build time: Xs
- HMR / hot reload: funcional? latência?
- Server functions ergonomics: [avaliação]
- Axum integration: [avaliação]

## DX Assessment
- Signals model vs. React hooks: [comparação honesta]
- Componentes reutilizáveis: [facilidade de composição]
- CSS / Tailwind integration: [funciona? como?]

## UI Complexity Estimates (Leptos vs. Next.js)
| UI | Leptos LOC | Next.js estimado | Complexidade relativa |
|----|-----------|-----------------|----------------------|
| Issue Board | X | X | similar / harder / easier |
| Pipeline View | X | X | ... |
| Server Function | X | X | ... |

## Recommended approach
[Leptos full / Leptos com scope reduzido de UI / fallback para outra stack]

## Scope recommendation for v1 frontend
[Quais UIs são viáveis em 8 semanas com Leptos, quais devem ser simplificadas]

## Impact on Architecture
[O que o SysArch deve saber ao desenhar a crate ensi-frontend]
```

---

## Critérios de Aceite

- [ ] As 3 UIs implementadas (mesmo que simplificadas)
- [ ] Métricas de build e bundle documentadas
- [ ] Server function funcionando end-to-end com Axum
- [ ] Verdict claro: GO / NO-GO / GO WITH CONSTRAINTS
- [ ] Scope recommendation para o frontend v1 documentada
- [ ] Impacto na arquitetura documentado para o SysArch

---

## Resultado vai para

- **SysArch** → informa design da crate `ensi-frontend` e decisão SSR vs. SPA
- **Architecture Review** → consolida com SP-01 antes de fechar o `architecture-artifact.json`

## Labels

`type:spike` · `pipeline:discovery` · `priority:urgent` · `bmad:sp-02`
