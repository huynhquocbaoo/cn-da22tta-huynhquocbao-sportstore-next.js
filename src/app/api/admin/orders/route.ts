import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const conn = await getConnection();
    
    // Lấy danh sách đơn hàng với thông tin user
    const [orders] = await conn.execute(`
      SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.payment_method,
        o.order_code,
        o.created_at,
        o.updated_at,
        o.shipping_address,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    
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

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID và status là bắt buộc' },
        { status: 400 }
      );
    }

    const conn = await getConnection();
    
    // Cập nhật trạng thái đơn hàng
    await conn.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );

    return NextResponse.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error: any) {
    console.error('Error updating order:', error);
    
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
