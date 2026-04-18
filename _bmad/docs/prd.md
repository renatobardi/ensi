# PRD — Solmu: Phase 1 (The Local Hammer)

**Version:** 1.1  
**Date:** 2026-04-18  
**Scope:** Phase 1 only. Phases 2–5 are explicitly out of scope.  
**Changelog v1.1:** Added Hard Constraints Manifest (§0), updated NFRs, added Constraint Enforcement Strategy (§8).

---

## 0. Hard Constraints Manifest (Inviolable)

These constraints apply across **all phases** of Solmu. They are not negotiable and any deviation requires a formal ADR approved before implementation.

| Constraint | Rule |
|-----------|------|
| **Single-Binary Deployment** | The entire system must compile into one executable. No sidecar processes, no daemons, no Docker Compose dependencies. |
| **Zero External Processes** | Forbidden: Postgres, Redis, Kafka, RabbitMQ, or any database/broker that requires a separate container or process. |
| **Embedded Message Bus** | NATS must be used in embedded mode (in-process). No external NATS server. Required from Phase 3 onward. |
| **Embedded Persistence** | SurrealDB must be used in embedded mode (in-process). No external SurrealDB server. Required from Phase 3 onward. |
| **Frontend Zero-JS-Toolchain** | The dashboard UI (Phase 2) must be built with Leptos (SSR + WASM). State must use Leptos Signals exclusively. Forbidden: React, Vue, Svelte, Zustand, or any npm/node-based toolchain. |
| **Backend Concurrency Stack** | Load engine and HTTP routing must use Rust + Axum + Tokio. No other async runtimes (async-std, smol). |
| **Event-Driven Inter-Component Communication** | Communication between the load engine, chaos injector, and dashboard must flow exclusively through the embedded NATS bus. No direct function calls across component boundaries from Phase 3 onward. |
| **C4 Architecture Mapping** | Every new component introduced in any phase must be mapped in a C4 context or container diagram before implementation. |
| **ADR Gate** | Any deviation from the stack (different library, different pattern, different protocol) requires a formal ADR merged to `_bmad/docs/adrs/` before the implementing PR is opened. |
| **Default-to-Local Security** | Execution against any target is unrestricted only within RFC 1918 + loopback. Public targets require Proof-of-Ownership (Phase 5). This is a security invariant, not a feature flag. |

---

## 1. Product Overview

### Vision Statement

Solmu is a single-binary load generator that lets developers stress-test local services safely, with zero configuration overhead and provably bounded resource usage.

### Problem Summary

Developers building services on ARM-based infrastructure (Oracle Cloud aarch64) have no lightweight, Rust-native tool to generate realistic HTTP load against localhost targets. Existing tools (wrk, k6, hey) are either x86-centric, runtime-heavy, or require YAML configs for basic use. Solmu fills that gap with a CLI that starts in under 100ms, enforces a hard local-only policy, and fits entirely within 50MB RSS at 500 concurrent connections.

### Target Users

| Persona | Context |
|---------|---------|
| **Backend Developer** | Runs services locally on a MacBook or ARM VM, wants a `cargo install` tool to smoke-test endpoints before CI |
| **SRE / Platform Engineer** | Needs reproducible load profiles scriptable via JSON output for pipeline integration |

---

## 2. Functional Requirements

### 2.1 CLI Interface

| ID | Requirement |
|----|-------------|
| FR-01 | The system must accept `--url <URL>` (required): the HTTP(S) target endpoint |
| FR-02 | The system must accept `--threads <N>` (default: 10, range: 1–10 000): max concurrent requests in-flight |
| FR-03 | The system must accept `--duration <S>` (default: 30, range: 1–3 600): test wall-clock seconds |
| FR-04 | The system must accept `--timeout <MS>` (default: 5 000): per-request timeout in milliseconds |
| FR-05 | The system must accept `--output <terminal\|json>` (default: terminal): result format |
| FR-06 | Invalid argument values must print a structured error to stderr and exit with code 1 before any network activity |

### 2.2 Target Guard

| ID | Requirement |
|----|-------------|
| FR-07 | The system must resolve the target hostname to an IP address exactly once, at startup, before emitting any request |
| FR-08 | The system must allow requests only when the resolved IP falls within: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, or `::1/128` |
| FR-09 | IPv6 ULA addresses (`fc00::/7`) must be **explicitly rejected** with a clear error message. They are not in the allowlist. Opt-in may be revisited in a future phase with an explicit `--allow-ula` flag |
| FR-10 | If the resolved IP does not match the allowlist, the process must abort with exit code 2 and a human-readable error before emitting any request |
| FR-11 | The system must not re-resolve DNS during the test run (TOCTOU mitigation) |

### 2.3 Load Engine

| ID | Requirement |
|----|-------------|
| FR-12 | The system must maintain at most `--threads` requests in-flight simultaneously, enforced by a counting semaphore |
| FR-13 | The system must send HTTP GET requests continuously until `--duration` seconds have elapsed, measured by a monotonic clock (`Instant`) |
| FR-14 | Response bodies must be discarded immediately upon receipt; only status codes and timing are retained |
| FR-15 | The HTTP connection pool size must be set equal to `--threads` to avoid overprovisioning |
| FR-16 | Request errors (timeout, connection refused, non-2xx) must be counted and not cause a panic |

### 2.4 Metrics Collection

| ID | Requirement |
|----|-------------|
| FR-17 | The system must count total requests, successful requests (2xx), and error requests using lock-free atomic counters |
| FR-18 | The system must record per-request latency in a 64-bucket power-of-two histogram without mutex contention |
| FR-19 | The system must compute p50, p95, and p99 latency from the histogram at the end of the test |
| FR-20 | All metric operations must be safe under concurrent access from multiple async tasks |

### 2.5 Reporter

| ID | Requirement |
|----|-------------|
| FR-21 | In `terminal` mode, the system must print a live throughput line updated in place using `\r` (no scrolling) |
| FR-22 | At test end, the system must print a summary: total requests, RPS, error rate, p50/p95/p99 latency |
| FR-23 | In `json` mode, the system must print a single JSON object to stdout with the same metrics, suitable for pipeline consumption |
| FR-24 | The system must exit with code 0 on successful test completion |

---

## 3. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | RSS must remain below 50MB with `--threads 500` on aarch64-unknown-linux-gnu, measured via `/proc/self/status` VmRSS in the integration test |
| NFR-02 | Performance | Binary startup to first request must be under 200ms on aarch64 |
| NFR-03 | Security | No request must be emitted to any IP outside the allowlist, under any input or DNS condition |
| NFR-04 | Security | The crate must not expose any network listener; Solmu is a pure client |
| NFR-05 | Reliability | The engine must not panic on any request error; errors are counted and surfaced in the report |
| NFR-06 | Portability | The binary must compile and pass all tests on `aarch64-unknown-linux-gnu` and `x86_64-unknown-linux-gnu` |
| NFR-07 | Portability | The binary must compile on `aarch64-apple-darwin` (macOS M-series) for local developer use |
| NFR-08 | Observability | Exit codes must be deterministic: 0 = success, 1 = arg error, 2 = guard rejection |
| NFR-09 | Maintainability | Each module (`cli`, `guard`, `engine`, `metrics`, `reporter`) must have zero cross-module coupling except through explicit function calls — no shared global state |
| NFR-10 | Build | The Solmu crate must live inside the `ensi` Cargo workspace as `crates/solmu` (see §6 for rationale) |
| NFR-11 | Build | `cargo build --release -p solmu` must produce exactly one binary artifact. CI must assert artifact count = 1. |
| NFR-12 | Build | `cargo deny check` must pass on every CI run with a ban list that includes: `sqlx` (postgres/mysql features), `redis`, `tokio-postgres`, `lapin` (AMQP), and any crate that spawns an external process as a side-effect of initialization |
| NFR-13 | Security | The `guard` module must be the sole location in the codebase where IP allowlist decisions are made. Semgrep rule `no-ip-bypass` must enforce this: any IP address literal outside `guard.rs` triggers a CI failure |
| NFR-14 | Architecture | Every PR that adds a new `[dependencies]` entry to any crate in the workspace must include a one-line justification in the PR description. The Architect agent reviews all dependency additions |
| NFR-15 | Architecture | The workspace `Cargo.toml` must declare all future crate slots as commented placeholders (`# crates/solmu-chaos`, `# crates/solmu-dashboard`, etc.) so that Phase 2–5 additions are anticipated and do not restructure the workspace layout |

---

## 4. Epics

### Epic 1 — Core Binary (E-01)
Stand up the Cargo workspace, implement the five modules, and produce a working binary that passes all unit tests.

Stories: US-01, US-02, US-03, US-04, US-05

### Epic 2 — Test Suite (E-02)
Implement the full unit and integration test suite, including the ARM RSS gate.

Stories: US-06, US-07, US-08, US-09, US-10

### Epic 3 — CI Pipeline (E-03)
Configure GitHub Actions to cross-compile and run the integration test on aarch64.

Stories: US-11

---

## 5. User Stories

### US-01 — Cargo Workspace Scaffolding
**As a** backend developer,  
**I want** `cargo build -p solmu` to produce a working binary,  
**so that** I can install it without leaving the ensi workspace.

**Acceptance criteria:**
- **Given** the ensi repo root, **when** `cargo build -p solmu` runs, **then** it exits 0 and produces `target/debug/solmu`
- **Given** `Cargo.toml` at repo root, **when** inspected, **then** it declares a `[workspace]` with `members = ["crates/solmu", ...]`
- **Given** `crates/solmu/Cargo.toml`, **when** inspected, **then** `[[bin]]` target is named `solmu`

**Effort:** S  
**Parallelism:** Sequential (blocks all others)  
**Dependencies:** none

---

### US-02 — CLI Argument Parsing
**As a** developer,  
**I want** `solmu --url http://localhost:8080 --threads 50 --duration 10` to parse without error,  
**so that** I can drive tests with a single command.

**Acceptance criteria:**
- **Given** valid args, **when** parsed, **then** all fields are populated with expected values
- **Given** `--threads 0`, **when** parsed, **then** process exits 1 with a range-error message on stderr
- **Given** `--threads 10001`, **when** parsed, **then** same rejection
- **Given** `--duration 0` or `--duration 3601`, **when** parsed, **then** process exits 1
- **Given** a non-HTTP URL, **when** parsed, **then** process exits 1

**Effort:** S  
**Parallelism:** Can run parallel to US-03, US-04, US-05 after US-01  
**Dependencies:** US-01

---

### US-03 — Target Guard
**As a** security-conscious developer,  
**I want** Solmu to refuse targets outside RFC 1918 / loopback,  
**so that** it cannot be accidentally (or maliciously) used as a DoS tool against public hosts.

**Acceptance criteria:**
- **Given** `--url http://127.0.0.1:8080`, **when** guard runs, **then** passes
- **Given** `--url http://10.0.0.1`, **when** guard runs, **then** passes
- **Given** `--url http://172.16.0.1`, **when** guard runs, **then** passes
- **Given** `--url http://192.168.0.1`, **when** guard runs, **then** passes
- **Given** `--url http://[::1]:8080`, **when** guard runs, **then** passes
- **Given** `--url http://8.8.8.8`, **when** guard runs, **then** aborts with exit 2 before any request
- **Given** `--url http://[fc00::1]` (ULA), **when** guard runs, **then** aborts with exit 2 and message explaining ULA is not supported
- **Given** a hostname that resolves to a public IP, **when** guard runs, **then** aborts with exit 2
- **Given** a passing guard, **when** test runs, **then** DNS is not re-resolved

**Effort:** S  
**Parallelism:** Parallel to US-02, US-04, US-05 after US-01  
**Dependencies:** US-01

---

### US-04 — Load Engine
**As a** developer,  
**I want** Solmu to saturate my local service with exactly `--threads` concurrent requests for `--duration` seconds,  
**so that** I get a realistic stress profile.

**Acceptance criteria:**
- **Given** `--threads 10 --duration 5` against a mock server, **when** test runs, **then** at most 10 requests are in-flight at any instant
- **Given** `--duration 5`, **when** test runs, **then** no new requests are started after 5 seconds (monotonic clock)
- **Given** a server that returns 500, **when** test runs, **then** errors are counted and the engine does not panic
- **Given** a server that drops connections, **when** test runs, **then** errors are counted and the engine continues

**Effort:** M  
**Parallelism:** Parallel to US-02, US-03, US-05 after US-01  
**Dependencies:** US-01

---

### US-05 — Metrics and Reporter
**As a** developer,  
**I want** a summary of RPS, error rate, and latency percentiles after the test,  
**so that** I can evaluate my service's performance at a glance.

**Acceptance criteria:**
- **Given** a completed test, **when** `--output terminal`, **then** summary prints p50/p95/p99, RPS, and error count to stdout
- **Given** a completed test, **when** `--output json`, **then** stdout is valid JSON with keys: `total_requests`, `rps`, `error_count`, `p50_ms`, `p95_ms`, `p99_ms`
- **Given** concurrent metric updates from 500 tasks, **when** histogram is read, **then** no data race occurs (verified by `cargo test --release` with thread sanitizer optional)
- **Given** `--output terminal`, **when** test is running, **then** live line updates in place using `\r`

**Effort:** S  
**Parallelism:** Parallel to US-02, US-03, US-04 after US-01  
**Dependencies:** US-01

---

### US-06 — Guard Unit Tests (15 cases)
**As a** maintainer,  
**I want** exhaustive unit tests for `guard.rs`,  
**so that** any future allowlist change is caught immediately.

**Acceptance criteria:**
- All 15 cases specified in the Analyst's design pass: loopback, RFC 1918 boundary conditions, IPv6 loopback, IPv6 ULA rejection, public IP rejection, DNS resolution against a known public domain
- Tests run with `cargo test -p solmu guard`

**Effort:** S  
**Parallelism:** Parallel to US-07–US-10 after US-03  
**Dependencies:** US-03

---

### US-07 — CLI Unit Tests (11 cases)
**As a** maintainer,  
**I want** unit tests for every arg validation rule,  
**so that** invalid inputs are always rejected with correct exit codes.

**Acceptance criteria:**
- 11 cases: valid full args, each default value, threads range boundaries (0, 1, 10000, 10001), duration boundaries, invalid URL
- Tests run with `cargo test -p solmu cli`

**Effort:** S  
**Parallelism:** Parallel to US-06, US-08–US-10 after US-02  
**Dependencies:** US-02

---

### US-08 — Engine Unit Tests (8 cases)
**As a** maintainer,  
**I want** engine tests using a mock HTTP server,  
**so that** concurrency and duration enforcement are verified without a real service.

**Acceptance criteria:**
- 8 cases: semaphore bounds at exact thread count, duration cutoff, 500 error counted, connection drop counted, no panics under any error condition
- Tests use an in-process mock HTTP server (e.g., `httptest` crate or axum `TestServer`)

**Effort:** M  
**Parallelism:** Parallel to US-06, US-07, US-09, US-10 after US-04  
**Dependencies:** US-04

---

### US-09 — Metrics Unit Tests (8 cases)
**As a** maintainer,  
**I want** metrics tests under concurrent load,  
**so that** the atomic histogram is provably correct.

**Acceptance criteria:**
- 8 cases: atomicidade (spawn 100 tasks updating simultaneously), bucket assignment for known latency values, p50/p95/p99 output matches expected distribution
- Tests run with `cargo test -p solmu metrics`

**Effort:** S  
**Parallelism:** Parallel to US-06, US-07, US-08, US-10 after US-05  
**Dependencies:** US-05

---

### US-10 — Integration Test: RSS Gate (aarch64)
**As a** platform engineer,  
**I want** an integration test that measures real RSS on the target architecture,  
**so that** the 50MB budget is enforced on every CI run.

**Acceptance criteria:**
- **Given** `--threads 500 --duration 10` against a local mock server on aarch64, **when** test runs, **then** VmRSS stays below 50 000 kB throughout
- Test is tagged `#[ignore]` locally and enabled by CI via `cargo test --test integration -- --include-ignored`
- Test fails with a clear message showing observed RSS if the budget is exceeded

**Effort:** M  
**Parallelism:** Sequential (requires all US-0x complete)  
**Dependencies:** US-04, US-05

---

### US-11 — CI Matrix (GitHub Actions)
**As a** platform engineer,  
**I want** CI to build and test on `x86_64-unknown-linux-gnu` and `aarch64-unknown-linux-gnu`,  
**so that** the RSS gate runs on the actual target architecture.

**Acceptance criteria:**
- **Given** a push to any PR branch, **when** CI runs, **then** `cargo test -p solmu` passes on both targets
- **Given** the aarch64 job, **when** it runs, **then** the integration test with `--include-ignored` executes and the RSS gate is enforced
- Cross-compilation uses `cross` or a native aarch64 runner (decision deferred to Architect per §7)
- macOS `aarch64-apple-darwin` is tested as a third matrix leg (unit tests only, no Linux RSS gate)

**Effort:** M  
**Parallelism:** Sequential (requires US-10 complete)  
**Dependencies:** US-10

---

## 6. MVP Scope

### In scope (Phase 1)

- `crates/solmu` binary crate inside the `ensi` Cargo workspace
- Five modules: `cli`, `guard`, `engine`, `metrics`, `reporter`
- Hard local-only guard (RFC 1918 + loopback; IPv6 ULA explicitly rejected)
- Atomic, mutex-free metrics with power-of-two histogram
- Terminal and JSON output modes
- 42 unit test cases + 1 integration RSS gate
- CI matrix: x86_64-linux, aarch64-linux, aarch64-macos

### Out of scope (Phase 1)

| Feature | Rationale |
|---------|-----------|
| HTTP POST / custom methods | Not needed to validate the load engine |
| Custom headers / body | Out of MVP scope |
| Axum dashboard (Leptos) | Phase 2 |
| OTLP telemetry | Phase 2 |
| NATS / SurrealDB | Phase 3 |
| LLM agent integration | Phase 4 |
| Zero-trust ownership handshake | Phase 5 |
| IPv6 ULA (`fc00::/7`) support | Deferred; explicit `--allow-ula` flag considered for Phase 5 |
| HTTPS certificate validation bypass | Never in scope |
| Public-IP allowlist | Phase 5 (ownership proof required) |

### Cargo Workspace Decision: Inside ensi

Solmu lives at `crates/solmu` inside the `ensi` workspace rather than as a standalone repo because:

1. Phase 2 integrates Solmu's engine directly with the Leptos dashboard crate — shared workspace eliminates cross-repo dep management
2. The ensi workspace already owns the Tokio and reqwest dependency graph; a standalone crate would duplicate it
3. CI matrix for aarch64 is shared infrastructure across all ensi crates
4. The ensi repo description explicitly lists 8 crates — Solmu is the first

---

## 8. Constraint Enforcement Strategy

The question is: **how does the Architect ensure that code generated by development agents doesn't violate the Hard Constraints Manifest (§0)?**

The answer is a defense-in-depth stack of six automated gates. No single gate is sufficient alone — together they make violation structurally impossible to merge.

### Layer 1 — Dependency Ban List (`cargo-deny`)

**What it catches:** External broker/DB clients, forbidden async runtimes, banned crates.

`cargo-deny` runs in CI as a required check on every PR. The `deny.toml` file (committed to repo root) declares:

```toml
[bans]
deny = [
  { name = "tokio-postgres" },
  { name = "sqlx", features = ["postgres", "mysql"] },
  { name = "redis" },
  { name = "lapin" },          # AMQP / RabbitMQ
  { name = "rdkafka" },        # Kafka
  { name = "async-std" },      # wrong async runtime
  { name = "smol" },
]
```

Any dev agent that tries to `cargo add redis` will break CI immediately, before a single line of business logic is written.

### Layer 2 — Single-Binary Artifact Assertion

**What it catches:** Accidental introduction of multiple binary targets or split deployments.

After `cargo build --release`, CI runs:

```bash
COUNT=$(find target/release -maxdepth 1 -type f -perm +111 -name 'solmu*' | wc -l)
[ "$COUNT" -eq 1 ] || (echo "Expected 1 binary, found $COUNT" && exit 1)
```

This fails if any dev agent adds a `[[bin]]` section that produces a second executable or a companion daemon.

### Layer 3 — Semgrep Custom Rules

**What it catches:** Guard bypass attempts, raw process spawning, hardcoded public IPs.

Three rules committed to `.semgrep/` and run in CI:

| Rule | Pattern | What it prevents |
|------|---------|-----------------|
| `no-ip-bypass` | IP address literal (`\b\d{1,3}\.\d{1,3}\.`) outside `src/guard.rs` | Dev agent adding a hardcoded IP exception anywhere else |
| `no-external-spawn` | `std::process::Command::new` with args matching `postgres\|redis\|nats-server\|surrealdb` | Dev agent spawning an external process to work around embedded constraint |
| `no-js-frameworks` | `wasm_bindgen` imports referencing `react\|vue\|zustand` in `*.rs` files | Frontend dev agent introducing a forbidden JS bridge |

These rules are the Architect's primary code-quality firewall. They encode the manifest as machine-checkable assertions.

### Layer 4 — ADR Gate (Process Guard)

**What it catches:** Stack deviations that are technically valid Rust but violate intent.

The Architect produces `_bmad/docs/adrs/adr-template.md` as part of the Architecture Document. The template is wired into CI via a PR title check:

- If a PR modifies `Cargo.toml` with a new dependency not present in the approved dependency list, CI posts a comment: "New dependency detected — ADR required."
- The PR cannot be merged until an ADR is present in `_bmad/docs/adrs/` that references the dependency.

This is enforced via a GitHub Actions step that diffs `Cargo.lock` and cross-references `_bmad/docs/adrs/`.

### Layer 5 — Architectural Fitness Functions (Integration Tests)

**What it catches:** Runtime violations — e.g., a dependency that silently connects to localhost:5432.

Two fitness functions run in the aarch64 CI leg alongside the RSS gate:

1. **Network isolation test:** After launching `solmu` against a mock target, `ss -tnp` is checked — any established connection to a port other than the mock server's port fails the test.
2. **Binary size gate:** `du -b target/release/solmu` must be below 50MB (the binary itself, not RSS). Bloat from forbidden embedded runtimes (e.g., a JS engine) would trip this.

### Layer 6 — Architect Agent PR Review (Human-in-the-Loop)

**What it catches:** Semantic violations that automated tools miss.

The Architect is configured as a required reviewer on the `ensi` repo for paths: `crates/*/Cargo.toml`, `.github/workflows/`, `_bmad/docs/adrs/`. Every PR touching these files triggers the Architect agent to review against the Hard Constraints Manifest before merge is allowed.

---

### Summary: Constraint → Gate Mapping

| Constraint | Layer 1 | Layer 2 | Layer 3 | Layer 4 | Layer 5 | Layer 6 |
|-----------|---------|---------|---------|---------|---------|---------|
| Single binary | | ✓ | | | | ✓ |
| No external processes | ✓ | | ✓ | ✓ | ✓ | ✓ |
| NATS embedded | ✓ | | ✓ | ✓ | | ✓ |
| SurrealDB embedded | ✓ | | | ✓ | | ✓ |
| Leptos only | | | ✓ | ✓ | | ✓ |
| Axum+Tokio only | ✓ | | | ✓ | | ✓ |
| Guard is sole IP authority | | | ✓ | | | ✓ |
| ADR before stack change | | | | ✓ | | ✓ |

---

## 7. Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-01 | Should CI use `cross` for aarch64 cross-compilation or a native Oracle Cloud aarch64 runner? `cross` is simpler to set up; native runner gives accurate RSS measurements | Architect |
| OQ-02 | Is `reqwest` the final HTTP client, or should `hyper` be used directly to tighten pool control? | Architect |
| OQ-03 | Should the histogram use 64 power-of-2 buckets (max ~34 years) or be capped at a practical max (e.g., 30s = bucket 35)? | Architect |
| OQ-04 | What is the PR merge strategy for the `ensi` workspace during Phase 1 — squash or merge commits? | Owner (renato.bardi@outlook.com) |
| OQ-05 | The Analyst's product brief was claimed as an artifact but was not committed to the repo. The PRD above was reconstructed from the issue description and the architectural analysis comment. The Analyst should commit `_bmad/docs/product-brief.md` before the Architect begins, or the Architect should treat this PRD as the authoritative input. | Analyst / Owner |
