const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const parseNumber = (value, fallback) => {
  const result = Number.parseInt(value ?? '', 10);
  return Number.isFinite(result) ? result : fallback;
};

const DB_CONFIG = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? process.env.MYSQL_ROOT_PASSWORD ?? '',
  port: parseNumber(process.env.DB_PORT || process.env.MYSQL_PORT, 3306),
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'sports_store',
};

async function initializeDatabase() {
  let connection;
  
  try {
    // Kết nối đến MySQL server (không chỉ định database)
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port,
    });

    console.log('✅ Connected to MySQL server');

    // Tạo database
    await connection.query('CREATE DATABASE IF NOT EXISTS ??', [DB_CONFIG.database]);
    console.log(`✅ Database ${DB_CONFIG.database} created or already exists`);

    // Chuyển sang database sports_store
    await connection.query('USE ??', [DB_CONFIG.database]);

    // Tạo bảng users với cột role
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table users created or already exists');

    // Thêm cột role nếu chưa có (cho database cũ)
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password
      `);
      console.log('✅ Added role column to users table');
    } catch (error) {
      // Column already exists, ignore error
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }

    // Tạo bảng products với các cột nâng cao
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(15,0) NOT NULL DEFAULT 0,
        image VARCHAR(255),
        category VARCHAR(100),
        images LONGTEXT,
        product_type VARCHAR(100),
        sport_type VARCHAR(100),
        stock INT DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0.00,
        total_reviews INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table products created or already exists');

    // Sửa cột price để hỗ trợ giá trị lớn (VND)
    try {
      await connection.query(`
        ALTER TABLE products 
        MODIFY COLUMN price DECIMAL(15,0) NOT NULL DEFAULT 0
      `);
      console.log('✅ Modified price column to DECIMAL(15,0)');
    } catch (error) {
      console.log('ℹ️  Price column modification skipped');
    }

    // Thêm cột images nếu chưa có
    try {
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN images LONGTEXT
      `);
      console.log('✅ Added images column to products table');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }

    // Thêm cột product_type nếu chưa có
    try {
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN product_type VARCHAR(100)
      `);
      console.log('✅ Added product_type column to products table');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }

    // Thêm cột sport_type nếu chưa có
    try {
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN sport_type VARCHAR(100)
      `);
      console.log('✅ Added sport_type column to products table');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }

    // Thêm cột average_rating và total_reviews nếu chưa có
    try {
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00,
        ADD COLUMN total_reviews INT DEFAULT 0
      `);
      console.log('✅ Added rating columns to products table');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }

    // Tạo bảng cart
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
    console.log('✅ Table cart created or already exists');

    // Tạo bảng orders
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        shipping_address TEXT,
        payment_method VARCHAR(50) DEFAULT 'cod',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table orders created or already exists');

    // Sửa cột total_amount để hỗ trợ giá trị lớn (VND)
    try {
      await connection.query(`
        ALTER TABLE orders 
        MODIFY COLUMN total_amount DECIMAL(15,0) NOT NULL DEFAULT 0
      `);
      console.log('✅ Modified total_amount column to DECIMAL(15,0)');
    } catch (error) {
      console.log('ℹ️  total_amount column modification skipped');
    }

    // Tạo bảng order_items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table order_items created or already exists');

    // Tạo bảng reviews
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        order_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product_order (user_id, product_id, order_id)
      )
    `);
    console.log('✅ Table reviews created or already exists');

    // Tạo bảng password_reset_codes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        code_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        attempts INT DEFAULT 0,
        used TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_password_reset_email (email)
      )
    `);
    console.log('✅ Table password_reset_codes created or already exists');

    // Tạo admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO users (email, password, name, role) 
      VALUES ('admin@sportsstore.com', ?, 'Administrator', 'admin')
      ON DUPLICATE KEY UPDATE role = 'admin', password = ?
    `, [hashedPassword, hashedPassword]);
    console.log('✅ Admin user created or updated: admin@sportsstore.com / admin123');

    // Kiểm tra xem đã có dữ liệu mẫu chưa
    const [existingProducts] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (existingProducts[0].count === 0) {
      // Thêm dữ liệu mẫu cho products
      await connection.query(`
        INSERT INTO products (name, description, price, image, images, category, product_type, sport_type, stock) VALUES
        ('Nike Air Max 270', 'Comfortable running shoes with Air Max technology', 120.00, '/images/nike-air-max-270.jpg', JSON_ARRAY('/images/nike-air-max-270.jpg'), 'Shoes', 'running_shoes', 'running', 50),
        ('Adidas Ultraboost 22', 'High-performance running shoes', 180.00, '/images/adidas-ultraboost-22.jpg', JSON_ARRAY('/images/adidas-ultraboost-22.jpg'), 'Shoes', 'running_shoes', 'running', 30),
        ('Puma RS-X', 'Retro-inspired lifestyle sneakers', 90.00, '/images/puma-rs-x.jpg', JSON_ARRAY('/images/puma-rs-x.jpg'), 'Shoes', 'lifestyle', 'training', 25),
        ('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic t-shirt', 25.00, '/images/nike-dri-fit.jpg', JSON_ARRAY('/images/nike-dri-fit.jpg'), 'Clothing', 'tshirt', 'training', 100),
        ('Adidas Originals Hoodie', 'Classic three-stripe hoodie', 65.00, '/images/adidas-hoodie.jpg', JSON_ARRAY('/images/adidas-hoodie.jpg'), 'Clothing', 'hoodie', 'training', 40),
        ('Puma Training Shorts', 'Lightweight training shorts', 35.00, '/images/puma-shorts.jpg', JSON_ARRAY('/images/puma-shorts.jpg'), 'Clothing', 'shorts', 'training', 60)
      `);
      console.log('✅ Sample products added');
    }

    await connection.end();
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Admin credentials:');
    console.log('Email: admin@sportsstore.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
