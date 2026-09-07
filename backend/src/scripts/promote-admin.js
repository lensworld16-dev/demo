import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://arnika:password@localhost:5432/arnika_db'
});

async function promote() {
  const email = 'admin123@gmail.com';
  try {
    const res = await pool.query("UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *", [email]);
    if (res.rowCount > 0) {
      console.log(`SUCCESS: ${email} is now an admin.`);
      console.log('User data:', res.rows[0]);
    } else {
      console.log(`ERROR: User with email ${email} not found in database.`);
    }
  } catch (err) {
    console.error('DATABASE ERROR:', err);
  } finally {
    await pool.end();
  }
}

promote();
