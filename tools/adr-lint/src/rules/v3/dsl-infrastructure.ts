import { Rule, RuleResult } from '../../types.js';

export const dslInfrastructureChecks: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.dsl_infrastructure)
    .flatMap((a) => {
      const dsl = a.dsl_infrastructure as any;
      const results: RuleResult[] = [];

      if (!dsl.dsl_definition) {
        results.push({
          severity: 'fail',
          message: `${a.id}: dsl_infrastructure exige dsl_definition (regra v3)`,
        });
      }

      if (!dsl.enforcement) {
        results.push({
          severity: 'warn',
          message: `${a.id}: enforcement recomendado para dsl_infrastructure (regra v3)`,
        });
      }

      return results;
    });