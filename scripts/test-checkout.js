const mysql = require('mysql2/promise');

const config = {
  DATABASE: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sports_store'
  }
};

async function testCheckout() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config.DATABASE);
    console.log('Connected to MySQL database');

    // Kiểm tra sản phẩm
    const [products] = await connection.execute('SELECT id, name FROM products');
    console.log('📦 Available products:');
    products.forEach(p => console.log(`  ID: ${p.id}, Name: ${p.name}`));

    // Kiểm tra cart items
    const [cartItems] = await connection.execute(`
      SELECT c.id, c.product_id, c.quantity, p.name, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = 2
    `);
    console.log('\n🛒 Cart items for user 2:');
    cartItems.forEach(item => {
      console.log(`  Cart ID: ${item.id}, Product ID: ${item.product_id}, Name: ${item.name}, Qty: ${item.quantity}, Price: ${item.price}`);
    });

    // Test tạo order với dữ liệu từ cart
    if (cartItems.length > 0) {
      console.log('\n🧪 Testing order creation...');
      
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0123456789',
          address: '123 Test Street',
          city: 'Hà Nội',
          district: 'Cầu Giấy',
          ward: 'Dịch Vọng'
        },
        paymentMethod: 'cod',
        notes: 'Test order'
      };

      console.log('Order data:', JSON.stringify(orderData, null, 2));

      // Tạo order
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, notes)
        VALUES (?, ?, 'pending', ?, ?, ?)
      `, [2, 1000000, JSON.stringify(orderData.shippingAddress), orderData.paymentMethod, orderData.notes]);

      const orderId = orderResult.insertId;
      console.log(`✅ Order created with ID: ${orderId}`);

      // Tạo order items
      for (const item of orderData.items) {
        console.log(`Creating order item for product ${item.product_id}...`);
        
        const [itemResult] = await connection.execute(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `, [orderId, item.product_id, item.quantity, item.price]);
        
        console.log(`✅ Order item created with ID: ${itemResult.insertId}`);
      }

      console.log('✅ Test checkout successful!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testCheckout();
