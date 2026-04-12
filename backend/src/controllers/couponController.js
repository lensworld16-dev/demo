import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getAllCoupons(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ success: true, coupons: rows });
  } catch (err) {
    next(err);
  }
}

export async function createCoupon(req, res, next) {
  try {
    const { code, discount_type, discount_value, min_order_value, max_discount, expires_at } = req.body;
    
    if (!code || !discount_type || discount_value === undefined) {
      throw new AppError('Code, discount type, and value are required', 400);
    }

    const { rows } = await query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [code.toUpperCase(), discount_type, discount_value, min_order_value || 0, max_discount || null, expires_at || null]
    );

    res.status(201).json({ success: true, coupon: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
       return next(new AppError('Coupon code already exists', 400));
    }
    next(err);
  }
}

export async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM coupons WHERE id = $1', [id]);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
}
