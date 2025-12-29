const mysql = require('mysql2/promise');
const config = {
  DATABASE: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sports_store'
  }
};

async function createReviewsTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config.DATABASE);
    console.log('Connected to MySQL database');

    // Tạo bảng reviews
    await connection.execute(`
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

    // Thêm cột average_rating vào bảng products
    await connection.execute(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0
    `);

    console.log('✅ Reviews table created successfully');
    console.log('✅ Added rating columns to products table');

  } catch (error) {
    console.error('❌ Error creating reviews table:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createReviewsTable();
