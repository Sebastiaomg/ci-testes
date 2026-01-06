const DECISION_TYPES = [
    'architectural_pattern',
    'infrastructure_choice',
    'dsl_infrastructure',
    'data_strategy',
    'integration_strategy',
    'security_policy',
    'governance_rule',
];
export function detectDecisionTypes(adr) {
    return DECISION_TYPES.filter((t) => t in adr);
}
export function detectSingleDecisionType(adr) {
    const found = detectDecisionTypes(adr);
    return found.length === 1 ? found[0] : null;
}
