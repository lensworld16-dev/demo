import 'dotenv/config';
import { query } from '../src/config/database.js';

async function createCategoriesTable() {
  try {
    await query(`DROP TABLE IF EXISTS categories CASCADE`);
    await query(`
      CREATE TABLE categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `);
    console.log('✅ Categories table created successfully');

    const initialCategories = [
      { name: 'Rings', slug: 'rings', image: '/images/rings.png' },
      { name: 'Earrings', slug: 'earrings', image: '/images/earrings.png' },
      { name: 'Necklaces', slug: 'necklaces', image: '/images/necklaces.png' },
      { name: 'Bracelets', slug: 'bracelets', image: '/images/bracelets.png' },
      { name: 'Anklets', slug: 'anklets', image: '/images/anklets.png' },
      { name: 'Chains', slug: 'chains', image: '/images/chains.png' },
      { name: 'Pendants', image: '/images/pendants.png', slug: 'pendants' },
      { name: 'Toe Rings', image: '/images/toe_rings.png', slug: 'toe-rings' }
    ];

    for (const cat of initialCategories) {
      await query(
        'INSERT INTO categories (name, slug, image) VALUES ($1, $2, $3)',
        [cat.name, cat.slug, cat.image]
      );
    }
    console.log('✅ Categories seeded successfully');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createCategoriesTable();
