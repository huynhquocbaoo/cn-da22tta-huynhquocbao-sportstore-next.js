import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

// GET - Lấy danh sách yêu thích
export async function GET(request: NextRequest) {
  try {
    // Xác thực user
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const conn = await getConnection();

    // Tạo bảng wishlist nếu chưa tồn tại
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);

    // Lấy danh sách yêu thích với thông tin sản phẩm
    const [rows] = await conn.execute(`
      SELECT 
        w.id,
        w.product_id,
        p.name,
        p.price,
        p.image,
        p.description,
        p.stock,
        p.category
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

    return NextResponse.json({ wishlistItems: rows });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Thêm sản phẩm vào danh sách yêu thích
export async function POST(request: NextRequest) {
  try {
    // Xác thực user
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const conn = await getConnection();

    // Tạo bảng wishlist nếu chưa tồn tại
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);

    // Kiểm tra sản phẩm có tồn tại không
    const [products] = await conn.execute(
      'SELECT id FROM products WHERE id = ?',
      [productId]
    );

    if ((products as any[]).length === 0) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    // Kiểm tra đã có trong wishlist chưa
    const [existing] = await conn.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'Sản phẩm đã có trong danh sách yêu thích' }, { status: 409 });
    }

    // Thêm vào wishlist
    await conn.execute(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );

    return NextResponse.json({ message: 'Đã thêm vào danh sách yêu thích' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Xóa sản phẩm khỏi danh sách yêu thích
export async function DELETE(request: NextRequest) {
  try {
    // Xác thực user
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const conn = await getConnection();

    // Xóa khỏi wishlist
    const [result] = await conn.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm trong danh sách yêu thích' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

