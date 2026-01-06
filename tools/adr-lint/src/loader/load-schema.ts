import fs from 'fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

type ADRWithFile = {
  file?: string;
};

export function validateSchema(schemaPath: string, adrs: unknown[]): void {
  const raw = fs.readFileSync(schemaPath, 'utf-8');

  let schema: unknown;
  try {
    schema = JSON.parse(raw);
  } catch {
    throw new Error(`❌ Schema inválido: JSON malformado (${schemaPath})`);
  }

  if (typeof schema !== 'object' || schema === null) {
    throw new Error('❌ Schema inválido: o JSON não é um objeto');
  }

  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictRequired: false,
  });

  (addFormats as unknown as (ajv: Ajv2020) => void)(ajv);

  const validate = ajv.compile(schema);

  adrs.forEach((adr, index) => {
    const {file, ...adrWithoutFile } = adr as any;
    const valid = validate(adrWithoutFile);

    if (!valid) {
      const file =
        typeof adr === 'object' && adr !== null && 'file' in adr
          ? (adr as ADRWithFile).file
          : undefined;

      const message = ajv.errorsText(validate.errors, {
        separator: '\n',
        dataVar: file ? `ADR(${file})` : `ADR[${index + 1}]`,
      });

      throw new Error(
        `❌ Erro de schema${file ? ` no arquivo "${file}"` : ''}:\n${message}`,
      );
    }
  });
}