const mysql = require('mysql2/promise');

const config = {
  DATABASE: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sports_store'
  }
};

async function testReviewSystem() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config.DATABASE);
    console.log('Connected to MySQL database');

    // Tạo order test trước
    console.log('Creating test order...');
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, notes)
      VALUES (2, 2000000, 'delivered', '{"firstName":"Test","lastName":"User"}', 'cod', 'Test order for reviews')
    `);
    const testOrderId = orderResult.insertId;
    console.log(`✅ Created test order ID: ${testOrderId}`);

    // Thêm đánh giá test cho sản phẩm khác
    console.log('Adding test reviews...');
    
    // Đánh giá cho sản phẩm ID 17 (Nike Air Force 1)
    await connection.execute(`
      INSERT INTO reviews (user_id, product_id, order_id, rating, comment)
      VALUES (2, 17, ?, 4, 'Sản phẩm tốt, chất lượng ổn')
    `, [testOrderId]);

    // Cập nhật average_rating cho sản phẩm 17
    const [ratingData17] = await connection.execute(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
      FROM reviews
      WHERE product_id = 17
    `);

    const avgRating17 = parseFloat(ratingData17[0].avg_rating || 0);
    const totalReviews17 = parseInt(ratingData17[0].total_reviews || 0);

    await connection.execute(`
      UPDATE products 
      SET average_rating = ?, total_reviews = ?
      WHERE id = 17
    `, [avgRating17, totalReviews17]);

    console.log(`✅ Updated product 17: ${avgRating17} stars, ${totalReviews17} reviews`);

    // Kiểm tra tất cả sản phẩm
    const [products] = await connection.execute(`
      SELECT id, name, average_rating, total_reviews
      FROM products
      ORDER BY id
    `);
    
    console.log('\n📦 All products with ratings:');
    products.forEach(product => {
      console.log(`  ${product.name} (ID: ${product.id})`);
      console.log(`  ⭐ ${product.average_rating || 0} stars (${product.total_reviews || 0} reviews)`);
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

testReviewSystem();
