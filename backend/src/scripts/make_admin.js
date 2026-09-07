import 'dotenv/config';
import { query } from '../src/config/database.js';

async function makeAdmin() {
  try {
    const email = 'enquiry.arnika@gmail.com';
    await query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
    console.log(`Updated ${email} to admin`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

makeAdmin();
