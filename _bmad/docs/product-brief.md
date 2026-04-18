# Solmu — Product Brief

## Vision

Solmu é um motor autônomo de resiliência de software que unifica Load Testing e Chaos Engineering em um único pipeline operado por IA.

## Diferencial

Fechamento de ciclo: o sistema planeja testes → executa → gera ADRs com recomendações técnicas. Sem intervenção manual entre as etapas.

## Formas de Distribuição

- **Open-Source CLI:** binário único, zero dependências, zero atrito
- **SaaS Cloud:** Oracle Cloud ARM64, dashboard Leptos, orquestração de agentes

## Fases de Desenvolvimento

| Fase | Codinome | Entregável Principal |
|------|----------|---------------------|
| 1 | The Local Hammer | CLI de load test para APIs locais |
| 2 | The Persistent Engine | SurrealDB embedded, histórico, relatórios |
| 3 | The Connected Brain | NATS embedded, Gemini API, planejamento autônomo |
| 4 | The Web Dashboard | Leptos SSR+WASM, visualizações em tempo real |
| 5 | The SaaS Platform | Multi-tenant, billing, auth externa |

## Foco Atual

**Fase 1:** Provar a tese de performance de Rust/Tokio. Entregar um `solmu attack` funcional que compete com `wrk`/`hey`/`vegeta` em throughput, com segurança Default-to-Local embutida e CI/CD cross-platform desde o dia 1.
