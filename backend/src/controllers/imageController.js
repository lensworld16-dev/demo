import { uploadImage, fetchImages, deleteImage } from '../services/imageService.js';

export async function handleUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    console.log('📸 Uploading image to Cloudinary...');
    const folder = req.body.folder || 'sajhnaa/products';
    const image = await uploadImage(req.file.buffer, folder);
    console.log('✅ Image uploaded successfully:', image.url);
    res.status(201).json({ success: true, image });
  } catch (err) {
    console.error('❌ IMAGE UPLOAD ERROR:', err);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
}

export async function handleFetch(req, res, next) {
  try {
    const images = await fetchImages(req.query.folder);
    res.json({ success: true, images });
  } catch (err) {
    next(err);
  }
}

export async function handleDelete(req, res, next) {
  try {
    const image = await deleteImage(req.params.id);
    res.json({ success: true, message: 'Image deleted', image });
  } catch (err) {
    next(err);
  }
}
