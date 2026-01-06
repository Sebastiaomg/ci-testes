export const riskSection = ({ adrs }) => adrs
    .filter((a) => a.status === 'Accepted')
    .filter((a) => !a.consequences)
    .map((a) => ({
    severity: 'warn',
    message: `${a.id}: riscos/consequências não documentados`,
}));
