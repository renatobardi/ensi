# AP: System Architecture — Ensi v1

> **Pipeline Stage:** Architecture
> **Agent Persona:** Architect (SysArch)
> **Input:** `_bmad/docs/prd-artifact.json` + `_bmad/docs/product-prd.md`
> **Expected Output:** `_bmad/docs/architecture-artifact.json` + `_bmad/docs/architecture.md`

---

## Contexto — O que o Curly (PM) entregou

O Planning stage foi concluído. Os artefatos estão em:

- `_bmad/docs/prd-artifact.json` — PrdArtifact JSON (schema-compliant)
- `_bmad/docs/product-prd.md` — PRD narrativo com Gherkin acceptance criteria
- `_bmad/status.md` — Pipeline status atualizado

### Decisões críticas do PRD para respeitar

**Pipeline MVP — 5 stages apenas:**
Discovery → Planning → Architecture → Development → Review

**2 validation spikes que gateiam o build:**
- SP-01: ACP + integração com Multica
- SP-02: BMad prompt portability

**10 features (7 must / 2 should / 1 could)**

**5 artifact schemas já definidos e fechados:**
- BriefArtifact, PrdArtifact, ArchitectureArtifact, SprintPlanArtifact, CodeReviewArtifact

**NFRs com targets mensuráveis:**
- p95 < 5 min para Analyst task
- p95 < 20 min para pipeline completo

**Explicitamente fora de scope v1:**
Deploy stage, Observability stage, Agent Memory (vector search), Tech Writer / Data Engineer / UX Designer, Multi-LLM

---

## Stack Técnica Definida

| Camada | Tecnologia | Constraint |
|--------|-----------|------------|
| Backend | Rust (Axum 0.8+) | Hexagonal architecture |
| Frontend | Leptos (SSR + WASM) | Leptos spike em Week 1 (SP-02) |
| Database | SurrealDB 3.0 embedded | Zero external process |
| Messaging | NATS embedded | Decouples server ↔ daemon |
| LLM | Gemini API | Único provider no v1 |
| Auth | JWT (HS256) + PAT | Prefix `ens_` |
| Deploy | Single binary | Zero setup |

---

## Tarefa do SysArch

### 1. Ler o input
Carrega `_bmad/docs/prd-artifact.json` como input primário antes de qualquer outra ação.

### 2. Definir a arquitetura do sistema

Cobre obrigatoriamente:

- **Cargo workspace** — crates e suas responsabilidades
- **Hexagonal architecture** — ports & adapters por crate
- **Pipeline FSM** — estados, transições, eventos (Rust enums)
- **SurrealDB schema** — todas as tabelas do MVP (SurrealQL)
- **NATS subject hierarchy** — `ensi.*` subjects
- **API surface** — REST endpoints + WebSocket events
- **Daemon architecture** — task lifecycle, execenv isolation
- **Auth flow** — JWT + PAT + Daemon Token

### 3. Definir o ArchitectureArtifact

O schema já foi definido pelo PM. Preenche todos os campos obrigatórios.

### 4. Identificar riscos técnicos e mitigações

Foco nos riscos da stack (Leptos WASM complexity, SurrealDB embedded constraints, Gemini API latency para NFRs).

### 5. Produzir os artefatos de saída

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
    ]
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
    "rest_endpoints": [
      {
        "method": "GET|POST|PUT|DELETE|PATCH",
        "path": "...",
        "auth": "jwt|pat|public",
        "request": "...",
        "response": "..."
      }
    ],
    "websocket_events": ["..."],
    "nats_subjects": ["..."]
  },
  "daemon": {
    "task_lifecycle": "...",
    "execenv_isolation": "...",
    "polling_interval_ms": 3000
  },
  "auth": {
    "mechanisms": ["JWT HS256", "PAT ens_*", "Daemon Token edt_*"],
    "flows": ["..."]
  },
  "technical_risks": [
    {
      "risk": "...",
      "probability": "low|medium|high",
      "impact": "low|medium|high",
      "mitigation": "...",
      "spike": "SP-01|SP-02|null"
    }
  ],
  "adr": [
    {
      "id": "ADR-001",
      "title": "...",
      "status": "accepted",
      "context": "...",
      "decision": "...",
      "consequences": "..."
    }
  ]
}
```

### Narrativo (Markdown — salvar em `_bmad/docs/architecture.md`)

Documento completo com diagramas (ASCII ou Mermaid), decisões arquiteturais (ADRs), trade-offs e guia de implementação por crate.

---

## Critérios de Aceite

- [ ] `architecture-artifact.json` completo e schema-compliant
- [ ] Cargo workspace definido com todas as crates e suas responsabilidades
- [ ] Pipeline FSM com todos os estados, transições e guards especificados
- [ ] SurrealDB schema com todas as tabelas do MVP (campos, indexes, relações)
- [ ] API surface completa (REST + WebSocket + NATS subjects)
- [ ] Daemon task lifecycle e execenv isolation especificados
- [ ] Pelo menos 3 ADRs documentando decisões críticas
- [ ] Riscos técnicos da stack abordados com mitigação e referência aos spikes
- [ ] NFRs de performance mapeados para decisões arquiteturais (p95 < 5 min Analyst, < 20 min pipeline)
- [ ] `architecture.md` narrativo com diagramas

---

## Próximo Stage após conclusão

**Development** — Scrum Master recebe `_bmad/docs/architecture-artifact.json` para gerar o `SprintPlanArtifact` e quebrar em tasks de implementação.

---

## Referências

- Input primário: `_bmad/docs/prd-artifact.json`
- PRD narrativo: `_bmad/docs/product-prd.md`
- Brief: `_bmad/docs/brief-artifact.json`
- Spec técnica: `ensi-spec-v2.md`
- Reference architecture: `multica-codebase-analysis.md`
- BMad Method: `_bmad/`
- Axum docs: https://docs.rs/axum
- SurrealDB docs: https://surrealdb.com/docs
- Leptos docs: https://leptos.dev
- NATS docs: https://nats.io

## Labels

`pipeline:architecture` · `agent:architect` · `priority:high` · `type:architecture` · `bmad:ap`
