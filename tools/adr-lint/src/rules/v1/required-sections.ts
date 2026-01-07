import { Rule } from '../../types.js';
import { detectDecisionTypes } from '../../engine/detect-decision-type.js';

export const requiredSections: Rule = ({ adrs }) =>
  adrs
    .filter((adr) => {
      const types = detectDecisionTypes(adr);
      if (types.length === 1) {
        const type = types[0];
        return !(adr[type] as any)?.decision_summary;
      }

      return true;
    })
    .map((adr) => ({
      severity: 'fail',
      message: `${adr.id}: decision_summary é obrigatório (regra v1)`,
    }));