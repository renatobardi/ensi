# PP: Product Requirements & PRD — Ensi v1

> **Pipeline Stage:** Planning
> **Agent Persona:** PM (Curly)
> **Input:** `_bmad/docs/brief-artifact.json` + `_bmad/docs/product-brief.md`
> **Expected Output:** `_bmad/docs/prd-artifact.json` + `_bmad/docs/product-prd.md`

---

## Contexto — O que a Mary (Analyst) entregou

O Discovery stage foi concluído. Os artefatos estão em:

- `_bmad/docs/brief-artifact.json` — BriefArtifact JSON (schema-compliant)
- `_bmad/docs/product-brief.md` — Brief narrativo completo

### Decisões-chave do Discovery

**3 personas validadas:**
- Solo AI-Forward Developer
- Small Engineering Team Lead
- AI Enablement Engineer

**Diferenciadores estabelecidos:**
- vs. Linear / Jira / GitHub Projects → eles adicionam AI em cima de PM; Ensi constrói PM em torno de agents como cidadãos de primeira classe
- vs. Devin / OpenHands → code execution agents; Ensi cobre o SDLC completo com handoffs validados
- vs. CrewAI → framework sem camada de PM, sem validação de artefatos, sem pipeline FSM
- vs. chat-only AI → sem estrutura, sem persistência, sem schema validation

**14 features classificadas** — 7 must / 5 should / 3 could

**Top must-haves:**
1. BMad FSM
2. 13 personas (prompts)
3. Schema-validated artifacts
4. Async task queue
5. Single-binary deployment

**Recomendações da Mary para o PM:**
- Finalizar os artifact schemas **antes** de escrever os persona prompts
- Reduzir o pipeline MVP para **5 stages** (defer Deploy + Observability para v2)
- MVP com **único agente transversal**: Code Reviewer

---

## Tarefa do Curly (PM)

### 1. Ler o input
Carrega `_bmad/docs/brief-artifact.json` como input primário antes de qualquer outra ação.

### 2. Definir requisitos funcionais e não-funcionais do Ensi v1

### 3. Especificar os 5 artifact schemas definitivos do MVP

Os schemas são o contrato que todos os outros agents vão usar. Defini-los primeiro é crítico.

| Schema | Stage | Produzido por |
|--------|-------|---------------|
| `BriefArtifact` | Discovery | Analyst |
| `PrdArtifact` | Planning | PM |
| `ArchitectureArtifact` | Architecture | Architect |
| `SprintPlanArtifact` | Development | Scrum Master |
| `CodeReviewArtifact` | Review | Code Reviewer |

### 4. Detalhar acceptance criteria por feature (must-haves primeiro)

### 5. Validar o scope de 8 semanas contra as 7 features must-have

### 6. Produzir os artefatos de saída

---

## Output Esperado

### PrdArtifact (JSON — salvar em `_bmad/docs/prd-artifact.json`)

```json
{
  "version": "1.0",
  "product_name": "Ensi",
  "scope": "v1",
  "pipeline_stages": [
    "discovery",
    "planning",
    "architecture",
    "development",
    "review"
  ],
  "features": [
    {
      "id": "F-001",
      "name": "...",
      "priority": "must|should|could",
      "user_stories": [
        "As a ... I want ... so that ..."
      ],
      "acceptance_criteria": ["..."],
      "artifact_schema": "BriefArtifact|PrdArtifact|ArchitectureArtifact|SprintPlanArtifact|CodeReviewArtifact"
    }
  ],
  "artifact_schemas": {
    "BriefArtifact": {},
    "PrdArtifact": {},
    "ArchitectureArtifact": {},
    "SprintPlanArtifact": {},
    "CodeReviewArtifact": {}
  },
  "non_functional_requirements": {
    "performance": "...",
    "security": "...",
    "deployment": "single binary, zero external services"
  },
  "out_of_scope_v1": [
    "Deploy stage",
    "Observability stage (OTel traces)",
    "Agent Memory (vector search)",
    "Transversal agents (Tech Writer, Data Engineer, UX Designer)",
    "Multi-LLM support (only Gemini API in v1)"
  ]
}
```

### Narrativo (Markdown — salvar em `_bmad/docs/product-prd.md`)

Documento completo com contexto, decisões, trade-offs e justificativas para cada feature.

---

## Critérios de Aceite

- [ ] `prd-artifact.json` completo e schema-compliant
- [ ] Os 5 artifact schemas do MVP totalmente definidos (todos os campos, tipos, required)
- [ ] Acceptance criteria específicos para cada feature must-have (mínimo 3 por feature)
- [ ] Scope de 8 semanas validado como realizável com justificativa
- [ ] `out_of_scope_v1` explicitamente listado para blindar contra scope creep
- [ ] `product-prd.md` narrativo com contexto e decisões documentadas

---

## Próximo Stage após conclusão

**Architecture** — SysArch recebe `_bmad/docs/prd-artifact.json` como input primário.

---

## Referências

- Input primário: `_bmad/docs/brief-artifact.json`
- Brief narrativo: `_bmad/docs/product-brief.md`
- Spec técnica: `ensi-spec-v2.md`
- BMad Method: `_bmad/`

## Labels

`pipeline:planning` · `agent:pm` · `priority:high` · `type:prd` · `bmad:pp`
