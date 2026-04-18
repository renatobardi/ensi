# Architecture Document — Solmu Phase 1 (The Local Hammer)

**Version:** 1.0  
**Date:** 2026-04-18  
**Scope:** Phase 1 only. Phases 2–5 extend this foundation but are not designed here.  
**Input:** `_bmad/docs/prd.md` v1.0

---

## 1. Tech Stack Selection

### Language & Runtime

| Choice | Version | Justification |
|--------|---------|---------------|
| **Rust** (stable) | 1.78+ | Deterministic memory usage (no GC pauses), zero-cost async, first-class ARM support. Single-binary output requires no runtime installation. Non-negotiable per issue spec. |
| **Tokio** | 1.x (multi-thread scheduler) | Already in ensi workspace; powers Axum for Phase 2. `multi_thread` scheduler maximises CPU utilisation across the semaphore-bounded task pool. Alternative (`async-std`) would duplicate the dependency graph with no benefit. |

**Trade-offs accepted:** Longer compile times vs Go/Python; steeper contributor curve.

### HTTP Client — OQ-02 Resolution: `reqwest` over raw `hyper`

**Decision:** `reqwest 0.12` with `rustls-tls` feature.

| Dimension | reqwest 0.12 | hyper 1.x directly |
|-----------|-------------|-------------------|
| Pool control | `pool_max_idle_per_host(N)` — sets pool size exactly to `--threads` | Manual `Client` construction; must implement pool logic by hand |
| DNS resolution | `resolve()` override hooks allow injecting the pre-resolved IP | Must write custom resolver trait implementation |
| Error ergonomics | `reqwest::Error` classifies timeout vs connection vs protocol | Raw `hyper::Error` requires manual boxing and downcast |
| Phase 2 compatibility | Axum and reqwest share rustls; no OpenSSL on ARM | Direct hyper would require re-integrating TLS separately |
| Code volume | ~5 lines of client builder | ~80 lines of pool + connector boilerplate |

reqwest gives complete control over what Phase 1 needs (pool size, timeout, body discard) without the maintenance surface of raw hyper. The Analyst's design already assumed reqwest — this confirms it.

**ASSUMPTION:** `default-features = false, features = ["rustls-tls"]` to avoid OpenSSL on ARM cross-targets.

### CLI Parsing

**Clap 4.x** (derive macro): consistent with ensi workspace conventions (Axum/Clap stack). Provides built-in range validation, structured help, and exit code 1 on parse errors (satisfies FR-06). Alternative (`argh`) lacks range validators and is less maintained.

### Metrics — OQ-03 Resolution: 64 Buckets, Capped Semantics

**Decision:** 64 power-of-2 buckets, latency in microseconds, capped at `min(observed_µs, timeout_µs)`.

Rationale:
- 64 buckets span from 1µs (bucket 0) to 2⁶³ µs (~292k years). Only buckets 0–22 are practically reachable with the default 5000ms timeout (2²² µs = 4.19s, 2²³ = 8.39s).
- Capping at `timeout_µs` prevents timed-out requests from polluting high buckets and ensures p99 is always ≤ timeout, which is the meaningful worst-case for the user.
- No external crate: `AtomicU64` array of 64 elements, indexed by `63 - latency_µs.leading_zeros()`. No mutex, no allocation per request.

**Why not 35 buckets (30s cap):** the 64-bucket array is 512 bytes — negligible. Fewer buckets would require a special-casing constant that makes the code harder to read with no memory benefit.

### Build System

**Cargo workspace** inside `ensi` at `crates/solmu`. Justified in PRD §6. No alternative considered — this is a hard constraint (NFR-10).

### CI/CD — OQ-01 Resolution: Native Runners, Not `cross`

**Decision:** GitHub-hosted native runners for all three legs.

| Leg | Runner | Rationale |
|-----|--------|-----------|
| `x86_64-unknown-linux-gnu` | `ubuntu-24.04` | Native, no cross toolchain needed |
| `aarch64-unknown-linux-gnu` | `ubuntu-24.04-arm` | GitHub-hosted ARM runner (GA since 2024); native execution gives accurate RSS from `/proc/self/status`. QEMU emulation (used by `cross`) makes RSS measurements unreliable — up to 2× inflation — invalidating NFR-01 |
| `aarch64-apple-darwin` | `macos-14` (M-series) | Native M1/M2/M3, unit tests only; no Linux RSS gate |

`cross` is appropriate for projects lacking ARM infrastructure access. Since GitHub offers `ubuntu-24.04-arm` natively and the RSS gate is the primary CI deliverable, `cross` would introduce measurement noise that defeats the purpose of US-10. Rejected.

**ASSUMPTION:** The ensi GitHub org has ARM runner access (standard GitHub Teams/Enterprise, or public repo with GitHub-hosted ARM). If not available, fallback: use `cross` for compile-only legs and provision one Oracle Cloud aarch64 self-hosted runner exclusively for the RSS integration test job.

### Third-Party Services

None for Phase 1. Gemini API, NATS, SurrealDB, OpenTelemetry are Phase 4, 3, 2 concerns respectively.

---

## 2. System Architecture

### C4 Context Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Developer's Machine                    │
│                                                           │
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │  Developer   │─stdin──▶│     solmu (binary)        │  │
│  │  (CLI user)  │◀─stdout─│                           │  │
│  └──────────────┘         │  ┌────────┐ ┌──────────┐ │  │
│                            │  │ guard  │ │ engine   │ │  │
│                            │  └────┬───┘ └────┬─────┘ │  │
│                            │       │           │       │  │
│                            │  ┌────▼───────────▼────┐ │  │
│                            │  │   metrics + reporter │ │  │
│                            │  └──────────────────────┘ │  │
│                            └──────────────┬────────────┘  │
│                                           │ HTTP GET        │
│                            ┌──────────────▼────────────┐  │
│                            │   Local Target Service     │  │
│                            │   (127.x / 10.x / 192.x)  │  │
│                            └───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### C4 Container: solmu binary internals

```
┌─────────────────────── solmu process ───────────────────────────┐
│                                                                   │
│  main()                                                           │
│   │                                                               │
│   ├─▶ cli::parse()          Clap derive — validates all args      │
│   │        │                exits 1 on range/type error           │
│   │        ▼                                                       │
│   ├─▶ guard::validate()     DNS resolve once → IP allowlist check │
│   │        │                exits 2 on rejection                   │
│   │        ▼                                                       │
│   ├─▶ engine::run()         Tokio semaphore, reqwest Client        │
│   │   ┌───────────────────────────────────────────┐               │
│   │   │  Arc<Semaphore(N)>                         │               │
│   │   │  loop until Instant::elapsed() > duration  │               │
│   │   │    acquire permit → spawn task →            │               │
│   │   │      GET → discard body → record latency    │               │
│   │   │      → release permit                       │               │
│   │   └────────────────┬──────────────────────────┘               │
│   │                    │ updates via Arc<Metrics>                   │
│   │                    ▼                                            │
│   ├─▶ metrics::Metrics  [AtomicU64 × 3] + [AtomicU64 × 64]       │
│   │                                                                │
│   └─▶ reporter::print() / reporter::print_json()                  │
│                                                                   │
└────────────────────────────────────────────────────────────────┘
```

### Critical Data Flow — Load Test Execution

```
1. main() calls cli::parse()
   → Config { url, threads, duration, timeout, output }

2. main() calls guard::validate(&config.url)
   → resolves hostname → checks IP → Ok(resolved_addr) or Err(exit 2)

3. main() builds reqwest::Client {
     pool_max_idle_per_host: threads,
     timeout: Duration::from_millis(timeout),
     resolve: pre-resolved addr (skips DNS during run)
   }

4. main() calls engine::run(config, client, Arc<Metrics>)
   → spawns Tokio tasks bounded by Semaphore(threads)
   → each task: acquire → GET → discard body → record µs → release
   → loop exits when Instant::elapsed() >= duration

5. engine::run() returns → main() calls reporter
   → terminal: print live \r line during run (via shared AtomicU64 counter)
   → at end: compute p50/p95/p99 from histogram → print summary
   → json: serialize Metrics to JSON → write to stdout

6. main() exits 0
```

### Deployment Topology

Single-binary, developer-local. No daemon, no network listener, no systemd unit. `cargo install` or direct binary copy. Phase 2 introduces Axum listener — out of scope here.

---

## 3. Data Model

No persistent storage in Phase 1. All state lives in process memory and is dropped on exit.

### In-Memory Metrics Structure

```rust
pub struct Metrics {
    pub total:   AtomicU64,          // incremented per request attempt
    pub success: AtomicU64,          // incremented on 2xx response
    pub errors:  AtomicU64,          // incremented on non-2xx, timeout, conn error
    pub hist:    [AtomicU64; 64],    // bucket[i] = count of requests in [2^i, 2^(i+1)) µs
}
```

**Histogram indexing:** `bucket = 63 - latency_µs.leading_zeros() as usize` (clamped to [0, 63]).  
**Percentile computation:** sequential scan of `hist` summing counts until threshold reached; O(64) — negligible.

**Live reporter state:** a single `AtomicU64` for requests completed, read by the reporter thread via `\r` update every 100ms. This is the only cross-thread communication outside `Metrics`.

---

## 4. API Design

Phase 1 is a CLI tool with no network API surface. The "API" is the command-line interface and exit codes.

### CLI Interface

```
solmu --url <URL> [--threads <N>] [--duration <S>] [--timeout <MS>] [--output <terminal|json>]
```

| Exit code | Meaning |
|-----------|---------|
| 0 | Test completed successfully |
| 1 | Argument validation error (printed to stderr) |
| 2 | Target guard rejection (printed to stderr) |

### JSON Output Schema (FR-23)

```json
{
  "total_requests": 15234,
  "rps": 507.8,
  "error_count": 12,
  "p50_ms": 9.2,
  "p95_ms": 18.7,
  "p99_ms": 31.4,
  "duration_s": 30,
  "threads": 50
}
```

All latency values are floating-point milliseconds. Pipeline consumers should treat `p99_ms == timeout_ms` as a saturation signal.

---

## 5. Cross-Cutting Concerns

### Security

**Default-to-Local (NFR-03):**
- DNS resolved once at startup (`std::net::ToSocketAddrs` or `tokio::net::lookup_host`)
- Resolved `IpAddr` checked against allowlist before `reqwest::Client` is constructed — the client never sees a rejected target
- No re-resolution during run (TOCTOU mitigated, FR-11)
- allowlist: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `::1/128`
- IPv6 ULA `fc00::/7`: explicitly rejected with exit 2 + message "IPv6 ULA addresses are not allowed in Phase 1. Use --allow-ula in a future release." (FR-09)

**No network listener (NFR-04):** Solmu is a pure HTTP client. No `TcpListener` bind, no Unix socket.

**Constraint validation for Dev agents:** All five hard constraints from the architectural manifesto are checkable mechanically:
1. Single-binary: `ls -la target/release/solmu` — one file, no shared libs (check with `ldd`)
2. Zero external processes: `cargo tree -p solmu` must not include postgres, redis, kafka drivers
3. No JS toolchain: Leptos out of scope for Phase 1; CI step asserts no `node_modules`
4. No OpenSSL: `cargo tree -p solmu --features rustls-tls` must not include `openssl-sys`
5. Guard enforcement: integration test fires at `8.8.8.8` and asserts exit code 2

### Observability

Phase 1: terminal output only. Live throughput line (`\r`) every 100ms. Final summary to stdout. No structured logging — `eprintln!` for errors to stderr only. Phase 2 replaces terminal output with OTLP.

### Error Handling

- Panics: forbidden in `engine.rs` and `metrics.rs` (NFR-05). Use `Result` propagation; request errors map to `errors.fetch_add(1, Relaxed)`.
- `guard.rs`: returns `Result<IpAddr, GuardError>`. `main` matches and calls `process::exit(2)`.
- `cli.rs`: Clap handles exit 1 automatically on parse failure.
- No retry policy: failed requests are counted and the engine moves to the next iteration immediately.

### Testing Strategy

| Layer | Tool | Target coverage |
|-------|------|-----------------|
| Unit: `guard` | `#[test]` in `guard.rs` | 15 cases — all allowlist boundaries + ULA + DNS |
| Unit: `cli` | `#[test]` in `cli.rs` + `assert_cmd` | 11 cases — valid, defaults, range errors |
| Unit: `engine` | `tokio::test` + `axum::TestServer` or `httptest` | 8 cases — semaphore bound, duration cutoff, error counting |
| Unit: `metrics` | `tokio::test` with 100 concurrent tasks | 8 cases — atomicity, bucket correctness, percentile math |
| Integration: RSS gate | `#[ignore]` test, aarch64 only | VmRSS < 50 000 kB at 500 threads |

**No mocking of the guard's IP check** — real `IpAddr` values are used in unit tests. DNS resolution tests use a localhost mock, not a public resolver, to keep tests hermetic.

---

## 6. Project Structure

```
ensi/                              ← Cargo workspace root
├── Cargo.toml                     ← [workspace] members = ["crates/solmu", ...]
├── Cargo.lock                     ← committed (binary crate)
├── _bmad/
│   ├── docs/
│   │   ├── prd.md
│   │   └── architecture.md        ← this file
│   └── status.md
└── crates/
    └── solmu/
        ├── Cargo.toml             ← [[bin]] name = "solmu"
        ├── src/
        │   ├── main.rs            ← wires modules, calls process::exit
        │   ├── cli.rs             ← Clap derive struct Config
        │   ├── guard.rs           ← IP allowlist validation
        │   ├── engine.rs          ← Tokio semaphore loop
        │   ├── metrics.rs         ← AtomicU64 counters + histogram
        │   └── reporter.rs        ← terminal / JSON output
        └── tests/
            └── integration.rs     ← RSS gate (#[ignore])
```

**Module dependency rules (NFR-09):** No global mutable state. Dependency direction: `main → {cli, guard, engine, reporter}`, `engine → metrics`, `reporter → metrics`. No other cross-module imports.

**Naming conventions:**
- Files/modules: `snake_case`
- Types: `PascalCase` (`Config`, `GuardError`, `Metrics`)
- Functions: `snake_case` (`validate`, `run`, `print_json`)
- Constants: `SCREAMING_SNAKE_CASE` (`MAX_THREADS`, `HIST_BUCKETS`)
- DB columns: N/A (no persistence in Phase 1)

---

## 7. Implementation Constraints

### Performance Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| RSS at 500 threads | < 50 MB | `/proc/self/status` VmRSS in integration test (NFR-01) |
| Startup to first request | < 200ms | `Instant` in `main.rs` before first `engine::run` await (NFR-02) |
| Binary size (release, stripped) | No hard budget | Target < 5MB; `strip = true` in `[profile.release]` |
| p99 latency measurement overhead | < 1µs per request | `AtomicU64` CAS — verified by benchmark if questioned |

### Platform Support

| Target | Status | Notes |
|--------|--------|-------|
| `aarch64-unknown-linux-gnu` | Required | Primary target; RSS gate runs here |
| `x86_64-unknown-linux-gnu` | Required | CI + developer Linux machines |
| `aarch64-apple-darwin` | Required | M-series Macs; unit tests only |

Browser/WCAG: not applicable (CLI tool).

### Known Technical Debt Accepted for Phase 1

| Debt | Reason |
|------|--------|
| HTTP GET only | Phase 1 scope; POST/PUT/PATCH needed for realistic load profiles (Phase 2+) |
| No TLS cert validation skip option | Never in scope — intentional security constraint |
| Terminal reporter polls every 100ms | Good enough for Phase 1; Phase 2 replaces with Leptos Signals |
| No custom headers | Adequate for smoke testing; Phase 2 adds header support |

---

## 8. Implementation Sequencing

### Sequential Gates

```
US-01 (workspace scaffold)
    │
    ├─► US-02 (CLI)  ─► US-07 (CLI tests)
    ├─► US-03 (guard) ─► US-06 (guard tests)
    ├─► US-04 (engine) ─► US-08 (engine tests)
    └─► US-05 (metrics + reporter) ─► US-09 (metrics tests)
                                          │
                    ┌─────────────────────┘
                    ▼
               US-10 (RSS integration test)  [requires US-04 + US-05]
                    │
                    ▼
               US-11 (CI matrix)
```

### Parallel Opportunities

After US-01 is merged:
- US-02, US-03, US-04, US-05 can be implemented in **parallel** (zero shared code between modules; only `Metrics` struct is shared and its interface is stable from this document)
- US-06 through US-09 can begin as soon as their respective implementation story is done

### First Vertical Slice (Recommended Start)

**US-01 → US-03 → US-04 (partial) → CLI smoke test**

Rationale: `guard.rs` is the highest-risk component — if DNS TOCTOU handling or allowlist logic is wrong, every subsequent test is invalid. Proving the guard works first de-risks the entire suite. A `main.rs` that parses one hardcoded `--url`, validates it, and prints "guard passed" / exits 2 is the minimal end-to-end proof of the architecture.

### SM Sprint Planning Notes

- **Sprint 1:** US-01 (blocker, S) + US-02 + US-03 + US-05 in parallel (all S)
- **Sprint 2:** US-04 (M, engine) + US-06 + US-07 + US-09 in parallel
- **Sprint 3:** US-08 (M, engine tests) + US-10 (M, RSS gate)
- **Sprint 4:** US-11 (M, CI) + PR review + merge to main

---

## 9. Decisions Log (ADR Format)

### ADR-01: reqwest over raw hyper (OQ-02)

**Context:** Phase 1 needs an HTTP GET client with bounded connection pool and pre-resolved DNS injection to satisfy FR-07, FR-11, FR-15.  
**Decision:** Use `reqwest 0.12` with `rustls-tls`, `default-features = false`.  
**Consequences:** Pool size is set via `.pool_max_idle_per_host(threads)`. DNS injection via `.resolve(host, resolved_addr)`. Phase 2 can continue using reqwest or switch to raw hyper when streaming body processing is needed. No behaviour change required.

---

### ADR-02: Native ARM runners over `cross` (OQ-01)

**Context:** The RSS gate (NFR-01) measures actual process memory on aarch64. QEMU-based cross-compilation tools like `cross` run the binary under emulation, which inflates RSS readings by up to 2× due to emulator overhead.  
**Decision:** Use GitHub-hosted `ubuntu-24.04-arm` runner for `aarch64-unknown-linux-gnu` leg. No `cross` in the CI matrix.  
**Consequences:** CI depends on GitHub ARM runner availability. Fallback documented in §1: one Oracle Cloud aarch64 self-hosted runner if org doesn't have access. Build times are slightly longer (no cross-compilation cache) but RSS measurements are trustworthy.

---

### ADR-03: 64-bucket power-of-2 histogram with timeout cap (OQ-03)

**Context:** The histogram must be lock-free (FR-18), correct under concurrent writes (FR-20), and report meaningful p50/p95/p99 (FR-19).  
**Decision:** `[AtomicU64; 64]` indexed by `63 - µs.leading_zeros()`. All latency values capped at `timeout_µs` before bucketing.  
**Consequences:** Array is 512 bytes — zero impact on RSS budget. Capping at timeout means p99 = timeout_ms signals full saturation rather than an impossible high-latency outlier. Bucket 63 is never reached in practice. Percentile computation is O(64) sequential scan — negligible.

---

### ADR-04: IPv6 ULA rejection (from PRD, confirmed)

**Context:** RFC 4193 ULA addresses (`fc00::/7`) are globally unique but not internet-routable. Allowing them as a "safe" target is ambiguous — they may route to infrastructure not controlled by the developer.  
**Decision:** Reject with exit 2 and explicit message. `--allow-ula` deferred to Phase 5.  
**Consequences:** Developers using ULA-addressed services must use the IP directly after Phase 5 opt-in. Conservative default — matches the spirit of Default-to-Local.

---

### ADR-05: Zero global mutable state (NFR-09)

**Context:** Shared global state is the primary source of data races in concurrent Rust programs.  
**Decision:** All shared state is `Arc<Metrics>` passed explicitly. No `static mut`, no `lazy_static!`, no `OnceCell` holding mutable data. The live reporter counter is a field on `Metrics`.  
**Consequences:** Slightly more verbose function signatures. Thread safety is enforced by the borrow checker at compile time. No runtime synchronisation cost beyond the atomics already required.

---

## Constraint Enforcement for Dev Agents

The following CI assertions enforce the architectural manifesto's hard constraints:

| Constraint | CI Check |
|-----------|----------|
| Single binary | `ls target/release/solmu` exits 0; `ldd target/release/solmu` shows only libc/libm (or "not a dynamic executable" with `target-feature=+crt-static`) |
| No external processes | `cargo tree -p solmu` must not include `tokio-postgres`, `redis`, `rdkafka`, `surrealdb` (Phase 3 only), `nats` (Phase 3 only) |
| No OpenSSL | `cargo tree -p solmu` must not include `openssl-sys` |
| Guard enforced | Integration test: `solmu --url http://8.8.8.8 --threads 1 --duration 1` exits 2 |
| No JS toolchain | CI step: `test ! -d node_modules` |
