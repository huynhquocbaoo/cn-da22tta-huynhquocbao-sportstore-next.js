import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2/promise';
import { getConnection } from '@/lib/database';

type ProductRow = RowDataPacket & {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  images?: string | null;
  category: string | null;
  product_type?: string | null;
  stock: number;
  average_rating: number | null;
  total_reviews: number | null;
  features?: string | null;
  specifications?: string | null;
  colors?: string | null;
  sizes?: string | null;
};

type ReviewRow = RowDataPacket & {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string | null;
};

type RelatedProductRow = RowDataPacket & {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string | null;
  stock: number;
  average_rating: number | null;
  total_reviews: number | null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawParam } = await params;

  if (!rawParam) {
    return NextResponse.json(
      { error: 'ID sản phẩm không hợp lệ' },
      { status: 400 }
    );
  }

  try {
    const pool = await getConnection();
    const conn = await pool.getConnection();

    const numericId = Number(rawParam);
    const isNumericId = !Number.isNaN(numericId);
    const identifier = isNumericId ? numericId : rawParam;

    const productWhereClause = isNumericId ? 'p.id = ?' : 'p.slug = ?';

    try {
      const [productRows] = await conn.execute<ProductRow[]>(
        `
        SELECT 
          p.*,
          COALESCE(p.average_rating, 0) AS average_rating,
          COALESCE(p.total_reviews, 0) AS total_reviews
        FROM products p
        WHERE ${productWhereClause}
        LIMIT 1
      `,
        [identifier]
      );

      if (!productRows.length) {
        return NextResponse.json(
          { error: 'Không tìm thấy sản phẩm' },
          { status: 404 }
        );
      }

      const productRaw = productRows[0];
      
      // Parse images JSON string to array
      let imagesArray: string[] = [];
      if (productRaw.images) {
        try {
          const parsed = JSON.parse(productRaw.images);
          if (Array.isArray(parsed)) {
            imagesArray = parsed;
          }
        } catch {
          // If parsing fails, keep empty array
        }
      }

      // Parse sizes JSON string to array
      let sizesArray: string[] = [];
      if (productRaw.sizes) {
        try {
          const parsed = JSON.parse(productRaw.sizes);
          if (Array.isArray(parsed)) {
            sizesArray = parsed;
          }
        } catch {
          // If parsing fails, keep empty array
        }
      }
      
      const product = {
        ...productRaw,
        images: imagesArray,
        sizes: sizesArray
      };

      const [reviews] = await conn.execute<ReviewRow[]>(
        `
        SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          u.name AS user_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
        LIMIT 10
      `,
        [product.id]
      );

      const [relatedProducts] = await conn.execute<RelatedProductRow[]>(
        `
        SELECT 
          id,
          name,
          price,
          image,
          category,
          stock,
          COALESCE(average_rating, 0) AS average_rating,
          COALESCE(total_reviews, 0) AS total_reviews
        FROM products
        WHERE category = ? AND id != ?
        ORDER BY created_at DESC
        LIMIT 4
      `,
        [product.category, product.id]
      );

      return NextResponse.json({
        product,
        reviews,
        relatedProducts,
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get product detail error:', error);

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errWithCode = error as { code?: string; message?: string };
      if (errWithCode.code === 'ECONNREFUSED') {
        return NextResponse.json(
          {
            error:
              'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `Lỗi server: ${errWithCode.message || 'Không xác định'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi server không xác định' },
      { status: 500 }
    );
  }
}

