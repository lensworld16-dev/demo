import { auth } from '../config/firebase.js';
import { query } from '../config/database.js';

export async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const token = header.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;

    // Upsert user in DB
    const { rows } = await query(
      `INSERT INTO users (firebase_uid, email, display_name, photo_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (firebase_uid) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = COALESCE(EXCLUDED.display_name, users.display_name),
         photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
         updated_at = now()
       RETURNING *`,
      [decoded.uid, decoded.email, decoded.name || null, decoded.picture || null]
    );

    if (!rows || rows.length === 0) {
       console.error('Failed to upsert user for UID:', decoded.uid);
       return res.status(500).json({ error: 'Failed to sync user data' });
    }

    req.dbUser = rows[0];
    next();
  } catch (err) {
    console.error('❌ AUTH ERROR:', err.message);
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
}

export async function requireAdmin(req, res, next) {
  if (!req.dbUser || req.dbUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }
  try {
    const token = header.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    const { rows } = await query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );
    if (rows.length) req.dbUser = rows[0];
  } catch (_) {
    // Silently continue without auth
  }
  next();
}
