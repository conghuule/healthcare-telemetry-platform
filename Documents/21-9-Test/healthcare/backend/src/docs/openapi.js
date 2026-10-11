import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const specUrl = new URL('../../docs/openapi.yaml', import.meta.url);
export const openApiSpec = parse(readFileSync(specUrl, 'utf8'));
