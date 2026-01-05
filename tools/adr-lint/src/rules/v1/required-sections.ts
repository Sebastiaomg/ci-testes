import { Rule } from '../../types.js';

export const requiredSections: Rule = ({ adrs }) =>
  adrs
    .filter((a) => !a.decision?.summary)
    .map((a) => ({
      severity: 'fail',
      message: `${a.id}: decision.summary é obrigatório`,
    }));
