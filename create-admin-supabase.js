// Quick script to create admin account in Supabase
// Run this with: node create-admin-supabase.js

const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'ChangeThisPassword123!';
    const hash = await bcrypt.hash(password, 10);
    console.log('Password hash for Supabase:');
    console.log(hash);
    console.log('\nRun this SQL in Supabase SQL Editor:');
    console.log(`
INSERT INTO "Admin" (id, email, "passwordHash", "createdAt")
VALUES (
  'admin_default',
  'admin@realproprealty.com',
  '${hash}',
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash";
    `);
}

generateHash();
