import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    const conn = await getConnection();
    
    // Lấy thông tin đơn hàng
    const [orders] = await conn.execute(`
      SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.order_code,
        o.notes,
        o.created_at,
        o.updated_at,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    if ((orders as any).length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    // Lấy chi tiết sản phẩm trong đơn hàng
    const [orderItems] = await conn.execute(`
      SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.size,
        p.name as product_name,
        p.image as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    const order = (orders as any)[0];
    order.items = orderItems;

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    
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
