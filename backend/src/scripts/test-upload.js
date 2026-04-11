import { uploadImage } from '../services/imageService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function test() {
  // 1x1 red pixel PNG
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  
  try {
    console.log('Testing upload...');
    const result = await uploadImage(buffer, 'test-folder');
    console.log('SUCCESS:', result);
  } catch (err) {
    console.error('UPLOAD FAILED:', err);
  }
}

test();
