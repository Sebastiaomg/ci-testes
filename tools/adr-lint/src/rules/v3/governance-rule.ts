import { Rule, RuleResult } from '../../types.js';

export const governanceRuleChecks: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.governance_rule)
    .flatMap((a) => {
      const errors: RuleResult[] = [];

      if (!a.governance_rule?.rules) {
        errors.push({
          severity: 'fail',
          message: `${a.id}: governance_rule exige rules`,
        });
      }

      if (a.audit_governance?.applicable !== true) {
        errors.push({
          severity: 'fail',
          message: `${a.id}: governance_rule exige audit_governance.applicable=true`,
        });
      }

      return errors;
    });