export const supersedesRequired = ({ adrs }) => adrs
    .filter((a) => a.status === 'Substituído')
    .filter((a) => !a.related_decisions?.supersedes?.length)
    .map((a) => ({
    severity: 'fail',
    message: `${a.id}: status Substituído exige supersedes`,
}));
