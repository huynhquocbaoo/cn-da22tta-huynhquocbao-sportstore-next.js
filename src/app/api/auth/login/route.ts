import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnection } from '@/lib/database';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và password là bắt buộc' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      // Tìm user theo email
      const [users] = await conn.execute(
        'SELECT id, email, password, name, role, is_locked FROM users WHERE email = ?',
        [email]
      );

      if ((users as any).length === 0) {
        return NextResponse.json(
          { error: 'Email hoặc password không đúng' },
          { status: 401 }
        );
      }

      const user = (users as any)[0];

      // Kiểm tra tài khoản bị khóa
      if (user.is_locked) {
        return NextResponse.json(
          { error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.' },
          { status: 403 }
        );
      }

      // Kiểm tra password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Email hoặc password không đúng' },
          { status: 401 }
        );
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role || 'user' },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user'
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific MySQL errors
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
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific MySQL errors
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
