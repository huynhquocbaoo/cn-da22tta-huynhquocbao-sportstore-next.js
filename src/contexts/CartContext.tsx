'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[] | undefined;
  addToCart: (productId: number, quantity?: number, size?: string) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number, size?: string) => Promise<boolean>;
  removeFromCart: (productId: number, size?: string) => Promise<boolean>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  loading: boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Lấy token từ localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
    console.log('CartContext: fetchCart called, user:', user);
    
    if (!user) {
      console.log('CartContext: No user, setting cartItems to undefined');
      setCartItems(undefined);
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      console.log('CartContext: Token exists:', !!token);
      
      if (!token) {
        console.log('CartContext: No token found, setting cartItems to undefined');
        setCartItems(undefined);
        return;
      }

      console.log('CartContext: Fetching cart with token:', token.substring(0, 20) + '...');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        // Thêm timeout để tránh hang
        signal: AbortSignal.timeout(5000)
      });

      console.log('CartContext: Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('CartContext: Cart data received:', data);
        console.log('CartContext: cartItems from API:', data.cartItems);
        console.log('CartContext: cartItems length:', data.cartItems?.length);
        setCartItems(data.cartItems || []);
      } else {
        const errorData = await response.json();
        console.log('CartContext: Error response:', errorData);
        setCartItems([]);
      }
    } catch (error) {
      console.error('CartContext: Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('CartContext: useEffect triggered, user:', user);
    console.log('CartContext: user exists:', !!user);
    console.log('CartContext: user id:', user?.id);
    if (user) {
      fetchCart();
    } else {
      console.log('CartContext: No user, setting cartItems to undefined');
      setCartItems(undefined);
    }
  }, [user]);

  const addToCart = async (productId: number, quantity: number = 1, size?: string): Promise<boolean> => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return false;
    }

    try {
      const token = getToken();
      if (!token) return false;

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity, size }),
      });

      if (response.ok) {
        console.log('CartContext: Product added successfully, refreshing cart...');
        await fetchCart(); // Refresh cart
        console.log('CartContext: Cart refreshed after adding product');
        return true;
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể thêm vào giỏ hàng');
        return false;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const updateQuantity = async (productId: number, quantity: number, size?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = getToken();
      if (!token) return false;

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity, size }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return true;
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể cập nhật giỏ hàng');
        return false;
      }
    } catch (error) {
      console.error('Update cart error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const removeFromCart = async (productId: number, size?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = getToken();
      if (!token) return false;

      let url = `/api/cart?productId=${productId}`;
      if (size) {
        url += `&size=${encodeURIComponent(size)}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return true;
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể xóa khỏi giỏ hàng');
        return false;
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const getCartTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      getCartTotal,
      getCartItemCount,
      loading,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
