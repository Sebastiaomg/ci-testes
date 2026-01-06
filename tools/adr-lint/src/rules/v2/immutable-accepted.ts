import { Rule } from '../../types.js';

export const immutableAcceptedV2: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.status === 'Accepted')
    .map((a) => ({
      severity: 'fail',
      message: `${a.id}: ADR Aceita não pode ser alterada (regra v2)`,
    }));
