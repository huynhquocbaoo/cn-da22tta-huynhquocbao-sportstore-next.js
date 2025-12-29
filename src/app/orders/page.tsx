'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, XCircle, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReviewModal from '@/components/ReviewModal';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
  hasReviewed?: boolean;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    productId: number;
    productName: string;
    orderId: number;
  }>({
    isOpen: false,
    productId: 0,
    productName: '',
    orderId: 0
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đã gửi hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleReviewProduct = (productId: number, productName: string, orderId: number) => {
    setReviewModal({
      isOpen: true,
      productId,
      productName,
      orderId
    });
  };

  const handleReviewSubmitted = () => {
    // Refresh orders to show updated review status
    fetchOrders();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      case 'delivered': return <Package className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chưa đăng nhập</h1>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem đơn hàng</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Light overlay for readability */}
      <div className="fixed inset-0 bg-white/85 z-0" />
      
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">Theo dõi trạng thái đơn hàng</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ngày đặt: {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center space-x-8">
                    <div className={`flex items-center space-x-2 ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                      <div className={`w-3 h-3 rounded-full ${order.status === 'pending' ? 'bg-yellow-600' : 'bg-green-600'}`}></div>
                      <span className="text-sm font-medium">Đặt hàng</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">Xác nhận</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">Gửi hàng</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">Giao hàng</span>
                    </div>
                  </div>
                </div>

                {/* Order Status Message */}
                <div className="px-6 py-4">
                  {order.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">
                            Đơn hàng đang chờ xác nhận
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ xác nhận đơn hàng trong thời gian sớm nhất.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-blue-800">
                            Đơn hàng đã được xác nhận
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị để gửi hàng.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'shipped' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex">
                        <Truck className="h-5 w-5 text-purple-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-purple-800">
                            Đơn hàng đã được gửi
                          </h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Đơn hàng của bạn đã được gửi và đang trên đường giao hàng.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'delivered' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex">
                        <Package className="h-5 w-5 text-green-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-green-800">
                            Đơn hàng đã được giao
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Items for Delivered Orders */}
                  {order.status === 'delivered' && order.items && order.items.length > 0 && (
                    <div className="px-6 py-4 border-t">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Sản phẩm đã mua</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <Link
                              href={`/products/${item.product_id}`}
                              className="flex items-center space-x-3 group"
                            >
                              <img
                                src={item.product_image || '/api/placeholder/60/60'}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{item.product_name}</p>
                                <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                              </div>
                            </Link>
                            {item.hasReviewed ? (
                              <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs font-medium">Đã đánh giá</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleReviewProduct(item.product_id, item.product_name, order.id)}
                                className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                              >
                                <Star className="h-4 w-4" />
                                <span className="text-xs font-medium">Đánh giá</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, productId: 0, productName: '', orderId: 0 })}
          productId={reviewModal.productId}
          productName={reviewModal.productName}
          orderId={reviewModal.orderId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
      </div>
    </div>
  );
}
