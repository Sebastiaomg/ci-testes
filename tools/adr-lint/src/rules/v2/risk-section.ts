import { Rule } from '../../types.js';

export const riskSection: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.status === 'Aceito')
    .filter((a) => !a.consequences)
    .map((a) => ({
      severity: 'warn',
      message: `${a.id}: riscos/consequências não documentados`,
    }));
