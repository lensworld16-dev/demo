import 'dotenv/config';
import { query } from '../src/config/database.js';

async function resetAllAdmins() {
  try {
    const { rowCount } = await query(
      "UPDATE users SET role = 'customer' WHERE role = 'admin'"
    );
    console.log(`✅ Success: ${rowCount} admins have been demoted to customers.`);
    console.log(`⚠️ Warning: You have also been demoted if you were an admin. You will lose access to the admin panel until you promote yourself again.`);
  } catch (err) {
    console.error('❌ Database Error:', err);
  } finally {
    process.exit(0);
  }
}

resetAllAdmins();
