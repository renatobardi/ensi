# Solmu — Architecture Document
**Phase:** 1 — The Local Hammer
**Architect Agent:** 2b9118e3-dfc7-44e9-92f9-91cc779d7206
**Date:** 2026-04-18
**Source Issue:** REN-54

---

## 1. Tech Stack Selection

### Runtime
**Rust (stable) + Tokio 1.36+**
- Why: Zero-cost async, no GC pauses, single-binary output, native cross-compilation. Alternatives (Go, C++) rejected: Go has GC jitter at high concurrency; C++ lacks modern async primitives without heavy deps.
- Trade-off: Longer compile times; mitigated by CI caching of `~/.cargo/registry` and `target/`.
- Constraint: `edition = "2021"`, MSRV = 1.75 (required for `impl Trait` in return position and async fn in traits).

### CLI Framework
**Clap 4.5+ (Derive API)**
- Why: Derive API generates boilerplate-free arg parsing with built-in help, validation, and shell completions. Alternatives (argh, bpaf) have smaller ecosystems.
- Trade-off: Compile-time cost; acceptable for a CLI tool.

### HTTP Client
**reqwest 0.12+ with rustls**
- Why: reqwest is the de-facto async HTTP client for Rust. `rustls` replaces OpenSSL — critical for cross-compilation to Windows/musl targets without system libs.
- Constraint: `default-features = false`, `features = ["json", "rustls-tls"]`. Never enable `native-tls`.
- Pool config: `pool_max_idle_per_host` = `--connections` value, `tcp_keepalive = 30s`, `danger_accept_invalid_certs(true)`.

### Terminal UI
**indicatif 0.17+**
- Why: Only production-grade Rust library for multi-progress-bar + live stat display. No viable alternative.
- Constraint: Use `ProgressBar` with custom template; do not write to stdout directly while indicatif is active (races with progress rendering).

### URL Parsing
**url 2.5+ (WHATWG URL Standard)**
- Why: Canonical Rust URL library, same spec as browsers. Needed for hostname extraction before DNS resolution.

### Error Handling
**thiserror 1.0+ (library errors) + anyhow 1.0+ (application errors)**
- Why: Industry-standard dual pattern. `thiserror` for typed errors in `solmu-engine` (library crate must expose typed errors). `anyhow` for `solmu-cli` (application layer where context propagation matters more than error types).

### Cross-Compilation
**cargo-zigbuild (latest)**
- Why: Zig's cross-linker eliminates glibc version hell for Linux targets and enables macOS cross-compilation from Linux CI runners. Only tool that supports all 5 targets from a single ARM64 Linux host.
- Alternative rejected: `cross` (Docker-based, heavy, forbidden by Zero External Processes constraint).

### CI/CD
**GitHub Actions + Self-Hosted ARM64 Runner (Oracle Cloud)**
- Why: Free-tier GitHub-hosted runners can't cross-compile macOS targets; ARM Oracle VM is already running 24/7 at zero cost. This eliminates GitHub Actions minute consumption on expensive macOS runners.
- PR pipeline: `cargo fmt --check` + `cargo clippy --all-targets -- -D warnings` + `cargo test --all`.
- Release pipeline: triggered by `v*.*.*` tag on `main`, produces 5 binary artifacts via cargo-zigbuild.

### Third-Party Services
None for Phase 1. No auth, no monitoring, no external APIs. Phase 2+ will add SurrealDB (embedded), NATS (embedded), and Gemini API.

---

## 2. System Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         solmu-cli                           │
│  ┌──────────┐   ┌───────────┐   ┌──────────────────────┐   │
│  │  main.rs │──▶│  Clap CLI │──▶│  attack.rs (Command) │   │
│  └──────────┘   └───────────┘   └──────────┬───────────┘   │
│                                             │               │
│                              ┌──────────────▼─────────┐    │
│                              │  validator.rs           │    │
│                              │  (Port: TargetValidator)│    │
│                              └──────────────┬──────────┘    │
│                                             │ validated URL  │
└─────────────────────────────────────────────┼───────────────┘
                                              │ AttackConfig
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        solmu-engine                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  pool.rs (WorkerPool)                              │    │
│  │  - Tokio semaphore (max concurrent = --connections) │    │
│  │  - Token bucket rate limiter (--rate req/s)        │    │
│  │  - Spawns Tokio tasks up to duration               │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │ spawns N tasks                        │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  worker.rs (HttpWorker)                              │  │
│  │  - Acquires semaphore permit                         │  │
│  │  - Sends HTTP request via reqwest::Client (shared)   │  │
│  │  - Records latency                                   │  │
│  │  - Sends RequestResult via MPSC tx                   │  │
│  └──────────────────────────┬─────────────────────────┘   │
│                              │ mpsc::Sender<RequestResult>  │
│                              ▼                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  collector.rs (MetricsCollector)                     │  │
│  │  - mpsc::Receiver<RequestResult>                     │  │
│  │  - Aggregates: counts, latency histogram             │  │
│  │  - Emits LiveStats periodically (for UI)             │  │
│  └──────────────────────────┬─────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  report.rs (ReportBuilder)                           │  │
│  │  - Computes percentiles (p50/p90/p99/max/min)        │  │
│  │  - Determines exit status (error_rate threshold)     │  │
│  │  - Outputs text or JSON                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Service Boundaries and Communication Patterns

- `solmu-cli` → `solmu-engine`: passes `AttackConfig` struct (pure data), receives `AttackReport` struct. No trait coupling needed at this boundary for Phase 1 — direct struct passing is appropriate for a single-command MVP.
- `WorkerPool` → `HttpWorker`: spawns tasks via `tokio::spawn`, no direct function calls.
- `HttpWorker` → `MetricsCollector`: `mpsc::Sender<RequestResult>` — fire and forget, non-blocking. Worker never calls collector methods.
- `MetricsCollector` → UI layer: separate `watch::Sender<LiveStats>` for live display (non-blocking broadcast to indicatif update loop).

### Hexagonal Boundaries (Ports & Adapters)

| Port | Trait | Phase 1 Adapter |
|------|-------|-----------------|
| `TargetValidator` | `ValidateTarget: Fn(&Url) -> Result<(), SecurityError>` | `LocalOnlyValidator` (IP + DNS check) |
| `HttpSender` | `SendRequest: async fn(Request) -> RequestResult` | `ReqwestAdapter` |
| `MetricsSink` | `mpsc::Sender<RequestResult>` | Tokio MPSC channel |
| `Reporter` | `BuildReport: Fn(AggregatedMetrics) -> Report` | `PercentileReporter` |

### Critical Data Flow: Attack Execution

```
CLI parses args
  → AttackConfig validated (URL security check)
  → reqwest::Client constructed (single instance, shared via Arc)
  → MPSC channel created (tx cloned per worker)
  → Collector task spawned (consumes rx)
  → WorkerPool starts (respects semaphore + rate limiter)
    → Each task: acquire permit → send request → record latency → send result via tx → release permit
  → Duration elapses → pool stops spawning → awaits in-flight tasks
  → tx dropped → collector drains remaining results
  → Report built → output rendered → process exits
```

### Deployment Topology

Single-binary CLI. No daemon, no server, no socket. Executes, reports, exits. Architecture is intentionally trivial for Phase 1 — the complexity is in Phase 3+ (daemon mode, SaaS).

---

## 3. Data Model

### Core Structs (In-Memory, Phase 1)

```rust
// solmu-engine/src/config.rs
pub struct AttackConfig {
    pub target: Url,
    pub method: HttpMethod,
    pub payload: Option<PathBuf>,
    pub headers: Vec<(String, String)>,
    pub connections: u16,          // 1..=5000
    pub duration_secs: u32,        // 1..=3600
    pub rate: Option<u32>,         // req/s; None = max throughput
    pub timeout_ms: u64,           // default 5000
    pub output_format: OutputFormat,
}

pub enum HttpMethod { Get, Post, Put, Delete, Patch }
pub enum OutputFormat { Text, Json }

// solmu-engine/src/metrics/types.rs
pub struct RequestResult {
    pub latency_us: u64,           // microseconds for precision
    pub status: RequestStatus,
    pub timestamp: Instant,
}

pub enum RequestStatus {
    Success(u16),                  // HTTP status code
    Timeout,
    ConnectionRefused,
    OtherError(String),
}

pub struct LiveStats {
    pub elapsed_secs: f64,
    pub throughput_rps: f64,
    pub error_rate_pct: f64,
    pub p99_ms: u64,
}

pub struct AttackReport {
    pub config_snapshot: AttackConfig,
    pub total_requests: u64,
    pub successful: u64,
    pub failed: u64,
    pub throughput_rps: f64,
    pub success_rate_pct: f64,
    pub latency: LatencyStats,
    pub errors: ErrorBreakdown,
    pub exit_status: ExitStatus,
}

pub struct LatencyStats { pub p50_ms: u64, pub p90_ms: u64, pub p99_ms: u64, pub max_ms: u64, pub min_ms: u64 }
pub struct ErrorBreakdown { pub timeout: u64, pub connection_refused: u64, pub other: u64 }
pub enum ExitStatus { Success, Failure }  // maps to exit(0)/exit(1)
```

### Percentile Calculation Strategy

Collect all latency values in a `Vec<u64>` (microseconds). Sort at end-of-run. Use index-based percentile: `p99 = sorted[ceil(n * 0.99) - 1]`. For very long runs (>10M requests), cap the Vec at 10M samples using reservoir sampling (not needed for MVP but document the ceiling).

### No Persistence in Phase 1

All data is in-memory. No files written except `--output json > file` via shell redirection. No SQLite, no CSV. Phase 2 introduces SurrealDB (embedded).

---

## 4. API Design

Phase 1 has no HTTP API. The "API" is the CLI interface and the internal MPSC channel protocol.

### CLI Contract (Clap Derive)

```rust
#[derive(Parser)]
#[command(name = "solmu", version)]
pub enum Cli { Attack(AttackArgs) }

#[derive(Args)]
pub struct AttackArgs {
    #[arg(short = 't', long, value_name = "URL")]
    pub target: String,
    #[arg(short = 'm', long, default_value = "GET")]
    pub method: HttpMethod,
    #[arg(long, value_name = "FILE")]
    pub payload: Option<PathBuf>,
    #[arg(long = "header", value_name = "KEY:VALUE", action = ArgAction::Append)]
    pub headers: Vec<String>,
    #[arg(short = 'c', long, default_value = "50", value_parser = clap::value_parser!(u16).range(1..=5000))]
    pub connections: u16,
    #[arg(short = 'd', long, default_value = "30", value_parser = clap::value_parser!(u32).range(1..=3600))]
    pub duration: u32,
    #[arg(short = 'r', long)]
    pub rate: Option<u32>,
    #[arg(long, default_value = "5000")]
    pub timeout: u64,
    #[arg(long, default_value = "text")]
    pub output: OutputFormat,
}
```

### Exit Code Convention

| Code | Meaning |
|------|---------|
| 0 | Attack completed, error_rate < 5% (SUCCESS) |
| 1 | Attack completed, error_rate >= 5% (FAILURE — use in CI assertions) |
| 2 | Tool/usage error (invalid args, security rejection, DNS failure, file not found) |

### MPSC Channel Protocol

`mpsc::channel<RequestResult>` with buffer size = `connections * 2`. Bounded channel provides back-pressure if collector falls behind — this is intentional.

### Rate Limiting and Concurrency Protocol

See ADR-003 for the definitive `--connections × --rate` interaction decision.

### Error Response Format

CLI errors output to stderr, machine-parseable in JSON mode:
```json
{"error": "target rejected: resolved IP 93.184.216.34 is not in a private range", "code": 2}
```

---

## 5. Cross-Cutting Concerns

### Authentication & Authorization

None for Phase 1. The security model is *isolation by network scope*, not authentication. Default-to-Local is the authorization boundary: only private network targets are reachable.

### Default-to-Local Security (Critical — Day 1)

**Algorithm (see ADR-001 for full decision rationale):**

```
fn validate_target(url: &Url) -> Result<(), SecurityError> {
    let host = url.host_str().ok_or(SecurityError::MissingHost)?;

    let addrs: Vec<IpAddr> = match host.parse::<IpAddr>() {
        Ok(ip) => vec![ip],                          // IP literal: no DNS needed
        Err(_) => resolve_dns(host)?                 // hostname: resolve all A/AAAA records
    };

    for ip in &addrs {
        if !is_private(ip) {
            return Err(SecurityError::PublicIpBlocked(*ip));
        }
    }
    Ok(())
}

fn is_private(ip: &IpAddr) -> bool {
    // 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
    // IPv6: ::1, fc00::/7
}
```

DNS resolution uses `tokio::net::lookup_host`. If resolution fails (NXDOMAIN, network error), the tool returns exit(2) with an informative message. This is the secure default — we cannot verify the target is local if we cannot resolve it.

No bypass flag. No `--allow-public` flag in Phase 1 or any phase without a formal ADR.

### Observability

Phase 1: stderr logging only via `eprintln!` for debug-level diagnostics. No structured logging framework (overkill for a CLI tool). `RUST_LOG` env var support via `env_logger` can be added in Phase 2 if needed.

### Error Handling

- All errors in `solmu-engine` use `thiserror`-derived types. No `unwrap()` or `expect()` in library code.
- `solmu-cli` uses `anyhow::Result` and the `?` operator for propagation.
- Fatal errors print to stderr and call `std::process::exit(2)`.
- Panics are reserved for genuine programmer errors (violated invariants). Use `debug_assert!` not `assert!` for performance-sensitive paths.

### Security

- `rustls` only — no OpenSSL dependency (cross-compilation guarantee).
- `danger_accept_invalid_certs(true)` in reqwest client — acceptable for local-only tool.
- No shell command execution, no `include!()` of external files, no `unsafe` blocks without `// SAFETY:` comment.
- Payload file read via `std::fs::read` with bounded size check: reject files > 10 MB (prevents accidental memory exhaustion).
- Secrets (Authorization headers) are never printed in verbose output.
- Dependency scanning: `cargo audit` added to CI pipeline alongside clippy.

### Testing Strategy

| Layer | Tool | Target | Coverage Goal |
|-------|------|--------|---------------|
| Unit | `cargo test` | validator, percentile calc, config parsing | 100% of security-critical paths |
| Integration | `cargo test` (with mock server via `mockito` or `wiremock`) | worker + collector pipeline | Happy path + timeout path |
| Cross-platform | CI matrix | All 5 targets (compile only for non-native) | Binary produced without error |
| Performance | Manual + `/usr/bin/time -v` | 500 connections, 30s run | < 50 MB RSS, > 2000 req/s |

No e2e test framework. The DoD metrics table in the spec is the acceptance test.

---

## 6. Project Structure

```
solmu/
├── Cargo.toml                    # Workspace root: [workspace] members = ["crates/*"]
├── Cargo.lock                    # Committed — CLI tool, not a library
├── .github/
│   └── workflows/
│       ├── ci.yml                # PR checks: fmt + clippy + test
│       └── release.yml           # Tag-triggered: cargo-zigbuild 5 targets → GH Release
├── crates/
│   ├── solmu-cli/
│   │   ├── Cargo.toml            # bin crate; deps: solmu-engine, clap, anyhow, indicatif
│   │   └── src/
│   │       ├── main.rs           # Entry: parse CLI, call engine, render report, exit
│   │       ├── commands/
│   │       │   └── attack.rs     # AttackCommand: wire config, run engine, display
│   │       └── validator.rs      # LocalOnlyValidator: DNS resolve + IP range check
│   └── solmu-engine/
│       ├── Cargo.toml            # lib crate; deps: tokio, reqwest, url, thiserror, etc.
│       └── src/
│           ├── lib.rs            # Public API: pub use config::AttackConfig; pub async fn run(...)
│           ├── config.rs         # AttackConfig, HttpMethod, OutputFormat
│           ├── client.rs         # build_client(config) -> reqwest::Client (single instance)
│           ├── worker.rs         # HttpWorker: one Tokio task per request
│           ├── pool.rs           # WorkerPool: semaphore + rate limiter + spawn loop
│           └── metrics/
│               ├── mod.rs
│               ├── collector.rs  # MetricsCollector: mpsc receiver + aggregation
│               ├── report.rs     # PercentileReporter: sort + index percentiles
│               └── types.rs      # RequestResult, LiveStats, AttackReport, ExitStatus
```

### Module Dependency Rules

- `solmu-engine` has ZERO knowledge of `solmu-cli`. The engine is a library.
- `solmu-cli` imports `solmu-engine` via workspace path dependency only.
- No circular dependencies. Enforced by Rust's crate system.
- `metrics::collector` does not import `pool` or `worker`. Communication only via channel types.

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | snake_case | `worker.rs` |
| Structs/Enums | PascalCase | `AttackConfig` |
| Functions | snake_case | `build_client` |
| Constants | SCREAMING_SNAKE | `MAX_CONNECTIONS` |
| DB columns | N/A (Phase 1) | — |
| CLI flags | kebab-case | `--pool-max-idle` |

---

## 7. Implementation Constraints

### Performance Budgets

| Metric | Budget | Verification |
|--------|--------|-------------|
| RAM at 500 connections | < 50 MB RSS | `/usr/bin/time -v` on Linux |
| Throughput (localhost target) | > 2,000 req/s | Attack report output |
| Binary size (stripped) | < 15 MB per target | `ls -lh target/` |
| Cold start to first request | < 500ms | Not formally measured in Phase 1 |

### Browser/Device Support

Not applicable — CLI tool only in Phase 1.

### Accessibility

Not applicable — Phase 1 is terminal output only. Phase 2+ Leptos dashboard: target WCAG 2.1 AA.

### Accepted Technical Debt for MVP

| Debt | Why Accepted | Resolution Phase |
|------|-------------|-----------------|
| No reservoir sampling for latency vec | Only matters > 10M requests; unlikely in 30s runs | Phase 2 if needed |
| No structured logging | `eprintln!` sufficient for single-binary CLI | Phase 2 with daemon mode |
| No config file support | CLI flags sufficient for MVP | Phase 2 |
| Sorted Vec for percentiles (O(n log n)) | Acceptable for < 10M samples | Phase 2 with HDR histogram |
| `danger_accept_invalid_certs(true)` hardcoded | Local-only tool; no valid cert expected | Phase 2 when HTTPS external targets needed |

---

## 8. Implementation Sequencing

### Parallel Tracks

```
TRACK A (Core Engine):              TRACK B (Infrastructure):
[REN-55] Workspace skeleton   ─────▶ [REN-63] CI pipeline (starts after REN-55)
    ↓                                     ↓
[REN-56] Security validator         [REN-64] Release pipeline (starts after REN-63)
    ↓
[REN-57] AttackConfig + HTTP client
    ↓
[REN-58] Worker + MPSC metrics
    ↓
[REN-59] Worker pool + rate control
    ↓
[REN-60] Metrics report + output
    ↓
[REN-61] CLI (Clap) — integrates all
    ↓
[REN-62] Terminal UI (indicatif)
    ↓
[REN-65] README + GIF ◀──── merges with TRACK B here
    ↓
[REN-66] BMAD Review Gate
```

### Sequential Dependencies (hard)

1. REN-55 (skeleton) must be first — all other issues depend on the workspace structure.
2. REN-56 (security validator) must complete before any issue that makes HTTP calls (REN-57, REN-58, REN-59) — this is a constitutional constraint.
3. REN-57 (config + client) before REN-58 (worker) — worker depends on `AttackConfig` and `reqwest::Client`.
4. REN-58 (worker) before REN-59 (pool) — pool orchestrates workers.
5. REN-59 + REN-60 before REN-61 (CLI) — CLI is the integration point; all engine pieces must exist.
6. REN-61 before REN-62 (UI) — indicatif hooks into the running attack; CLI structure must exist.

### Parallel Opportunities

- REN-63 (CI pipeline) can start immediately after REN-55 — it doesn't need working code, only the workspace `Cargo.toml` and directory structure.
- REN-64 (release pipeline) can start after REN-63 is stable — it adds the release workflow on top of CI.
- REN-60 (metrics report) can be developed in parallel with REN-59 (pool) — they share types but don't depend on each other's implementation.

### Recommended First Vertical Slice (Proves Architecture End-to-End)

**REN-55 → REN-56 → REN-57 → partial REN-58:** Produce a binary that accepts `--target`, validates the URL (security check), constructs the reqwest client, sends a single HTTP request, prints the latency, and exits. This vertical slice exercises: Cargo workspace, Clap CLI, hexagonal validator, reqwest+rustls client, basic MPSC channel, and cross-compilation. If this compiles and runs on all 5 targets, the architecture is proven.

---

## 9. Decisions Log (ADRs)

### ADR-001: DNS Resolution Strategy for Default-to-Local Validator

**Context:** The spec defines security validation by IP range but only shows tests with IP literals. Real-world usage will involve hostnames (e.g., `http://myapp.local:3000`). A hostname-only check (no DNS) is bypassable: `evil-corp.com` could resolve to `10.0.0.1` and pass. But resolving DNS introduces a dependency on network availability.

**Decision:** Resolve hostnames to IP(s) at validation time using `tokio::net::lookup_host`. Check ALL resolved addresses against the private ranges. If ANY resolved IP is public, reject with exit(2). If DNS resolution fails (NXDOMAIN, timeout, network error), reject with exit(2) and a diagnostic message: `"Cannot verify target is local: DNS resolution failed for '{host}'. Solmu only accepts verifiable local targets."`

**Why not "allow on DNS failure":** Allowing unresolvable hostnames creates a bypass vector — an attacker-controlled DNS server (or poisoned cache) could make `public-api.com` appear to fail resolution, getting an allow. Rejecting on failure is the correct secure default.

**Why this doesn't hurt local development:** DNS resolution for `localhost`, `127.0.0.1`, and RFC-1918 hostnames works in any environment with a functioning loopback. Only broken/malicious DNS scenarios are affected.

**Consequences:** Users in strict air-gapped environments with broken DNS for their own internal hostnames will need to use IP literals instead of hostnames. This is acceptable — the error message guides them.

---

### ADR-002: Exit Code Convention

**Context:** The spec shows `Exit: SUCCESS (error rate < 5%)` in the report but doesn't define exit codes numerically.

**Decision:**
- `exit(0)` — attack completed, error_rate < 5%
- `exit(1)` — attack completed, error_rate >= 5%
- `exit(2)` — tool/usage error (security rejection, invalid args, DNS failure, file not found, etc.)

**Rationale:** Exit code 1 for "threshold exceeded" makes `solmu attack` directly useful in CI pipelines: `solmu attack --target http://localhost:3000 && deploy.sh`. Exit code 2 for usage errors follows POSIX convention (distinct from runtime failure), enabling scripts to differentiate "the attack ran but failed" from "the tool itself errored".

**Consequences:** CLI callers must handle 3 exit codes. Document in README and `--help` output.

---

### ADR-003: `--connections` × `--rate` Interaction

**Context:** If `--rate 100` and `--connections 1000`, two interpretations exist:
1. Spawn 1000 workers, each paced to 0.1 req/s (1000 idle goroutine-equivalents).
2. Use connections as a concurrency cap and rate as a throughput cap — both apply independently.

**Decision:** `--connections` = maximum concurrent in-flight HTTP requests (Tokio semaphore, acquired before `send()`, released after response). `--rate` = maximum new requests initiated per second (token bucket, applied to the spawn loop). Both constraints apply simultaneously and independently.

**Implementation:**
```rust
// Spawn loop pseudo-code:
loop {
    rate_limiter.acquire_one().await;          // blocks if rate exceeded
    let permit = semaphore.acquire().await?;   // blocks if connections exceeded
    tokio::spawn(async move {
        let result = worker.send().await;
        tx.send(result).await.ok();
        drop(permit);                          // releases semaphore slot
    });
    if elapsed >= duration { break; }
}
```

**Why this model:** Users who specify `--connections 1000 --rate 100` want at most 100 new requests per second, with at most 1000 outstanding at any time. They don't want 1000 idle workers — that wastes memory and Tokio task overhead. The semaphore + token bucket model is standard (used by wrk2, hey, vegeta).

**Memory implication:** Task memory is proportional to actual in-flight requests (bounded by semaphore), not total connection count. At 1000 connections, each in-flight task holds ~1 reqwest future (~4KB stack) = ~4 MB baseline. Well within the 50 MB budget.

**Consequences:** `--rate` and `--connections` are orthogonal flags. `--rate` without `--connections` uses default of 50 concurrent. `--connections` without `--rate` = max throughput (no rate limiter instantiated). Document clearly in `--help`.

---

### ADR-004: `--payload` with GET Behavior

**Context:** The spec says `--payload` "requires POST/PUT/PATCH" but doesn't define what happens when the user passes `--payload ./data.json --method GET`.

**Decision:** Hard error at validation time, exit(2):
```
Error: --payload is not allowed with GET or DELETE requests.
       Use --method POST, PUT, or PATCH to send a request body.
```

**Rationale:** Silent ignore would be confusing and hide user mistakes. HTTP GET with a body is technically allowed by the spec but semantically wrong and likely a user error. Fail loudly, fail early.

**Consequences:** Users who accidentally pass `--payload` with GET get an immediate, actionable error. No behavior change needed for the happy paths.

---

### ADR-005: Single reqwest::Client Instance

**Context:** The spec mandates "one single `reqwest::Client`, cloned per worker." Clarify what "cloned" means for reqwest.

**Decision:** Construct one `reqwest::Client` in `build_client(config)`. Pass it as `Arc<reqwest::Client>` to the worker pool. Each worker task receives a clone of the `Arc` (reference count increment), not a deep copy of the client. reqwest's internal connection pool is shared across all Arc clones — this is the intended behavior.

**Rationale:** reqwest::Client is already internally an Arc over a pool. Cloning is O(1). Using multiple Client instances would create multiple independent connection pools, wasting sockets and defeating keep-alive.

**Consequences:** All workers share one connection pool. `pool_max_idle_per_host` on that single client controls the maximum idle connections. Set to `--connections` value.

---

### ADR-006: Rate Limiter Implementation

**Context:** No rate limiter is in the mandated dependency list. Options: add `governor` crate (token bucket, production-grade) or implement a simple manual approach.

**Decision:** Use the `governor` crate (token bucket, `RateLimiter::direct`). Add to `solmu-engine` dependencies.

**Rationale:** Manual token bucket implementation has subtle bugs under load (clock drift, burst handling). `governor` is the standard Rust rate-limiting crate, battle-tested, and adds < 100KB to binary size. Acceptable for a performance tool.

**Alternative considered:** Manual `tokio::time::interval` approach — simpler but inaccurate at high rates due to interval drift.

**Consequences:** Add `governor = "0.6"` to `solmu-engine/Cargo.toml`. Single new dependency, no external processes.

---

### ADR-007: Self-Hosted Runner Network Requirements

**Context:** The Analyst flagged that the Oracle VM may have firewall restrictions preventing GitHub Actions connectivity.

**Decision:** This is a pre-condition for REN-64, not an architectural constraint. The Architecture Document records the requirement: the Oracle VM must have unrestricted outbound HTTPS (port 443) to `github.com`, `*.githubusercontent.com`, `*.actions.githubusercontent.com`, and `objects.githubusercontent.com` (for artifact upload). REN-64 must begin with a network verification step.

**Consequences:** REN-64 includes a pre-flight check: `curl -I https://github.com` from the VM before installing the runner. If blocked, the developer must configure iptables/firewall rules before proceeding.
