import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type ADRStatus = 'Proposto' | 'Aceito' | 'Depreciado' | 'Substituído';

interface Consequences {
  positive?: string[];
  negative?: string[];
}

interface DecisionDSL {
  type?: string;
  intent?: string;
}

interface RelatedDecisions {
  supersedes?: string[];
  depends_on?: string[];
}

interface ADR {
  id: string;
  prefix: string;
  status: ADRStatus;
  decision: {
    summary: string;
  } & DecisionDSL;
  consequences?: Consequences;
  related_decisions?: RelatedDecisions;
  file: string;
}

const ADR_DIR = 'docs/adr';

const files = fs.readdirSync(ADR_DIR).filter((f) => f.endsWith('.yaml'));

const adrs: ADR[] = files.map((file) => {
  const raw = yaml.load(
    fs.readFileSync(path.join(ADR_DIR, file), 'utf8'),
  ) as Omit<ADR, 'file'>;

  return { file, ...raw };
});

const errors: string[] = [];
const warnings: string[] = [];

function fail(msg: string): void {
  errors.push(msg);
}

function warn(msg: string): void {
  warnings.push(msg);
}

/**
 * Regras
 */

// 1️⃣ ID e prefixo consistentes
adrs.forEach((adr) => {
  if (!adr.id.startsWith(`ADR-${adr.prefix}-`)) {
    fail(`${adr.file}: prefix não corresponde ao ID`);
  }
});

// 2️⃣ IDs únicos
const ids = adrs.map((a) => a.id);
ids.forEach((id, idx) => {
  if (ids.indexOf(id) !== idx) {
    fail(`ID duplicado: ${id}`);
  }
});

// 3️⃣ Status Substituído exige supersedes
adrs.forEach((adr) => {
  if (adr.status === 'Substituído') {
    if (!adr.related_decisions?.supersedes?.length) {
      fail(`${adr.id}: status Substituído exige supersedes`);
    }
  }
});

// 4️⃣ depends_on exige ADR existente
adrs.forEach((adr) => {
  adr.related_decisions?.depends_on?.forEach((dep) => {
    if (!ids.includes(dep)) {
      fail(`${adr.id}: depends_on ${dep} não existe`);
    }
  });
});

// 5️⃣ ADR Aceita sem consequências (warning)
adrs.forEach((adr) => {
  if (
    adr.status === 'Aceito' &&
    !adr.consequences?.positive?.length &&
    !adr.consequences?.negative?.length
  ) {
    warn(`${adr.id}: ADR Aceita sem consequências descritas`);
  }
});

// 6️⃣ ADR Aceita sem DSL mínima (warning)
adrs.forEach((adr) => {
  if (adr.status === 'Aceito' && (!adr.decision.type || !adr.decision.intent)) {
    warn(`${adr.id}: ADR Aceita sem decision.type ou decision.intent`);
  }
});

/**
 * Output
 */
if (warnings.length) {
  console.warn('⚠️ WARNINGS:');
  warnings.forEach((w) => console.warn(' -', w));
}

if (errors.length) {
  console.error('❌ ERRORS:');
  errors.forEach((e) => console.error(' -', e));
  process.exit(1);
}

console.log('✅ ADR lint passou com sucesso');
