'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/lib/imageUtils';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleUpdateQuantity = async (productId: number, newQuantity: number, size?: string) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity, size);
  };

  const handleRemoveItem = async (productId: number, size?: string) => {
    await removeFromCart(productId, size);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500000 ? 0 : 50000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
        </div>

        {!user ? (
          /* Not logged in */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Vui lòng đăng nhập
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn cần đăng nhập để xem giỏ hàng
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sản phẩm ({cartItems?.length || 0})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems?.map((item) => (
                    <div key={`${item.id}-${item.size || 'no-size'}`} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <span className={`text-3xl text-gray-400 ${item.image ? 'hidden' : ''}`}>🏃</span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          
                          {/* Size Badge */}
                          {item.size && (
                            <div className="mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Size: {item.size}
                              </span>
                            </div>
                          )}
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>{item.description}</p>
                          </div>

                          {/* Price */}
                          <div className="mt-3 flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end space-y-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1, item.size)}
                              disabled={item.quantity <= 1}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Giảm số lượng"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1, item.size)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Tăng số lượng"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.product_id, item.size)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-sm text-gray-500">
                      Miễn phí vận chuyển cho đơn từ {formatPrice(500000)}
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Thanh toán
                  </Link>
                  
                  <Link
                    href="/products"
                    className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-500">
                    <p className="mb-2">🔒 Thanh toán an toàn</p>
                    <p>✅ Đảm bảo chất lượng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
