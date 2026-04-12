import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
});

async function columnExists(table, column) {
  const { rows } = await query(
    'SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2',
    [table, column]
  );
  return rows.length > 0;
}

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Basic Table Creation
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        photo_url TEXT,
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        compare_price DECIMAL(12,2),
        category VARCHAR(100),
        tags TEXT[],
        images TEXT[] DEFAULT '{}',
        thumbnail TEXT,
        stock INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
        shipping DECIMAL(12,2) DEFAULT 0,
        tax DECIMAL(12,2) DEFAULT 0,
        total DECIMAL(12,2) NOT NULL DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address JSONB DEFAULT '{}'::jsonb,
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        product_id UUID REFERENCES products(id),
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, product_id)
      );

      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        public_id VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        secure_url TEXT NOT NULL,
        format VARCHAR(20),
        width INT,
        height INT,
        bytes INT,
        folder VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
        discount_value DECIMAL(12,2) NOT NULL,
        min_order_value DECIMAL(12,2) DEFAULT 0,
        max_discount DECIMAL(12,2),
        starts_at TIMESTAMPTZ DEFAULT now(),
        expires_at TIMESTAMPTZ,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );

        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          product_id UUID REFERENCES products(id),
          rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          is_published BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMP DEFAULT now()
        );
    `);

    // Migration logic (Individual queries because CockroachDB/Postgres anonymous blocks often restrict DDL)
    
    // Check Orders table
    if (!(await columnExists('orders', 'items'))) {
      await client.query("ALTER TABLE orders ADD COLUMN items JSONB NOT NULL DEFAULT '[]'::jsonb");
    }
    if (!(await columnExists('orders', 'shipping_address'))) {
      await client.query("ALTER TABLE orders ADD COLUMN shipping_address JSONB DEFAULT '{}'::jsonb");
    }
    if (!(await columnExists('orders', 'status'))) {
      await client.query("ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'pending'");
    }
    if (!(await columnExists('orders', 'subtotal'))) {
      await client.query("ALTER TABLE orders ADD COLUMN subtotal DECIMAL(12,2) NOT NULL DEFAULT 0");
    }
    if (!(await columnExists('orders', 'total'))) {
      await client.query("ALTER TABLE orders ADD COLUMN total DECIMAL(12,2) NOT NULL DEFAULT 0");
    }

    // Check Wishlist table
    if (!(await columnExists('wishlist', 'id'))) {
      await client.query("ALTER TABLE wishlist ADD COLUMN id UUID DEFAULT gen_random_uuid()");
      try { await client.query("ALTER TABLE wishlist ADD PRIMARY KEY (id)"); } catch (e) {}
    }

    // Check Users table
    if (!(await columnExists('users', 'photo_url'))) {
      await client.query("ALTER TABLE users ADD COLUMN photo_url TEXT");
    }

    // Indices
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
    `);

    console.log('✅ Database tables initialized and verified');
  } catch (err) {
    console.error('❌ Database Init Error:', err);
    throw err;
  } finally {
    client.release();
  }
}

export function query(text, params) {
  return pool.query(text, params);
}

export default pool;
