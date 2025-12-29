import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// GET - Lấy danh sách sản phẩm
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limitRaw = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;
    const limit = Math.min(50, limitRaw);
    const offset = Math.max(0, (page - 1) * limit);

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      let whereClause = '';
      let params: any[] = [];

      if (category) {
        whereClause = 'WHERE category = ?';
        params.push(category);
      }

      if (search) {
        whereClause += whereClause ? ' AND ' : 'WHERE ';
        whereClause += '(name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Lấy tổng số sản phẩm
    const [countResult] = await conn.execute(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = (countResult as any)[0].total;

    // Lấy sản phẩm với phân trang và đánh giá
    const [products] = await conn.execute(
      `SELECT 
        p.*,
        COALESCE(p.average_rating, 0) as average_rating,
        COALESCE(p.total_reviews, 0) as total_reviews
      FROM products p 
      ${whereClause} 
      ORDER BY p.created_at DESC 
      LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Get products error:', error);
    
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
