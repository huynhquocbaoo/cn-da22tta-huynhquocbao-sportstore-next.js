import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// GET - Lấy tất cả sản phẩm cho admin
export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      const [products] = await conn.execute(`
        SELECT * FROM products 
        ORDER BY created_at DESC
      `);

      return NextResponse.json({ products });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST - Thêm sản phẩm mới
export async function POST(request: NextRequest) {
  try {
    const { name, description, price, image, images, category, product_type, sport_type, stock } = await request.json();

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Tên, giá và danh mục là bắt buộc' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      // Thêm sản phẩm mới với cột images, product_type, sport_type
      const [result] = await conn.execute(
        'INSERT INTO products (name, description, price, image, images, category, product_type, sport_type, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, description || '', price, image || '', images || '[]', category, product_type || '', sport_type || '', stock || 0]
      );

    return NextResponse.json(
      { 
        message: 'Thêm sản phẩm thành công', 
        productId: (result as any).insertId 
      },
      { status: 201 }
    );
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Add product error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}
