import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import slugify from 'slugify';

export async function getCategories(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM categories ORDER BY created_at ASC');
    res.json({ success: true, categories: rows });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, image } = req.body;
    if (!name) throw new AppError('Name is required', 400);

    const slug = slugify(name, { lower: true });
    const { rows } = await query(
      'INSERT INTO categories (name, slug, image) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, image]
    );
    res.status(201).json({ success: true, category: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    let updateFields = [];
    let values = [];
    let i = 1;

    if (name) {
      updateFields.push(`name = $${i++}`, `slug = $${i++}`);
      values.push(name, slugify(name, { lower: true }));
    }
    if (image !== undefined) {
      updateFields.push(`image = $${i++}`);
      values.push(image);
    }

    if (updateFields.length === 0) throw new AppError('Nothing to update', 400);

    values.push(id);
    const { rows } = await query(
      `UPDATE categories SET ${updateFields.join(', ')}, updated_at = now() WHERE id = $${i} RETURNING *`,
      values
    );

    if (!rows.length) throw new AppError('Category not found', 404);
    res.json({ success: true, category: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    
    // 1. Get category to find image path
    const { rows: findRows } = await query('SELECT image FROM categories WHERE id = $1', [id]);
    if (!findRows.length) throw new AppError('Category not found', 404);
    
    const imageUrl = findRows[0].image;
    
    // 2. Cleanup Cloudinary if image exists
    if (imageUrl) {
      const { rows: imgRows } = await query('SELECT public_id FROM images WHERE secure_url = $1 OR url = $1', [imageUrl]);
      if (imgRows.length > 0) {
        try {
          const { deleteByPublicId } = await import('../services/imageService.js');
          await deleteByPublicId(imgRows[0].public_id);
          console.log(`🗑️ Purged Category Image: ${imgRows[0].public_id}`);
        } catch (e) {
          console.error('Cloudinary purge failed', e);
        }
      }
    }

    // 3. Final Delete
    await query('DELETE FROM categories WHERE id = $1', [id]);
    res.json({ success: true, message: 'Category and assets purged from existence' });
  } catch (err) {
    next(err);
  }
}
