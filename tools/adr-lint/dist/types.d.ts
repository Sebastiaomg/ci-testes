/**
 * Severidade das regras
 */
export type Severity = 'warn' | 'fail';
/**
 * Resultado de uma regra
 */
export interface RuleResult {
    severity: Severity;
    message: string;
}
/**
 * Contexto passado para cada regra
 */
export interface RuleContext {
    adrs: ADR[];
    ids: string[];
}
/**
 * Assinatura de uma regra
 */
export type Rule = (ctx: RuleContext) => RuleResult[];
/**
 * Tipos possíveis de decisão (novo schema v2+)
 */
export type DecisionType = 'architectural_pattern' | 'infrastructure_choice' | 'dsl_infrastructure' | 'data_strategy' | 'integration_strategy' | 'security_policy' | 'governance_rule';
/**
 * Base comum a todos os decision_types
 */
export interface DecisionBase {
    decision_summary: string;
}
/**
 * Governança e auditoria (usada principalmente em governance_rule,
 * mas pode aparecer como seção transversal)
 */
export interface AuditGovernance {
    applicable?: boolean;
    audit_location?: string[];
}
export type AdrStatus = 'Proposed' | 'Accepted' | 'Deprecated' | 'Superseded';
/**
 * ADR — compatível com:
 * - schema v1 (decision.summary)
 * - schema v2+ (decision_types no topo)
 */
export interface ADR {
    id: string;
    schema_version: string;
    lint_version: string;
    title: string;
    prefix: string;
    status: AdrStatus;
    date: string;
    /**
     * Contexto textual (presente em v1 e v2)
     */
    context?: {
        description: string;
    };
    decision?: {
        summary?: string;
        type?: string;
        intent?: string;
        scope?: string;
    };
    architectural_pattern?: DecisionBase & {
        intent?: string;
        scope?: string;
    };
    infrastructure_choice?: DecisionBase & {
        constraints?: unknown;
        technical_impacts?: unknown;
    };
    dsl_infrastructure?: DecisionBase & {
        dsl_definition?: unknown;
        enforcement?: unknown;
    };
    data_strategy?: DecisionBase & {
        datasets?: string[];
        governance?: unknown;
    };
    integration_strategy?: DecisionBase & {
        protocols?: string[];
        contracts?: unknown;
    };
    security_policy?: DecisionBase & {
        controls?: string[];
        compliance?: string[];
    };
    governance_rule?: DecisionBase & {
        rules?: {
            enforces?: string[];
            forbids?: string[];
        };
        audit_governance?: AuditGovernance;
        dsl_adoption?: {
            principles?: string[];
        };
        lifecycle?: {
            allowed_status?: string[];
            lifecycle_rules?: string[];
        };
    };
    /**
     * Seções transversais (podem existir em qualquer ADR)
     */
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
    audit_governance?: AuditGovernance;
    technical_impacts?: {
        affected_components?: string[];
        migrations_required?: boolean;
        training_required?: boolean;
    };
    /**
     * Campo interno do linter
     */
    file: string;
}
