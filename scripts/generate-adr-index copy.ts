import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type AdrStatus = 'proposed' | 'accepted' | 'deprecated' | 'superseded';

interface AdrMeta {
  id: string;
  title: string;
  status: AdrStatus;
  date: string;
  prefix?: string;
  file: string;
}

interface AdrDsl {
  id: unknown;
  title: unknown;
  status: unknown;
  date: unknown;
  prefix?: unknown;
}

const ADR_DIR = path.resolve('docs/adr');
const OUTPUT_FILE = path.resolve('docs/ADR-index.md');

function isAdrDsl(value: unknown): value is AdrDsl {
  return typeof value === 'object' && value !== null;
}

function normalizeStatus(value: string, file: string): AdrStatus {
  const normalized = value.toLowerCase();

  const allowed: AdrStatus[] = [
    'proposed',
    'accepted',
    'deprecated',
    'superseded',
  ];

  if (!allowed.includes(normalized as AdrStatus)) {
    throw new Error(`Status inválido na ADR ${file}: "${value}"`);
  }

  return normalized as AdrStatus;
}

function loadAdrs(): AdrMeta[] {
  const files = fs
    .readdirSync(ADR_DIR)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(ADR_DIR, file), 'utf8');
    const parsed = yaml.load(raw);

    if (!isAdrDsl(parsed)) {
      throw new Error(`ADR inválida (não é objeto): ${file}`);
    }

    const { id, title, status, date, prefix } = parsed;

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof status !== 'string' ||
      typeof date !== 'string'
    ) {
      throw new Error(`ADR inválida (campos obrigatórios): ${file}`);
    }

    return {
      id,
      title,
      status: normalizeStatus(status, file),
      date,
      prefix: typeof prefix === 'string' ? prefix : undefined,
      file,
    };
  });
}

function groupByStatus(adrs: AdrMeta[]): Record<AdrStatus, AdrMeta[]> {
  return adrs.reduce(
    (acc, adr) => {
      acc[adr.status] = acc[adr.status] || [];
      acc[adr.status].push(adr);
      return acc;
    },
    {} as Record<AdrStatus, AdrMeta[]>,
  );
}

function renderSection(title: string, adrs: AdrMeta[]): string {
  if (!adrs || adrs.length === 0) return '';

  const lines = adrs
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(
      (adr) =>
        `- **${adr.id}** – ${adr.title} (${adr.date})  \n  ↳ docs/adr/${adr.file}`,
    );

  return `## ${title}: ${lines.length}\n\n${lines.join('\n')}\n\n`;
}

function generateIndex(adrs: AdrMeta[]): string {
  const byStatus = groupByStatus(adrs);
  const sections: Array<[string, AdrMeta[]]> = [
    ['Propostas', byStatus.proposed],
    ['Aceitas', byStatus.accepted],
    ['Depreciadas', byStatus.deprecated],
    ['Substituídas', byStatus.superseded],
  ];

  return `# ADR Index

> ⚠️ Este arquivo é **gerado automaticamente**.  
> Não edite manualmente.

Total de ADRs: **${adrs.length}**
${sections.map(([t, a]) => renderSection(t, a)).join('\n')}
`;
}

function main() {
  const adrs = loadAdrs();
  const content = generateIndex(adrs);

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`ADR-index.md gerado com ${adrs.length} ADRs`);
}

main();
