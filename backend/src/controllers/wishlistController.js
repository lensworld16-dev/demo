import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getWishlist(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT w.id as wishlist_id, w.created_at as added_at, p.*
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.dbUser.id]
    );
    res.json({ success: true, items: rows });
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req, res, next) {
  try {
    const { product_id } = req.body;
    if (!product_id) throw new AppError('Product ID is required', 400);

    const { rows } = await query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [req.dbUser.id, product_id]
    );
    res.status(201).json({ success: true, item: rows[0] || { message: 'Already in wishlist' } });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { rows } = await query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.dbUser.id, req.params.productId]
    );
    if (!rows.length) throw new AppError('Item not found in wishlist', 404);
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    next(err);
  }
}
