export function generateAdrIndex(adrs) {
    const sorted = [...adrs].sort((a, b) => a.id.localeCompare(b.id));
    return [
        '# Architecture Decision Records',
        '',
        '| ID | Title | Status | Date |',
        '|----|-------|--------|------|',
        ...sorted.map((adr) => `| ${adr.id} | ${adr.title} | ${adr.status} | ${adr.date} |`),
        '',
    ].join('\n');
}
