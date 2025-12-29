'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  category: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[] | undefined;
  addToWishlist: (productId: number) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Lấy token từ localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Lấy danh sách yêu thích từ API
  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems(undefined);
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setWishlistItems(undefined);
        return;
      }

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlistItems || []);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems(undefined);
    }
  }, [user]);

  const addToWishlist = async (productId: number): Promise<boolean> => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      return false;
    }

    try {
      const token = getToken();
      if (!token) return false;

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        await fetchWishlist();
        return true;
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể thêm vào danh sách yêu thích');
        return false;
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = getToken();
      if (!token) return false;

      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchWishlist();
        return true;
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể xóa khỏi danh sách yêu thích');
        return false;
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    if (!wishlistItems) return false;
    return wishlistItems.some(item => item.product_id === productId);
  };

  const getWishlistCount = () => {
    if (!wishlistItems) return 0;
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

