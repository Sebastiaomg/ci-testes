import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ADR } from '../types.js';

export function loadADRs(dir: string): ADR[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'));

  return files.map((file) => {
    const raw = yaml.load(
      fs.readFileSync(path.join(dir, file), 'utf8'),
    ) as Omit<ADR, 'file'>;

    return { ...raw, file };
  });
}
