import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, price, compare_price, category, tags, images, thumbnail, stock, is_featured, is_bestseller } = req.body;
    if (!name || !price) throw new AppError('Name and price are required', 400);

    const slug = slugify(name);
    const { rows } = await query(
      `INSERT INTO products (name, slug, description, price, compare_price, category, tags, images, thumbnail, stock, is_featured, is_bestseller)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, slug, description, price, compare_price || null, category || null, tags || [], images || [], thumbnail || null, stock || 0, is_featured || false, is_bestseller || false]
    );
    res.status(201).json({ success: true, product: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req, res, next) {
  try {
    const { category, search, featured, sort, page = 1, limit = 12 } = req.query;
    let sql = 'SELECT * FROM products WHERE is_active = true';
    const params = [];
    let paramIdx = 1;

    if (category) {
      sql += ` AND category = $${paramIdx++}`;
      params.push(category);
    }
    if (search) {
      sql += ` AND (name ILIKE $${paramIdx} OR description ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (featured === 'true') {
      sql += ' AND is_featured = true';
    }
    if (req.query.bestseller === 'true') {
      sql += ' AND is_bestseller = true';
    }

    // Count total
    const countResult = await query(`SELECT COUNT(*) FROM (${sql}) AS count_query`, params);
    const total = parseInt(countResult.rows[0].count);

    // Sorting
    const sortMap = {
      'price-asc': 'price ASC',
      'price-desc': 'price DESC',
      'newest': 'created_at DESC',
      'name': 'name ASC',
    };
    sql += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` LIMIT $${paramIdx++} OFFSET $${paramIdx}`;
    params.push(parseInt(limit), offset);

    const { rows } = await query(sql, params);
    res.json({
      success: true,
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM products WHERE slug = $1 AND is_active = true', [req.params.slug]);
    if (!rows.length) throw new AppError('Product not found', 404);
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new AppError('Product not found', 404);
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, compare_price, category, tags, images, thumbnail, stock, is_featured, is_active, is_bestseller } = req.body;

    const { rows } = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        compare_price = COALESCE($4, compare_price),
        category = COALESCE($5, category),
        tags = COALESCE($6, tags),
        images = COALESCE($7, images),
        thumbnail = COALESCE($8, thumbnail),
        stock = COALESCE($9, stock),
        is_featured = COALESCE($10, is_featured),
        is_active = COALESCE($11, is_active),
        is_bestseller = COALESCE($12, is_bestseller),
        updated_at = now()
       WHERE id = $13 RETURNING *`,
      [name, description, price, compare_price, category, tags, images, thumbnail, stock, is_featured, is_active, is_bestseller, id]
    );
    if (!rows.length) throw new AppError('Product not found', 404);
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    // 1. Get product to find its images
    const { rows: productRows } = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (!productRows.length) throw new AppError('Product not found', 404);
    
    const product = productRows[0];
    const imageUrls = product.images || [];

    // 2. Find and delete images from Cloudinary
    if (imageUrls.length > 0) {
      // Find public_ids for these URLs in the images table
      const { rows: imageRows } = await query(
        'SELECT public_id FROM images WHERE secure_url = ANY($1) OR url = ANY($1)',
        [imageUrls]
      );

      for (const img of imageRows) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
          console.log(`🗑️ Deleted Cloudinary Image: ${img.public_id}`);
        } catch (err) {
          console.warn(`⚠️ Failed to delete image ${img.public_id} from Cloudinary:`, err.message);
        }
      }

      // Cleanup images table
      await query('DELETE FROM images WHERE secure_url = ANY($1) OR url = ANY($1)', [imageUrls]);
    }

    // 3. Delete from products table PERMANENTLY
    await query('DELETE FROM products WHERE id = $1', [id]);
    
    console.log(`✅ Product ${id} and its assets deleted successfully.`);
    res.json({ success: true, message: 'Product and associated images deleted permanently' });
  } catch (err) {
    next(err);
  }
}

export async function getAllProductsAdmin(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ success: true, products: rows });
  } catch (err) {
    next(err);
  }
}
