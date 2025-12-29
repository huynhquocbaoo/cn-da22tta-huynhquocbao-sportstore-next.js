'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component mount
    const token = localStorage.getItem('token');
    console.log('🔒 AuthContext: Loading user from localStorage', { token: !!token });
    
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        console.log('🔒 AuthContext: User data loaded', userData);
        if (userData && userData.id) {
          setUser(userData);
        }
      } catch (error) {
        console.error('🔒 AuthContext: Error parsing user data', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        // Lưu token vào cookie để middleware có thể đọc
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        return true;
      } else {
        alert(data.error || 'Đăng nhập thất bại');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        return true;
      } else {
        alert(data.error || 'Đăng ký thất bại');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Lỗi kết nối');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Xóa cookie
    document.cookie = 'token=; path=/; max-age=0';
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
