import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Bỏ bảo mật middleware cho admin routes
  // Chỉ để AdminGuard xử lý bảo mật
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
