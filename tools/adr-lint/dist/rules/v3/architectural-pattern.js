export const architecturalPatternChecks = ({ adrs }) => adrs
    .filter((a) => a.architectural_pattern)
    .flatMap((a) => {
    const p = a.architectural_pattern;
    const errors = [];
    if (!p.intent) {
        errors.push({
            severity: 'fail',
            message: `${a.id}: architectural_pattern exige intent (regra v3)`,
        });
    }
    if (!p.scope) {
        errors.push({
            severity: 'fail',
            message: `${a.id}: architectural_pattern exige scope (regra v3)`,
        });
    }
    return errors;
});
