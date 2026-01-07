import { Rule } from '../../types.js';

export const riskSection: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.status === 'Accepted')
    .filter((a) => !a.consequences)
    .map((a) => ({
      severity: 'warn',
      message: `${a.id}: riscos/consequências não documentados (regra v2)`,
    }));
