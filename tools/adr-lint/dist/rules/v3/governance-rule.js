export const governanceRuleChecks = ({ adrs }) => adrs
    .filter((a) => a.governance_rule)
    .flatMap((a) => {
    const errors = [];
    if (!a.governance_rule?.rules) {
        errors.push({
            severity: 'fail',
            message: `${a.id}: governance_rule exige rules (regra v3)`,
        });
    }
    if (a.governance_rule?.audit_governance?.applicable !== true) {
        errors.push({
            severity: 'fail',
            message: `${a.id}: governance_rule exige audit_governance.applicable=true (regra v3)`,
        });
    }
    return errors;
});
