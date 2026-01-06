#!/usr/bin/env node
import fs from 'fs';
import { fileURLToPath } from 'url';
import { loadADRs } from './loader/load-adr.js';
import { validateSchema } from './loader/load-schema.js';
import { runRules } from './engine/rule-engine.js';
import { summarize } from './engine/severity.js';
import { generateAdrIndex } from './engine/generate-index.js';
import { rulesetV1 } from './versions/ruleset.v1.js';
import { rulesetV2 } from './versions/ruleset.v2.js';
import { rulesetV3 } from './versions/ruleset.v3.js';
import path from 'path';

const command = process.argv[2] ?? 'lint';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoDir = path.resolve(__dirname, '../../../');
const ADR_DIR = path.resolve(repoDir, 'docs/adr');

function selectRules(lintVersion: string) {
  switch (lintVersion) {
    case 'v1':
      return rulesetV1;
    case 'v2':
      return rulesetV2;
    case 'v3':
      return rulesetV3;
    default:
      throw new Error(`Ruleset não definido para lint_version=${lintVersion}`);
  }
}

switch (command) {
  case 'lint': {
    const adrs = loadADRs(ADR_DIR);

    // Valida cada ADR individualmente pelo schema correspondente
    adrs.forEach((adr) => {
      const schemaFile = path.resolve(
        repoDir,
        `docs/adr-schema/adr.schema.${adr.schema_version}.json`
      );

      validateSchema(schemaFile, [adr]); // valida ADR individual
    });

    // Aplica as regras baseadas no lint_version de cada ADR
    const results = adrs.flatMap((adr) => {
      const rules = selectRules(adr.lint_version);
      return runRules(rules, {
        adrs: [adr],
        ids: [adr.id],
      });
    });

    const { errors, warnings } = summarize(results);

    warnings.forEach((w) => console.warn('⚠️', w.message));
    errors.forEach((e) => console.error('❌', e.message));

    if (errors.length) process.exit(1);

    console.log('✅ ADR lint passou com sucesso');
    break;
  }

  case 'index': {
    const adrs = loadADRs(ADR_DIR);
    const index = generateAdrIndex(adrs);
    const output = path.join(repoDir, 'docs/ADR-Index.md');

    fs.writeFileSync(output, index);
    console.log('📄 ADR index gerado com sucesso');
    break;
  }

  default:
    console.error(`❌ Comando desconhecido: ${command}`);
    process.exit(1);
}
