'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Package, ShoppingCart, Users, TrendingUp, Eye, ChevronDown, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import AdminGuard from '@/components/AdminGuard';
import { getCategories, ProductCategory, getCategoryName } from '@/data/product-categories';
import { getProductTypesByCategory, ProductType, getProductTypeName, getSportTypes, SportType, getSportTypeName } from '@/data/product-types';
import { getImageUrl } from '@/lib/imageUtils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  product_type: string;
  sport_type: string;
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
  shipping_address: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stock'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStock, setEditingStock] = useState<{ id: number; stock: number } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    product_type: '',
    sport_type: '',
    stock: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [filteredProductTypes, setFilteredProductTypes] = useState<ProductType[]>([]);
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // Group orders by year and month
  const groupedOrders = orders.reduce((acc, order) => {
    const date = new Date(order.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    if (!acc[year]) {
      acc[year] = { months: {}, totalRevenue: 0, orderCount: 0, deliveredCount: 0 };
    }
    if (!acc[year].months[month]) {
      acc[year].months[month] = { orders: [], totalRevenue: 0, deliveredCount: 0 };
    }
    
    acc[year].months[month].orders.push(order);
    acc[year].orderCount += 1;
    
    // Chỉ tính doanh thu cho đơn hàng đã giao (delivered)
    if (order.status === 'delivered') {
      const amount = Number(order.total_amount) || 0;
      acc[year].months[month].totalRevenue += amount;
      acc[year].totalRevenue += amount;
      acc[year].months[month].deliveredCount += 1;
      acc[year].deliveredCount += 1;
    }
    
    return acc;
  }, {} as Record<number, { 
    months: Record<number, { orders: Order[]; totalRevenue: number; deliveredCount: number }>; 
    totalRevenue: number;
    orderCount: number;
    deliveredCount: number;
  }>);

  // Tính tổng doanh thu (chỉ đơn đã giao)
  const totalDeliveredRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const toggleYear = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleMonth = (key: string) => {
    setExpandedMonths(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const getMonthName = (month: number) => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return months[month - 1];
  };


  useEffect(() => {
    fetchData();
    setCategories(getCategories());
    setProductTypes(getProductTypesByCategory(''));
    setSportTypes(getSportTypes());
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchOrders()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Khi thay đổi category (loại sản phẩm), filter productTypes và reset product_type
    if (name === 'category') {
      const filtered = getProductTypesByCategory(value);
      setFilteredProductTypes(filtered);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        product_type: '' // Reset product_type khi thay đổi category
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageFiles(prev => [...prev, ...fileArray]);
      
      // Create previews for each file
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Lỗi khi upload ảnh');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let imageUrl = formData.image;
      let imagesArray: string[] | null = null;
      
      // Upload tất cả các file ảnh (chỉ khi có file mới)
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => uploadImage(file));
        imagesArray = await Promise.all(uploadPromises);
        // Ảnh đầu tiên sẽ là ảnh chính
        imageUrl = imagesArray[0];
      }
      
      // Parse giá: loại bỏ dấu chấm phân cách hàng nghìn
      const priceValue = parseFloat(formData.price.replace(/\./g, '')) || 0;
      
      // Tạo productData cơ bản
      const productData: Record<string, any> = {
        name: formData.name,
        description: formData.description,
        price: priceValue,
        image: imageUrl,
        category: formData.category,
        product_type: formData.product_type,
        sport_type: formData.sport_type,
        stock: parseInt(formData.stock)
      };
      
      // Chỉ thêm images nếu có upload ảnh mới
      if (imagesArray !== null && imagesArray.length > 0) {
        productData.images = JSON.stringify(imagesArray);
      }

      if (editingProduct) {
        // Cập nhật sản phẩm
        const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (response.ok) {
          await fetchProducts();
          setEditingProduct(null);
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || 'Lỗi cập nhật sản phẩm');
        }
      } else {
        // Thêm sản phẩm mới - luôn gửi images (có thể là mảng rỗng)
        if (!productData.images) {
          productData.images = '[]';
        }
        
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (response.ok) {
          await fetchProducts();
          setShowAddForm(false);
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || 'Lỗi thêm sản phẩm');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Lỗi kết nối');
    } finally {
      setUploading(false);
    }
  };

  // Format số thành dạng có dấu chấm phân cách (VD: 1500000 -> 1.500.000)
  const formatPriceInput = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: formatPriceInput(product.price),
      image: product.image,
      category: product.category,
      product_type: product.product_type || '',
      sport_type: product.sport_type || '',
      stock: product.stock.toString()
    });
    setImageFiles([]);
    setImagePreviews([]);
    
    // Filter product types based on selected category
    if (product.category) {
      const filtered = getProductTypesByCategory(product.category);
      setFilteredProductTypes(filtered);
    }
    
    setShowAddForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Lỗi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi kết nối');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        await fetchOrders();
        alert('Cập nhật trạng thái đơn hàng thành công');
      } else {
        const error = await response.json();
        alert(error.error || 'Lỗi cập nhật đơn hàng');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Lỗi kết nối');
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });

      if (response.ok) {
        await fetchProducts();
        alert('Cập nhật số lượng kho thành công');
      } else {
        const error = await response.json();
        alert(error.error || 'Lỗi cập nhật kho hàng');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Lỗi kết nối');
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`);
      const data = await response.json();
      setSelectedOrder(data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      product_type: '',
      sport_type: '',
      stock: ''
    });
    setImageFiles([]);
    setImagePreviews([]);
    setFilteredProductTypes([]);
    setEditingProduct(null);
    setShowAddForm(false);
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

  const formatAddress = (shippingAddress: string | null | undefined) => {
    if (!shippingAddress) {
      return 'Không có địa chỉ';
    }
    
    try {
      const address = JSON.parse(shippingAddress);
      const parts = [];
      
      // Thêm tên khách hàng
      if (address.firstName || address.lastName) {
        parts.push(`${address.firstName || ''} ${address.lastName || ''}`.trim());
      }
      
      // Thêm địa chỉ chi tiết
      if (address.address) {
        parts.push(address.address);
      }
      
      // Thêm phường/xã
      if (address.ward) {
        parts.push(address.ward);
      }
      
      // Thêm quận/huyện
      if (address.district) {
        parts.push(address.district);
      }
      
      // Thêm tỉnh/thành phố
      if (address.city) {
        parts.push(address.city);
      }
      
      // Thêm số điện thoại
      if (address.phone) {
        parts.push(`📞 ${address.phone}`);
      }
      
      return parts.join(', ');
    } catch (error) {
      return shippingAddress || 'Không có địa chỉ';
    }
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
          <p className="mt-4 text-gray-900">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
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
            <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Admin</h1>
            <p className="text-gray-900 mt-2">Quản lý sản phẩm, đơn hàng và kho hàng</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Tổng sản phẩm</p>
                  <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Tổng đơn hàng</p>
                  <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Đơn chờ xác nhận</p>
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
                  <p className="text-sm font-medium text-gray-900">Sản phẩm hết hàng</p>
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
                      : 'border-transparent text-gray-900 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Quản lý sản phẩm
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-900 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Quản lý đơn hàng
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'stock'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-900 hover:text-gray-700 hover:border-gray-300'
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
                          className="text-gray-900 hover:text-gray-700"
                          title="Đóng form"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Tên sản phẩm *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập tên sản phẩm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Bước 1: Loại sản phẩm *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            title="Chọn loại sản phẩm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          >
                            <option value="">Chọn loại sản phẩm</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Bước 2: Môn thể thao *
                          </label>
                          <select
                            name="sport_type"
                            value={formData.sport_type}
                            onChange={handleInputChange}
                            required
                            title="Chọn môn thể thao"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          >
                            <option value="">Chọn môn thể thao</option>
                            {sportTypes.map((sport) => (
                              <option key={sport.id} value={sport.id}>
                                {sport.icon} {sport.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Chi tiết loại sản phẩm
                          </label>
                          <select
                            name="product_type"
                            value={formData.product_type}
                            onChange={handleInputChange}
                            title="Chọn chi tiết loại sản phẩm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            disabled={!formData.category}
                          >
                            <option value="">
                              {formData.category ? 'Chọn chi tiết (không bắt buộc)' : 'Chọn loại sản phẩm trước'}
                            </option>
                            {filteredProductTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.icon} {type.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Giá (VNĐ) *
                          </label>
                          <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={(e) => {
                              // Cho phép nhập số và dấu chấm để format tiền VNĐ
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              setFormData({ ...formData, price: value });
                            }}
                            required
                            placeholder="Ví dụ: 1.500.000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Mô tả
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Nhập mô tả sản phẩm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Hình ảnh sản phẩm (có thể chọn nhiều ảnh)
                          </label>
                          
                          {/* Upload file input - multiple */}
                          <div className="mb-4">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              title="Chọn ảnh từ máy tính"
                              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-900 mt-1">
                              Chọn nhiều ảnh cùng lúc (JPG, PNG, GIF - tối đa 5MB mỗi ảnh). Ảnh đầu tiên sẽ là ảnh chính.
                            </p>
                          </div>

                          {/* Image previews - multiple */}
                          {imagePreviews.length > 0 && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Xem trước ảnh ({imagePreviews.length} ảnh):
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {imagePreviews.map((preview, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                                    />
                                    {index === 0 && (
                                      <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-0.5 rounded-b-lg">
                                        Ảnh chính
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Show existing image when editing */}
                          {formData.image && imagePreviews.length === 0 && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Ảnh hiện tại:
                              </label>
                              <img
                                src={getImageUrl(formData.image)}
                                alt="Current"
                                className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          )}

                          {/* Fallback URL input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Hoặc nhập URL hình ảnh:
                            </label>
                            <input
                              type="text"
                              name="image"
                              value={formData.image}
                              onChange={handleInputChange}
                              placeholder="Nhập URL hình ảnh"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
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
                            disabled={uploading}
                            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="h-4 w-4" />
                            <span>
                              {uploading ? 'Đang xử lý...' : (editingProduct ? 'Cập nhật' : 'Thêm sản phẩm')}
                            </span>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Sản phẩm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Danh mục
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Giá
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Tồn kho
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
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
                                      src={getImageUrl(product.image)}
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
                                  <div className="text-sm text-gray-900 truncate max-w-xs">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                {product.category && getCategoryName(product.category) !== 'Không xác định' && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {getCategoryName(product.category)}
                                  </span>
                                )}
                                {product.sport_type && getSportTypeName(product.sport_type) !== 'Không xác định' && (
                                  <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {getSportTypeName(product.sport_type)}
                                  </span>
                                )}
                                {product.product_type && getProductTypeName(product.product_type) !== 'Không xác định' && (
                                  <div className="text-xs text-gray-900">
                                    {getProductTypeName(product.product_type)}
                                  </div>
                                )}
                              </div>
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
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Quản lý đơn hàng theo thời gian</h3>
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 px-4 py-2 rounded-xl">
                        <span className="text-sm text-gray-600">Tổng đơn hàng: </span>
                        <span className="font-bold text-blue-600">{orders.length}</span>
                      </div>
                      <div className="bg-green-50 px-4 py-2 rounded-xl">
                        <span className="text-sm text-gray-600">Doanh thu (đã giao): </span>
                        <span className="font-bold text-green-600">
                          {formatPrice(totalDeliveredRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grouped Orders by Year */}
                  <div className="space-y-4">
                    {Object.keys(groupedOrders)
                      .map(Number)
                      .sort((a, b) => b - a)
                      .map(year => (
                        <div key={year} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                          {/* Year Header */}
                          <button
                            onClick={() => toggleYear(year)}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {expandedYears.includes(year) ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                              <Calendar className="h-5 w-5" />
                              <span className="text-lg font-bold">Năm {year}</span>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <div className="text-xs text-blue-200">Tổng đơn</div>
                                <div className="font-bold">{groupedOrders[year].orderCount}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-blue-200">Đã giao</div>
                                <div className="font-bold text-green-300">{groupedOrders[year].deliveredCount}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-blue-200">Doanh thu (đã giao)</div>
                                <div className="font-bold text-yellow-300">
                                  {formatPrice(groupedOrders[year].totalRevenue)}
                                </div>
                              </div>
                            </div>
                          </button>

                          {/* Months */}
                          {expandedYears.includes(year) && (
                            <div className="divide-y divide-gray-100">
                              {Object.keys(groupedOrders[year].months)
                                .map(Number)
                                .sort((a, b) => b - a)
                                .map(month => {
                                  const monthKey = `${year}-${month}`;
                                  const monthData = groupedOrders[year].months[month];
                                  return (
                                    <div key={monthKey}>
                                      {/* Month Header */}
                                      <button
                                        onClick={() => toggleMonth(monthKey)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                      >
                                        <div className="flex items-center space-x-3">
                                          {expandedMonths.includes(monthKey) ? (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                          )}
                                          <span className="font-semibold text-gray-700">
                                            {getMonthName(month)} {year}
                                          </span>
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {monthData.orders.length} đơn
                                          </span>
                                          {monthData.deliveredCount > 0 && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                              {monthData.deliveredCount} đã giao
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <DollarSign className="h-4 w-4 text-green-600" />
                                          <span className="font-bold text-green-600">
                                            {formatPrice(monthData.totalRevenue)}
                                          </span>
                                          <span className="text-xs text-gray-400">(đã giao)</span>
                                        </div>
                                      </button>

                                      {/* Orders Table */}
                                      {expandedMonths.includes(monthKey) && (
                                        <div className="overflow-x-auto">
                                          <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                              {monthData.orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                                                    <div className="text-xs text-gray-500">{order.user_email}</div>
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                                                    {formatPrice(order.total_amount)}
                                                  </td>
                                                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                                                    {(() => {
                                                      try {
                                                        const address = JSON.parse(order.shipping_address);
                                                        return (
                                                          <div className="truncate">
                                                            {[address.address, address.ward, address.district, address.city]
                                                              .filter(Boolean).join(', ')}
                                                          </div>
                                                        );
                                                      } catch {
                                                        return 'Không có địa chỉ';
                                                      }
                                                    })()}
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                      {getStatusText(order.status)}
                                                    </span>
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.created_at)}
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    <div className="flex space-x-2">
                                                      <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Xem chi tiết"
                                                      >
                                                        <Eye className="h-4 w-4" />
                                                      </button>
                                                      {order.status === 'pending' && (
                                                        <button
                                                          onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                                          className="text-green-600 hover:text-green-900"
                                                          title="Xác nhận"
                                                        >
                                                          ✓
                                                        </button>
                                                      )}
                                                      {order.status === 'confirmed' && (
                                                        <button
                                                          onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                                          className="text-purple-600 hover:text-purple-900"
                                                          title="Gửi hàng"
                                                        >
                                                          🚚
                                                        </button>
                                                      )}
                                                      {order.status === 'shipped' && (
                                                        <button
                                                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                                          className="text-green-600 hover:text-green-900"
                                                          title="Đã giao"
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
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      ))}

                    {orders.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-2xl">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Chưa có đơn hàng nào</p>
                      </div>
                    )}
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Sản phẩm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Tồn kho hiện tại
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
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
                                      src={getImageUrl(product.image)}
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
                                  <div className="text-sm text-gray-900">
                                    {product.category && getCategoryName(product.category) !== 'Không xác định' && (
                                      <span>{getCategoryName(product.category)}</span>
                                    )}
                                    {product.sport_type && getSportTypeName(product.sport_type) !== 'Không xác định' && (
                                      <span className="ml-2 text-xs text-green-700">
                                        • {getSportTypeName(product.sport_type)}
                                      </span>
                                    )}
                                    {product.product_type && getProductTypeName(product.product_type) !== 'Không xác định' && (
                                      <span className="ml-2 text-xs">
                                        • {getProductTypeName(product.product_type)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {editingStock?.id === product.id ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    value={editingStock.stock}
                                    onChange={(e) => setEditingStock({
                                      id: product.id,
                                      stock: parseInt(e.target.value) || 0
                                    })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900"
                                    min="0"
                                    placeholder="Số lượng"
                                    title="Nhập số lượng kho"
                                    aria-label="Cập nhật số lượng kho"
                                  />
                                  <button
                                    onClick={() => {
                                      handleUpdateStock(product.id, editingStock.stock);
                                      setEditingStock(null);
                                    }}
                                    className="text-green-600 hover:text-green-900"
                                    title="Lưu"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingStock(null)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Hủy"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="cursor-pointer hover:text-blue-600" 
                                      onClick={() => setEditingStock({ id: product.id, stock: product.stock })}>
                                  {product.stock}
                                </span>
                              )}
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
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingStock({ id: product.id, stock: product.stock })}
                                  className="text-green-600 hover:text-green-900"
                                  title="Cập nhật số lượng"
                                >
                                  <Package className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Chỉnh sửa sản phẩm"
                                >
                                  <Edit className="h-4 w-4" />
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
            </div>
          </div>
        </div>
        </div>
      </div>
    </AdminGuard>
  );
}