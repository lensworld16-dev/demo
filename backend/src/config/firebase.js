import admin from 'firebase-admin';

const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
let formattedKey = rawKey;

if (rawKey) {
  // Try to parse if it was pasted as a JSON string
  if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
    try {
      formattedKey = JSON.parse(rawKey);
    } catch (e) {
      formattedKey = rawKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    }
  } else {
    // Standard replacement
    formattedKey = rawKey.replace(/\\n/g, '\n');
  }

  // Ensure headers are correct
  if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey.replace(/-----.*?-----|\s/g, '')}\n-----END PRIVATE KEY-----\n`;
  }
  
  // Clean up any weird invisible characters
  formattedKey = formattedKey.trim();
}

console.log('Firebase Init Debug:');
console.log('- Project ID present:', !!process.env.FIREBASE_PROJECT_ID);
console.log('- Client Email present:', !!process.env.FIREBASE_CLIENT_EMAIL);
console.log('- Raw Key length:', rawKey.length);
console.log('- Starts with:', rawKey.substring(0, 30));
console.log('- Formatted Key has real newlines:', formattedKey.includes('\n'));
console.log('- Formatted Key substring:', formattedKey.substring(0, 35));

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: formattedKey,
  }),
});

export const auth = firebaseApp.auth();
export default firebaseApp;
