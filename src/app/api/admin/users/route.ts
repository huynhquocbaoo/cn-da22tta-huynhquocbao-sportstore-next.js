import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// GET - Lấy danh sách tài khoản khách hàng
export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      const [users] = await conn.execute(`
        SELECT 
          id, 
          email, 
          name, 
          role,
          is_locked,
          created_at
        FROM users 
        WHERE role = 'user'
        ORDER BY created_at DESC
      `);

      return NextResponse.json({ users });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật trạng thái tài khoản (khóa/mở khóa)
export async function PUT(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Thiếu thông tin userId hoặc action' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      if (action === 'lock') {
        await conn.execute(
          'UPDATE users SET is_locked = 1 WHERE id = ? AND role = "user"',
          [userId]
        );
        return NextResponse.json({ message: 'Đã khóa tài khoản' });
      } else if (action === 'unlock') {
        await conn.execute(
          'UPDATE users SET is_locked = 0 WHERE id = ? AND role = "user"',
          [userId]
        );
        return NextResponse.json({ message: 'Đã mở khóa tài khoản' });
      } else {
        return NextResponse.json(
          { error: 'Action không hợp lệ' },
          { status: 400 }
        );
      }
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Xóa tài khoản khách hàng
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu userId' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      // Kiểm tra xem user có phải admin không
      const [users]: any = await conn.execute(
        'SELECT role FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { error: 'Không tìm thấy tài khoản' },
          { status: 404 }
        );
      }

      if (users[0].role === 'admin') {
        return NextResponse.json(
          { error: 'Không thể xóa tài khoản admin' },
          { status: 403 }
        );
      }

      // Xóa user (các bảng liên quan sẽ tự động xóa do ON DELETE CASCADE)
      await conn.execute('DELETE FROM users WHERE id = ?', [userId]);

      return NextResponse.json({ message: 'Đã xóa tài khoản thành công' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

