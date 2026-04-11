import 'dotenv/config';
import { query } from '../src/config/database.js';

async function listUsers() {
  try {
    const { rows } = await query('SELECT id, email, role FROM users');
    console.log('Users:', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listUsers();
