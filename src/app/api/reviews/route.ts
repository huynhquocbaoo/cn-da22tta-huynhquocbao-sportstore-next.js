import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { getUserIdFromRequest } from '@/lib/auth';

// GET - Lấy reviews của sản phẩm
export async function GET(request: NextRequest) {
  try {
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
      // Lấy reviews với thông tin user
      const [reviews] = await conn.execute(`
        SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          u.name as user_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
      `, [productId]);

      return NextResponse.json({ reviews });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST - Tạo review mới
export async function POST(request: NextRequest) {
  try {
    // Verify user token
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc token không hợp lệ' },
        { status: 401 }
      );
    }

    const { productId, orderId, rating, comment } = await request.json();

    if (!productId || !orderId || !rating) {
      return NextResponse.json(
        { error: 'Thông tin đánh giá không đầy đủ' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Đánh giá phải từ 1 đến 5 sao' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();

    let transactionStarted = false;

    try {
      // Check existing review to avoid duplicate key errors
      const [existingReview] = await conn.execute(
        `
        SELECT id 
        FROM reviews 
        WHERE user_id = ? AND product_id = ? AND order_id = ?
        LIMIT 1
      `,
        [userId, productId, orderId]
      );

      if ((existingReview as any[]).length > 0) {
        return NextResponse.json(
          {
            error: 'Bạn đã đánh giá sản phẩm này cho đơn hàng này. Không thể tạo thêm đánh giá mới.',
          },
          { status: 409 }
        );
      }

      await conn.beginTransaction();
      transactionStarted = true;

      // Tạo review
      await conn.execute(`
        INSERT INTO reviews (user_id, product_id, order_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, productId, orderId, rating, comment || '']);

      // Cập nhật average_rating và total_reviews cho sản phẩm
      const [ratingData] = await conn.execute(`
        SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
        FROM reviews
        WHERE product_id = ?
      `, [productId]);

      const avgRating = parseFloat((ratingData as any)[0].avg_rating || 0);
      const totalReviews = parseInt((ratingData as any)[0].total_reviews || 0);

      await conn.execute(`
        UPDATE products 
        SET average_rating = ?, total_reviews = ?
        WHERE id = ?
      `, [avgRating, totalReviews, productId]);

      await conn.commit();

      return NextResponse.json({ 
        message: 'Đánh giá đã được lưu thành công',
        averageRating: avgRating,
        totalReviews: totalReviews
      });
    } catch (error: any) {
      if (transactionStarted) {
        await conn.rollback();
      }
      console.error('Error in review transaction:', error);
      throw error;
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Error creating review:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.' },
        { status: 500 }
      );
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Bạn đã đánh giá sản phẩm này cho đơn hàng này.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}
