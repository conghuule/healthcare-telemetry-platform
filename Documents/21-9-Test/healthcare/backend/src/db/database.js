import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';

const schemaUrl = new URL('../../db/schema.sql', import.meta.url);

export function createDatabasePool(connectionString) {
  return new Pool({ connectionString, max: 10, idleTimeoutMillis: 30000 });
}

export async function initializeDatabase(pool) {
  const schema = await readFile(schemaUrl, 'utf8');
  await pool.query(schema);
}
