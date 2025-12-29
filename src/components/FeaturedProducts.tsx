'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  average_rating?: number;
  total_reviews?: number;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Đã thêm vào giỏ hàng!');
    }
  };

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
    }).format(price * 1000); // Convert to VND
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất với chất lượng vượt trội và giá cả hợp lý
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const detailHref = `/products/${product.id}`;
            return (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-3xl">
                <Link href={detailHref} className="block">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl text-gray-400">🏃</span>
                    )}
                  </div>
                </Link>
                
                {/* Stock Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    product.stock > 50 ? 'bg-green-500 text-white' :
                    product.stock > 20 ? 'bg-yellow-500 text-white' :
                    product.stock > 0 ? 'bg-orange-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="text-sm text-blue-600 font-medium capitalize">
                      {product.category}
                    </span>
                  </div>
                  
                  <Link href={detailHref} className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors block h-14">
                    {product.name}
                  </Link>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  {/* Spacer to push price and button to bottom */}
                  <div className="flex-grow"></div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                  </button>
                </div>
            </div>
          )})}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}
