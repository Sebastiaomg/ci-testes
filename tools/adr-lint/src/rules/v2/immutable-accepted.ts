import { Rule } from '../../types.js';

export const immutableAcceptedV2: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.status === 'Aceito')
    .map((a) => ({
      severity: 'fail',
      message: `${a.id}: ADR Aceita não pode ser alterada (regra v2)`,
    }));
