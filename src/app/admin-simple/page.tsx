'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Package, ShoppingCart, Users, TrendingUp, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  slug: string;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
}

export default function AdminSimplePage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stock'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    // Mock data for testing
    setProducts([
      {
        id: 1,
        name: 'Nike Air Max',
        description: 'Giày thể thao Nike Air Max',
        price: 150,
        image: 'https://via.placeholder.com/150',
        category: 'Shoes',
        stock: 50,
        slug: 'nike-air-max',
        created_at: '2024-01-01'
      },
      {
        id: 2,
        name: 'Adidas T-Shirt',
        description: 'Áo thun Adidas',
        price: 75,
        image: 'https://via.placeholder.com/150',
        category: 'Clothing',
        stock: 0,
        slug: 'adidas-t-shirt',
        created_at: '2024-01-02'
      },
      {
        id: 3,
        name: 'Basketball',
        description: 'Bóng rổ chính hãng',
        price: 100,
        image: 'https://via.placeholder.com/150',
        category: 'Equipment',
        stock: 25,
        slug: 'basketball',
        created_at: '2024-01-03'
      }
    ]);

    setOrders([
      {
        id: 1,
        user_id: 1,
        total_amount: 150,
        status: 'pending',
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        user_name: 'Nguyễn Văn A',
        user_email: 'user@example.com'
      },
      {
        id: 2,
        user_id: 2,
        total_amount: 250,
        status: 'confirmed',
        created_at: '2024-01-14',
        updated_at: '2024-01-14',
        user_name: 'Trần Thị B',
        user_email: 'user2@example.com'
      },
      {
        id: 3,
        user_id: 3,
        total_amount: 100,
        status: 'delivered',
        created_at: '2024-01-13',
        updated_at: '2024-01-13',
        user_name: 'Lê Văn C',
        user_email: 'user3@example.com'
      }
    ]);

    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock),
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = (productId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleUpdateOrderStatus = (orderId: number, status: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status, updated_at: new Date().toISOString().split('T')[0] }
        : order
    ));
    alert('Cập nhật trạng thái đơn hàng thành công');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      stock: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Admin (Demo)</h1>
          <p className="text-gray-600 mt-2">Quản lý sản phẩm, đơn hàng và kho hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đơn chờ xác nhận</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sản phẩm hết hàng</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý sản phẩm
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý đơn hàng
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stock'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý kho hàng
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Thêm sản phẩm mới"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Thêm sản phẩm</span>
                  </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-semibold">
                        {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                      </h4>
                      <button
                        onClick={resetForm}
                        className="text-gray-500 hover:text-gray-700"
                        title="Đóng form"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên sản phẩm *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập tên sản phẩm"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Danh mục *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          title="Chọn danh mục sản phẩm"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Chọn danh mục</option>
                          <option value="Shoes">Giày</option>
                          <option value="Clothing">Quần áo</option>
                          <option value="Accessories">Phụ kiện</option>
                          <option value="Equipment">Thiết bị</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá (USD) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          step="0.01"
                          min="0"
                          placeholder="Nhập giá sản phẩm"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng *
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          required
                          min="0"
                          placeholder="Nhập số lượng"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Nhập mô tả sản phẩm"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL hình ảnh
                        </label>
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="Nhập URL hình ảnh"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Save className="h-4 w-4" />
                          <span>{editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Products List */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tồn kho
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {product.image ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={product.image}
                                    alt={product.name}
                                  />
                                ) : (
                                  <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">🏃</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock > 50 ? 'bg-green-100 text-green-800' :
                              product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                              product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Sửa"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Danh sách đơn hàng</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tổng tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.user_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.user_email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Xác nhận đơn hàng"
                                >
                                  ✓
                                </button>
                              )}
                              {order.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="Đánh dấu đã gửi hàng"
                                >
                                  🚚
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Đánh dấu đã giao hàng"
                                >
                                  ✓
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stock Tab */}
            {activeTab === 'stock' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Quản lý kho hàng</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tồn kho hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {product.image ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={product.image}
                                    alt={product.name}
                                  />
                                ) : (
                                  <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">🏃</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock > 50 ? 'bg-green-100 text-green-800' :
                              product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                              product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 50 ? 'Còn nhiều' :
                               product.stock > 20 ? 'Còn ít' :
                               product.stock > 0 ? 'Sắp hết' :
                               'Hết hàng'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Cập nhật số lượng"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
