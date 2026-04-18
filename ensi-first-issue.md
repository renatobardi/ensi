---

# BP: Project Discovery & Brief — Ensi v1

## Título

BP: Project Discovery & Brief — Ensi v1

## Descrição

### Contexto do Projeto

**Ensi** é uma plataforma open-source de project management com AI agents como cidadãos de primeira classe. O diferencial do Ensi é o **pipeline estruturado**: ao invés de agents recebendo tarefas arbitrárias, o trabalho flui por estágios definidos (Discovery → Planning → Architecture → Sprint Planning → Development → Review → QA → Deployment) com 13 personas especializadas e artefatos validados por schema JSON em cada etapa.

### Visão do Produto

**Tagline:** AI-native project management with structured pipelines.

O Ensi resolve um problema específico: equipes modernas com AI agents não têm como coordenar múltiplos especialistas (Analyst, PM, Architect, Dev, QA) de forma estruturada. Cada agent trabalha isoladamente, sem saber o que o anterior produziu, sem validar seus outputs, e sem deixar contexto para projetos futuros.

O Ensi cria essa coordenação com:

1. **Pipeline Orchestrator (BMad FSM)** — State machine que guia o fluxo estágio a estágio
2. **13 Personas Especializadas** — Agents pré-configurados com system prompts e output schemas:
   - **Sequenciais**: Analyst, PM, Architect, Scrum Master, Frontend Dev, Backend Dev, Fullstack Dev, QA Engineer, DevOps/Infra
   - **Transversais** (qualquer estágio): Code Reviewer, Tech Writer, Data Engineer, UX Designer
3. **Structured Outputs** — Cada artefato (Brief, PRD, Arch Doc, Sprint Plan, etc.) tem schema JSON validado obrigatoriamente
4. **Agent Memory** — Vector search: agents acessam contexto de projetos anteriores
5. **OpenTelemetry nativo** — Traces de execução, métricas de pipeline
6. **Self-contained** — SurrealDB embedded + NATS embedded, um binário, zero setup

### Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Backend | Rust (Axum 0.8+) |
| Frontend | Leptos (SSR + WASM) |
| Database | SurrealDB 3.0 embedded |
| Messaging | NATS embedded |
| LLM default | Gemini API |
| Observabilidade | OpenTelemetry |
| UI System | W3C Design Tokens (DTCG) + Calm UI |
| Arquitetura | Hexagonal + Event-driven |

### Pipeline Completo

```
SEQUENTIAL:
Analyst → PM → Architect → Scrum Master →
[Frontend Dev || Backend Dev || Fullstack Dev] → Code Reviewer →
QA Engineer → DevOps/Infra → Complete

TRANSVERSAL (any stage):
Code Reviewer  — PR reviews, code quality audits
Tech Writer    — Docs, READMEs, API docs, changelogs
Data Engineer  — Data models, schemas, data pipelines
UX Designer    — UI/UX, wireframes, user flows
```

### Roadmap

8 semanas de desenvolvimento, organizado em:
- Semanas 1-2: Foundation (Cargo workspace, SurrealDB schema, Axum, NATS, auth, Leptos)
- Semanas 3-4: Core features (Issues, Agents, 13 Personas, Task queue, Daemon, Triggers, Board view)
- Semanas 5-6: Pipeline & BMad (FSM, Artifacts, Pipeline View, Artifact Inspector, transversal agents)
- Semana 7: Memory, Observabilidade, Autopilots, Chat
- Semana 8: Polish, Docs, Security, Ship

### Escopo desta Issue

Mary (Analyst), como primeira persona do pipeline, deve:

1. **Analisar** a visão do produto descrita acima e os documentos de referência
2. **Identificar** stakeholders, personas de usuário e seus problemas reais
3. **Refinar** a proposta de valor — o que exatamente o Ensi resolve que outros não resolvem
4. **Mapear** features para o MVP com classificação must/should/could
5. **Identificar** constraints, assumptions e riscos do projeto
6. **Produzir** o **Project Brief** no formato `BriefArtifact` (JSON schema obrigatório)

### Output Esperado (BriefArtifact)

```json
{
  "project_name": "Ensi",
  "problem_statement": "...",
  "target_users": [
    {
      "persona": "...",
      "needs": ["..."]
    }
  ],
  "key_features": [
    {
      "name": "...",
      "description": "...",
      "priority": "must|should|could"
    }
  ],
  "success_metrics": ["..."],
  "constraints": ["..."],
  "assumptions": ["..."],
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

### Perguntas que Mary deve responder

1. Quem são os early adopters do Ensi? Que tamanho de equipe? Que tipo de projeto?
2. Qual é a diferença real entre ter um pipeline estruturado vs. um board Kanban genérico?
3. O que faz um Dev querer usar 13 agents especializados vs. um agent genérico?
4. Quais features do pipeline são must para o MVP vs. nice-to-have?
5. Quais os maiores riscos técnicos e de produto?

### Critérios de Aceite

- [ ] BriefArtifact no formato JSON schema completo (todos os campos required preenchidos)
- [ ] Pelo menos 3 target user personas identificadas com needs específicos
- [ ] Features classificadas em must/should/could com justificativa clara
- [ ] Diferenciação clara Ensi vs. Linear, GitHub Projects, Jira (sem AI agents nativos)
- [ ] Diferenciação clara Ensi vs. chat-only AI tools (sem structured pipeline)
- [ ] Riscos técnicos específicos da stack (Rust + Leptos + SurrealDB) abordados
- [ ] MVP scope validado como executável em 8 semanas

## Workflow

**Trigger:** BP (Brainstorm / Create Brief)

**Pipeline Stage:** Discovery

**Agent Persona:** Analyst

**Expected Output:** BriefArtifact (JSON, validado contra BriefSchema)

**Próximo Stage após conclusão:** Planning (PM assume com base no Brief)

## Referências

- Ensi spec v2: `ensi-spec-v2.md`
- Ensi reference architecture: `multica-codebase-analysis.md`
- BMad Method: `_bmad/`
- SurrealDB docs: https://surrealdb.com/docs
- Axum docs: https://docs.rs/axum
- Leptos docs: https://leptos.dev
- NATS docs: https://nats.io
- OpenTelemetry Rust: https://opentelemetry.io/docs/languages/rust/

## Labels

- `pipeline:discovery`
- `agent:analyst`
- `priority:high`
- `type:brief`
- `bmad:bp`
