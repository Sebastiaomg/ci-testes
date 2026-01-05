import fs from 'fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
export function validateSchema(schemaPath, adrs) {
    const raw = fs.readFileSync(schemaPath, 'utf-8');
    let schema;
    try {
        schema = JSON.parse(raw);
    }
    catch {
        throw new Error(`❌ Schema inválido: JSON malformado (${schemaPath})`);
    }
    if (typeof schema !== 'object' || schema === null) {
        throw new Error('❌ Schema inválido: o JSON não é um objeto');
    }
    const ajv = new Ajv2020({
        allErrors: true,
        strict: true,
    });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    adrs.forEach((adr, index) => {
        const valid = validate(adr);
        if (!valid) {
            const message = ajv.errorsText(validate.errors, {
                separator: '\n',
                dataVar: `ADR[${index + 1}]`,
            });
            throw new Error(`❌ Erro de schema:\n${message}`);
        }
    });
}
