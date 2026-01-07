//Severidade das regras
export type Severity = 'warn' | 'fail';

// Resultado de uma regra
export interface RuleResult {
  severity: Severity;
  message: string;
}

// Contexto passado para cada regra
export type AdrStatus =
  | 'Proposed'
  | 'Accepted'
  | 'Deprecated'
  | 'Superseded';

export interface AdrFromIndex {
  id: string;
  status: AdrStatus;
  hash: string;
}

export interface RuleContext {
  adrs: ADR[];
  ids: string[];
  index: AdrFromIndex[];
}

// Assinatura de uma regra
export type Rule = (ctx: RuleContext) => RuleResult[];

// Tipos possíveis de decisão (novo schema v2+)
export type DecisionType =
  | 'architectural_pattern'
  | 'infrastructure_choice'
  | 'dsl_infrastructure'
  | 'data_strategy'
  | 'integration_strategy'
  | 'security_policy'
  | 'governance_rule';


// Base comum a todos os decision_types

export interface DecisionBase {
  decision_summary: string;
}

export interface Constraints {
  bounded_context?: string | null;
  consistency_model?: 'strong' | 'eventual' | 'none';
  transaction_scope?: 'local' | 'distributed' | 'none';
}

// Outros
export interface Rules {
  enforces?: string[];
  forbids?: string[];
}

export interface DslAdoption {
  principles?: string[];
}

export interface Lifecycle {
  allowed_status?: string[];
  lifecycle_rules?: string[];
}

export interface TechnicalImpacts {
  affected_components?: string[];
  migrations_required?: boolean;
  training_required?: boolean;
}
// Governança e auditoria (usada principalmente em governance_rule,
// mas pode aparecer como seção transversal)
export interface AuditGovernance {
  applicable?: boolean;
  audit_location?: string[];
}

// ADR — compatível com:
// - schema v1 (decision.summary)
// - schema v2+ (decision_types no topo)
export interface ADR {
  // Identidade e estado
  id: string;
  schema_version: string; // tooling (fora do canonical)
  lint_version: string;   // tooling (fora do canonical)
  title: string;
  prefix: string;
  status: AdrStatus;
  date: string;

 // Contexto textual
  context?: {
    description: string;
  };

 // Decision types (apenas UM deve existir)
  architectural_pattern?: DecisionBase & {
    intent?: 'scalability' | 'performance' | 'security' | 'governance'
      | 'cost_optimization' | 'reliability' | 'compliance';
    scope?: 'system' | 'application' | 'bounded_context';
  };

  infrastructure_choice?: DecisionBase & {
    constraints?: Constraints;
    technical_impacts?: TechnicalImpacts;
  };

  dsl_infrastructure?: DecisionBase & {
    dsl_definition?: Record<string, unknown>;
    enforcement?: Record<string, unknown>;
  };

  data_strategy?: DecisionBase;

  integration_strategy?: DecisionBase;

  security_policy?: DecisionBase;

  governance_rule?: DecisionBase & {
    rules?: Rules;
    audit_governance?: AuditGovernance;
    dsl_adoption?: DslAdoption;
    lifecycle?: Lifecycle;
  };

  // Estruturas transversais normativas
  // (podem existir em qualquer ADR)
  constraints?: Constraints;
  rules?: Rules;
  dsl_adoption?: DslAdoption;
  lifecycle?: Lifecycle;
  technical_impacts?: TechnicalImpacts;
  audit_governance?: AuditGovernance;

  consequences?: {
    positive?: string[];
    negative?: string[];
  };

  related_decisions?: {
    implements?: string[];
    extends?: string[];
    constrains?: string[];
    depends_on?: string[];
    supersedes?: string[];
  };

// Campo interno do linter (fora do canonical)
  file: string;
}
