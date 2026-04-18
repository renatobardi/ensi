# SPP: Sprint Plan — Ensi v1

> **Pipeline Stage:** Development (Sprint Planning)
> **Agent Persona:** Scrum Master
> **Input:** `_bmad/docs/architecture-artifact.json` + `_bmad/docs/prd-artifact.json`
> **Expected Output:** `_bmad/docs/sprint-plan-artifact.json` + `_bmad/docs/sprint-plan.md`

---

## Contexto — O que o SysArch entregou

Arquitetura completa em `_bmad/docs/architecture-artifact.json`. Narrative em `_bmad/docs/architecture.md`.

### Decisões arquiteturais para respeitar no sprint plan

**Cargo workspace — 8 crates (ordem de dependência):**
```
ensi-core (ports/traits)
  ├── ensi-db       (SurrealDB adapter)
  ├── ensi-events   (NATS JetStream adapter)
  └── ensi-pipeline (FSM + artifact validation)
        ├── ensi-server   (Axum HTTP + WebSocket)
        ├── ensi-daemon   (task poller + execenv)
        └── ensi-frontend (Leptos SSR + WASM)
              └── ensi-cli
```

**Stack validada:**
- Rust + Axum 0.8 / Leptos SSR+WASM / SurrealDB 3.0 embedded / NATS JetStream embedded
- Gemini Flash → Discovery + Development stages
- Gemini Pro → Planning + Architecture stages
- AgentExecutor: retry loop max 3 + error injection (85–90% success rate)
- Board: click-to-move (DnD → v1.1, ADR-005)

**Open item obrigatório no plan:**
- OI-001: Validar métricas reais do Gemini (rodar SP-01 com API key antes do Week 3)

**Pipeline MVP — 5 stages:**
Discovery → Planning → Architecture → Development → Review

**NFRs a respeitar:**
- p95 < 5 min para Analyst task
- p95 < 20 min para pipeline completo

---

## Roadmap de referência (8 semanas)

| Semanas | Foco |
|---------|------|
| 1–2 | Foundation: Cargo workspace, SurrealDB schema, Axum base, NATS, auth, Leptos setup |
| 3–4 | Core: Issues, Agents, 13 Personas, Task queue, Daemon, Triggers, Board view |
| 5–6 | Pipeline & BMad: FSM, Artifacts, Pipeline View, Artifact Inspector, Code Reviewer |
| 7 | Polish: OI-001 validation, CLI, error handling, performance |
| 8 | Ship: Docs, security audit, release build, single binary validation |

---

## Tarefa do Scrum Master

### 1. Ler os inputs
Carrega `_bmad/docs/architecture-artifact.json` e `_bmad/docs/prd-artifact.json` antes de qualquer outra ação.

### 2. Quebrar o trabalho em tasks de implementação

Para cada crate do workspace, define as tasks com:
- Descrição clara do que implementar
- Dependências entre tasks (o que precisa estar pronto antes)
- Estimativa em dias (1 dev)
- Crate alvo
- Stage do pipeline que habilita (se aplicável)

### 3. Sequenciar as tasks respeitando dependências

`ensi-core` → `ensi-db` + `ensi-events` → `ensi-pipeline` → `ensi-server` + `ensi-daemon` → `ensi-frontend` → `ensi-cli`

### 4. Distribuir nas 8 semanas

Respeitando:
- Semanas 1–2: apenas Foundation (zero features de produto, só infraestrutura)
- OI-001 deve estar resolvido antes do início do Week 3
- Features must-have do PRD todas cobertas até Week 6
- Weeks 7–8 reservados para polish, docs e ship

### 5. Identificar riscos de schedule

Flags explícitas para tasks com dependências externas ou alta incerteza.

### 6. Produzir os artefatos de saída

---

## Output Esperado

### SprintPlanArtifact (JSON — salvar em `_bmad/docs/sprint-plan-artifact.json`)

```json
{
  "version": "1.0",
  "product_name": "Ensi",
  "scope": "v1",
  "total_weeks": 8,
  "open_items": [
    {
      "id": "OI-001",
      "description": "Validar métricas reais Gemini API com GEMINI_API_KEY antes do Week 3",
      "owner": "Backend Dev",
      "deadline": "end of Week 2"
    }
  ],
  "weeks": [
    {
      "week": 1,
      "theme": "...",
      "tasks": [
        {
          "id": "T-001",
          "title": "...",
          "description": "...",
          "crate": "ensi-core",
          "estimate_days": 1,
          "depends_on": [],
          "assignee_persona": "Backend Dev | Frontend Dev | Fullstack Dev",
          "risk": "low|medium|high"
        }
      ]
    }
  ],
  "milestones": [
    {
      "week": 2,
      "name": "Foundation complete",
      "gate": "Cargo workspace compila, SurrealDB up, auth funcionando, OI-001 resolvido"
    },
    {
      "week": 4,
      "name": "Core complete",
      "gate": "Issues CRUD, daemon roda task, 13 personas configuradas"
    },
    {
      "week": 6,
      "name": "Pipeline complete",
      "gate": "FSM roda pipeline completo Discovery→Review com artifacts validados"
    },
    {
      "week": 8,
      "name": "Ship",
      "gate": "Single binary, docs completos, security OK, release build"
    }
  ],
  "risks": [
    {
      "risk": "...",
      "probability": "low|medium|high",
      "impact": "low|medium|high",
      "mitigation": "..."
    }
  ]
}
```

### Narrativo (Markdown — salvar em `_bmad/docs/sprint-plan.md`)

Documento completo com tabela de tasks por semana, dependências visuais e critérios de cada milestone.

---

## Critérios de Aceite

- [ ] `sprint-plan-artifact.json` completo e schema-compliant
- [ ] Todas as tasks das 8 crates cobertas
- [ ] OI-001 explicitamente alocado no Week 2 com owner e deadline
- [ ] Dependências entre tasks declaradas (sem task órfã)
- [ ] 4 milestones com gates claros (Week 2, 4, 6, 8)
- [ ] Todas as 7 features must-have do PRD cobertas até Week 6
- [ ] Features should/could claramente identificadas como pós-Week 6 ou v1.1
- [ ] Riscos de schedule documentados
- [ ] `sprint-plan.md` narrativo com tabela de tasks por semana

---

## Próximo Stage após conclusão

**Development** — Backend Dev, Frontend Dev e Fullstack Dev recebem `_bmad/docs/sprint-plan-artifact.json` e começam a implementação pela Week 1.

---

## Referências

- Input primário: `_bmad/docs/architecture-artifact.json`
- ADRs: `_bmad/docs/architecture.md`
- PRD: `_bmad/docs/prd-artifact.json`
- SP-01 result: `_bmad/spikes/sp-01-result.md`
- SP-02 result: `_bmad/spikes/sp-02-result.md`
- BMad Method: `_bmad/`

## Labels

`pipeline:development` · `agent:scrum-master` · `priority:high` · `type:sprint-plan` · `bmad:spp`
