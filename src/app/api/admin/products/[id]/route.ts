import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// PUT - Cập nhật sản phẩm
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const data = await request.json();
    const { name, description, price, image, images, category, product_type, sport_type, sizes, stock } = data;

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      // Nếu chỉ cập nhật stock
      if (data.stock !== undefined && Object.keys(data).length === 1) {
        await conn.execute(
          'UPDATE products SET stock = ? WHERE id = ?',
          [stock, productId]
        );
        return NextResponse.json({ message: 'Cập nhật số lượng kho thành công' });
      }
      
      // Cập nhật đầy đủ sản phẩm
      if (!name || price === undefined || !category) {
        return NextResponse.json(
          { error: 'Tên, giá và danh mục là bắt buộc' },
          { status: 400 }
        );
      }

      // Kiểm tra xem có images mới không (images phải là string JSON hợp lệ và không rỗng)
      let hasNewImages = false;
      if (images && typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          hasNewImages = Array.isArray(parsed) && parsed.length > 0;
        } catch {
          hasNewImages = false;
        }
      }

      // Nếu có images mới, cập nhật cả images
      if (hasNewImages) {
        await conn.execute(
          'UPDATE products SET name = ?, description = ?, price = ?, image = ?, images = ?, category = ?, product_type = ?, sport_type = ?, sizes = ?, stock = ? WHERE id = ?',
          [name, description || '', price, image || '', images, category, product_type || '', sport_type || '', sizes || null, stock || 0, productId]
        );
      } else {
        // Không cập nhật images, giữ nguyên ảnh cũ
        await conn.execute(
          'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ?, product_type = ?, sport_type = ?, sizes = ?, stock = ? WHERE id = ?',
          [name, description || '', price, image || '', category, product_type || '', sport_type || '', sizes || null, stock || 0, productId]
        );
      }

      return NextResponse.json({ message: 'Cập nhật sản phẩm thành công' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Xóa sản phẩm
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      // Xóa sản phẩm
      await conn.execute('DELETE FROM products WHERE id = ?', [productId]);
      return NextResponse.json({ message: 'Xóa sản phẩm thành công' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}
