import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { getUserIdFromRequest } from '@/lib/auth';

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
      // Lấy danh sách đơn hàng của user hiện tại
      const [orders] = await conn.execute(`
        SELECT 
          o.id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.payment_method,
          o.created_at,
          o.updated_at
        FROM orders o
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId]);

      // Lấy order items cho mỗi đơn hàng
      const ordersWithItems = await Promise.all(
        (orders as any[]).map(async (order) => {
          const [items] = await conn.execute(`
            SELECT 
              oi.id,
              oi.product_id,
              oi.quantity,
              oi.price,
              oi.size,
              p.name as product_name,
              p.image as product_image,
              CASE WHEN r.id IS NULL THEN 0 ELSE 1 END as hasReviewed
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN reviews r
              ON r.order_id = oi.order_id
              AND r.product_id = oi.product_id
              AND r.user_id = ?
            WHERE oi.order_id = ?
          `, [userId, order.id]);

          const formattedItems = (items as any[]).map(item => ({
            ...item,
            hasReviewed: Boolean(item.hasReviewed)
          }));

          return {
            ...order,
            items: formattedItems
          };
        })
      );

      return NextResponse.json({ orders: ordersWithItems });
    } finally {
      conn.release();
    }
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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc token không hợp lệ' },
        { status: 401 }
      );
    }

    const { items, shippingAddress, paymentMethod, notes, orderCode } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Không có sản phẩm nào trong giỏ hàng' }, { status: 400 });
    }

    const pool = await getConnection();
    
    try {
      // Tính tổng tiền
      let totalAmount = 0;
      for (const item of items) {
        totalAmount += item.price * item.quantity;
      }

      // Tạo đơn hàng (bao gồm order_code nếu là chuyển khoản)
      const [result] = await pool.execute(`
        INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, order_code, notes)
        VALUES (?, ?, 'pending', ?, ?, ?, ?)
      `, [userId, totalAmount, JSON.stringify(shippingAddress), paymentMethod, orderCode || null, notes || '']);

      const orderId = (result as any).insertId;

      // Tạo order items với validation
      for (const item of items) {
        console.log('Creating order item:', {
          orderId,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          size: item.size
        });

        // Kiểm tra sản phẩm có tồn tại không
        const [productCheck] = await pool.execute(
          'SELECT id FROM products WHERE id = ?',
          [item.product_id]
        );

        if (!productCheck || (productCheck as any[]).length === 0) {
          console.error(`Product ID ${item.product_id} not found`);
          throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
        }

        await pool.execute(`
          INSERT INTO order_items (order_id, product_id, quantity, price, size)
          VALUES (?, ?, ?, ?, ?)
        `, [orderId, item.product_id, item.quantity, item.price, item.size || null]);
      }

      return NextResponse.json({ 
        message: 'Đặt hàng thành công', 
        orderId: orderId 
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Error creating order:', error);
    
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
