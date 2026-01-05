export type Severity = 'warn' | 'fail';
export interface RuleResult {
    severity: Severity;
    message: string;
}
export interface RuleContext {
    adrs: ADR[];
    ids: string[];
}
export type Rule = (ctx: RuleContext) => RuleResult[];
export interface ADR {
    id: string;
    schema_version: string;
    lint_version: string;
    title: string;
    prefix: string;
    status: string;
    date: string;
    decision?: {
        summary: string;
        type?: string;
        intent?: string;
    };
    consequences?: {
        positive?: string[];
        negative?: string[];
    };
    related_decisions?: {
        supersedes?: string[];
        depends_on?: string[];
    };
    file: string;
}
