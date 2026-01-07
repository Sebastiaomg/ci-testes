import { Rule } from '../../types.js';
import { computeAdrHash } from '../../engine/generate-index.js';

export const immutableAccepted: Rule = ({ adrs, index }) =>
  adrs.flatMap((adr) => {
    const previous = index.find((i) => i.id === adr.id);
    // ADR nova → nunca é violação
    if (!previous) return [];
    // Só importa se já estava Accepted
    if (previous.status !== 'Accepted') return [];
    const currentHash = computeAdrHash(adr);
    if (currentHash === previous.hash) return [];
    // Violação real
    return [
      {
        severity: 'warn',
        message: `${adr.id}: ADR Aceita deve ser imutável (regra v1)`,
      },
    ];
  });