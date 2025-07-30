import { Pool } from 'pg';

const pool = new Pool({
  connectionString:"postgresql://istitch_user:AL4WAX5eGuHieVIN8aWGNvWqxwmTnxzl@dpg-d2563t7gi27c73bnsbog-a.oregon-postgres.render.com/istitch", // or define host, user, etc. manually
});

export default pool;
