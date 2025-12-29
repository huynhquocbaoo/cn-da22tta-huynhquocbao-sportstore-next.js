'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Shield, XCircle, X } from 'lucide-react';

export default function ErrorMessage() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'error' | 'warning' | 'info'>('error');

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    const logout = searchParams.get('logout');

    if (logout === 'true') {
      setMessage('Bạn đã đăng xuất thành công.');
      setType('info');
      setShow(true);
    } else if (error === 'unauthorized') {
      setMessage('Bạn cần đăng nhập để truy cập trang quản trị.');
      setType('warning');
      setShow(true);
    } else if (error === 'forbidden') {
      setMessage('Bạn không có quyền truy cập trang quản trị. Chỉ có tài khoản admin mới được phép.');
      setType('error');
      setShow(true);
    } else if (error === 'invalid_token') {
      setMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      setType('error');
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Shield className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md ${getColorClasses()} border rounded-lg p-4 shadow-lg`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => setShow(false)}
            title="Đóng thông báo"
            className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' :
              type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
              'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
