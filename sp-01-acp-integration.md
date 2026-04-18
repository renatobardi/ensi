# SP-01: Validation Spike — ACP + Gemini API Structured Output

> **Type:** Spike (timeboxed investigation)
> **Timebox:** 1 dia
> **Agent Persona:** Backend Dev ou Architect
> **Roda em paralelo com:** SP-02, AP (Architecture)
> **Output:** `_bmad/spikes/sp-01-result.md` + código de prova em `_bmad/spikes/sp-01/`

---

## Objetivo

Validar se o Gemini API entrega structured outputs (JSON schema-compliant) de forma confiável o suficiente para o pipeline BMad do Ensi — e identificar os pontos de falha antes de construir o Pipeline FSM em cima disso.

---

## Contexto

O Ensi depende criticamente de LLM outputs que respeitem schemas JSON exatos (BriefArtifact, PrdArtifact, etc.). Se o Gemini não entregar compliance consistente, o pipeline FSM quebra na validação e a proposta de valor do Ensi cai.

O PM (Curly) identificou isso como SP-01 — gate obrigatório antes do build completo.

---

## Perguntas a responder

1. O Gemini API (`gemini-2.0-flash` ou `gemini-2.5-pro`) suporta `response_schema` com JSON Schema completo?
2. Qual a taxa de compliance em 10 chamadas consecutivas com o mesmo schema?
3. Quais campos do schema causam falha ou truncamento (nested objects, arrays de objetos, enums)?
4. Qual a latência p50 e p95 para um BriefArtifact completo (~500 tokens de output)?
5. O feedback loop de re-tentativa (schema validation error → retry com erro no prompt) funciona na prática?
6. A integração via `reqwest` + `serde_json` em Rust é viável sem SDK oficial?

---

## Tarefa

### 1. Setup mínimo em Rust

Cria um projeto Rust standalone em `_bmad/spikes/sp-01/`:

```
sp-01/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── gemini.rs      # cliente HTTP Gemini via reqwest
│   └── schemas.rs     # BriefArtifact + PrdArtifact structs
└── results/
    └── runs.json      # outputs das 10 chamadas
```

### 2. Implementar e testar

- Chamar Gemini API com `response_schema` setado para `BriefArtifact`
- Rodar 10 vezes com o mesmo prompt (contexto do Ensi)
- Registrar: compliance (valid/invalid), latência, tokens usados, erros
- Testar o retry loop: forçar erro de validação → re-prompt com o erro → medir se corrige

### 3. Testar schema complexo

Usar `PrdArtifact` (mais complexo, com arrays de objetos aninhados) e repetir 5 chamadas.

---

## Output Esperado

Salvar em `_bmad/spikes/sp-01-result.md`:

```markdown
# SP-01 Result

## Verdict: GO | NO-GO | GO WITH CONSTRAINTS

## Findings
- Compliance rate (BriefArtifact): X/10
- Compliance rate (PrdArtifact): X/5
- p50 latency: Xms | p95 latency: Xms
- Problematic schema fields: [...]
- Retry loop effectiveness: [...]

## Recommended approach
[Como o Pipeline FSM deve tratar falhas de schema — número de retries, fallback, logging]

## Code artifacts
- Gemini client: `_bmad/spikes/sp-01/src/gemini.rs` → pode ser extraído para `ensi-core`
- Schema structs: `_bmad/spikes/sp-01/src/schemas.rs` → base para `ensi-pipeline`

## Impact on Architecture
[O que o SysArch deve saber ao desenhar o Pipeline FSM e o AgentExecutor]
```

---

## Critérios de Aceite

- [ ] 10 chamadas executadas e resultados registrados em `results/runs.json`
- [ ] Taxa de compliance documentada para BriefArtifact e PrdArtifact
- [ ] Latência p50 e p95 medidas e comparadas com NFR (p95 < 5 min Analyst)
- [ ] Retry loop testado com pelo menos 1 caso de falha intencional
- [ ] Verdict claro: GO / NO-GO / GO WITH CONSTRAINTS
- [ ] Impacto na arquitetura documentado para o SysArch

---

## Resultado vai para

- **SysArch** → informa design do `AgentExecutor` trait e retry logic no Pipeline FSM
- **Architecture Review** → consolida com SP-02 antes de fechar o `architecture-artifact.json`

## Labels

`type:spike` · `pipeline:discovery` · `priority:urgent` · `bmad:sp-01`
