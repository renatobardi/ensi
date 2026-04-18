# Ensi

> AI-native project management with structured pipelines.

## 1. Visão Geral

**Ensi** é uma plataforma open-source de project management com AI agents como cidadãos de primeira classe. O Ensi organiza o trabalho em um **pipeline estruturado** com 13 personas especializadas (Analyst, PM, Architect, Scrum Master, Frontend Dev, Backend Dev, Fullstack Dev, Code Reviewer, QA Engineer, DevOps/Infra, Tech Writer, Data Engineer, UX Designer), artefatos validados por schema JSON em cada estágio, e memória semântica cross-project via vector search.

### Princípios

1. **Pipeline-First**: Todo trabalho flui por estágios claros com checkpoints de qualidade
2. **Self-Contained**: SurrealDB embedded, NATS embedded — um binário serve tudo
3. **Structured Outputs**: Cada artefato tem schema JSON validado antes de persistir
4. **Agent Memory**: Contexto semântico entre projetos via vector search
5. **Calm UI**: Interface que reduz carga cognitiva, design system tokenizado

## 2. Problema e Proposta

### O Problema

Ferramentas de project management existentes ignoram a realidade das equipes modernas: AI agents realizam trabalho real, mas são tratados como ferramentas externas sem integração nativa. Quando um agent existe no workflow, não há:

- Pipeline estruturado que coordene múltiplos agents (cada um decide o que fazer isoladamente)
- Validação de artefatos intermediários (PRDs, specs podem ser inconsistentes ou incompletos)
- Memória cross-project (contexto se perde entre issues e projetos)
- Observabilidade (impossível debugar por que um agent tomou certa decisão)
- Coordenação entre especialistas (Frontend Dev, Backend Dev, QA precisam operar em sequência)

### A Proposta

Ensi resolve isso com:

- **Pipeline FSM**: Estado de máquina que coordena Analyst → PM → Architect → Scrum Master → Dev(s) → Code Reviewer → QA → DevOps
- **13 Personas pré-configuradas**: Cada agent tem system prompt, output schema e stage definidos
- **Structured Outputs**: Schemas JSON por artefato (BriefSchema, PRDSchema, etc.), validados antes de persistir e antes de avançar o pipeline
- **Agent Memory**: Vector search no SurrealDB com embeddings de artefatos — agents acessam contexto de projetos anteriores
- **OpenTelemetry nativo**: Traces de cada execução, métricas de pipeline
- **Self-contained**: SurrealDB embedded + NATS embedded — zero setup, um único binário

## 3. Stack Técnica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Backend | Rust (Axum 0.8+) | Performance, safety, single binary deployment |
| Frontend | Leptos (SSR + WASM) | Full-stack Rust, signals reativos, zero JS toolchain |
| Database | SurrealDB 3.0 embedded | Multi-model (doc + graph + vector), zero processo externo |
| Messaging | NATS embedded | Pub/sub leve, desacoplamento server ↔ daemon |
| State (frontend) | Leptos signals | Fine-grained reactivity, substitui Zustand + React Query |
| CLI / Daemon | Rust (Clap + Tokio) | Mesmo ecossistema, single binary deployment |
| LLM default | Gemini API | Structured output nativo, contextos grandes, extensível |
| Observabilidade | OpenTelemetry | Traces + métricas + logs padronizados |
| UI System | W3C Design Tokens (DTCG) | Tokenizado, Calm UI principles |
| Arquitetura | Hexagonal + Event-driven | Ports & adapters, NATS event bus |

## 4. Arquitetura

### 4.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Leptos)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Issues   │ │ Pipeline │ │ Agents   │ │ Artifact │           │
│  │ Board    │ │ View     │ │ Config   │ │ Inspector│           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       └─────────────┴────────────┴─────────────┘                  │
│                           │ WebSocket + REST                      │
└───────────────────────────┼───────────────────────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────────────┐
│                      BACKEND (Axum)                                 │
│  ┌──────────────────────────────────────────────────┐             │
│  │               APPLICATION LAYER                   │             │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │             │
│  │  │ Commands │  │ Queries  │  │ Events   │       │             │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘       │             │
│  └───────┼──────────────┼──────────────┼─────────────┘             │
│          │              │              │                             │
│  ┌───────┼──────────────┼──────────────┼─────────────┐             │
│  │       │      DOMAIN LAYER           │             │             │
│  │  ┌────▼─────┐  ┌────▼─────┐  ┌─────▼────┐       │             │
│  │  │ Entities │  │ Services │  │ Pipeline │       │             │
│  │  │          │  │          │  │ FSM      │       │             │
│  │  └──────────┘  └──────────┘  └──────────┘       │             │
│  └─────────────────────────────────────────────────-─┘             │
│          │              │              │                             │
│  ┌───────┼──────────────┼──────────────┼─────────────┐             │
│  │  ┌────▼─────┐  ┌────▼─────┐  ┌─────▼────┐       │             │
│  │  │ SurrealDB│  │ NATS     │  │ OTel     │       │             │
│  │  │ Adapter  │  │ Adapter  │  │ Adapter  │       │             │
│  │  └──────────┘  └──────────┘  └──────────┘       │             │
│  └─────────────────────────────────────────────────-─┘             │
└───────────────────────────┬───────────────────────────────────────┘
                            │ NATS (events, task dispatch)
┌───────────────────────────┼───────────────────────────────────────┐
│                      DAEMON (Rust binary)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ NATS Sub │→ │ ExecEnv  │→ │ Agent    │                       │
│  │ + Poll   │  │ Prepare  │  │ Backend  │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
│                                   │                               │
│       ┌───────────────────────────┤                               │
│       │  Providers                │                               │
│       │  Gemini API (default)     │                               │
│       │  Claude Code              │                               │
│       │  Codex / OpenCode         │                               │
│       │  Custom (extensível)      │                               │
│       └───────────────────────────┘                               │
└───────────────────────────────────────────────────────────────────┘
```

### 4.2 Hexagonal Architecture (Ports & Adapters)

```rust
// Ports — interfaces que o domínio define e os adapters implementam

#[async_trait]
pub trait IssueRepository: Send + Sync {
    async fn find_by_id(&self, id: &IssueId) -> Result<Issue>;
    async fn find_by_workspace(&self, ws: &WorkspaceId, filter: IssueFilter) -> Result<Vec<Issue>>;
    async fn save(&self, issue: &Issue) -> Result<()>;
    async fn delete(&self, id: &IssueId) -> Result<()>;
}

#[async_trait]
pub trait EventPublisher: Send + Sync {
    async fn publish(&self, event: DomainEvent) -> Result<()>;
}

#[async_trait]
pub trait AgentExecutor: Send + Sync {
    async fn execute(&self, task: &AgentTask, opts: ExecOptions) -> Result<AgentSession>;
}

#[async_trait]
pub trait ArtifactStore: Send + Sync {
    async fn save_artifact(&self, artifact: &Artifact) -> Result<()>;
    async fn find_similar(&self, query: &str, limit: usize) -> Result<Vec<Artifact>>;
}
```

### 4.3 Event-driven (NATS)

```
NATS Subjects:

# Task lifecycle
ensi.tasks.{workspace_id}.enqueued      → daemon subscribes
ensi.tasks.{workspace_id}.claimed       → server updates status
ensi.tasks.{task_id}.started            → server broadcasts to WS
ensi.tasks.{task_id}.progress           → server relays to frontend
ensi.tasks.{task_id}.completed          → server processes result
ensi.tasks.{task_id}.failed             → server handles failure
ensi.tasks.{task_id}.cancelled          → daemon receives & aborts

# Pipeline events
ensi.pipeline.{workspace_id}.stage_changed       → UI updates
ensi.pipeline.{workspace_id}.artifact_created    → triggers next stage
ensi.pipeline.{workspace_id}.validation_failed   → blocks progression
ensi.pipeline.{workspace_id}.blocked             → notifies team
ensi.pipeline.{workspace_id}.unblocked           → resumes flow

# Domain events
ensi.issues.{workspace_id}.created      → activity log, notifications
ensi.issues.{workspace_id}.updated      → WS broadcast
ensi.comments.{workspace_id}.created    → trigger detection
ensi.agents.{workspace_id}.status       → UI status update

# Real-time (bridged to WebSocket)
ensi.ws.{workspace_id}.broadcast        → all workspace members
ensi.ws.user.{user_id}.direct           → specific user (inbox)
```

### 4.4 Pipeline Orchestrator (BMad FSM)

```
SEQUENTIAL STAGES:
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
┌───────────────────────────────────────────────────────────────────┐
│                       DEVELOPMENT                                  │
│                                                                    │
│  Frontend Dev ──┐                                                  │
│  Backend Dev  ──┼──→ [execução paralela] ──→ Code Reviewer        │
│  Fullstack Dev──┘                                                  │
│                                                                    │
│  → ImplementationReport + CodeReviewArtifact                      │
└───────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│     QA      │──→│  DEPLOYMENT │──→│  COMPLETE   │
│             │   │             │   │             │
│ QA Engineer │   │ DevOps/Infra│   │             │
│ → TestReport│   │ → Deploy    │   │             │
└─────────────┘   └─────────────┘   └─────────────┘

TRANSVERSAL (qualquer stage, via @mention ou trigger):
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Code Reviewer │  │ Tech Writer  │  │Data Engineer │  │ UX Designer  │
│PR reviews,   │  │Docs, READMEs,│  │Data models,  │  │UI/UX, wire-  │
│code quality  │  │API docs,     │  │schemas, data │  │frames, user  │
│              │  │changelogs    │  │pipelines     │  │flows         │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

## 5. Domain Model

### 5.1 Entidades

| Entidade | Descrição | Chave |
|----------|-----------|-------|
| User | Identidade do usuário | email (unique) |
| Workspace | Container de isolamento | slug (unique), issue_prefix, pipeline_config |
| Member | User ↔ Workspace + role | UNIQUE (workspace, user) |
| Issue | Tarefa com status, priority, assignee polimórfico | UNIQUE (workspace, number) |
| Comment | Discussão com autor polimórfico, threading | comment_type, parent |
| Agent | Agent configurável com persona, runtime, triggers, memory | UNIQUE (workspace, name) |
| AgentPersona | Definição de role com system_prompt, output_schema, pipeline_type | name (unique) |
| Runtime | Daemon registrado com provider e status | UNIQUE (workspace, daemon_id, provider) |
| Task | Unidade de execução com FSM de status | INDEX on status |
| Pipeline | FSM do projeto com stage e history | UNIQUE on issue |
| Artifact | Output estruturado validado com embedding | TYPE + VECTOR INDEX |
| Memory | Contexto semântico com embedding | VECTOR INDEX |
| Project | Agrupador de issues | lead polimórfico |
| Skill | Capability reutilizável com SKILL.md | UNIQUE (workspace, name) |
| Autopilot | Automação com triggers cron/webhook | execution_mode |
| ChatSession | Conversa direta com agent | session_id (resumption) |
| TaskMessage | Mensagens de execução streaming | seq ordering |
| TaskUsage | Consumo de tokens por model | UNIQUE (task, provider, model) |
| InboxItem | Notificação com severity | read, archived |
| ActivityLog | Audit trail | actor_type polimórfico |

### 5.2 Agent Personas (13 pré-configuradas)

```rust
pub enum BmadRole {
    // Sequential pipeline
    Analyst,
    Pm,
    Architect,
    ScrumMaster,
    FrontendDev,
    BackendDev,
    FullstackDev,
    QaEngineer,
    Devops,
    // Transversal
    CodeReviewer,
    TechWriter,
    DataEngineer,
    UxDesigner,
    // Extensível
    Custom,
}

pub enum PipelinePersonaType {
    Sequential,   // tem stage definido no pipeline principal
    Transversal,  // pode ser chamado em qualquer stage
}
```

| Persona | Role | Stage | Tipo | Output Schema |
|---------|------|-------|------|---------------|
| Analyst | analyst | Discovery | Sequential | BriefArtifact |
| PM | pm | Planning | Sequential | PrdArtifact + StoryArtifact[] |
| Architect | architect | Architecture | Sequential | ArchitectureArtifact + TechSpecArtifact |
| Scrum Master | scrum_master | SprintPlanning | Sequential | SprintPlanArtifact |
| Frontend Dev | frontend_dev | Development | Sequential (paralelo) | ImplementationReport |
| Backend Dev | backend_dev | Development | Sequential (paralelo) | ImplementationReport |
| Fullstack Dev | fullstack_dev | Development | Sequential (paralelo) | ImplementationReport |
| Code Reviewer | code_reviewer | Review + any | Seq + Transversal | CodeReviewArtifact |
| QA Engineer | qa_engineer | QualityAssurance | Sequential | TestReportArtifact |
| DevOps / Infra | devops | Deployment | Sequential | DeploymentArtifact |
| Tech Writer | tech_writer | any | Transversal | TechDocArtifact |
| Data Engineer | data_engineer | any | Transversal | DataModelArtifact |
| UX Designer | ux_designer | any | Transversal | DesignArtifact |

### 5.3 Database Schema (SurrealDB)

```surql
-- Users
DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD name ON user TYPE string;
DEFINE FIELD email ON user TYPE string;
DEFINE FIELD avatar_url ON user TYPE option<string>;
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON user TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_user_email ON user FIELDS email UNIQUE;

-- Workspaces
DEFINE TABLE workspace SCHEMAFULL;
DEFINE FIELD name ON workspace TYPE string;
DEFINE FIELD slug ON workspace TYPE string;
DEFINE FIELD description ON workspace TYPE option<string>;
DEFINE FIELD context ON workspace TYPE option<string>;
DEFINE FIELD settings ON workspace TYPE object DEFAULT {};
DEFINE FIELD repos ON workspace TYPE array DEFAULT [];
DEFINE FIELD issue_prefix ON workspace TYPE string DEFAULT 'ENS';
DEFINE FIELD issue_counter ON workspace TYPE int DEFAULT 0;
DEFINE FIELD pipeline_config ON workspace TYPE option<object>;
DEFINE FIELD created_at ON workspace TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON workspace TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_workspace_slug ON workspace FIELDS slug UNIQUE;

-- Members
DEFINE TABLE member SCHEMAFULL;
DEFINE FIELD workspace ON member TYPE record<workspace>;
DEFINE FIELD user ON member TYPE record<user>;
DEFINE FIELD role ON member TYPE string ASSERT $value IN ['owner', 'admin', 'member'];
DEFINE FIELD created_at ON member TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_member_ws_user ON member FIELDS workspace, user UNIQUE;

-- Issues
DEFINE TABLE issue SCHEMAFULL;
DEFINE FIELD workspace ON issue TYPE record<workspace>;
DEFINE FIELD number ON issue TYPE int;
DEFINE FIELD title ON issue TYPE string;
DEFINE FIELD description ON issue TYPE option<string>;
DEFINE FIELD status ON issue TYPE string ASSERT $value IN ['backlog','todo','in_progress','in_review','done','blocked','cancelled'];
DEFINE FIELD priority ON issue TYPE string ASSERT $value IN ['urgent','high','medium','low','none'];
DEFINE FIELD assignee_type ON issue TYPE option<string> ASSERT $value IN [NONE,'member','agent'];
DEFINE FIELD assignee ON issue TYPE option<record>;
DEFINE FIELD creator_type ON issue TYPE string ASSERT $value IN ['member','agent'];
DEFINE FIELD creator ON issue TYPE record;
DEFINE FIELD parent ON issue TYPE option<record<issue>>;
DEFINE FIELD project ON issue TYPE option<record<project>>;
DEFINE FIELD pipeline ON issue TYPE option<record<pipeline>>;
DEFINE FIELD position ON issue TYPE float DEFAULT 0.0;
DEFINE FIELD due_date ON issue TYPE option<datetime>;
DEFINE FIELD origin_type ON issue TYPE option<string>;
DEFINE FIELD origin ON issue TYPE option<record>;
DEFINE FIELD created_at ON issue TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON issue TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_issue_ws_number ON issue FIELDS workspace, number UNIQUE;
DEFINE INDEX idx_issue_workspace ON issue FIELDS workspace;
DEFINE INDEX idx_issue_assignee ON issue FIELDS assignee;
DEFINE INDEX idx_issue_pipeline ON issue FIELDS pipeline;

-- Agents
DEFINE TABLE agent SCHEMAFULL;
DEFINE FIELD workspace ON agent TYPE record<workspace>;
DEFINE FIELD name ON agent TYPE string;
DEFINE FIELD description ON agent TYPE option<string>;
DEFINE FIELD avatar_url ON agent TYPE option<string>;
DEFINE FIELD persona ON agent TYPE option<record<agent_persona>>;
DEFINE FIELD runtime ON agent TYPE option<record<runtime>>;
DEFINE FIELD runtime_mode ON agent TYPE string DEFAULT 'local';
DEFINE FIELD runtime_config ON agent TYPE object DEFAULT {};
DEFINE FIELD visibility ON agent TYPE string DEFAULT 'workspace' ASSERT $value IN ['workspace','private'];
DEFINE FIELD status ON agent TYPE string DEFAULT 'offline' ASSERT $value IN ['idle','working','blocked','error','offline'];
DEFINE FIELD max_concurrent_tasks ON agent TYPE int DEFAULT 6;
DEFINE FIELD owner ON agent TYPE record<user>;
DEFINE FIELD instructions ON agent TYPE option<string>;
DEFINE FIELD custom_env ON agent TYPE object DEFAULT {};
DEFINE FIELD custom_args ON agent TYPE array DEFAULT [];
DEFINE FIELD mcp_config ON agent TYPE option<object>;
DEFINE FIELD triggers ON agent TYPE object DEFAULT { on_assign: true, on_comment: true, on_mention: true };
DEFINE FIELD memory_enabled ON agent TYPE bool DEFAULT true;
DEFINE FIELD archived_at ON agent TYPE option<datetime>;
DEFINE FIELD created_at ON agent TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON agent TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_agent_ws_name ON agent FIELDS workspace, name UNIQUE;

-- Agent Personas
DEFINE TABLE agent_persona SCHEMAFULL;
DEFINE FIELD name ON agent_persona TYPE string;
DEFINE FIELD bmad_role ON agent_persona TYPE string ASSERT $value IN ['analyst','pm','architect','scrum_master','frontend_dev','backend_dev','fullstack_dev','qa_engineer','devops','code_reviewer','tech_writer','data_engineer','ux_designer','custom'];
DEFINE FIELD system_prompt ON agent_persona TYPE string;
DEFINE FIELD output_schema ON agent_persona TYPE option<object>;
DEFINE FIELD pipeline_stage ON agent_persona TYPE option<string>;
DEFINE FIELD pipeline_type ON agent_persona TYPE string DEFAULT 'sequential' ASSERT $value IN ['sequential','transversal'];
DEFINE FIELD description ON agent_persona TYPE option<string>;
DEFINE FIELD created_at ON agent_persona TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_persona_name ON agent_persona FIELDS name UNIQUE;

-- Runtimes
DEFINE TABLE runtime SCHEMAFULL;
DEFINE FIELD workspace ON runtime TYPE record<workspace>;
DEFINE FIELD daemon_id ON runtime TYPE string;
DEFINE FIELD name ON runtime TYPE string;
DEFINE FIELD provider ON runtime TYPE string;
DEFINE FIELD status ON runtime TYPE string DEFAULT 'offline' ASSERT $value IN ['online','offline'];
DEFINE FIELD device_info ON runtime TYPE option<string>;
DEFINE FIELD metadata ON runtime TYPE object DEFAULT {};
DEFINE FIELD owner ON runtime TYPE record<user>;
DEFINE FIELD last_seen_at ON runtime TYPE option<datetime>;
DEFINE FIELD created_at ON runtime TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON runtime TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_runtime_unique ON runtime FIELDS workspace, daemon_id, provider UNIQUE;

-- Tasks
DEFINE TABLE task SCHEMAFULL;
DEFINE FIELD agent ON task TYPE record<agent>;
DEFINE FIELD runtime ON task TYPE option<record<runtime>>;
DEFINE FIELD issue ON task TYPE option<record<issue>>;
DEFINE FIELD pipeline ON task TYPE option<record<pipeline>>;
DEFINE FIELD pipeline_stage ON task TYPE option<string>;
DEFINE FIELD artifact_schema ON task TYPE option<object>;
DEFINE FIELD chat_session ON task TYPE option<record<chat_session>>;
DEFINE FIELD autopilot_run ON task TYPE option<record<autopilot_run>>;
DEFINE FIELD status ON task TYPE string DEFAULT 'queued' ASSERT $value IN ['queued','dispatched','running','completed','failed','cancelled'];
DEFINE FIELD priority ON task TYPE int DEFAULT 2;
DEFINE FIELD dispatched_at ON task TYPE option<datetime>;
DEFINE FIELD started_at ON task TYPE option<datetime>;
DEFINE FIELD completed_at ON task TYPE option<datetime>;
DEFINE FIELD result ON task TYPE option<object>;
DEFINE FIELD error ON task TYPE option<string>;
DEFINE FIELD context ON task TYPE object DEFAULT {};
DEFINE FIELD session_id ON task TYPE option<string>;
DEFINE FIELD work_dir ON task TYPE option<string>;
DEFINE FIELD trigger_comment ON task TYPE option<record<comment>>;
DEFINE FIELD created_at ON task TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_task_status ON task FIELDS status;
DEFINE INDEX idx_task_agent ON task FIELDS agent;

-- Pipeline
DEFINE TABLE pipeline SCHEMAFULL;
DEFINE FIELD workspace ON pipeline TYPE record<workspace>;
DEFINE FIELD project ON pipeline TYPE option<record<project>>;
DEFINE FIELD issue ON pipeline TYPE record<issue>;
DEFINE FIELD stage ON pipeline TYPE string DEFAULT 'discovery' ASSERT $value IN ['discovery','planning','architecture','sprint_planning','development','review','quality_assurance','deployment','complete','blocked'];
DEFINE FIELD blocked_reason ON pipeline TYPE option<string>;
DEFINE FIELD blocked_at_stage ON pipeline TYPE option<string>;
DEFINE FIELD history ON pipeline TYPE array DEFAULT [];
DEFINE FIELD created_at ON pipeline TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON pipeline TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_pipeline_workspace ON pipeline FIELDS workspace;
DEFINE INDEX idx_pipeline_issue ON pipeline FIELDS issue UNIQUE;

-- Artifacts
DEFINE TABLE artifact SCHEMAFULL;
DEFINE FIELD pipeline ON artifact TYPE record<pipeline>;
DEFINE FIELD workspace ON artifact TYPE record<workspace>;
DEFINE FIELD artifact_type ON artifact TYPE string ASSERT $value IN ['brief','prd','story','architecture','tech_spec','sprint_plan','implementation','code_review','test_report','deployment_plan','tech_doc','design','data_model','custom'];
DEFINE FIELD title ON artifact TYPE string;
DEFINE FIELD content ON artifact TYPE object;
DEFINE FIELD schema_version ON artifact TYPE string;
DEFINE FIELD validated ON artifact TYPE bool DEFAULT false;
DEFINE FIELD validation_errors ON artifact TYPE array DEFAULT [];
DEFINE FIELD author_type ON artifact TYPE string ASSERT $value IN ['agent','member'];
DEFINE FIELD author ON artifact TYPE record;
DEFINE FIELD version ON artifact TYPE int DEFAULT 1;
DEFINE FIELD parent_version ON artifact TYPE option<record<artifact>>;
DEFINE FIELD embedding ON artifact TYPE option<array<float>>;
DEFINE FIELD created_at ON artifact TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_artifact_pipeline ON artifact FIELDS pipeline;
DEFINE INDEX idx_artifact_type ON artifact FIELDS artifact_type;
DEFINE INDEX idx_artifact_embedding ON artifact FIELDS embedding MTREE DIMENSION 768;

-- Memory
DEFINE TABLE memory SCHEMAFULL;
DEFINE FIELD workspace ON memory TYPE record<workspace>;
DEFINE FIELD agent ON memory TYPE option<record<agent>>;
DEFINE FIELD content ON memory TYPE string;
DEFINE FIELD memory_type ON memory TYPE string ASSERT $value IN ['artifact_summary','decision','lesson_learned','context','preference'];
DEFINE FIELD source_artifact ON memory TYPE option<record<artifact>>;
DEFINE FIELD source_issue ON memory TYPE option<record<issue>>;
DEFINE FIELD embedding ON memory TYPE array<float>;
DEFINE FIELD relevance_score ON memory TYPE float DEFAULT 1.0;
DEFINE FIELD expires_at ON memory TYPE option<datetime>;
DEFINE FIELD created_at ON memory TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_memory_workspace ON memory FIELDS workspace;
DEFINE INDEX idx_memory_embedding ON memory FIELDS embedding MTREE DIMENSION 768;

-- Projects
DEFINE TABLE project SCHEMAFULL;
DEFINE FIELD workspace ON project TYPE record<workspace>;
DEFINE FIELD title ON project TYPE string;
DEFINE FIELD description ON project TYPE option<string>;
DEFINE FIELD icon ON project TYPE option<string>;
DEFINE FIELD status ON project TYPE string DEFAULT 'planned' ASSERT $value IN ['planned','in_progress','paused','completed','cancelled'];
DEFINE FIELD lead_type ON project TYPE option<string> ASSERT $value IN [NONE,'member','agent'];
DEFINE FIELD lead ON project TYPE option<record>;
DEFINE FIELD priority ON project TYPE string DEFAULT 'none';
DEFINE FIELD created_at ON project TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON project TYPE datetime DEFAULT time::now();

-- Skills
DEFINE TABLE skill SCHEMAFULL;
DEFINE FIELD workspace ON skill TYPE record<workspace>;
DEFINE FIELD name ON skill TYPE string;
DEFINE FIELD description ON skill TYPE option<string>;
DEFINE FIELD content ON skill TYPE string;
DEFINE FIELD config ON skill TYPE object DEFAULT {};
DEFINE FIELD created_by ON skill TYPE record<user>;
DEFINE FIELD created_at ON skill TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON skill TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_skill_ws_name ON skill FIELDS workspace, name UNIQUE;

-- Skill Files
DEFINE TABLE skill_file SCHEMAFULL;
DEFINE FIELD skill ON skill_file TYPE record<skill>;
DEFINE FIELD path ON skill_file TYPE string;
DEFINE FIELD content ON skill_file TYPE string;
DEFINE INDEX idx_skill_file_path ON skill_file FIELDS skill, path UNIQUE;

-- Agent Skills (junction)
DEFINE TABLE agent_skill SCHEMAFULL;
DEFINE FIELD in ON agent_skill TYPE record<agent>;
DEFINE FIELD out ON agent_skill TYPE record<skill>;
DEFINE FIELD created_at ON agent_skill TYPE datetime DEFAULT time::now();

-- Autopilots
DEFINE TABLE autopilot SCHEMAFULL;
DEFINE FIELD workspace ON autopilot TYPE record<workspace>;
DEFINE FIELD project ON autopilot TYPE option<record<project>>;
DEFINE FIELD title ON autopilot TYPE string;
DEFINE FIELD description ON autopilot TYPE option<string>;
DEFINE FIELD assignee ON autopilot TYPE record<agent>;
DEFINE FIELD priority ON autopilot TYPE option<string>;
DEFINE FIELD status ON autopilot TYPE string DEFAULT 'active' ASSERT $value IN ['active','paused','archived'];
DEFINE FIELD execution_mode ON autopilot TYPE string DEFAULT 'create_issue' ASSERT $value IN ['create_issue','run_only'];
DEFINE FIELD issue_title_template ON autopilot TYPE option<string>;
DEFINE FIELD concurrency_policy ON autopilot TYPE string DEFAULT 'skip' ASSERT $value IN ['skip','queue','replace'];
DEFINE FIELD last_run_at ON autopilot TYPE option<datetime>;
DEFINE FIELD created_at ON autopilot TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON autopilot TYPE datetime DEFAULT time::now();

-- Auth Tables (abbreviated)
-- verification_code: email, code, expires_at, used, attempts
-- personal_access_token: user, name, token_hash (UNIQUE), token_prefix, expires_at, revoked
-- daemon_token: workspace, daemon_id, token_hash (UNIQUE), expires_at
-- workspace_invitation: workspace, inviter, invitee_email, role, status, expires_at
-- activity_log: workspace, issue, actor_type, actor, action, details
-- inbox_item: workspace, recipient_type, recipient, item_type, severity, issue, title, body, read, archived
```

## 6. Agent System

### 6.1 Task Lifecycle

Ver seção 4.4 do Reference Architecture para o diagrama completo.

### 6.2 Daemon Execution

```rust
pub struct Daemon {
    cfg: DaemonConfig,
    client: ApiClient,
    repo_cache: RepoCache,
    workspaces: HashMap<WorkspaceId, WorkspaceState>,
    runtime_index: HashMap<RuntimeId, RuntimeInfo>,
}

pub struct DaemonConfig {
    pub poll_interval: Duration,        // default: 3s
    pub heartbeat_interval: Duration,   // default: 15s
    pub agent_timeout: Duration,        // default: 2h
    pub max_concurrent_tasks: usize,    // default: 20
    pub workspaces_root: PathBuf,       // ~/ensi_workspaces
}

async fn run(&mut self) -> Result<()> {
    self.bind_health_port()?;
    self.load_auth_token()?;
    self.sync_workspaces().await?;

    tokio::join!(
        self.poll_loop(),
        self.heartbeat_loop(),
        self.gc_loop(),
        self.workspace_sync_loop(),
        self.serve_health(),
    );

    self.deregister_runtimes().await?;
    Ok(())
}
```

### 6.3 Structured Output Validation

```rust
impl Artifact {
    pub fn validate(&self) -> Result<(), Vec<ValidationError>> {
        let schema = self.load_schema()?;
        let validator = jsonschema::compile(&schema)?;
        match validator.validate(&self.content) {
            Ok(_) => Ok(()),
            Err(errors) => Err(errors.map(|e| ValidationError::from(e)).collect()),
        }
    }
}

// Pipeline só avança após validação bem-sucedida
impl PipelineService {
    pub async fn submit_artifact(
        &self,
        pipeline_id: &PipelineId,
        artifact: Artifact,
    ) -> Result<PipelineTransitionResult> {
        artifact.validate()?;  // Blocks progression if invalid
        let events = self.pipeline.apply(PipelineEvent::from_artifact(artifact))?;
        self.event_bus.publish_all(events).await?;
        Ok(PipelineTransitionResult::Advanced)
    }
}
```

### 6.4 Agent Memory

```rust
pub struct MemoryService {
    db: SurrealClient,
    embedder: Box<dyn Embedder>,
}

impl MemoryService {
    pub async fn remember(&self, memory: CreateMemory) -> Result<Memory> {
        let embedding = self.embedder.embed(&memory.content).await?;
        self.db.create("memory").content(Memory { embedding, ..memory.into() }).await
    }

    pub async fn recall(&self, ws: &WorkspaceId, query: &str, limit: usize) -> Result<Vec<Memory>> {
        let q_vec = self.embedder.embed(query).await?;
        self.db.query(
            "SELECT *, vector::similarity::cosine(embedding, $q) AS score
             FROM memory WHERE workspace = $ws ORDER BY score DESC LIMIT $limit"
        )
        .bind(("q", q_vec))
        .bind(("ws", ws))
        .bind(("limit", limit))
        .await
    }

    pub async fn learn_from_artifact(&self, artifact: &Artifact) -> Result<Vec<Memory>> {
        // Auto-extract decisions, summaries, lessons from completed artifacts
        let summary = self.summarize(artifact).await?;
        let decisions = self.extract_decisions(artifact).await?;
        let mut memories = vec![self.remember(CreateMemory {
            content: summary,
            memory_type: MemoryType::ArtifactSummary,
            source_artifact: Some(artifact.id.clone()),
            ..Default::default()
        }).await?];
        for d in decisions {
            memories.push(self.remember(CreateMemory {
                content: d,
                memory_type: MemoryType::Decision,
                source_artifact: Some(artifact.id.clone()),
                ..Default::default()
            }).await?);
        }
        Ok(memories)
    }
}
```

### 6.5 Triggers

| Trigger | Condição | Notas |
|---------|----------|-------|
| on_assign | issue.assignee = agent AND status != backlog | Evita false starts |
| on_comment | member comment em issue agent-assigned | Skips: comment do próprio agent; @outros sem agent mention; reply em thread sem agent |
| on_mention | @agent_name no comment | Sempre dispara, sem restrição de status |
| on_pipeline_advance | FSM transiciona para stage do agent | Auto — próximo agent notificado via NATS |
| on_artifact_created | Artefato do stage anterior validado | Downstream agents triggados automaticamente |

### 6.6 Skills

Skills são SKILL.md + arquivos de suporte armazenados no SurrealDB. Atribuídas a agents via `agent_skill`. No execenv, escritas em paths específicos por provider:
- Gemini: `.agent_context/skills/{name}/SKILL.md`
- Claude: `~/.claude/skills/{name}/SKILL.md`

## 7. API Design

### 7.1 REST Endpoints

**Auth & Health**
| Method | Path | Descrição |
|--------|------|-----------|
| GET | /health | Health check |
| GET | /ws | WebSocket upgrade |
| POST | /auth/send-code | Envia código |
| POST | /auth/verify-code | Cria sessão |
| POST | /auth/google | Google OAuth |
| POST | /auth/logout | Encerra sessão |

**Daemon (/api/daemon/)**
| Method | Path | Descrição |
|--------|------|-----------|
| POST | /register | Registra runtimes |
| POST | /deregister | Desregistra |
| POST | /heartbeat | Keepalive |
| GET | /workspaces/{id}/repos | Repos |
| POST | /runtimes/{id}/tasks/claim | Claim task |
| GET | /tasks/{id}/status | Status |
| POST | /tasks/{id}/start | Inicia |
| POST | /tasks/{id}/progress | Progresso |
| POST | /tasks/{id}/complete | Completa |
| POST | /tasks/{id}/fail | Falha |
| POST | /tasks/{id}/usage | Tokens |
| POST | /tasks/{id}/messages | Mensagens |

**Issues (/api/issues/)**
| Method | Path | Descrição |
|--------|------|-----------|
| GET/POST | / | Lista / Cria |
| GET | /search | Full-text |
| POST | /batch-update | Lote |
| GET/PUT/DELETE | /{id} | CRUD |
| POST/GET | /{id}/comments | Comentários |
| GET | /{id}/timeline | Timeline |
| GET | /{id}/active-task | Task ativa |
| POST | /{id}/tasks/{tid}/cancel | Cancela |
| GET | /{id}/task-runs | Histórico |
| GET | /{id}/children | Sub-issues |

**Pipeline (/api/pipelines/)**
| Method | Path | Descrição |
|--------|------|-----------|
| POST | / | Cria pipeline |
| GET | /{id} | Stage + histórico |
| POST | /{id}/transition | Transição |
| GET/POST | /{id}/artifacts | Lista / Cria |
| GET | /{id}/artifacts/{aid} | Detalhes |
| GET | /{id}/artifacts/{aid}/diff | Diff versões |

**Agents (/api/agents/)**
| Method | Path | Descrição |
|--------|------|-----------|
| GET/POST | / | Lista / Cria |
| GET/PUT | /{id} | Detalhes / Atualiza |
| POST | /{id}/archive | Arquiva |
| POST | /{id}/restore | Restaura |
| GET | /{id}/tasks | Histórico tasks |
| GET/PUT | /{id}/skills | Skills |

**Personas (/api/personas/)**
| Method | Path | Descrição |
|--------|------|-----------|
| GET/POST | / | Lista / Cria persona |
| GET/PUT | /{id} | Detalhes / Atualiza |

**Demais resources (padrão REST):**
Projects, Skills, Autopilots, Chat Sessions, Runtimes, Inbox, Memory, Pins, Attachments, Tokens, Workspaces, Invitations

### 7.2 WebSocket Events

**Workspace-scoped:** issue:*, comment:*, task:dispatch/started/progress/completed/failed/cancelled, agent:status, pipeline:stage_changed/artifact_created/validation_failed/blocked, project:*, autopilot:run:*

**User-scoped:** inbox:new, inbox:read, invitation:received

### 7.3 NATS Subjects

```
ensi.tasks.{workspace_id}.enqueued / claimed
ensi.tasks.{task_id}.started / progress / completed / failed / cancelled
ensi.pipeline.{workspace_id}.stage_changed / artifact_created / validation_failed / blocked
ensi.issues.{workspace_id}.created / updated
ensi.comments.{workspace_id}.created
ensi.agents.{workspace_id}.status_changed
ensi.ws.{workspace_id}.broadcast
ensi.ws.user.{user_id}.direct
```

## 8. Frontend (Leptos)

### 8.1 Pages e Componentes

**Issues** — Board Kanban + List view, filtros, batch actions, issue detail, agent live card (real-time execution), transcript dialog

**Pipeline View** (novo) — Visualização dos 9 stages, status por stage (waiting/active/completed/blocked), artefatos por stage, botão para avançar/bloquear/rework

**Artifact Inspector** (novo) — Tree view de artefatos, rendering schema-aware, diff entre versões, export

**Agents** — Configuração completa: persona picker, instructions, skills, custom_env, mcp_config, tasks history

**Persona Picker** (novo) — Seleção de BMad role, preview do system prompt e output schema

**Projects, Skills, Autopilots, Runtimes, Chat, Inbox, Settings** — Idêntico à especificação de referência

### 8.2 Design System (DTCG Tokens)

```json
{
  "color": {
    "surface": {
      "primary": { "$value": "#ffffff", "$type": "color" },
      "secondary": { "$value": "#f8f9fa", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "#1a1a2e", "$type": "color" },
      "secondary": { "$value": "#6b7280", "$type": "color" },
      "muted": { "$value": "#9ca3af", "$type": "color" }
    },
    "accent": {
      "primary": { "$value": "#6366f1", "$type": "color" },
      "success": { "$value": "#22c55e", "$type": "color" },
      "warning": { "$value": "#f59e0b", "$type": "color" },
      "danger": { "$value": "#ef4444", "$type": "color" }
    },
    "pipeline": {
      "discovery": { "$value": "#8b5cf6", "$type": "color" },
      "planning": { "$value": "#3b82f6", "$type": "color" },
      "architecture": { "$value": "#06b6d4", "$type": "color" },
      "sprint_planning": { "$value": "#f97316", "$type": "color" },
      "development": { "$value": "#22c55e", "$type": "color" },
      "review": { "$value": "#a855f7", "$type": "color" },
      "qa": { "$value": "#f59e0b", "$type": "color" },
      "deployment": { "$value": "#64748b", "$type": "color" },
      "complete": { "$value": "#10b981", "$type": "color" }
    }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" },
    "xl": { "$value": "32px", "$type": "dimension" }
  }
}
```

### 8.3 Calm UI Principles

1. **Progressive Disclosure** — Mostrar apenas o necessário agora. Detalhes on demand.
2. **Reduced Motion** — Transições apenas para orientação espacial. Sem animações decorativas.
3. **Muted Palette** — Backgrounds de baixo contraste; cores saturadas apenas para ações.
4. **Generous Whitespace** — Cada elemento respira. Densidade é opt-in.
5. **Predictable Layout** — Mesmos componentes nos mesmos lugares em todas as páginas.
6. **Status, Not Noise** — Indicadores de pipeline stage são sutis. Alertas apenas para blockers.

### 8.4 State Management (Leptos Signals)

```rust
#[component]
pub fn IssuesPage() -> impl IntoView {
    let workspace_id = use_workspace_id();
    
    // Server state via resources (equivale a React Query)
    let issues = create_resource(
        move || workspace_id.get(),
        |ws_id| async move { api::fetch_issues(ws_id).await }
    );
    
    // Client state via signals (equivale a Zustand)
    let (view_mode, set_view_mode) = create_signal(ViewMode::Board);
    let (filter, set_filter) = create_signal(IssueFilter::default());
    
    // WebSocket invalidation
    use_ws_event("issue:updated", move |_| issues.refetch());
    
    view! {
        <Suspense fallback=|| view! { <Loading/> }>
            {move || issues.get().map(|data| {
                let filtered = apply_filter(data, filter.get());
                match view_mode.get() {
                    ViewMode::Board => view! { <BoardView issues=filtered/> },
                    ViewMode::List => view! { <ListView issues=filtered/> },
                }
            })}
        </Suspense>
    }
}
```

## 9. CLI & Daemon

### 9.1 Comandos

```bash
# Setup & Auth
ensi setup [self-host [--server-url URL]]   # One-command setup
ensi login                                    # Browser OAuth
ensi auth status                              # Check token
ensi auth logout                              # Remove token

# Daemon
ensi daemon start [--foreground] [--profile NAME]
ensi daemon stop [--profile NAME]
ensi daemon status [--output json]
ensi daemon logs [-f] [-n COUNT]

# Workspaces
ensi workspace list
ensi workspace watch <id>
ensi workspace unwatch <id>

# Issues
ensi issue list [--status] [--priority] [--assignee]
ensi issue create --title "..." [--description] [--status] [--priority] [--assignee]
ensi issue update <id> [--title] [--priority] [--status]
ensi issue assign <id> --to "<name>"
ensi issue comment add <issue-id> --content "..."
ensi issue runs <issue-id>

# Pipeline (new)
ensi pipeline status <issue-id>
ensi pipeline advance <issue-id>
ensi pipeline block <issue-id> --reason "..."
ensi pipeline rework <issue-id> --to <stage>

# Artifacts (new)
ensi artifact list <issue-id>
ensi artifact show <artifact-id>
ensi artifact validate <artifact-id>

# Agents & Personas
ensi agent list
ensi persona list

# Memory (new)
ensi memory search "<query>"

# Autopilots
ensi autopilot list
ensi autopilot trigger <id>

# Config
ensi config show
ensi config set <key> <value>
ensi version
ensi update
```

### 9.2 Pairing & Auth

Autenticação via browser OAuth → PAT de 90 dias armazenado em `~/.ensi/config.json`. Perfis isolados para múltiplas instâncias.

### 9.3 Task Execution

Daemon: poll (3s) → claim → execenv prepare → spawn provider → stream messages → validate artifact → report completion → NATS publish.

## 10. Observabilidade (OpenTelemetry)

```rust
// Trace por execução de agent
#[instrument(skip(self))]
pub async fn execute_task(&self, task: &Task) -> Result<TaskResult> {
    let span = tracer.start("task.execute");
    span.set_attribute("task.id", task.id.to_string());
    span.set_attribute("agent.persona", task.agent.persona_name.clone());
    span.set_attribute("pipeline.stage", task.pipeline_stage.clone().unwrap_or_default());
    span.set_attribute("task.tokens.input", result.usage.input_tokens);
    span.set_attribute("task.tokens.output", result.usage.output_tokens);
}

// Métricas
ensi.task.duration_ms                    // Histogram
ensi.pipeline.transitions_total          // Counter
ensi.artifact.validations_total          // Counter (label: outcome=ok|fail)
ensi.tokens.total                        // Counter (labels: provider, model)
ensi.tasks.queue_depth                   // Gauge
ensi.pipeline.stage_duration_ms         // Histogram (label: stage)
ensi.memory.recall_latency_ms           // Histogram
```

**Exporters:** OTLP (Jaeger, Grafana Tempo), Prometheus `/metrics`

## 11. Configuração e Setup

### Quick Start

```bash
# Install
curl -fsSL https://raw.githubusercontent.com/ensi-dev/ensi/main/scripts/install.sh | bash

# Setup (SurrealDB + NATS embedded, zero external deps)
ensi setup self-host

# Open browser
open http://localhost:3000

# Login: qualquer email + código 888888 (dev mode)
```

### Environment Variables

| Var | Default | Descrição |
|-----|---------|-----------|
| `ENSI_PORT` | 8080 | Server port |
| `ENSI_FRONTEND_PORT` | 3000 | Frontend port |
| `ENSI_JWT_SECRET` | (gerado) | JWT signing secret |
| `ENSI_DB_PATH` | ./data/ensi.db | SurrealDB data path |
| `ENSI_NATS_PORT` | 4222 | NATS port |
| `ENSI_OTEL_ENDPOINT` | (none) | OpenTelemetry collector |
| `ENSI_GEMINI_API_KEY` | (none) | Default LLM API key |

### Single Binary

```bash
./ensi serve          # Server + frontend + SurrealDB + NATS
./ensi daemon start   # Daemon (processo separado)
```

## 12. Roadmap — 8 Semanas

### Semana 1-2: Foundation

- [ ] Cargo workspace setup (ensi-core, ensi-server, ensi-daemon, ensi-cli, ensi-db, ensi-events, ensi-pipeline, ensi-memory, ensi-frontend)
- [ ] SurrealDB embedded + schema completo (migrations idempotentes)
- [ ] Axum server skeleton: health, CORS, auth middleware, workspace middleware
- [ ] JWT + PAT auth (ens_ prefix)
- [ ] NATS embedded setup + event bus adapter
- [ ] Leptos app skeleton com routing
- [ ] User CRUD, Workspace CRUD, Member CRUD
- [ ] CLI scaffold (Clap) + config file (~/.ensi/config.json)

### Semana 3-4: Core Features

- [ ] Issue CRUD (status, priority, assignee polimórfico, parent-child)
- [ ] Comment system (threading, author polimórfico, tipos)
- [ ] Project CRUD
- [ ] Agent CRUD + Agent Persona (13 personas pré-configuradas)
- [ ] Runtime registration + daemon heartbeat
- [ ] Task queue (enqueue, claim, start, complete, fail, cancel)
- [ ] Daemon: poll loop, execenv prepare, session resumption
- [ ] Gemini API provider (structured output)
- [ ] Issue Board (Kanban) + List view no Leptos
- [ ] WebSocket real-time (NATS → WS bridge)
- [ ] Trigger detection (on_assign, on_comment, on_mention)

### Semana 5-6: Pipeline & BMad

- [ ] Pipeline FSM (todos os stages + transitions + blocked/rework)
- [ ] Artifact storage + validation (JSON schema enforcement)
- [ ] Todos os structured output schemas (Brief, PRD, Architecture, SprintPlan, CodeReview, TestReport, Deployment)
- [ ] Pipeline View (frontend) com stage cards por cor DTCG
- [ ] Artifact Inspector (frontend) com schema-aware rendering + diff
- [ ] Persona picker na criação de agents
- [ ] on_pipeline_advance trigger + on_artifact_created trigger
- [ ] Transversal agent routing (Code Reviewer, Tech Writer, Data Engineer, UX Designer)
- [ ] Development stage: Frontend Dev + Backend Dev + Fullstack Dev em paralelo
- [ ] Skills system (SKILL.md + files, injection por provider)

### Semana 7: Memory, Observability & Autopilots

- [ ] Agent Memory: embedding service (Gemini embeddings), SurrealDB MTREE index
- [ ] MemoryService: remember, recall, learn_from_artifact
- [ ] MEMORY.md injection no execenv
- [ ] OpenTelemetry: traces de task execution, pipeline transitions
- [ ] Métricas Prometheus (/metrics endpoint)
- [ ] Autopilots (create_issue + run_only mode, cron triggers)
- [ ] Chat sessions (direct agent chat fora de issues)
- [ ] Inbox + notifications
- [ ] Token usage tracking (task_usage)
- [ ] CLI: issue, pipeline, artifact, memory, persona, daemon commands

### Semana 8: Polish, Docs & Ship

- [ ] Calm UI: DTCG tokens aplicados em todos os componentes
- [ ] Pipeline colors por stage (ver Design Tokens)
- [ ] Dark mode
- [ ] Self-host install script (single curl → setup completo)
- [ ] Docker image
- [ ] README + docs de deployment
- [ ] E2E tests (pipeline completo: Discovery → Complete)
- [ ] Performance benchmarks (SurrealDB queries, NATS latency)
- [ ] Security review (JWT, token storage, input validation)
- [ ] Claude Code + Codex providers (além do Gemini)
- [ ] Import skills de URL externas
- [ ] Pins, Attachments, file upload

### Pós-MVP

- Desktop app (Tauri)
- NATS clustering (horizontal scaling)
- Skills marketplace
- Plugin system
- GitHub/GitLab integration nativa
- Webhook triggers para autopilots
- Audit log export
- SAML/SSO

## 13. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| SurrealDB 3.0 instabilidade ou breaking changes | Média | Alto | Pin versão exata, testes de integração extensivos, fallback plan para SQLite embedded |
| Leptos SSR performance em produção | Baixa | Médio | Benchmark early (Semana 1), fallback para SPA-only se necessário |
| Gemini structured output inconsistência | Média | Alto | Validation layer robusto com retry + feedback do schema; fallback para Claude |
| Escopo ainda agressivo para 8 semanas | Média | Alto | Semanas 7-8 são buffers implícitos; Memory e Observability podem ser movidos para pós-MVP sem comprometer o core |
| NATS embedded memory overhead em máquinas pequenas | Baixa | Baixo | Monitoring, limites configuráveis, fallback para in-process tokio channels |
| Vector search quality sem fine-tuning | Média | Médio | Benchmark com queries reais, ajustar embedding model, dimensão 768 é razoável para Gemini |
| 13 agents é muito para configurar manualmente | Alta | Médio | Personas pré-configuradas com system prompts prontos — usuário só precisa escolher a persona e dar um nome |

## 14. Meta: Construindo Ensi com BMad Method

O próprio Ensi será desenvolvido usando o pipeline BMad que implementa — dogfooding completo.

**Fase 1 (Bootstrap):** Issues gerenciadas em ferramenta genérica. Agents executam tasks via CLI diretamente. Sem pipeline visual.

**Fase 2 (Hybrid):** Conforme o Ensi atinge MVP, migramos o desenvolvimento para dentro do próprio Ensi. Pipeline View começa a guiar o desenvolvimento.

**Fase 3 (Self-hosted):** Ensi gerencia 100% do seu próprio desenvolvimento. Cada feature passa pelo pipeline completo: Analyst → PM → Architect → SM → Dev → QA → DevOps.

A primeira issue é uma BP (Brainstorm / Create Brief) para o Analyst — o primeiro agente a ser ativado.
