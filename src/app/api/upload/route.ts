import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'Không có file được chọn' }, { status: 400 });
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Chỉ chấp nhận file ảnh' }, { status: 400 });
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File quá lớn. Kích thước tối đa 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file unique
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);

    // Tạo thư mục nếu chưa tồn tại
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Lưu file
    await writeFile(filePath, buffer);

    // Trả về URL của ảnh qua API route để bypass static cache
    const imageUrl = `/api/uploads/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      fileName 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Lỗi khi upload ảnh' }, { status: 500 });
  }
}
