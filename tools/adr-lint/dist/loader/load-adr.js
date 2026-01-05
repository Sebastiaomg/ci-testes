import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
export function loadADRs(dir) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'));
    return files.map((file) => {
        const raw = yaml.load(fs.readFileSync(path.join(dir, file), 'utf8'));
        return { ...raw, file };
    });
}
