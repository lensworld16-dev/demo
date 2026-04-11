import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

console.log('Testing connection to CockroachDB...');
console.log('URL:', process.env.DATABASE_URL.substring(0, 30) + '...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.query('SELECT now()', (err, res) => {
  if (err) {
    console.error('Connection Error:', err.message);
  } else {
    console.log('SUCCESS! Connected to sajhnaa_db at:', res.rows[0].now);
  }
  pool.end();
});
