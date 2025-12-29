const mysql = require('mysql2/promise');

async function fixPriceColumn() {
  let connection;
  try {
    console.log('🔧 Fixing price column to support larger values...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'sports_store'
    });

    console.log('✅ Connected to database');

    // Thay đổi kiểu dữ liệu cột price từ DECIMAL(10,2) sang DECIMAL(15,0)
    // DECIMAL(15,0) cho phép giá trị lên đến 999,999,999,999,999 (999 nghìn tỷ)
    await connection.query(`
      ALTER TABLE products 
      MODIFY COLUMN price DECIMAL(15,0) NOT NULL DEFAULT 0
    `);
    console.log('✅ Modified price column to DECIMAL(15,0)');

    // Cũng sửa cột total_amount trong bảng orders nếu có
    try {
      await connection.query(`
        ALTER TABLE orders 
        MODIFY COLUMN total_amount DECIMAL(15,0) NOT NULL DEFAULT 0
      `);
      console.log('✅ Modified total_amount column in orders table');
    } catch (error) {
      console.log('ℹ️  Could not modify orders table (may not exist or different structure)');
    }

    console.log('\n✅ Database fix completed successfully!');
    console.log('📌 Price column now supports values up to 999,999,999,999,999 VND');

  } catch (error) {
    console.error('❌ Error fixing database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixPriceColumn();

