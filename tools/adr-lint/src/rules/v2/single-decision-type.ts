import { Rule } from '../../types.js';
import { detectDecisionTypes, detectSingleDecisionType } from '../../engine/detect-decision-type.js';

export const singleDecisionType: Rule = ({ adrs }) =>
  adrs.flatMap((adr) => {
    const types = detectDecisionTypes(adr);
    const type = detectSingleDecisionType(adr);

    if (!type) {
      return [{
        severity: 'fail',
        message:
          types.length > 1
            ? `${adr.id}: ADR define múltiplos decision_types (${types.join(', ')}) (regra v2)`
            : `${adr.id}: ADR não define decision_type (regra v2)`,
      }];
    }

    return [];
  });