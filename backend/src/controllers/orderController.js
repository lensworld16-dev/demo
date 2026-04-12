import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function createOrder(req, res, next) {
  try {
    const userId = req.dbUser?.id;
    const { items, subtotal, shipping, tax, total, shipping_address, payment_method, payment_id } = req.body;

    if (!userId) {
      throw new AppError('Authentication failed: User not found in database', 401);
    }

    console.log('📦 Process: Creating order for User ID:', userId);

    if (!items || !items.length) {
      throw new AppError('Order must contain items', 400);
    }

    const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
    const addressJson = typeof shipping_address === 'string' ? shipping_address : JSON.stringify(shipping_address);

    const { rows } = await query(
      `INSERT INTO orders (user_id, items, subtotal, shipping, tax, total, shipping_address, payment_method, payment_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        userId, 
        itemsJson, 
        Number(subtotal || 0), 
        Number(shipping || 0), 
        Number(tax || 0), 
        Number(total || 0), 
        addressJson, 
        payment_method || 'cod', 
        payment_id || null
      ]
    );

    console.log('✅ Success: Order #', rows[0].id);
    res.status(201).json({ success: true, order: rows[0] });
  } catch (err) {
    console.error('❌ FAILED_ORDER:', {
      message: err.message,
      detail: err.detail,
      code: err.code,
      stack: err.stack
    });
    next(err);
  }
}

export async function getUserOrders(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.dbUser.id]
    );
    res.json({ success: true, orders: rows });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new AppError('Order not found', 404);
    // Ensure user can only see their own orders (unless admin)
    if (req.dbUser.role !== 'admin' && rows[0].user_id !== req.dbUser.id) {
      throw new AppError('Forbidden', 403);
    }
    res.json({ success: true, order: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const { rows } = await query(`
      SELECT o.*, u.email, u.display_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, orders: rows });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) throw new AppError('Invalid status', 400);

    const { rows } = await query(
      'UPDATE orders SET status = $1, updated_at = now() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) throw new AppError('Order not found', 404);
    res.json({ success: true, order: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM orders WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      throw new AppError('Order not found', 404);
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
}

