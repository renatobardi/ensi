# Ensi — Reference Architecture

> Documento de referência de arquitetura, decisões de design e modelos de dados do Ensi.

## 1. Architecture Overview

### Visão do Sistema

Ensi é uma plataforma AI-native de project management onde agents são cidadãos de primeira classe. O Ensi organiza o trabalho em um **pipeline estruturado** com personas especializadas, artefatos validados e memória semântica cross-project.

**Público-alvo:** Equipes de desenvolvimento de 2-15 pessoas que trabalham com AI agents  
**LLM default:** Gemini API (extensível para outros providers)  
**Deployment:** Self-hosted, self-contained — zero dependências externas além do binário

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Leptos)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Issues   │ │ Pipeline │ │ Agents   │ │ Artifact │       │
│  │ Board    │ │ View     │ │ Config   │ │ Inspector│       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       └─────────────┴────────────┴─────────────┘              │
│                         │ WebSocket + REST                    │
└─────────────────────────┼─────────────────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────────────────┐
│                    BACKEND (Axum)                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Handlers │→ │ Services │→ │ SurrealDB│→ │ Domain   │     │
│  │ (Axum)   │  │ (Domain) │  │ Queries  │  │ Events   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│       │                                          │            │
│  ┌──────────┐  ┌──────────┐                     │            │
│  │ NATS     │→ │ WS Hub   │←────────────────────┘            │
│  │ EventBus │  │ (rooms)  │                                   │
│  └──────────┘  └──────────┘                                   │
└───────────────────────┬───────────────────────────────────────┘
                        │ NATS / HTTP (poll, claim, report)
┌───────────────────────┼───────────────────────────────────────┐
│                  DAEMON (Rust binary)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ NATS Sub │→ │ ExecEnv  │→ │ Agent    │                   │
│  │ + Poll   │  │ Prepare  │  │ Backend  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                   │                           │
│       ┌───────────────────────────┤                           │
│       │  Agent Providers          │                           │
│       │  Gemini API (default)     │                           │
│       │  Claude Code              │                           │
│       │  Codex / OpenCode         │                           │
│       │  Extensível via trait     │                           │
│       └───────────────────────────┘                           │
└───────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Backend | Rust (Axum 0.8+) | Performance, safety, single binary deployment |
| Frontend | Leptos (SSR + WASM) | Full-stack Rust, fine-grained signals, zero JS toolchain |
| Database | SurrealDB 3.0 embedded | Multi-model (doc + graph + vector), zero external process |
| Messaging | NATS embedded | Lightweight pub/sub, desacoplamento server ↔ daemon |
| LLM default | Gemini API | Structured output nativo, contextos grandes, custo otimizado |
| Observabilidade | OpenTelemetry | Traces de execução, métricas de pipeline |
| UI System | W3C Design Tokens (DTCG) | Tokenizado, Calm UI principles |

### Estrutura do Projeto (Cargo Workspace)

```
ensi/
├── crates/
│   ├── ensi-core/          # Domain entities, services, ports (traits)
│   ├── ensi-server/        # Axum HTTP server + WebSocket
│   ├── ensi-daemon/        # Daemon: poll, execenv, agent backends
│   ├── ensi-cli/           # CLI tool (Clap)
│   ├── ensi-db/            # SurrealDB adapter + schema migrations
│   ├── ensi-events/        # NATS event bus adapter
│   ├── ensi-pipeline/      # Pipeline FSM + artifact validation
│   ├── ensi-memory/        # Vector memory (embeddings + search)
│   └── ensi-frontend/      # Leptos SSR app
├── _bmad/                  # BMad Method definitions
├── ensi-spec-v2.md
├── ensi-first-issue.md
└── Cargo.toml
```

### Hexagonal Architecture

```
                    ┌─────────────────────┐
                    │    DOMAIN CORE       │
     ┌──────────────┤    (ensi-core)       ├──────────────┐
     │              │                      │              │
     │              │  Entities            │              │
     │              │  Value Objects       │              │
     │              │  Domain Services     │              │
     │              │  Pipeline FSM        │              │
     │              │  Ports (traits)      │              │
     │              └──────────────────────┘              │
     │                                                     │
┌────▼─────┐  ┌──────────┐  ┌──────────┐  ┌────────────▼──┐
│ HTTP     │  │ NATS     │  │ WebSocket│  │ CLI           │
│ (Axum)   │  │ Adapter  │  │ Adapter  │  │ Adapter       │
└──────────┘  └──────────┘  └──────────┘  └───────────────┘
     │              │              │              │
┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
│ SurrealDB│  │ NATS     │  │ OTel     │  │ LLM      │
│ Repo     │  │ EventBus │  │ Tracer   │  │ Provider │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## 2. Pipeline: Agentes e Estágios

### 2.1 Visão do Pipeline

```
SEQUENTIAL PIPELINE:
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  DISCOVERY  │──→│  PLANNING   │──→│ ARCHITECTURE│──→│   SPRINT    │
│             │   │             │   │             │   │  PLANNING   │
│ Analyst     │   │ PM          │   │ Architect   │   │ Scrum Master│
│             │   │             │   │             │   │             │
│ → Brief     │   │ → PRD       │   │ → Arch Doc  │   │ → Sprint    │
│             │   │ → Stories   │   │ → Tech Spec │   │   Plan      │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT                                   │
│                                                                      │
│  Frontend Dev ──┐                                                    │
│  Backend Dev  ──┼──→ [execução paralela] ──→ Code Reviewer          │
│  Fullstack Dev──┘                                                    │
│                                                                      │
│  → ImplementationReport + CodeReviewArtifact                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│     QA      │──→│  DEPLOYMENT │──→│  COMPLETE   │
│             │   │             │   │             │
│ QA Engineer │   │ DevOps/Infra│   │             │
│             │   │             │   │             │
│ → Test Rpt  │   │ → Deploy    │   │             │
└─────────────┘   └─────────────┘   └─────────────┘

TRANSVERSAL AGENTS (disponíveis em QUALQUER estágio via @mention ou trigger):
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Code Reviewer │  │ Tech Writer  │  │Data Engineer │  │ UX Designer  │
│              │  │              │  │              │  │              │
│PR reviews,   │  │Docs, READMEs,│  │Data models,  │  │UI/UX, wire-  │
│code quality  │  │API docs,     │  │schemas, data │  │frames, user  │
│audits        │  │changelogs    │  │pipelines     │  │flows         │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Tabela de Agentes

| Agente | Tipo | Stage | Artifact de saída |
|--------|------|-------|-------------------|
| Analyst | Sequential | Discovery | BriefArtifact |
| PM | Sequential | Planning | PrdArtifact, StoryArtifact[] |
| Architect | Sequential | Architecture | ArchitectureArtifact, TechSpecArtifact |
| Scrum Master | Sequential | SprintPlanning | SprintPlanArtifact |
| Frontend Dev | Sequential (paralelo) | Development | ImplementationReport |
| Backend Dev | Sequential (paralelo) | Development | ImplementationReport |
| Fullstack Dev | Sequential (paralelo) | Development | ImplementationReport |
| Code Reviewer | Sequential + Transversal | Review / any | CodeReviewArtifact |
| QA Engineer | Sequential | QualityAssurance | TestReportArtifact |
| DevOps / Infra | Sequential | Deployment | DeploymentArtifact |
| Tech Writer | Transversal | any | TechDocArtifact |
| Data Engineer | Transversal | any | DataModelArtifact |
| UX Designer | Transversal | any | DesignArtifact |

### 2.3 Pipeline FSM

```rust
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum PipelineStage {
    Discovery,
    Planning,
    Architecture,
    SprintPlanning,
    Development,
    Review,
    QualityAssurance,
    Deployment,
    Complete,
    Blocked { stage: Box<PipelineStage>, reason: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PipelineEvent {
    BriefSubmitted { artifact: BriefArtifact },
    PrdSubmitted { prd: PrdArtifact, stories: Vec<StoryArtifact> },
    ArchitectureSubmitted { artifact: ArchitectureArtifact },
    SprintPlanSubmitted { artifact: SprintPlanArtifact },
    ImplementationSubmitted { pr_url: String },
    CodeReviewApproved { artifact: CodeReviewArtifact },
    QaApproved { artifact: TestReportArtifact },
    DeploymentCompleted { artifact: DeploymentArtifact },
    Block { reason: String },
    Unblock,
    Rework { target: PipelineStage, reason: String },
    // Eventos transversais — não alteram o stage principal
    TransversalArtifactCreated { artifact_type: String, artifact: serde_json::Value },
}
```

### 2.4 Structured Output Schemas

```rust
#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct BriefArtifact {
    pub project_name: String,
    pub problem_statement: String,
    pub target_users: Vec<UserPersona>,
    pub key_features: Vec<Feature>,
    pub success_metrics: Vec<String>,
    pub constraints: Vec<String>,
    pub assumptions: Vec<String>,
    pub risks: Vec<Risk>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct PrdArtifact {
    pub title: String,
    pub overview: String,
    pub goals: Vec<Goal>,
    pub non_goals: Vec<String>,
    pub user_stories: Vec<UserStory>,
    pub acceptance_criteria: Vec<AcceptanceCriterion>,
    pub technical_constraints: Vec<String>,
    pub dependencies: Vec<Dependency>,
    pub milestones: Vec<Milestone>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct ArchitectureArtifact {
    pub system_name: String,
    pub overview: String,
    pub components: Vec<Component>,
    pub data_model: DataModelSpec,
    pub api_design: Vec<ApiEndpoint>,
    pub infrastructure: InfrastructureSpec,
    pub security: SecuritySpec,
    pub trade_offs: Vec<TradeOff>,
    pub adrs: Vec<ArchitectureDecisionRecord>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct SprintPlanArtifact {
    pub sprint_number: u32,
    pub goal: String,
    pub duration_weeks: u32,
    pub stories: Vec<SprintStory>,
    pub capacity: TeamCapacity,
    pub risks: Vec<String>,
    pub definition_of_done: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct CodeReviewArtifact {
    pub pr_url: String,
    pub verdict: String,  // approved | changes_requested | rejected
    pub issues: Vec<ReviewIssue>,
    pub suggestions: Vec<String>,
    pub security_concerns: Vec<String>,
    pub performance_concerns: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct TestReportArtifact {
    pub verdict: String,  // passed | failed | partial
    pub coverage_percent: f32,
    pub test_cases: Vec<TestCase>,
    pub bugs_found: Vec<Bug>,
    pub regression_status: String,
    pub recommendations: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct DeploymentArtifact {
    pub environment: String,
    pub version: String,
    pub deployment_url: Option<String>,
    pub health_checks: Vec<HealthCheck>,
    pub rollback_plan: String,
    pub monitoring_setup: MonitoringSpec,
}
```

---

## 3. Domain Model (SurrealDB Schema)

### 3.1 Entidades Principais

**user** — identidade do usuário
**workspace** — container de isolamento com slug único, issue_prefix, pipeline_config
**member** — relação user ↔ workspace com role (owner/admin/member)
**issue** — tarefa com status, priority, assignee polimórfico (member|agent), pipeline link
**comment** — discussão com author polimórfico, threading, tipos (comment|status_change|progress_update|system)
**agent** — agent configurável com persona, runtime, instructions, custom_env, mcp_config, triggers, memory_enabled
**agent_persona** — definição de role BMad com system_prompt, output_schema, pipeline_stage, pipeline_type (sequential|transversal)
**runtime** — daemon registrado com provider (gemini|claude|codex|custom), status, last_seen_at
**task** — unidade de execução com status (queued→dispatched→running→completed|failed|cancelled), pipeline_stage, artifact_schema
**pipeline** — FSM com stage, blocked_reason, history []
**artifact** — output estruturado validado com content (Object), validated, embedding (vector)
**memory** — contexto semântico com embedding (vector), memory_type, source_artifact
**project** — agrupador de issues com lead polimórfico, status, priority
**skill** — capability reutilizável com content (SKILL.md) e skill_files
**autopilot** — automação com execution_mode (create_issue|run_only), triggers (cron|webhook|api)
**chat_session** — conversa direta com agent com session_id para resumption
**task_message** — mensagens de execução (text|thinking|tool-use|tool-result|status|error|log)
**task_usage** — consumo de tokens por task/provider/model
**inbox_item** — notificação com severity (action_required|attention|info)
**activity_log** — audit trail completo

### 3.2 Polymorphic Fields

```
assignee_type / assignee    → member | agent
creator_type / creator      → member | agent
author_type / author        → member | agent
lead_type / lead            → member | agent
recipient_type / recipient  → member | agent
```

### 3.3 Vector Indexes

```
artifact.embedding  → MTREE DIMENSION 768 (cosine similarity)
memory.embedding    → MTREE DIMENSION 768 (cosine similarity)
```

### 3.4 Relacionamentos

```
workspace ──1:N──→ member ←──N:1── user
workspace ──1:N──→ issue ──1:1──→ pipeline ──1:N──→ artifact ──0:N──→ memory
workspace ──1:N──→ agent ──N:1──→ agent_persona
workspace ──1:N──→ runtime
workspace ──1:N──→ skill
workspace ──1:N──→ autopilot ──1:N──→ autopilot_trigger
                                    autopilot ──1:N──→ autopilot_run

issue ──1:N──→ comment
issue ──N:1──→ project
issue ──N:1──→ issue (parent-child)
issue ──1:N──→ task ──1:N──→ task_message
                  task ──1:N──→ task_usage

agent ──N:1──→ runtime
agent ──M:N──→ skill (via agent_skill)
agent ──1:N──→ task
```

---

## 4. Agent System

### 4.1 Task Lifecycle

```
TRIGGER
├── Issue assigned to agent (on_assign)
├── Member comment on agent issue (on_comment)
├── @mention agent in comment (on_mention)
├── Pipeline stage reached (on_pipeline_advance)
├── Artifact validated by previous stage (on_artifact_created)
├── Autopilot fires (cron / webhook)
└── Chat message sent
         ↓
TaskService::enqueue_task()  →  status = 'queued'
         ↓
Daemon pollLoop() every 3s
POST /api/daemon/runtimes/{id}/tasks/claim  →  status = 'dispatched'
         ↓
POST /api/daemon/tasks/{id}/start  →  status = 'running'
         ↓
execenv::prepare()
  ~/ensi_workspaces/{workspace_id}/{task_id}/
  ├── workdir/               ← agent works here
  └── .agent_context/
      ├── AGENT.md           ← identity + instructions
      ├── ISSUE.md           ← issue description
      ├── PIPELINE.md        ← current stage + past artifacts
      ├── REPOS.md           ← available git repos
      ├── MEMORY.md          ← vector-retrieved relevant memories
      └── skills/            ← injected skill files
         ↓
AgentBackend::execute()
  Stream messages → POST /api/daemon/tasks/{id}/messages
  Progress        → POST /api/daemon/tasks/{id}/progress
         ↓
Validate artifact output (if pipeline task)
  ✓ valid   → POST /api/daemon/tasks/{id}/complete
  ✗ invalid → retry with schema feedback OR fail
         ↓
Server-side completion:
  - Save result + session_id + work_dir (for resumption)
  - Create comment from task output
  - Pipeline task: advance stage → trigger next agent
  - Update agent status → idle
  - Broadcast task:completed via NATS → WebSocket
```

### 4.2 Daemon Config

```rust
pub struct DaemonConfig {
    pub poll_interval: Duration,        // default: 3s
    pub heartbeat_interval: Duration,   // default: 15s
    pub agent_timeout: Duration,        // default: 2h
    pub max_concurrent_tasks: usize,    // default: 20
    pub workspaces_root: PathBuf,       // ~/ensi_workspaces
}
```

### 4.3 Agent Memory Service

```rust
pub struct MemoryService {
    db: SurrealClient,
    embedder: Box<dyn Embedder>,
}

impl MemoryService {
    // Armazena memória com embedding vetorial
    pub async fn remember(&self, memory: CreateMemory) -> Result<Memory>;
    
    // Recupera memórias relevantes via cosine similarity
    pub async fn recall(
        &self,
        workspace: &WorkspaceId,
        query: &str,
        limit: usize,
    ) -> Result<Vec<Memory>>;
    
    // Gera memórias automaticamente de artefatos completados
    pub async fn learn_from_artifact(&self, artifact: &Artifact) -> Result<Vec<Memory>>;
}
```

### 4.4 Triggers

| Trigger | Condição | Observações |
|---------|----------|-------------|
| on_assign | issue.assignee = agent AND status != backlog | Previne false starts |
| on_comment | member comment em issue com agent assignee | Skips: comment do próprio agent; @mentions de outros sem mencionar o assignee; replies sem agent mention |
| on_mention | @agent_name no conteúdo do comment | Dispara independentemente do status |
| on_pipeline_advance | Pipeline FSM entra no stage do agent | Automático — próximo agent é notificado |
| on_artifact_created | Artefato do stage anterior validado | Downstream agents triggados automaticamente |

---

## 5. API Reference

### 5.1 Auth & Health
| Method | Path | Descrição |
|--------|------|-----------|
| GET | /health | Health check |
| GET | /ws | WebSocket upgrade |
| POST | /auth/send-code | Envia código |
| POST | /auth/verify-code | Verifica código, cria sessão |
| POST | /auth/google | Google OAuth |
| POST | /auth/logout | Encerra sessão |

### 5.2 Daemon API (/api/daemon/)
| Method | Path | Descrição |
|--------|------|-----------|
| POST | /register | Registra runtimes |
| POST | /deregister | Desregistra daemon |
| POST | /heartbeat | Keepalive |
| GET | /workspaces/{id}/repos | Repos do workspace |
| POST | /runtimes/{id}/tasks/claim | Reivindica task |
| GET | /tasks/{id}/status | Status |
| POST | /tasks/{id}/start | Inicia |
| POST | /tasks/{id}/progress | Progresso |
| POST | /tasks/{id}/complete | Completa |
| POST | /tasks/{id}/fail | Falha |
| POST | /tasks/{id}/usage | Tokens usados |
| POST | /tasks/{id}/messages | Batch mensagens |

### 5.3 Issues (/api/issues/)
| Method | Path | Descrição |
|--------|------|-----------|
| GET | / | Lista |
| POST | / | Cria |
| GET | /search | Busca full-text |
| POST | /batch-update | Lote |
| POST | /batch-delete | Remoção lote |
| GET | /{id} | Detalhes |
| PUT | /{id} | Atualiza |
| DELETE | /{id} | Remove |
| POST | /{id}/comments | Comentário |
| GET | /{id}/comments | Lista comentários |
| GET | /{id}/timeline | Timeline |
| GET | /{id}/active-task | Task ativa |
| POST | /{id}/tasks/{tid}/cancel | Cancela task |
| GET | /{id}/task-runs | Histórico |
| GET | /{id}/usage | Uso tokens |
| GET | /{id}/children | Sub-issues |

### 5.4 Pipeline (/api/pipelines/)
| Method | Path | Descrição |
|--------|------|-----------|
| POST | / | Cria pipeline |
| GET | /{id} | Stage + histórico |
| POST | /{id}/transition | Transição de stage |
| GET | /{id}/artifacts | Lista artefatos |
| POST | /{id}/artifacts | Cria artefato |
| GET | /{id}/artifacts/{aid} | Detalhes |
| GET | /{id}/artifacts/{aid}/diff | Diff versões |

### 5.5 Agents (/api/agents/)
| Method | Path | Descrição |
|--------|------|-----------|
| GET | / | Lista |
| POST | / | Cria |
| GET | /{id} | Detalhes |
| PUT | /{id} | Atualiza |
| POST | /{id}/archive | Arquiva |
| POST | /{id}/restore | Restaura |
| GET | /{id}/tasks | Histórico tasks |
| GET | /{id}/skills | Skills |
| PUT | /{id}/skills | Define skills |

### 5.6 Personas (/api/personas/)
| Method | Path | Descrição |
|--------|------|-----------|
| GET | / | Lista (built-in + custom) |
| POST | / | Cria persona |
| GET | /{id} | Detalhes |
| PUT | /{id} | Atualiza |

### 5.7 Demais Resources
Projects, Skills, Autopilots, Chat, Runtimes, Inbox, Memory, Pins, Attachments, Tokens, Workspaces — padrão REST: GET list, POST create, GET/{id}, PUT/{id}/PATCH/{id}, DELETE/{id}

### 5.8 NATS Subjects

```
ensi.tasks.{workspace_id}.enqueued
ensi.tasks.{workspace_id}.claimed
ensi.tasks.{task_id}.started / progress / completed / failed / cancelled
ensi.pipeline.{workspace_id}.stage_changed
ensi.pipeline.{workspace_id}.artifact_created / artifact_validated / validation_failed
ensi.pipeline.{workspace_id}.blocked / unblocked
ensi.issues.{workspace_id}.created / updated
ensi.comments.{workspace_id}.created
ensi.agents.{workspace_id}.status_changed
ensi.ws.{workspace_id}.broadcast
ensi.ws.user.{user_id}.direct
```

### 5.9 WebSocket Events

**Workspace-scoped:** issue:*, comment:*, task:*, agent:status, pipeline:stage_changed, pipeline:artifact_created, pipeline:validation_failed, project:*, autopilot:*

**User-scoped:** inbox:new, inbox:read, invitation:received

---

## 6. Auth & Authorization

### Métodos de Autenticação

1. **Email + Verification Code** → JWT (HS256, 90 dias)
2. **Google OAuth** → JWT
3. **Personal Access Token** — prefixo `ens_`, 40 hex chars, SHA256 no DB
4. **Daemon Token** — prefixo `edt_`, workspace-scoped, short-lived
5. **Cookie** — HttpOnly + CSRF para sessão web

### Roles

- **Owner** — controle total (delete, transfer workspace)
- **Admin** — manage members, agents, settings
- **Member** — CRUD issues, projects, usar agents

### Middleware Chain (Axum)

```rust
Router::new()
    .layer(TraceLayer::new_for_http())
    .layer(CorsLayer::permissive())
    .layer(middleware::from_fn(auth_middleware))
    .layer(middleware::from_fn(workspace_middleware))
```

---

## 7. Observabilidade (OpenTelemetry)

```rust
// Trace por execução de agent
#[instrument(skip(self))]
pub async fn execute_task(&self, task: &Task) -> Result<TaskResult> {
    let span = tracer.start("task.execute");
    span.set_attribute("task.id", task.id.to_string());
    span.set_attribute("agent.name", task.agent.name.clone());
    span.set_attribute("pipeline.stage", task.pipeline_stage.clone().unwrap_or_default());
    // ...
    span.set_attribute("task.tokens.input", result.usage.input_tokens);
    span.set_attribute("task.tokens.output", result.usage.output_tokens);
}

// Métricas-chave
ensi.task.duration_ms          // Histogram
ensi.pipeline.transitions_total // Counter
ensi.artifact.validations_total // Counter (label: outcome=ok|fail)
ensi.tokens.total               // Counter (labels: provider, model)
ensi.tasks.queue_depth          // Gauge
ensi.pipeline.stage_duration_ms // Histogram (label: stage)
```

**Exporters:** OTLP (Jaeger, Grafana Tempo), Prometheus `/metrics`
