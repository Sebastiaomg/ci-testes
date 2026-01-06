import { Rule } from '../../types.js';

export const immutableAccepted: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.status === 'Accepted')
    .map((a) => ({
      severity: 'warn',
      message: `${a.id}: ADR Aceita deve ser imutável`,
    }));
