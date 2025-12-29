/**
 * Chuyển đổi URL ảnh từ /uploads/ sang /api/uploads/ để bypass Next.js static cache
 * Giúp ảnh mới upload hiển thị ngay lập tức mà không cần restart server
 */
export function getImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // Nếu URL đã là /api/uploads thì thêm timestamp để bust cache
  if (url.startsWith('/api/uploads/')) {
    return `${url}?t=${Date.now()}`;
  }
  
  // Chuyển /uploads/xxx thành /api/uploads/xxx
  if (url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    return `/api/uploads/${filename}?t=${Date.now()}`;
  }
  
  // URL external hoặc khác giữ nguyên
  return url;
}

