import 'dotenv/config';
import { query } from '../src/config/database.js';

const action = process.argv[2]; // 'add' or 'remove'
const email = process.argv[3];

async function manageAdmin() {
  if (!action || !email) {
    console.log('Usage: node scratch/manage-admins.js <add/remove> <email>');
    process.exit(1);
  }

  try {
    const role = action === 'add' ? 'admin' : 'customer';
    const { rowCount } = await query(
      'UPDATE users SET role = $1 WHERE email = $2',
      [role, email]
    );

    if (rowCount > 0) {
      console.log(`✅ Success: ${email} is now a ${role}.`);
    } else {
      console.log(`❌ Error: User with email ${email} not found in database.`);
      console.log(`Hint: The user must log in at least once to be created in the database.`);
    }
  } catch (err) {
    console.error('❌ Database Error:', err);
  } finally {
    process.exit(0);
  }
}

manageAdmin();
