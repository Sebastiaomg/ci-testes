import { Rule } from '../../types.js';

export const supersedesRequired: Rule = ({ adrs }) =>
  adrs
    .filter((a) => a.status === 'Superseded')
    .filter((a) => !a.related_decisions?.supersedes?.length)
    .map((a) => ({
      severity: 'fail',
      message: `${a.id}: status Substituído exige supersedes`,
    }));
