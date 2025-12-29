import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// API route để serve ảnh từ thư mục uploads - bypass Next.js static cache
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    
    // Loại bỏ query params từ filename (VD: image.jpg?t=123 -> image.jpg)
    const cleanPath = path.map(p => p.split('?')[0]);
    const filePath = join(process.cwd(), 'public', 'uploads', ...cleanPath);

    // Kiểm tra file tồn tại
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Đọc file
    const fileBuffer = await readFile(filePath);
    const fileStat = await stat(filePath);

    // Xác định content type dựa trên extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'tif': 'image/tiff',
    };
    
    // Mặc định là image/jpeg nếu không xác định được (thay vì octet-stream gây download)
    const contentType = contentTypes[ext || ''] || 'image/jpeg';

    // Trả về file với headers inline (hiển thị thay vì download)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStat.size.toString(),
        'Content-Disposition': 'inline', // Hiển thị trực tiếp, không download
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

