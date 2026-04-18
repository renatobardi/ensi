# Sprint Plan — Ensi v1

> **Produzido por:** SM (Scrum Master)
> **Data:** 2026-04-17
> **Versão:** 1.0
> **Inputs:** `_bmad/docs/architecture-artifact.json`, `_bmad/docs/prd-artifact.json`
> **Outputs:** `_bmad/docs/sprint-plan-artifact.json` (este documento é o narrativo)

---

## Visão Geral

Ensi v1 é uma plataforma de pipeline de planejamento orientada a agentes, construída em **Rust puro** com 8 crates organizados como Cargo workspace. O plano distribui a implementação em **8 semanas** com 4 milestones de gate explícitos: Foundation (Week 2), Core (Week 4), Pipeline (Week 6) e Ship (Week 8).

**Stack validada:**
- Runtime: Rust + Cargo workspace (8 crates)
- HTTP: Axum 0.8
- Frontend: Leptos 0.7 SSR + WASM
- Database: SurrealDB 3.0 embedded (sem processo separado)
- Mensageria: NATS JetStream embedded
- LLM: Gemini 2.0 Flash (Discovery/Development/Review) + Gemini 2.5 Pro (Planning/Architecture)

---

## Open Items

| ID | Descrição | Owner | Deadline | Status |
|----|-----------|-------|----------|--------|
| OI-001 | Validar modelos Gemini (2.0-flash + 2.5-pro) em todos 5 stages — latência, qualidade, fallbacks | Backend Dev | **End of Week 2** | **BLOCKER para Week 3** |
| OI-002 | SprintPlanArtifact e CodeReviewArtifact schemas — SM define Sprint, Dev define CodeReview | Backend Dev | End of Week 6 | |

> **CRÍTICO:** OI-001 (T-008) é **hard blocker** para Week 3. Se validação falhar ou revelar problemas:
> - **Resultado obrigatório** até 30-ago-2026 (fim Week 2)
> - **Não iniciar T-009 a T-012 (Week 3)** até resolução ou escalation com plano B
> - Planos B: fallback gemini-1.5-pro, simplificar schemas, ajustar prompts, ou mudar provider

---

## Dependências entre Crates

```
ensi-core (ports/traits)
  ├── ensi-db       (SurrealDB adapter)
  ├── ensi-events   (NATS JetStream adapter)
  └── ensi-pipeline (FSM + artifact validation)
        ├── ensi-server   (Axum HTTP + WebSocket)
        ├── ensi-daemon   (task poller + execenv + AgentExecutor)
        └── ensi-frontend (Leptos SSR + WASM)
              └── ensi-cli
```

A sequência de implementação respeita essa hierarquia: `ensi-core` → `ensi-db` + `ensi-events` → `ensi-pipeline` → `ensi-server` + `ensi-daemon` → `ensi-frontend` → `ensi-cli`.

---

## Semana 1 — Foundation: Workspace, Core Domain, DB Schema

**Theme:** Estrutura base do Cargo workspace, entidades de domínio e schema do banco.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-001 | Cargo workspace scaffold + CI | workspace | 1 | Fullstack Dev | low | — |
| T-002 | ensi-core: entidades de domínio | ensi-core | 2 | Backend Dev | low | T-001 |
| T-003 | ensi-core: port traits (hexagonal inner layer) | ensi-core | 1 | Backend Dev | low | T-002 |
| T-004 | ensi-db: SurrealDB 3.0 embedded init + schema | ensi-db | 2 | Backend Dev | medium | T-003 |

**Total estimado:** 6 dias-dev

**Entrega ao final da semana:** Cargo workspace compila com `cargo check`. SurrealDB embedded inicializa com schema SCHEMAFULL para as 12 tabelas. ensi-core tem todos os tipos de domínio e traits definidos.

---

## Semana 2 — Foundation: NATS, Auth, Axum Base, OI-001 **BLOCKER**

**Theme:** Infraestrutura de comunicação, autenticação e **validação crítica dos modelos Gemini**.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-005 | ensi-events: NATS JetStream embedded + EventPublisher | ensi-events | 1 | Backend Dev | medium | T-003 |
| T-006 | ensi-server: Axum 0.8 base + auth middleware JWT/PAT/DaemonToken | ensi-server | 2 | Backend Dev | low | T-004, T-005 |
| T-007 | ensi-server: endpoints de auth | ensi-server | 1 | Backend Dev | low | T-006 |
| T-008 | **OI-001 BLOCKER** — Validar modelos Gemini (latência + qualidade + fallbacks) | ensi-daemon | **2** | Backend Dev | **critical** | T-001 |

**Total estimado:** 6 dias-dev

**Gate Milestone (Week 2):** Cargo workspace compila, SurrealDB up, NATS up, auth middleware funcional (JWT/PAT/DaemonToken), **OI-001 RESOLVIDO (métricas reais documentadas + plano B se necessário)**. **SEM T-008 SUCESSO = WEEK 3 CANCELADA até resolução.**

---

## Semana 3 — Core: ensi-db Adapters + APIs Workspace/Agent/Project **[Depende de T-008 passar]**

**Theme:** Adapters do banco completos e endpoints REST iniciais. **NÃO INICIAR até T-008 (OI-001) resolvido com sucesso.**

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-009 | ensi-db: adapters Issue/Project/Workspace/Member repositories | ensi-db | 2 | Backend Dev | low | **T-008**, T-004 |
| T-010 | ensi-db: adapters Agent/Task/Artifact/Pipeline repositories | ensi-db | 2 | Backend Dev | low | T-009 |
| T-011 | ensi-server: Workspace, Member, Project REST endpoints | ensi-server | 1 | Backend Dev | low | T-007, **T-008**, T-009 |
| T-012 | ensi-server: Agent REST endpoints | ensi-server | 1 | Backend Dev | low | T-011 |

**Total estimado:** 6 dias-dev (adiável se T-008 falhar)

**Condição de início:** ✅ T-008 passou validação com métricas aceitáveis OU ✅ Plano B aprovado (fallback model + risco mitigado)

**Entrega (se aprovado):** Todos os 8 adapters SurrealDB com testes. APIs workspace, project, member, agent funcionando.

---

## Semana 4 — Core: Issues API, Daemon Bootstrap, Frontend Scaffold

**Theme:** API de issues completa, daemon recebendo tasks, frontend Leptos inicial.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-013 | ensi-server: Issue CRUD + Comment endpoints | ensi-server | 2 | Backend Dev | low | T-010, T-012 |
| T-014 | ensi-daemon: task poller + execenv lifecycle | ensi-daemon | 2 | Backend Dev | medium | T-008, T-013 |
| T-015 | ensi-frontend: Leptos 0.7 SSR + WASM scaffold | ensi-frontend | 3 | Frontend Dev | medium | T-007 |

**Total estimado:** 7 dias-dev

**Gate Milestone (Week 4):** Todos os endpoints REST funcionando (workspaces, projects, issues, comments, agents, auth). ensi-db adapters completos com testes. Daemon recebe task via NATS e cria execenv. Leptos app faz login e exibe issues.

---

## Semana 5 — Pipeline: FSM, WebSocket Hub, Issue Board

**Theme:** Core do pipeline — máquina de estados, WebSocket e board interativo.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-016 | ensi-pipeline: FSM + artifact validation | ensi-pipeline | 3 | Backend Dev | **high** | T-010, T-014 |
| T-017 | ensi-server: WebSocket hub + pipeline/task/artifact REST endpoints | ensi-server | 2 | Backend Dev | medium | T-013, T-016 |
| T-018 | ensi-frontend: Issue Board (click-to-move) com WebSocket | ensi-frontend | 3 | Frontend Dev | medium | T-015, T-017 |

**Total estimado:** 8 dias-dev

**Entrega:** FSM com transições completas. WebSocket broadcast funcional. Issue Board com click-to-move (ADR-005 — sem DnD).

---

## Semana 6 — BMad: AgentExecutor (Gemini), Daemon Tokens, Pipeline View, CLI

**Theme:** Integração Gemini completa — pipeline end-to-end funciona com LLM real.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-019 | ensi-daemon: AgentExecutor — Gemini API + retry loop | ensi-daemon | 3 | Backend Dev | **high** | T-016, T-008 |
| T-020 | ensi-daemon: DaemonToken lifecycle + daemon REST endpoints | ensi-daemon | 1 | Backend Dev | low | T-019, T-017 |
| T-021 | ensi-frontend: Pipeline View + Issue Detail + Task Feed | ensi-frontend | 3 | Frontend Dev | medium | T-018, T-020 |
| T-022 | ensi-cli: comandos de workspace, issue, pipeline e PAT | ensi-cli | 2 | Fullstack Dev | low | T-013, T-017 |

**Total estimado:** 9 dias-dev

**Gate Milestone (Week 6):** FSM roda pipeline completo Discovery→Review com Gemini real. Artifacts validados por schema. WebSocket broadcast funcional. Pipeline View e Task Feed visíveis no browser. CLI `ensi` operacional.

---

## Semana 7 — Polish: OI-001 Validation, Error Handling, Task Feed, Integration Tests

**Theme:** Validação end-to-end, hardening de erros e cobertura de testes.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-023 | OI-001 — Validação end-to-end pipeline completo | ensi-daemon | 1 | Backend Dev | medium | T-019, T-020, T-021 |
| T-024 | Error handling hardening + Blocked state UI | ensi-server | 2 | Backend Dev | low | T-023 |
| T-025 | ensi-frontend: Agent Task Feed view completo | ensi-frontend | 2 | Frontend Dev | low | T-021 |
| T-026 | Suite de testes de integração | workspace | 2 | Fullstack Dev | medium | T-024 |

**Total estimado:** 7 dias-dev

**Entrega:** NFR-01 e NFR-02 validados (p95 latência). Erros estruturados em todos os endpoints. Task Feed com coloring por role. Suite de integração passando no CI.

---

## Semana 8 — Ship: Security, Single Binary, Docs, Release

**Theme:** Auditoria de segurança, build de release e publicação v1.0.

| ID | Tarefa | Crate | Dias | Assignee | Risco | Depende de |
|----|--------|-------|------|----------|-------|------------|
| T-027 | Security audit | workspace | 1 | Backend Dev | low | T-026 |
| T-028 | Single binary validation + release build | workspace | 1 | Fullstack Dev | medium | T-027 |
| T-029 | Documentação — README, quickstart, API reference, CHANGELOG | workspace | 2 | Fullstack Dev | low | T-028 |
| T-030 | GitHub Release v1.0 | workspace | 1 | Fullstack Dev | low | T-029 |

**Total estimado:** 5 dias-dev

**Gate Milestone (Week 8):** Single binary macOS+Linux. Docs completos. Security audit aprovado. GitHub Release v1.0 publicado.

---

## Milestones

| Week | Nome | Gate |
|------|------|------|
| 2 | Foundation complete | Cargo workspace compila, SurrealDB up, NATS up, auth middleware funcional, OI-001 resolvido |
| 4 | Core complete | REST API completa, ensi-db adapters com testes, daemon recebe tasks, Leptos app com login |
| 6 | Pipeline complete | FSM end-to-end com Gemini real, artifacts validados, Pipeline View e CLI funcionando |
| 8 | Ship | Single binary, docs, security audit OK, GitHub Release v1.0 |

---

## Grafo de Dependências (Caminho Crítico)

```
T-001 → T-002 → T-003 → T-004 → T-009 → T-010 → T-016 → T-019 → T-020 → T-023 → T-024 → T-026 → T-027 → T-028 → T-029 → T-030
                       ↓
                      T-005
                       ↓
                      T-006 → T-007 → T-011 → T-012 → T-013 → T-014 → T-015
                                                               ↓        ↓
                                                              T-017 → T-018 → T-021 → T-025
                                                                       ↓
                                                                      T-022
```

**Caminho crítico:** T-001 → T-002 → T-003 → T-004 → T-009 → T-010 → T-016 → T-019 → T-020 → T-023 → T-024 → T-026 → T-027 → T-028 → T-029 → T-030

**Tarefas de maior risco no caminho crítico:**
- T-016 (FSM — Week 5, high risk): bloqueante para toda integração Gemini
- T-019 (AgentExecutor — Week 6, high risk): integração Gemini + retry loop
- T-008/T-023 (OI-001 — Week 2 e 7): validação de latência real

---

## Estimativa de Esforço por Semana

| Semana | Dias-dev Backend | Dias-dev Frontend | Dias-dev Fullstack | Total |
|--------|-----------------|-------------------|---------------------|-------|
| 1 | 5 | 0 | 1 | 6 |
| 2 | 5 | 0 | 0 | 5 |
| 3 | 6 | 0 | 0 | 6 |
| 4 | 4 | 3 | 0 | 7 |
| 5 | 5 | 3 | 0 | 8 |
| 6 | 4 | 3 | 2 | 9 |
| 7 | 3 | 2 | 2 | 7 |
| 8 | 1 | 0 | 4 | 5 |
| **Total** | **33** | **11** | **9** | **53** |

---

## Cobertura de Requisitos (Traceability Matrix)

### Features Must-Have (cobertas até Week 6)

| Feature | Descrição | Tasks |
|---------|-----------|-------|
| F-001 | ACP-Compatible Agent Interface | T-014, T-019, T-020 |
| F-002 | Analyst Stage — Clarifying Dialogue + product-brief.md | T-016, T-019 |
| F-003 | PM Stage — PRD com Acceptance Criteria | T-016, T-019 |
| F-004 | Architect Stage — ADR | T-016, T-019 |
| F-005 | Schema-Validated Artifact Handoffs | T-016, T-019 |
| F-006 | Human-in-the-Loop Review Gate | T-013, T-017 (comments), T-016 (unblock) |
| F-007 | Session State Persistence and Resumption | T-010 (PipelineRepository), T-016 (FSM state) |

### Features Should-Have

| Feature | Descrição | Status |
|---------|-----------|--------|
| F-008 | Zero-Config Onboarding | T-029 (docs), T-022 (CLI) — Week 6-8 |
| F-009 | Stage Completion Notifications | T-024 (error comments), T-020 (artifact submit) |
| F-010 | Pipeline Status Visibility | T-017 (pipeline endpoints), T-021 (Pipeline View) |

### Functional Requirements

| FR | Descrição | Tasks |
|----|-----------|-------|
| FR-01 | ACP-compatible agent interface | T-014, T-019 |
| FR-02 | Receber task payload do daemon (BP-tagged) | T-014 |
| FR-03 | Comentar na issue em completions/failures | T-020, T-024 |
| FR-04 | Atualizar status da issue (in_progress, blocked, done) | T-017, T-020 |
| FR-05 | Executar stage Discovery primeiro | T-016 |
| FR-06 | Executar stage Planning após Discovery + aprovação | T-016 |
| FR-07 | Executar stage Architecture após Planning + aprovação | T-016 |
| FR-08 | Validar output contra schema; retry até 3x | T-019 (retry loop) |
| FR-09 | Pausar entre stages aguardando aprovação humana | T-016 (FSM guard), T-013 (comment API) |
| FR-10 | Armazenar artifacts em .ensi/docs/ | T-020 (artifact submit) |
| FR-11 | Commit artifacts no repo do projeto | T-020 |
| FR-12 | Filenames consistentes e previsíveis | T-019 |
| FR-13 | Persistir session state após cada transição | T-016, T-010 |
| FR-14 | Retomar sessão do último stage completo | T-016 |
| FR-15 | Suportar sessões concorrentes sem interferência | T-014 (execenv isolado por task_id) |
| FR-16 | Instalação com comando único | T-029, T-022 |
| FR-17 | Error claro se GEMINI_API_KEY não configurado | T-024 |

### Non-Functional Requirements

| NFR | Descrição | Tasks | Status |
|-----|-----------|-------|--------|
| NFR-01 | Analyst p95 < 5min | T-008, T-023 | Validado em OI-001 |
| NFR-02 | Pipeline completo p95 < 20min | T-023 | Validado em OI-001 |
| NFR-03 | Setup < 10min do zero | T-029 (quickstart) | Week 8 |
| NFR-04 | < 5% sessions precisam restart por erro do agente | T-019 (retry), T-024 (error handling) | Week 6-7 |
| NFR-05 | >= 80% sessions produzem 3 artifacts sem intervenção | T-016, T-019 | Week 6 |
| NFR-06 | Exponential backoff + max 3 retries para erros Gemini | T-019, T-024 | Week 6-7 |
| NFR-07 | API keys nunca em disco/logs/artifacts | T-019, T-027 | Week 6+8 |
| NFR-08 | Sem PII em artifacts além do input do usuário | T-027 | Week 8 |
| NFR-09 | Sem telemetria third-party sem opt-in | T-027 | Week 8 |
| NFR-12 | Todas transições/retries/errors em logs com ISO 8601 | T-024 | Week 7 |
| NFR-13 | Issue sempre reflete estado do pipeline | T-017, T-020, T-024 | Week 5-7 |

---

## Riscos de Schedule

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Gemini p95 > NFR (> 5min Analyst, > 20min pipeline) | medium | high | OI-001 valida na Week 2. Se violado: simplificar artifact schemas ou fallback Flash para todos os stages |
| SurrealDB 3.0 embedded instabilidade | low | high | SCHEMAFULL + health check. Fallback: SurrealDB 2.x ou SQLite+serde_json |
| Leptos reactive model causa slip | medium | medium | 3-4 dias onboarding no início da Week 4; LOC budget ajustado +30% |
| NATS JetStream embedded behavior inesperado | low | medium | Implementação isolada em ensi-events com testes. Fallback: polling SurrealDB |
| Gemini structured output > 15% falhas | low | medium | ADR-003: retry com error injection. Schema preprocessing para reduzir falhas |

---

## Features Pós-Week 6 / v1.1

As seguintes features do PRD foram identificadas como pós-MVP ou v1.1:

- **DnD board** — aguarda biblioteca Leptos madura (ADR-005)
- **Deploy stage** — deferred to v2
- **Agent Memory (vector search)** — deferred to v2
- **Multi-LLM support** — apenas Gemini API em v1
- **Brownfield analysis** — requer spike separado
- **Billing / per-token metering** — usuário usa own API key
- **Slack / email notifications** — Multica issue comments suficientes para MVP
- **Automated sprint planning** — requer integração mais profunda com Multica board (irônico!)

---

## Próximos Passos

Sprint Plan concluído. Atribuir tasks às semanas no Multica board:

1. **Backend Dev** → Tasks de ensi-core, ensi-db, ensi-events, ensi-pipeline, ensi-server, ensi-daemon (Weeks 1–7)
2. **Frontend Dev** → Tasks de ensi-frontend (Weeks 4–7)
3. **Fullstack Dev** → Tasks de ensi-cli, workspace (Weeks 1, 6–8)

**Ação imediata:** Iniciar T-008 (OI-001) junto com T-001 na Week 1 para ter resultados de latência disponíveis antes do fim da Week 2.
