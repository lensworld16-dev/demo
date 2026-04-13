import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getSettings(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT value FROM site_settings WHERE key = $1', [id]);
    if (!rows.length) return res.json({ success: true, settings: {} });
    res.json({ success: true, settings: rows[0].value });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const { id } = req.params;
    const { value } = req.body;
    console.log(`[SETTINGS] Updating key: ${id}, Payload size: ${JSON.stringify(value).length} chars`);
    
    const { rows } = await query(
      'INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, now()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now() RETURNING *',
      [id, JSON.stringify(value)]
    );
    
    res.json({ success: true, settings: rows[0].value });
  } catch (err) {
    next(err);
  }
}
