ADR (YAML/JSON)
 ├─ schema_version → define qual schema usar em load-schema.ts
 └─ lint_version   → define qual ruleset aplicar

Fluxo:
1. CLI (`index.ts`) lê ADR
2. load-adr.ts converte para JS
3. load-schema.ts valida estrutura com schema_version
4. CLI pega lint_version do ADR
5. Seleciona ruleset correspondente (rules/vX)
6. Aplica regras sobre o ADR
7. Retorna erros de lint se houver

## 🧩 Insight arquitetural (importante)

O desenho correto do `adr-lint` fica assim:

- **Schema** → valida estrutura  
- **Ajv** → produz erros técnicos  
- **CLI (`index.ts`)** → adiciona contexto (arquivo, severidade, versão)  
- **Loader** → conhece o filesystem  

Isso mantém:

- schema puro  
- lint extensível  
- mensagens humanas  
- CI utilizável  




# Regras do adr-lint v3
Regras globais (todas as ADRs com lint_version: v3)
| Regra                         | Severidade | Descrição                                                     |
|------------------------------|------------|---------------------------------------------------------------|
| exactly-one-decision-type    | fail       | Exatamente 1 `decision_type` deve estar presente              |
| decision-summary-required    | fail       | `decision_summary` é obrigatório                              |
| accepted-has-consequences    | warn       | ADR com status Accepted deve documentar consequências          |
| superseded-requires-link     | fail       | Status Superseded exige `related_decisions.supersedes`         |

Regras específicas por decision_type
governance_rule
| Regra                                   | Severidade |
|----------------------------------------|------------|
| `rules` obrigatório                    | fail       |
| `audit_governance.applicable = true`   | fail       |

architectural_pattern
| Regra                  | Severidade |
|------------------------|------------|
| `intent` obrigatório   | fail       |
| `scope` obrigatório    | fail       |

infrastructure_choice
| Regra                          | Severidade |
|--------------------------------|------------|
| `technical_impacts` recomendado| warn       |

dsl_infrastructure
| Regra                         | Severidade |
|-------------------------------|------------|
| `dsl_definition` obrigatório  | fail       |
| `enforcement` recomendado     | warn       |