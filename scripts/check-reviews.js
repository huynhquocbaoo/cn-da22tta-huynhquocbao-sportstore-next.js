const mysql = require('mysql2/promise');

const config = {
  DATABASE: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sports_store'
  }
};

async function checkReviews() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config.DATABASE);
    console.log('Connected to MySQL database');

    // Kiểm tra reviews
    const [reviews] = await connection.execute(`
      SELECT r.*, p.name as product_name, u.name as user_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    
    console.log('⭐ Reviews in database:');
    reviews.forEach(review => {
      console.log(`  Product: ${review.product_name} (ID: ${review.product_id})`);
      console.log(`  User: ${review.user_name}, Rating: ${review.rating}/5`);
      console.log(`  Comment: ${review.comment || 'No comment'}`);
      console.log(`  Date: ${review.created_at}`);
      console.log('  ---');
    });

    // Kiểm tra average_rating trong products
    const [products] = await connection.execute(`
      SELECT id, name, average_rating, total_reviews
      FROM products
      ORDER BY id
    `);
    
    console.log('\n📦 Products with ratings:');
    products.forEach(product => {
      console.log(`  ${product.name} (ID: ${product.id})`);
      console.log(`  Average Rating: ${product.average_rating || 0}`);
      console.log(`  Total Reviews: ${product.total_reviews || 0}`);
      console.log('  ---');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkReviews();
