import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

// Use the connection string from env if available, else fallback to the one in promote-admin
const connectionString = process.env.DATABASE_URL || 'postgresql://sajhnaa:J1s2fGnGEsqt0d2mI77Xlg@rapid-elk-14391.jxf.gcp-asia-south1.cockroachlabs.cloud:26257/sajhnaa_db?sslmode=verify-full';

const pool = new Pool({ connectionString });

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node make-admin.js <email>');
    process.exit(1);
  }

  try {
    const res = await pool.query("UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *", [email]);
    if (res.rowCount > 0) {
      console.log(`✅ SUCCESS: ${email} is now an admin.`);
      console.log('User Details:', res.rows[0]);
    } else {
      console.log(`❌ ERROR: User with email ${email} not found.`);
    }
  } catch (err) {
    console.error('❌ DB ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

makeAdmin();
