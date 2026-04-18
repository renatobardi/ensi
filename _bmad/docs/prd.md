# Solmu — Product Requirements Document
**Source:** REN-54 (Kickoff — Solmu Fase 1: The Local Hammer)
**Phase:** 1 — The Local Hammer
**Status:** Complete (Analyst + Architect phases done)

---

## Product Overview

**Solmu** ("nó" em finlandês) é um motor autônomo de resiliência de software que unifica Stress/Load Testing e Chaos Engineering em um único pipeline operado por agentes de IA (Gemini API). O diferencial estratégico é o **fechamento de ciclo**: o sistema planeja testes autonomamente, executa-os, e gera Architecture Decision Records (ADRs) com recomendações técnicas baseadas nos dados coletados.

**Duas formas simultâneas:**
- **Open-Source CLI** — binário único para macOS (Intel + Apple Silicon), Windows e Linux. Zero atrito, zero dependências externas.
- **SaaS Cloud** — mesma base de código hospedada em Oracle Cloud Free Tier (VM ARM64, 4 oCPU, 24 GB RAM) com dashboard web e orquestração de agentes.

---

## Fase 1 — "The Local Hammer"

### Objetivo

Provar a tese de performance extrema de Rust/Tokio em geração de requisições HTTP. Estabelecer o repositório, a estrutura de workspace, e o pipeline de CI/CD. Entregar valor imediato para desenvolvedores que querem testar APIs locais sem scripts.

**Duração estimada:** 2-3 semanas de desenvolvimento solo.

---

## Hard Constraints (Seção 3.2) — Inegociáveis

1. **Single-Binary Deployment:** O binário final não pode exigir instalação de runtime externo (Java, Node, Python), gerenciador de pacotes, ou `docker-compose`.
2. **Zero External Processes (Embedded Stack):** SurrealDB e NATS rodam embutidos dentro do processo Rust. Proibido: PostgreSQL, Redis, Kafka, RabbitMQ, MongoDB em containers separados.
3. **Frontend Zero-JS-Toolchain:** Dashboard usa Leptos com SSR + WASM. Sem npm/yarn/bun. *(Fase 2+)*
4. **Arquitetura Hexagonal (Ports & Adapters):** Módulos comunicam via traits Rust, não via dependências diretas.
5. **Event-Driven Core:** Comunicação exclusivamente via MPSC channels (Fase 1) ou NATS (Fase 3+).
6. **ARM-First, Cross-Platform-Always:** Compila para 5 plataformas desde o primeiro commit.
7. **Default-to-Local Security:** Ataques a IPs públicos bloqueados hardcoded. Não removível por flag de CLI.

---

## Stack da Fase 1

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Rust (Tokio) | Tokio 1.36+ |
| CLI | Clap (Derive API) | Clap 4.5+ |
| HTTP Client | Reqwest (rustls) | 0.12+ |
| Terminal UI | indicatif | 0.17+ |
| URL parsing | url crate | 2.5+ |
| Error handling | thiserror + anyhow | 1.0+ |
| Rate limiting | governor | 0.6+ |
| Cross-compile | cargo-zigbuild | latest |
| CI/CD | GitHub Actions (Self-Hosted Runner ARM64 Oracle) | — |

**Proibido na Fase 1:** Leptos, NATS, SurrealDB, Gemini API, Axum, Chaos Engineering.

---

## Interface CLI

```bash
solmu attack [OPTIONS] --target <URL>
```

**Flags:**
- `-t, --target <URL>` — URL do endpoint alvo (obrigatória)
- `-m, --method <METHOD>` — GET, POST, PUT, DELETE, PATCH. Default: GET
- `--payload <FILE>` — arquivo JSON para body (requer POST/PUT/PATCH; hard error com GET/DELETE)
- `--header <KEY:VALUE>` — header customizado, pode repetir
- `-c, --connections <NUM>` — conexões concorrentes. Default: 50. Max: 5000
- `-d, --duration <SECONDS>` — duração em segundos. Default: 30. Max: 3600
- `-r, --rate <REQ_PER_SEC>` — rate limit opcional. Se omitido: saturação máxima
- `--timeout <MS>` — timeout por request. Default: 5000ms
- `--output <FORMAT>` — `text` (default) ou `json`

---

## Estrutura de Módulos (Workspace Rust)

```
solmu/
├── Cargo.toml
├── crates/
│   ├── solmu-cli/
│   │   └── src/
│   │       ├── main.rs
│   │       ├── commands/attack.rs
│   │       └── validator.rs      # Default-to-Local security
│   └── solmu-engine/
│       └── src/
│           ├── lib.rs
│           ├── config.rs         # AttackConfig struct
│           ├── worker.rs         # Tokio task por request
│           ├── pool.rs           # Pool + semaphore + rate limiter
│           ├── client.rs         # reqwest::Client (single instance)
│           └── metrics/
│               ├── collector.rs  # MPSC receiver + aggregação
│               ├── report.rs     # Percentis
│               └── types.rs      # Enums e structs
```

---

## Vetor de Segurança — Default-to-Local

Ranges permitidos: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.

Algoritmo (ADR-001): resolver hostname → checar todos os IPs resolvidos → rejeitar se qualquer IP for público → rejeitar se DNS falhar.

**Testes unitários obrigatórios:**
```rust
#[test]
fn test_reject_public_ips() {
    assert!(validate_target("https://google.com").is_err());
    assert!(validate_target("https://1.1.1.1").is_err());
}

#[test]
fn test_allow_private_ranges() {
    assert!(validate_target("http://localhost:3000").is_ok());
    assert!(validate_target("http://127.0.0.1:8080").is_ok());
    assert!(validate_target("http://10.0.0.1:3000").is_ok());
    assert!(validate_target("http://192.168.1.100:5000").is_ok());
    assert!(validate_target("http://172.16.0.1:4000").is_ok());
}
```

---

## Exit Codes (ADR-002)

| Code | Significado |
|------|-------------|
| 0 | Sucesso — error_rate < 5% |
| 1 | Falha — error_rate ≥ 5% |
| 2 | Erro de ferramenta/uso (args inválidos, segurança, DNS) |

---

## --connections × --rate (ADR-003)

Restrições independentes e simultâneas:
- `--connections` = semáforo Tokio (máximo in-flight)
- `--rate` = token bucket `governor` (máximo novos req/s)

Ambas aplicadas simultaneamente. Spawner loop: adquire token → adquire semáforo → spawna task.

---

## Output do Terminal

**Durante execução:**
```
● Solmu v0.1.0 — Attacking http://localhost:3000/api
  ████████████████░░░░░░░░░░░░░░░░ 55% [16/30s]
  Throughput: 4,832 req/s | Errors: 0.2% | p99: 45ms
```

**Relatório final (--output text):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SOLMU — Attack Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Requests: 145,230 | Throughput: 4,836 req/s
  Success Rate: 99.8% | p50: 12ms | p90: 45ms | p99: 120ms
  Exit: SUCCESS (error rate < 5%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## CI/CD

**Targets (cargo-zigbuild):**
- `aarch64-unknown-linux-gnu`
- `x86_64-unknown-linux-gnu`
- `x86_64-pc-windows-gnu`
- `aarch64-apple-darwin`
- `x86_64-apple-darwin`

**CI (todo PR):** `cargo fmt --check` + `cargo clippy --all-targets -- -D warnings` + `cargo test --all` + `cargo audit`

**Release:** push de tag `v*.*.*` na branch `main` → 5 binários → GitHub Releases.

---

## Definition of Done — Fase 1

| Critério | Métrica | Verificação |
|----------|---------|-------------|
| Segurança: bloqueio IP público | 100% rejeição | `cargo test test_reject_public_ips` |
| Segurança: permissão rede local | 100% permissão | `cargo test test_allow_private_ranges` |
| Performance: RAM em 500 conexões | < 50 MB RSS | `/usr/bin/time -v` |
| Performance: throughput mínimo | > 2.000 req/s | Output do relatório |
| Qualidade: linter | 0 warnings | `cargo clippy -- -D warnings` |
| Qualidade: formatação | 0 diffs | `cargo fmt --check` |
| CI/CD: binários gerados | 5 plataformas | GitHub Releases com 5 artefatos |
| Documentação: README | Funcional | GIF do terminal, instalação em 2 comandos |
| Testes unitários | 100% passando | `cargo test --all` |

---

## Sub-issues da Fase 1

| Issue | Título | Estimativa |
|-------|--------|------------|
| REN-55 | Setup Cargo workspace and project skeleton | 1 dia |
| REN-56 | Implement Default-to-Local security validator | 1 dia |
| REN-57 | Implement AttackConfig and reqwest HTTP client | 1 dia |
| REN-58 | Implement HTTP worker and MPSC metrics pipeline | 2 dias |
| REN-59 | Implement worker pool with concurrency and rate control | 2 dias |
| REN-60 | Implement metrics report with percentile calculation | 1 dia |
| REN-61 | Implement CLI interface with Clap (attack command) | 1 dia |
| REN-62 | Implement terminal UI with indicatif progress and live stats | 1 dia |
| REN-63 | Setup GitHub Actions CI pipeline (PR checks) | 1 dia |
| REN-64 | Setup self-hosted ARM64 runner and cross-platform release pipeline | 2 dias |
| REN-65 | Write README with installation instructions and terminal demo GIF | 1 dia |
| REN-66 | Phase 1 — BMAD Review Gate (blocks Phase 2) | gate |

**Total:** 14 dias (2–3 semanas solo)
