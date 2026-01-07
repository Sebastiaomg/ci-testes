import type { AdrStatus, ADR, AdrFromIndex } from '../types.js';
import { detectDecisionTypes } from './detect-decision-type.js';
import crypto from 'crypto';

export function computeAdrHash(adr: ADR): string {
  const canonical = JSON.stringify(
    {
      // Identidade e estado
      id: adr.id,
      title: adr.title,
      status: adr.status,
      date: adr.date,
      prefix: adr.prefix,

      // Contexto
      context: adr.context,

      // Tipos de decisão (apenas o que existir)
      architectural_pattern: adr.architectural_pattern ?? null,
      infrastructure_choice: adr.infrastructure_choice ?? null,
      dsl_infrastructure: adr.dsl_infrastructure ?? null,
      data_strategy: adr.data_strategy ?? null,
      integration_strategy: adr.integration_strategy ?? null,
      security_policy: adr.security_policy ?? null,
      governance_rule: adr.governance_rule ?? null,

      // Estruturas normativas
      constraints: adr.constraints ?? null,
      rules: adr.rules ?? null,
      dsl_adoption: adr.dsl_adoption ?? null,
      lifecycle: adr.lifecycle ?? null,
      technical_impacts: adr.technical_impacts ?? null,
      audit_governance: adr.audit_governance ?? null,
      related_decisions: adr.related_decisions ?? null,
      consequences: adr.consequences ?? null,
    },
    null,
    0, // ⚠️ determinístico
  );

  return crypto
    .createHash('sha256')
    .update(canonical)
    .digest('hex');
}

function renderSection(title: string, adrs: ADR[]): string {
  if (!adrs || adrs.length === 0) return '';
//   const lines = adrs
//     .sort((a, b) => a.date.localeCompare(b.date))
//     .map(
//       (adr) =>
//         `- **${adr.id}** – ${adr.title} (${adr.date})  \n  ↳ docs/adr/${adr.file}`,
//     );

//   return `## ${title}: ${lines.length}\n\n${lines.join('\n')}\n\n`;

  const sorted = adrs.sort((a, b) => a.date.localeCompare(b.date))
return [
    `## ${title}: ${adrs.length}`,
    '',
    '| ID | Title | Type | Status | Date | Hash |',
    '|----|-------|------|--------|------|------|',
    ...sorted.map((adr) => {
      const types = detectDecisionTypes(adr);
      const hash = computeAdrHash(adr);
      const type = types.length === 1 ? types[0] : '—';

      return `| ${adr.id} | ${adr.title} | ${type} | ${adr.status} | ${adr.date} | ${hash} |`;
    }),
    '',
  ].join('\n');

}

function groupByStatus(adrs: ADR[]): Record<AdrStatus, ADR[]> {
  return adrs.reduce<Record<AdrStatus, ADR[]>>(
    (acc, adr) => {
      acc[adr.status].push(adr);
      return acc;
    },
    {
      Proposed: [],
      Accepted: [],
      Deprecated: [],
      Superseded: [],
    }
  );
}

export function generateAdrIndex(adrs: ADR[]): string {
  const byStatus = groupByStatus(adrs);
  const sections: Array<[string, ADR[]]> = [
    ['Propostas', byStatus.Proposed],
    ['Aceitas', byStatus.Accepted],
    ['Depreciadas', byStatus.Deprecated],
    ['Substituídas', byStatus.Superseded],
  ];
  return [
    `# Architecture Decision Records - Total: ${adrs.length}`,
    '',
    `${sections.map(([t, a]) => renderSection(t, a)).join('\n')}`,
  ].join('\n');
}
