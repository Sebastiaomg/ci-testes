export const immutableAccepted = ({ adrs }) => adrs
    .filter((a) => a.status === 'Aceito')
    .map((a) => ({
    severity: 'warn',
    message: `${a.id}: ADR Aceita deve ser imutável`,
}));
