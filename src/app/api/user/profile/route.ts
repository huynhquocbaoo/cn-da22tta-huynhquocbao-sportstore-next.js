import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Tên không được để trống' }, { status: 400 });
    }

    const conn = await getConnection();

    // Update user name
    await conn.execute(
      'UPDATE users SET name = ? WHERE id = ?',
      [name.trim(), userId]
    );

    // Get updated user data
    const [users] = await conn.execute(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as any[])[0];

    return NextResponse.json({
      message: 'Cập nhật thành công',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const conn = await getConnection();

    const [users] = await conn.execute(
      'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as any[])[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

