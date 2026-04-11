import 'dotenv/config';
import pool from '../config/database.js';

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in DB:', res.rows.map(r => r.table_name));
    
    // Also try to select from images to see if it works
    try {
      await pool.query('SELECT * FROM images LIMIT 1');
      console.log('✅ images table exists and is accessible.');
    } catch (e) {
      console.error('❌ images table error:', e.message);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

check();
