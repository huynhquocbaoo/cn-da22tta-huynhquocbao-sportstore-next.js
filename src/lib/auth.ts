import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from './config';

/**
 * Lấy token từ request (header hoặc cookie)
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Đọc token từ header Authorization
  let token = request.headers.get('authorization')?.replace('Bearer ', '').trim();
  
  // Nếu không có token từ header, đọc từ cookie
  if (!token || token === '') {
    token = request.cookies.get('token')?.value?.trim();
  }
  
  // Kiểm tra token có tồn tại và hợp lệ không
  if (!token || token === '' || token === 'null' || token === 'undefined') {
    return null;
  }

  // Kiểm tra token format (JWT phải có 3 phần được phân cách bởi dấu chấm)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    console.error('❌ Invalid token format:', token.substring(0, 20) + '...');
    return null;
  }
  
  return token;
}

/**
 * Verify JWT token và trả về decoded data
 */
export function verifyToken(token: string): { userId: number; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };
  } catch (error: any) {
    console.error('❌ JWT verification error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      console.error('❌ Token is malformed or invalid');
    } else if (error.name === 'TokenExpiredError') {
      console.error('❌ Token has expired');
    } else if (error.name === 'NotBeforeError') {
      console.error('❌ Token not active yet');
    }
    return null;
  }
}

/**
 * Lấy user ID từ request token
 */
export function getUserIdFromRequest(request: NextRequest): number | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

/**
 * Lấy thông tin user từ request token
 */
export function getUserFromRequest(request: NextRequest): { userId: number; email: string; role: string } | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

