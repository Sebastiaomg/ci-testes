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