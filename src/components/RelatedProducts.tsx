'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  stock: number;
  average_rating?: number;
  total_reviews?: number;
}

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const toggleLike = async (productId: number) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const detailHref = `/products/${product.id}`;
          return (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-3xl">
                <Link href={detailHref} className="block">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-6xl text-gray-400 ${product.image ? 'hidden' : ''}`}>🏃</span>
                  </div>
                </Link>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleLike(product.id)}
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                    title={isInWishlist(product.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <Link
                    href={detailHref}
                    className="p-2 bg-white text-gray-600 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors text-center"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4 inline" />
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-sm text-blue-600 font-medium capitalize">
                    {product.category}
                  </span>
                </div>
                
                <Link href={detailHref} className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors block">
                  {product.name}
                </Link>

                <p className="text-sm text-gray-600 mb-3">Thương hiệu: {product.brand}</p>
                
                {/* Stock Information */}
                <div className="mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 50 ? 'bg-green-100 text-green-800' :
                    product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                    product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(Number(product.average_rating) || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {(Number(product.average_rating) || 0).toFixed(1)} ({Number(product.total_reviews) || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Thêm vào giỏ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
