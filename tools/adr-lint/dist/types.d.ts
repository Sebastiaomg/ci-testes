export type Severity = 'warn' | 'fail';
export interface RuleResult {
    severity: Severity;
    message: string;
}
export type AdrStatus = 'Proposed' | 'Accepted' | 'Deprecated' | 'Superseded';
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
export type Rule = (ctx: RuleContext) => RuleResult[];
export type DecisionType = 'architectural_pattern' | 'infrastructure_choice' | 'dsl_infrastructure' | 'data_strategy' | 'integration_strategy' | 'security_policy' | 'governance_rule';
export interface DecisionBase {
    decision_summary: string;
}
export interface Constraints {
    bounded_context?: string | null;
    consistency_model?: 'strong' | 'eventual' | 'none';
    transaction_scope?: 'local' | 'distributed' | 'none';
}
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
export interface AuditGovernance {
    applicable?: boolean;
    audit_location?: string[];
}
export interface ADR {
    id: string;
    schema_version: string;
    lint_version: string;
    title: string;
    prefix: string;
    status: AdrStatus;
    date: string;
    context?: {
        description: string;
    };
    architectural_pattern?: DecisionBase & {
        intent?: 'scalability' | 'performance' | 'security' | 'governance' | 'cost_optimization' | 'reliability' | 'compliance';
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
    file: string;
}
