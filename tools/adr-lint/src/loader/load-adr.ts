import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ADR, AdrStatus, AdrFromIndex } from '../types.js';
import { hash } from 'crypto';

export function loadADRs(dir: string): ADR[] {
  const files = fs.readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .filter((f) => !f.toLowerCase().includes('template'));

  return files.map((file) => {
    const raw = yaml.load(
      fs.readFileSync(path.join(dir, file), 'utf8'),
    ) as Omit<ADR, 'file'>;

    return { ...raw, file };
  });
}

const ADR_STATUSES: readonly AdrStatus[] = [
  'Proposed',
  'Accepted',
  'Deprecated',
  'Superseded',
];

function parseAdrStatus(value: string): AdrStatus {
  if (ADR_STATUSES.includes(value as AdrStatus)) {
    return value as AdrStatus;
  }

  throw new Error(`Status inválido no adr-index.md: "${value}"`);
}

export function loadADRsFromIndex(filePath: string): AdrFromIndex[] {
  const content = fs.readFileSync(filePath, 'utf8');

  const tableLines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));

  if (tableLines.length === 0) return [];

  // Descobre o header
  const headerColumns = tableLines[0]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);

  const idIndex = headerColumns.indexOf('ID');
  const statusIndex = headerColumns.indexOf('Status');
  const hashIndex = headerColumns.indexOf('Hash');

  if (idIndex === -1 || statusIndex === -1 || hashIndex === -1) {
    throw new Error(
      `adr-index.md inválido: colunas obrigatórias "ID" e "Status" não encontradas`,
    );
  }

  return tableLines
    .slice(1) // tudo depois do primeiro header
    .map((line) =>
      line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean),
    )
    .filter((columns) => {
      // ignora separador: | --- | --- |
      if (columns.every((c) => /^-+$/.test(c))) return false;

      // ignora header repetido
      if (
        columns[idIndex] === 'ID' ||
        columns[statusIndex] === 'Status' ||
        columns[hashIndex] === 'Hash'
      ) {
        return false;
      }

      return true;
    })
    .map((columns) => {
      const id = columns[idIndex];
      const rawStatus = columns[statusIndex];
      const hash = columns[hashIndex];

      return {
        id,
        status: parseAdrStatus(rawStatus),
        hash,
      };
    });
}

// export function getAdrFromIndex(
//   index: AdrFromIndex[],
//   adrId: string,): AdrFromIndex | undefined {
//   return index.find((entry) => entry.id === adrId);
// }
