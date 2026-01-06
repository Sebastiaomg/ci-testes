import { detectDecisionTypes } from './detect-decision-type.js';
function renderSection(title, adrs) {
    if (!adrs || adrs.length === 0)
        return '';
    const lines = adrs
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((adr) => `- **${adr.id}** – ${adr.title} (${adr.date})  \n  ↳ docs/adr/${adr.file}`);
    return `## ${title}: ${lines.length}\n\n${lines.join('\n')}\n\n`;
}
function groupByStatus(adrs) {
    return adrs.reduce((acc, adr) => {
        acc[adr.status].push(adr);
        return acc;
    }, {
        Proposed: [],
        Accepted: [],
        Deprecated: [],
        Superseded: [],
    });
}
export function generateAdrIndex(adrs) {
    const byStatus = groupByStatus(adrs);
    const sections = [
        ['Propostas', byStatus.Proposed],
        ['Aceitas', byStatus.Accepted],
        ['Depreciadas', byStatus.Deprecated],
        ['Substituídas', byStatus.Superseded],
    ];
    const sorted = [...adrs].sort((a, b) => a.id.localeCompare(b.id));
    return [
        `# Architecture Decision Records - Total: ${adrs.length}`,
        '',
        '| ID | Title | Type | Status | Date |',
        '|----|-------|------|--------|------|',
        ...sorted.map((adr) => {
            const types = detectDecisionTypes(adr);
            const type = types.length === 1 ? types[0] : '—';
            return `| ${adr.id} | ${adr.title} | ${type} | ${adr.status} | ${adr.date} |`;
        }),
        '',
        `Total de ADRs: **${adrs.length}**`,
        `${sections.map(([t, a]) => renderSection(t, a)).join('\n')}`
    ].join('\n');
}
