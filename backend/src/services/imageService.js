import cloudinary from '../config/cloudinary.js';
import { query } from '../config/database.js';

export async function uploadImage(fileBuffer, folder = 'sajhnaa/products') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      },
      async (error, result) => {
        if (error) return reject(error);

        // Store in DB
        const { rows } = await query(
          `INSERT INTO images (public_id, url, secure_url, format, width, height, bytes, folder)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            result.public_id,
            result.url,
            result.secure_url,
            result.format,
            result.width,
            result.height,
            result.bytes,
            folder,
          ]
        );
        resolve(rows[0]);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function fetchImages(folder) {
  const params = folder
    ? ['SELECT * FROM images WHERE folder = $1 ORDER BY created_at DESC', [folder]]
    : ['SELECT * FROM images ORDER BY created_at DESC', []];
  const { rows } = await query(...params);
  return rows;
}

export async function deleteImage(imageId) {
  const { rows } = await query('SELECT * FROM images WHERE id = $1', [imageId]);
  if (!rows.length) throw new Error('Image not found');

  await cloudinary.uploader.destroy(rows[0].public_id);
  await query('DELETE FROM images WHERE id = $1', [imageId]);
  return rows[0];
}
