'use client';

import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (productId: number) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    await removeFromWishlist(productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <Heart className="h-16 w-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Danh sách yêu thích</h1>
          <p className="text-gray-600">
            Vui lòng đăng nhập để xem danh sách sản phẩm yêu thích của bạn.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </Link>
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách yêu thích
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            {wishlistItems && wishlistItems.length > 0
              ? `Bạn có ${wishlistItems.length} sản phẩm yêu thích`
              : 'Chưa có sản phẩm nào trong danh sách yêu thích'}
          </p>
        </div>

        {/* Wishlist Items */}
        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Danh sách yêu thích trống
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy khám phá và thêm những sản phẩm bạn yêu thích!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Product Image */}
                <Link href={`/products/${item.product_id}`}>
                  <div className="relative aspect-square bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-6xl">🏃</span>
                      </div>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Hết hàng</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                  </Link>
                  
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                      {item.category}
                    </span>
                  )}
                  
                  <p className="text-lg font-bold text-blue-600 mb-4">
                    {formatPrice(item.price)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item.product_id)}
                      disabled={item.stock === 0}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                        item.stock === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm">Thêm giỏ hàng</span>
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

