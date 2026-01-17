'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, AlertCircle, ShoppingCart, Copy, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getProvinces, getDistrictsByProvince, getWardsByDistrict, Province, District, Ward } from '@/data/vietnam-addresses';

// Generate random order code
const generateOrderCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'DH';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    district: '',
    ward: '',
    
    // Payment
    paymentMethod: 'cod',
    
    // Additional
    notes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Generate order code once and keep it stable
  const orderCode = useMemo(() => generateOrderCode(), []);
  
  // Address states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    // Chỉ redirect nếu user đã được load và không có user
    if (user === null && typeof window !== 'undefined') {
      router.push('/');
      return;
    }
    
    // Không redirect dựa trên cartItems nữa
    // Để user có thể vào checkout page ngay cả khi cart trống
    // Sẽ hiển thị thông báo "Giỏ hàng trống" trong UI thay vì redirect
  }, [user, router]);

  // Load provinces on component mount
  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  // Debug: Log user and cartItems
  useEffect(() => {
    console.log('Checkout page - User:', user);
    console.log('Checkout page - CartItems:', cartItems);
    console.log('Checkout page - CartItems length:', cartItems?.length);
    console.log('Checkout page - CartItems type:', typeof cartItems);
    console.log('Checkout page - CartItems is array:', Array.isArray(cartItems));
  }, [user, cartItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle province change
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const newDistricts = getDistrictsByProvince(provinceCode);
    setDistricts(newDistricts);
    setWards([]);
    
    setFormData(prev => ({
      ...prev,
      city: provinceCode,
      district: '',
      ward: ''
    }));
  };

  // Handle district change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    const newWards = getWardsByDistrict(formData.city, districtCode);
    setWards(newWards);
    
    setFormData(prev => ({
      ...prev,
      district: districtCode,
      ward: ''
    }));
  };

  // Handle ward change
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    setFormData(prev => ({
      ...prev,
      ward: wardCode
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Bank transfer info
  const bankInfo = {
    bankName: 'Vietcombank',
    accountNumber: '9848890295',
    accountName: 'HUYNH QUOC BAO',
    branch: 'CN Sóc Trăng'
  };

  const subtotal = cartItems && Array.isArray(cartItems) && cartItems.length > 0 ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    
    try {
      // Debug: Log token
      const token = localStorage.getItem('token');
      console.log('Checkout - Token:', token);
      
      if (!token) {
        throw new Error('Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
      }

      // Check if cart has items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.');
    }

      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id || item.id, // Sử dụng product_id nếu có, fallback về id
          quantity: item.quantity,
          price: item.price,
          size: item.size || null
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        orderCode: formData.paymentMethod === 'bank_transfer' ? orderCode : undefined
      };

      console.log('Checkout - Order data:', orderData);
      console.log('Checkout - Cart items:', cartItems);
      console.log('Checkout - Items mapping:', cartItems.map(item => ({
        cartId: item.id,
        productId: item.product_id || item.id,
        quantity: item.quantity,
        price: item.price
      })));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
        // Thêm timeout để tránh hang
        signal: AbortSignal.timeout(10000)
      });

      const result = await response.json();
      console.log('Checkout - Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra khi đặt hàng');
      }

      // Clear cart after successful order
      clearCart();
      
      setIsProcessing(false);
      setIsCompleted(true);
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      setError(error.message || 'Có lỗi xảy ra khi đặt hàng');
      setIsProcessing(false);
    }
  };

  // Show loading state while checking authentication
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Redirect to cart if not logged in
  if (!user && typeof window !== 'undefined') {
    router.push('/cart');
    return null;
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua sắm tại SportStore. Chúng tôi sẽ gửi email xác nhận đến bạn.
          </p>
          <div className="space-y-3">
            <Link
              href="/products"
              className="w-full inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/orders"
              className="w-full inline-block px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/cart"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại giỏ hàng
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Thông tin thanh toán</h1>
          <p className="text-gray-600 mt-2">Điền thông tin địa chỉ và thanh toán đơn hàng</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Nhập họ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Nhập tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Địa chỉ giao hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tỉnh/Thành phố *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleProvinceChange}
                        required
                        title="Chọn tỉnh/thành phố"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quận/Huyện *
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleDistrictChange}
                        required
                        disabled={!formData.city}
                        title="Chọn quận/huyện"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phường/Xã *
                      </label>
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleWardChange}
                        required
                        disabled={!formData.district}
                        title="Chọn phường/xã"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${formData.paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-medium">Chuyển khoản ngân hàng</span>
                    </div>
                  </label>
                  
                  {/* Bank Transfer Info */}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Thông tin chuyển khoản</h3>
                      
                      {/* QR Code */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-3 rounded-xl shadow-md">
                          <img
                            src="/images/image.png"
                            alt="QR Code Vietcombank"
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Bank Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Ngân hàng</p>
                            <p className="font-semibold text-gray-900">{bankInfo.bankName}</p>
                          </div>
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VCB</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Số tài khoản</p>
                            <p className="font-semibold text-gray-900 font-mono">{bankInfo.accountNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankInfo.accountNumber, 'accountNumber')}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Sao chép"
                          >
                            {copiedField === 'accountNumber' ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Chủ tài khoản</p>
                            <p className="font-semibold text-gray-900">{bankInfo.accountName}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankInfo.accountName, 'accountName')}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Sao chép"
                          >
                            {copiedField === 'accountName' ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Chi nhánh</p>
                            <p className="font-semibold text-gray-900">{bankInfo.branch}</p>
                          </div>
                        </div>
                        
                        {/* Transfer Content - Order Code */}
                        <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-yellow-800 font-medium mb-1">⚠️ NỘI DUNG CHUYỂN KHOẢN (Bắt buộc)</p>
                              <p className="text-xl font-bold text-yellow-900 font-mono tracking-wider">{orderCode}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(orderCode, 'orderCode')}
                              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md"
                              title="Sao chép mã đơn hàng"
                            >
                              {copiedField === 'orderCode' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                          <p className="text-xs text-yellow-700 mt-2">
                            Vui lòng điền đúng mã này khi chuyển khoản để chúng tôi xác nhận đơn hàng của bạn.
                          </p>
                        </div>
                        
                        {/* Amount */}
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-green-700">Số tiền cần chuyển</p>
                              <p className="text-xl font-bold text-green-800">{formatPrice(total)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(total.toString(), 'amount')}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Sao chép số tiền"
                            >
                              {copiedField === 'amount' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 text-center mt-4">
                        Sau khi chuyển khoản, vui lòng bấm &quot;Đặt hàng&quot; để hoàn tất.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ghi chú</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                />
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  type="submit"
                  disabled={isProcessing || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Đang xử lý...' : 
                   (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) ? 'Giỏ hàng trống' : 
                   `Thanh toán đơn hàng - ${formatPrice(total)}`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Đơn hàng của bạn</h2>
              
              <div className="space-y-4">
                {cartItems && Array.isArray(cartItems) && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.size || 'no-size'}`} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                        <img
                          src={item.image || '/api/placeholder/48/48'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                          {item.size && <span className="ml-2">| Size: {item.size}</span>}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Giỏ hàng trống</p>
                    <Link
                      href="/products"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mua sắm ngay
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                <span>Thanh toán an toàn và bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}