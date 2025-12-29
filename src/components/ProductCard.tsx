'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/lib/imageUtils';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  inStock: boolean;
  stock: number;
  description?: string;
  average_rating?: number;
  total_reviews?: number;
  slug?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const detailHref = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;
  const isLiked = isInWishlist(product.id);

  const handleToggleWishlist = async () => {
    if (isLiked) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  const handleAddToCart = async () => {
    const success = await addToCart(product.id, 1);
    if (success) {
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Product Image */}
          <Link
            href={detailHref}
            className="relative w-full sm:w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden"
          >
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-6xl text-gray-400 ${product.image ? 'hidden' : ''}`}>🏃</span>
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold">Hết hàng</span>
              </div>
            )}
          </Link>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm text-blue-600 font-medium capitalize">
                  {product.category}
                </span>
                <Link href={detailHref} className="text-lg font-semibold text-gray-900 mt-1 block hover:text-blue-600 transition-colors">
                  {product.name}
                </Link>
                
                {/* Stock Information */}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 50 ? 'bg-green-100 text-green-800' :
                    product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                    product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
                title={isLiked ? 'Bỏ yêu thích' : 'Yêu thích'}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
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
                {(Number(product.average_rating) || 0).toFixed(1)} ({Number(product.total_reviews) || 0} đánh giá)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  href={detailHref}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                  title="Xem chi tiết"
                >
                  <Eye className="h-5 w-5 inline" />
                </Link>
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Thêm vào giỏ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col overflow-hidden">
        {/* Product Image */}
        <Link
          href={detailHref}
          className="relative overflow-hidden rounded-t-3xl block"
        >
          <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
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

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Hết hàng</span>
            </div>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
            title={isLiked ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <Link
            href={detailHref}
            className="p-2 bg-white text-gray-600 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors text-center"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4 inline" />
          </Link>
        </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium capitalize">
            {product.category}
          </span>
        </div>
        
        <Link
          href={detailHref}
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors block h-14"
        >
          {product.name}
        </Link>
        
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

        {/* Spacer to push price and button to bottom */}
        <div className="flex-grow"></div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
        </button>
      </div>
    </div>
  );
}
