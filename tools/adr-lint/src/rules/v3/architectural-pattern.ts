import { Rule, RuleResult } from '../../types.js';

export const architecturalPatternChecks: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.architectural_pattern)
    .flatMap((a) => {
      const p = a.architectural_pattern as any;
      const errors: RuleResult[] = [];

      if (!p.intent) {
        errors.push({
          severity: 'fail',
          message: `${a.id}: architectural_pattern exige intent`,
        });
      }

      if (!p.scope) {
        errors.push({
          severity: 'fail',
          message: `${a.id}: architectural_pattern exige scope`,
        });
      }

      return errors;
    });