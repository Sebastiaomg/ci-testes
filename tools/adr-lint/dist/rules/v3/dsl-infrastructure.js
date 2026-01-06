export const dslInfrastructureChecks = ({ adrs }) => adrs
    .filter((a) => a.dsl_infrastructure)
    .flatMap((a) => {
    const dsl = a.dsl_infrastructure;
    const results = [];
    if (!dsl.dsl_definition) {
        results.push({
            severity: 'fail',
            message: `${a.id}: dsl_infrastructure exige dsl_definition`,
        });
    }
    if (!dsl.enforcement) {
        results.push({
            severity: 'warn',
            message: `${a.id}: enforcement recomendado para dsl_infrastructure`,
        });
    }
    return results;
});
