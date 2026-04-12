import { query } from '../config/database.js';

export async function getProfile(req, res, next) {
  try {
    res.json({ success: true, user: req.dbUser });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { display_name, photo_url } = req.body;
    const { rows } = await query(
      `UPDATE users SET
        display_name = COALESCE($1, display_name),
        photo_url = COALESCE($2, photo_url),
        updated_at = now()
       WHERE id = $3 RETURNING *`,
      [display_name, photo_url, req.dbUser.id]
    );
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(req, res, next) {
  try {
    const [productsRes, ordersRes, usersRes, revenueRes] = await Promise.all([
      query('SELECT COUNT(*) FROM products WHERE is_active = true'),
      query('SELECT COUNT(*) FROM orders'),
      query('SELECT COUNT(*) FROM users'),
      query("SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != 'cancelled'"),
    ]);
    res.json({
      success: true,
      stats: {
        totalProducts: parseInt(productsRes.rows[0].count),
        totalOrders: parseInt(ordersRes.rows[0].count),
        totalUsers: parseInt(usersRes.rows[0].count),
        totalRevenue: parseFloat(revenueRes.rows[0].revenue),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ success: true, users: rows });
  } catch (err) {
    next(err);
  }
}

