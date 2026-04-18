# AP: System Architecture — Ensi v1 (v2 — post-spikes)

> **Pipeline Stage:** Architecture
> **Agent Persona:** Architect (SysArch)
> **Input:** `_bmad/docs/prd-artifact.json` + resultados SP-01 + resultados SP-02
> **Expected Output:** `_bmad/docs/architecture-artifact.json` + `_bmad/docs/architecture.md`
> **Nota:** Issue anterior falhou por problema de rede. Esta versão incorpora os findings dos dois spikes diretamente.

---

## Contexto — Inputs disponíveis

### Do PRD (Curly)
- `_bmad/docs/prd-artifact.json` — PrdArtifact JSON (schema-compliant)
- `_bmad/docs/product-prd.md` — PRD narrativo com Gherkin acceptance criteria
- **5 stages MVP:** Discovery → Planning → Architecture → Development → Review
- **5 artifact schemas fechados:** BriefArtifact, PrdArtifact, ArchitectureArtifact, SprintPlanArtifact, CodeReviewArtifact
- **NFRs:** p95 < 5 min Analyst task, p95 < 20 min pipeline completo
- **Out of scope v1:** Deploy stage, Observability, Agent Memory, Tech Writer / Data Engineer / UX Designer, Multi-LLM

### Do SP-01 — Gemini Structured Output (GO WITH CONSTRAINTS)
Resultado completo em `_bmad/spikes/sp-01-result.md`. Findings críticos para a arquitetura:

**Constraints obrigatórios no AgentExecutor:**
- Strip estes keywords antes de enviar schema para Gemini: `additionalProperties`, `$ref`, `oneOf`, `anyOf`
- Retry policy: máximo 3 tentativas com erro injetado no prompt — resolve ~85–90% das violações
- Model selection por stage:
  - Flash (`gemini-2.0-flash`) → Discovery (Brief), Development (Stories)
  - Pro (`gemini-2.5-pro`) → Planning (PRD), Architecture
- Latência estimada: p50 ~1.800ms / p95 ~4.200ms — dentro do NFR de 5 min

**Impacto nos traits:**
- `AgentExecutor` trait deve expor `model_for_stage(stage: PipelineStage) -> GeminiModel`
- Schema serialization layer deve fazer strip automático dos keywords não suportados
- Retry loop faz parte do `AgentExecutor`, não do Pipeline FSM

**Blocker pendente:** `results/runs.json` é placeholder — API key não estava disponível no spike. Rodar `GEMINI_API_KEY=<key> cargo run` em `_bmad/spikes/sp-01/` para validar métricas reais antes do Week 3.

### Do SP-02 — Leptos SSR + WASM (GO WITH CONSTRAINTS)
Resultado completo em `_bmad/spikes/sp-02-result.md`. Findings críticos para a arquitetura:

**Métricas validadas:**
- Bundle WASM: 233 KB gzipped + 23 KB JS glue (projeção app completo: 350–500 KB gzipped)
- Warm build: 3.9s — DX aceitável
- Leptos + Axum single binary: integração limpa, server functions com tokio/async funcionam naturalmente

**Constraints obrigatórios na crate `ensi-frontend`:**
- **DnD não está disponível no v1** — usar click-to-move no board (defer drag-and-drop para v1.1)
- Learning curve: 3–4 dias para Rust devs novos em reactive UI (borrow-checker + clone-before-capture pattern)
- LOC Leptos ~30% maior que equivalente Next.js — considerar no scope das UIs

**Scope de UIs viável em 8 semanas (conforme SP-02):**
- Issue Board com click-to-move ✅
- Pipeline View (5 stages) ✅
- Issue Detail com artefato viewer ✅
- Agent task feed (live updates via WebSocket) ✅
- Drag-and-drop real ❌ (v1.1)

---

## Stack Técnica Confirmada

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Backend | Rust (Axum 0.8+) | Confirmado |
| Frontend | Leptos (SSR + WASM) | GO WITH CONSTRAINTS (SP-02) |
| Database | SurrealDB 3.0 embedded | Confirmado |
| Messaging | NATS embedded | Confirmado |
| LLM | Gemini API (Flash + Pro) | GO WITH CONSTRAINTS (SP-01) |
| Auth | JWT (HS256) + PAT `ens_*` + Daemon Token `edt_*` | Confirmado |
| Deploy | Single binary | Confirmado |

---

## Tarefa do SysArch

### 1. Ler os inputs
Carrega `_bmad/docs/prd-artifact.json` e os dois resultados de spike antes de qualquer outra ação.

### 2. Definir o Cargo workspace

Crates obrigatórias e suas responsabilidades. Ponto de partida sugerido:

| Crate | Responsabilidade |
|-------|-----------------|
| `ensi-core` | Domain traits (ports): IssueRepository, EventPublisher, AgentExecutor, ArtifactStore |
| `ensi-server` | Axum HTTP server, rotas REST + WebSocket |
| `ensi-daemon` | Task poller/subscriber, execenv isolation |
| `ensi-pipeline` | Pipeline FSM, stage transitions, artifact validation |
| `ensi-db` | SurrealDB adapter (implementa traits de ensi-core) |
| `ensi-events` | NATS adapter, subject hierarchy |
| `ensi-frontend` | Leptos SSR + WASM (constraints SP-02 aplicados) |
| `ensi-cli` | CLI commands |

### 3. Definir o Pipeline FSM

Estados, transições e guards. Incorporar retry logic do SP-01 como parte do `AgentExecutor`, não do FSM.

### 4. Definir o SurrealDB schema

Todas as tabelas do MVP em SurrealQL. Focar nas entidades core: workspace, project, issue, agent, task, artifact, pipeline_state.

### 5. Definir a API surface

REST endpoints + WebSocket events + NATS subjects (`ensi.*`).

### 6. Definir o Daemon

Task lifecycle, execenv isolation por task (`~/ensi_workspaces/{ws_id}/{task_id}/`), injeção de contexto (AGENT.md, ISSUE.md, PIPELINE.md).

### 7. Documentar ADRs obrigatórios

Mínimo 5 ADRs, incluindo obrigatoriamente:
- ADR-001: Leptos vs. alternativas (fundamentado no SP-02)
- ADR-002: Gemini model selection por stage (fundamentado no SP-01)
- ADR-003: AgentExecutor retry policy
- ADR-004: SurrealDB embedded vs. external
- ADR-005: Click-to-move vs. DnD no board v1

---

## Output Esperado

### ArchitectureArtifact (JSON — salvar em `_bmad/docs/architecture-artifact.json`)

```json
{
  "version": "1.0",
  "product_name": "Ensi",
  "scope": "v1",
  "cargo_workspace": {
    "crates": [
      {
        "name": "ensi-core",
        "responsibility": "...",
        "ports": ["..."],
        "adapters": ["..."]
      }
    ]
  },
  "pipeline_fsm": {
    "states": ["Discovery", "Planning", "Architecture", "Development", "Review", "Blocked", "Complete"],
    "transitions": [
      {
        "from": "...",
        "to": "...",
        "event": "...",
        "guard": "..."
      }
    ],
    "retry_policy": {
      "max_retries": 3,
      "strategy": "error_injection",
      "success_rate": "85-90%"
    }
  },
  "agent_executor": {
    "model_selection": {
      "Discovery": "gemini-2.0-flash",
      "Planning": "gemini-2.5-pro",
      "Architecture": "gemini-2.5-pro",
      "Development": "gemini-2.0-flash",
      "Review": "gemini-2.0-flash"
    },
    "schema_preprocessing": ["strip additionalProperties", "strip $ref", "strip oneOf", "strip anyOf"]
  },
  "database_schema": {
    "tables": [
      {
        "name": "...",
        "fields": ["..."],
        "indexes": ["..."],
        "relations": ["..."]
      }
    ]
  },
  "api_surface": {
    "rest_endpoints": [],
    "websocket_events": [],
    "nats_subjects": []
  },
  "frontend": {
    "framework": "Leptos SSR + WASM",
    "wasm_budget_kb_gzipped": 500,
    "v1_uis": ["Issue Board (click-to-move)", "Pipeline View", "Issue Detail", "Agent task feed"],
    "deferred_to_v1_1": ["Drag-and-drop board"]
  },
  "daemon": {
    "task_lifecycle": "...",
    "execenv_path": "~/ensi_workspaces/{ws_id}/{task_id}/",
    "context_files": ["AGENT.md", "ISSUE.md", "PIPELINE.md", "REPOS.md"],
    "polling_interval_ms": 3000
  },
  "auth": {
    "mechanisms": ["JWT HS256", "PAT ens_*", "Daemon Token edt_*"]
  },
  "adr": [],
  "technical_risks": [],
  "open_items": [
    "SP-01 API key validation pendente — rodar antes do Week 3"
  ]
}
```

### Narrativo (Markdown — salvar em `_bmad/docs/architecture.md`)

Documento completo com diagramas Mermaid, ADRs, trade-offs e guia de implementação por crate.

---

## Critérios de Aceite

- [ ] `architecture-artifact.json` completo e schema-compliant
- [ ] Cargo workspace definido com todas as crates e responsabilidades
- [ ] Pipeline FSM com estados, transições, guards e retry policy (SP-01)
- [ ] `AgentExecutor` trait com model selection por stage e schema preprocessing
- [ ] SurrealDB schema com todas as tabelas do MVP
- [ ] API surface completa (REST + WebSocket + NATS)
- [ ] Frontend scope alinhado com constraints do SP-02 (click-to-move, WASM budget)
- [ ] 5 ADRs obrigatórios documentados (incluindo ADR-001 a ADR-005)
- [ ] Open item SP-01 API key registrado explicitamente
- [ ] `architecture.md` narrativo com diagramas Mermaid

---

## Próximo Stage após conclusão

**Development** — Scrum Master recebe `_bmad/docs/architecture-artifact.json` para gerar o `SprintPlanArtifact`.

---

## Referências

- Input primário: `_bmad/docs/prd-artifact.json`
- SP-01 result: `_bmad/spikes/sp-01-result.md` + código em `_bmad/spikes/sp-01/`
- SP-02 result: `_bmad/spikes/sp-02-result.md` + código em `_bmad/spikes/sp-02/`
- Spec técnica: `ensi-spec-v2.md`
- BMad Method: `_bmad/`

## Labels

`pipeline:architecture` · `agent:architect` · `priority:high` · `type:architecture` · `bmad:ap` · `v2`
