import { headers as nextHeaders } from 'next/headers';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ProductDetailResponse {
  product: Parameters<typeof ProductDetailClient>[0]['product'];
  reviews: Parameters<typeof ProductDetailClient>[0]['reviews'];
  relatedProducts: Parameters<typeof ProductDetailClient>[0]['relatedProducts'];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchProductData(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Không thể tải sản phẩm
          </h1>
          <p className="text-gray-600">
            Có thể sản phẩm không tồn tại hoặc hệ thống đang gặp sự cố. Vui lòng
            thử lại sau.
          </p>
          <a
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại trang sản phẩm
          </a>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailClient
      product={data.product}
      reviews={data.reviews}
      relatedProducts={data.relatedProducts}
    />
  );
}

async function fetchProductData(identifier: string) {
  if (!identifier?.trim()) {
    return null;
  }

  const headersList = await nextHeaders();
  const host = headersList.get('host');
  const protocol =
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https') ||
    process.env.NODE_ENV === 'production'
      ? 'https'
      : 'http';

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${protocol}://${host}` : 'http://localhost:3000');

  try {
    const response = await fetch(
      `${baseUrl}/api/products/${encodeURIComponent(identifier)}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProductDetailResponse;
    return data;
  } catch (error) {
    console.error('Failed to fetch product detail:', error);
    return null;
  }
}

