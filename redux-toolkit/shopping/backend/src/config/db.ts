import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error('DB_URL is not defined');
}

const pool = new Pool({ connectionString });

pool.on('error', (error) => {
  console.log('Unexpected PostgreSQL error:', error);
  process.exit(1);
});

export default pool;
