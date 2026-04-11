import 'dotenv/config';
import { query } from '../config/database.js';

async function setup() {
  try {
    console.log('🚀 Starting Database Upgrade for Admin Controls...');

    // 1. Add is_bestseller column
    await query('ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false');
    console.log('✅ Added is_bestseller column to products.');

    // 2. Create site_settings table
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMP DEFAULT now()
      )
    `);
    console.log('✅ Created site_settings table.');

    // 3. Insert default homepage config
    const defaultConfig = {
      expertly_crafted_title: "The Art of Adornment",
      expertly_crafted_subtitle: "Expertly Crafted",
      expertly_crafted_description: "Every piece of Sajhnaa jewellery is a testament to timeless elegance and modern craftsmanship. We use only the finest materials to ensure your shine never fades.",
      best_sellers_title: "Our Best Sellers",
      best_sellers_subtitle: "Most Loved Pieces"
    };

    await query(
      "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
      ['homepage', JSON.stringify(defaultConfig)]
    );
    console.log('✅ Initialized default homepage configuration.');

    console.log('🎉 Database Upgrade Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Upgrade Failed:', err);
    process.exit(1);
  }
}

setup();
