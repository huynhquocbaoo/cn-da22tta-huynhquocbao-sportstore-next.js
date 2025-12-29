'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/imageUtils';

export interface ProductDetailData {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  features?: string[] | string | null;
  specifications?: Record<string, string> | string | null;
  category?: string;
  product_type?: string;
  stock: number;
  average_rating?: number;
  total_reviews?: number;
  colors?: Array<{ name: string; value: string; image?: string }>;
  sizes?: number[];
}

export interface ProductReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

export interface RelatedProductData {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  stock: number;
  average_rating?: number;
  total_reviews?: number;
}

interface ProductDetailClientProps {
  product: ProductDetailData;
  reviews: ProductReview[];
  relatedProducts: RelatedProductData[];
}

const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Build list of all images (converted to API URLs for cache busting)
  const allImages = useMemo(() => {
    if (!product) return ['/api/placeholder/600/600'];
    
    const imageList: string[] = [];
    
    // Add images from images array
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageList.push(...product.images.map(img => getImageUrl(img)));
    }
    
    // Add main image if not already in list
    if (typeof product.image === 'string' && product.image.trim().length > 0) {
      const mainImageUrl = getImageUrl(product.image);
      if (!imageList.some(img => img.split('?')[0] === mainImageUrl.split('?')[0])) {
        imageList.unshift(mainImageUrl);
      }
    }
    
    return imageList.length > 0 ? imageList : ['/api/placeholder/600/600'];
  }, [product]);

  const currentImage = allImages[currentImageIndex] || allImages[0];
  const hasMultipleImages = allImages.length > 1;

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const ratingValue = Number(product?.average_rating) || 0;
  const totalReviews = Number(product?.total_reviews) || reviews.length;

  const handleAddToCart = async () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      const success = await addToCart(product.id, quantity);
      if (success) {
        alert('Đã thêm vào giỏ hàng!');
      } else {
        alert('Không thể thêm sản phẩm vào giỏ. Vui lòng thử lại.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Không thể tải sản phẩm
          </h1>
          <p className="text-gray-600 mb-6">
            Sản phẩm bạn tìm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Quay lại danh sách sản phẩm
          </Link>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Product Image Gallery */}
            <div className="p-6 lg:p-8 flex flex-col items-center justify-center bg-gray-50">
              {/* Main Image with Arrows */}
              <div className="relative w-full max-w-md">
                {/* Left Arrow */}
                {hasMultipleImages && (
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                )}

                {/* Image */}
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-auto aspect-square object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/600/600';
                  }}
                />

                {/* Right Arrow */}
                {hasMultipleImages && (
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Ảnh tiếp"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {hasMultipleImages && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - Ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/100/100';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Category */}
              {product.category && (
                <span className="text-sm text-blue-600 font-medium mb-2">
                  {product.category}
                </span>
              )}

              {/* Product Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(ratingValue)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {ratingValue.toFixed(1)} ({totalReviews} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-red-600">
                  {formatCurrency(product.price)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Mô tả sản phẩm
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description?.trim()
                    ? product.description
                    : 'Chưa có mô tả cho sản phẩm này.'}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Còn hàng ({product.stock} sản phẩm)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ✗ Hết hàng
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng
                </label>
                <div className="inline-flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-2 text-lg font-semibold text-gray-900 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="h-6 w-6" />
                {isAdding
                  ? 'Đang thêm...'
                  : product.stock > 0
                    ? 'Thêm vào giỏ hàng'
                    : 'Hết hàng'}
              </button>

              {/* Shipping Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                  <span>Đổi trả 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Đánh giá từ khách hàng ({reviews.length})
            </h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {(review.user_name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user_name || 'Người dùng ẩn danh'}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 ml-13">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(item.image) || '/api/placeholder/300/300'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/300';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-red-600 font-bold text-sm">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

