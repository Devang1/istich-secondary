import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or define host, user, etc. manually
});

export default pool;
