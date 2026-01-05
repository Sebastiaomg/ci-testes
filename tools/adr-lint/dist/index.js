#!/usr/bin/env node
import fs from 'fs';
import { loadADRs } from './loader/load-adr.js';
import { validateSchema } from './loader/load-schema.js';
import { runRules } from './engine/rule-engine.js';
import { summarize } from './engine/severity.js';
import { generateAdrIndex } from './engine/generate-index.js';
import { rulesetV1 } from './versions/ruleset.v1.js';
import { rulesetV2 } from './versions/ruleset.v2.js';
import path from 'path';
const command = process.argv[2] ?? 'lint';
const ADR_DIR = path.resolve(process.cwd(), 'docs/adr');
function selectRules(lintVersion) {
    switch (lintVersion) {
        case 'v1':
            return rulesetV1;
        case 'v2':
            return rulesetV2;
        default:
            throw new Error(`Ruleset não definido para lint_version=${lintVersion}`);
    }
}
switch (command) {
    case 'lint': {
        const adrs = loadADRs(ADR_DIR);
        // Valida cada ADR individualmente pelo schema correspondente
        adrs.forEach((adr) => {
            const schemaFile = path.resolve(process.cwd(), `docs/adr-schema/adr.schema.${adr.schema_version}.json`);
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
        if (errors.length)
            process.exit(1);
        console.log('✅ ADR lint passou com sucesso');
        break;
    }
    case 'index': {
        const adrs = loadADRs(ADR_DIR);
        const index = generateAdrIndex(adrs);
        fs.writeFileSync('docs/ADR-index.md', index);
        console.log('📄 ADR index gerado com sucesso');
        break;
    }
    default:
        console.error(`❌ Comando desconhecido: ${command}`);
        process.exit(1);
}
