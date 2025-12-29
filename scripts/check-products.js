const mysql = require('mysql2/promise');

const config = {
  DATABASE: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sports_store'
  }
};

async function checkProducts() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config.DATABASE);
    console.log('Connected to MySQL database');

    // Kiểm tra sản phẩm
    const [products] = await connection.execute('SELECT id, name FROM products ORDER BY id');
    console.log('📦 Products in database:');
    products.forEach(product => {
      console.log(`  ID: ${product.id}, Name: ${product.name}`);
    });

    // Kiểm tra cart items
    const [cartItems] = await connection.execute('SELECT * FROM cart ORDER BY id DESC LIMIT 10');
    console.log('\n🛒 Recent cart items:');
    cartItems.forEach(item => {
      console.log(`  Cart ID: ${item.id}, Product ID: ${item.product_id}, User ID: ${item.user_id}`);
    });

    // Kiểm tra orders
    const [orders] = await connection.execute('SELECT id, user_id, status, created_at FROM orders ORDER BY id DESC LIMIT 5');
    console.log('\n📋 Recent orders:');
    orders.forEach(order => {
      console.log(`  Order ID: ${order.id}, User ID: ${order.user_id}, Status: ${order.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkProducts();
