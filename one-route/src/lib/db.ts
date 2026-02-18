import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';

// AWS RDS PostgreSQL Connection with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL_CERT_PATH
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.DB_SSL_CERT_PATH).toString(),
      }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export async function queryDatabase(query: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

export function getPool() {
  return pool;
}

export async function closePool() {
  await pool.end();
}

export default pool;
