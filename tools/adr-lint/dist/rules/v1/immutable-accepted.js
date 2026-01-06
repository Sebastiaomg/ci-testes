export const immutableAccepted = ({ adrs }) => adrs
    .filter((a) => a.status === 'Accepted')
    .map((a) => ({
    severity: 'warn',
    message: `${a.id}: ADR Aceita deve ser imutável`,
}));
