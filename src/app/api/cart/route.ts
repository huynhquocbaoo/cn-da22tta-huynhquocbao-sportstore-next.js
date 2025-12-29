import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { getUserIdFromRequest } from '@/lib/auth';

// GET - Lấy giỏ hàng của user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc token không hợp lệ' },
        { status: 401 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      const [cartItems] = await conn.execute(`
        SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.description
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [userId]);

      return NextResponse.json({ cartItems });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Get cart error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST - Thêm sản phẩm vào giỏ hàng
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc token không hợp lệ' },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID là bắt buộc' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      console.log('Looking for product ID:', productId);
      const [products] = await conn.execute(
        'SELECT id, stock FROM products WHERE id = ?',
        [productId]
      );

      console.log('Found products:', products);

      if ((products as any).length === 0) {
        return NextResponse.json(
          { error: `Sản phẩm với ID ${productId} không tồn tại` },
          { status: 404 }
        );
      }

      const product = (products as any)[0];
      if (product.stock < quantity) {
        return NextResponse.json(
          { error: 'Không đủ hàng trong kho' },
          { status: 400 }
        );
      }

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const [existingItems] = await conn.execute(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      if ((existingItems as any).length > 0) {
        // Cập nhật số lượng
        const newQuantity = (existingItems as any)[0].quantity + quantity;
        if (newQuantity > product.stock) {
          return NextResponse.json(
            { error: 'Không đủ hàng trong kho' },
            { status: 400 }
          );
        }
        
        await conn.execute(
          'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
          [newQuantity, userId, productId]
        );
      } else {
        // Thêm mới vào giỏ hàng
        await conn.execute(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, productId, quantity]
        );
      }

      return NextResponse.json({ message: 'Đã thêm vào giỏ hàng' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Add to cart error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật số lượng sản phẩm trong giỏ hàng
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc token không hợp lệ' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity < 0) {
      return NextResponse.json(
        { error: 'Product ID và quantity hợp lệ là bắt buộc' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      if (quantity === 0) {
        // Xóa sản phẩm khỏi giỏ hàng
        await conn.execute(
          'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
          [userId, productId]
        );
      } else {
        // Kiểm tra stock
        const [products] = await conn.execute(
          'SELECT stock FROM products WHERE id = ?',
          [productId]
        );

        if ((products as any).length === 0) {
          return NextResponse.json(
            { error: 'Sản phẩm không tồn tại' },
            { status: 404 }
          );
        }

        if ((products as any)[0].stock < quantity) {
          return NextResponse.json(
            { error: 'Không đủ hàng trong kho' },
            { status: 400 }
          );
        }

        // Cập nhật số lượng
        await conn.execute(
          'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
          [quantity, userId, productId]
        );
      }

      return NextResponse.json({ message: 'Đã cập nhật giỏ hàng' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Update cart error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc token không hợp lệ' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID là bắt buộc' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      await conn.execute(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      return NextResponse.json({ message: 'Đã xóa khỏi giỏ hàng' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Delete from cart error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}
