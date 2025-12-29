'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const createInitialFormState = () => ({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    verificationCode: ''
  });

  const [formData, setFormData] = useState(createInitialFormState());
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [forgotUserName, setForgotUserName] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [codeMeta, setCodeMeta] = useState<{ expiresIn: number; previewCode: string | null; sent: boolean }>({
    expiresIn: 10,
    previewCode: null,
    sent: false
  });
  const { login, register } = useAuth();

  // Reset form khi mở modal
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData(createInitialFormState());
      setForgotUserName('');
      setResetSuccess(false);
      setCodeMeta({ expiresIn: 10, previewCode: null, sent: false });
      setSendingCode(false);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
          setFormData(createInitialFormState());
        }
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          alert('Mật khẩu xác nhận không khớp');
          return;
        }
        const success = await register(formData.email, formData.password, formData.name);
        if (success) {
          setMode('login');
          setFormData(createInitialFormState());
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const requestResetCode = async () => {
    if (!formData.email) {
      alert('Vui lòng nhập email đã đăng ký');
      return false;
    }

    setSendingCode(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, step: 'send-code' })
      });

      const data = await response.json();

      if (response.ok) {
        setForgotUserName(data.userName || '');
        setMode('reset');
        setResetSuccess(false);
        setCodeMeta({
          expiresIn: data.expiresInMinutes ?? 10,
          previewCode: data.previewCode ?? null,
          sent: true
        });
        setFormData(prev => ({ ...prev, verificationCode: '' }));
        return true;
      }

      alert(data.error || 'Không thể gửi mã xác thực');
      return false;
    } catch (error) {
      alert('Lỗi kết nối');
      return false;
    } finally {
      setSendingCode(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestResetCode();
  };

  const handleResendCode = async () => {
    await requestResetCode();
  };

  // Xử lý đặt lại mật khẩu - Bước 2: Đặt mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      alert('Vui lòng nhập mã xác thực gồm 6 chữ số');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          newPassword: formData.newPassword,
          code: formData.verificationCode,
          step: 'reset' 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setMode('login');
          setFormData(createInitialFormState());
          setResetSuccess(false);
          setCodeMeta({ expiresIn: 10, previewCode: null, sent: false });
        }, 2000);
      } else {
        alert(data.error || 'Không thể đặt lại mật khẩu');
      }
    } catch (error) {
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'verificationCode'
        ? value.replace(/\D/g, '').slice(0, 6)
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const goBackToLogin = () => {
    setMode('login');
    setFormData(createInitialFormState());
    setForgotUserName('');
    setResetSuccess(false);
    setCodeMeta({ expiresIn: 10, previewCode: null, sent: false });
    setSendingCode(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {(mode === 'forgot' || mode === 'reset') && (
            <button
              onClick={goBackToLogin}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          )}
          <h2 className="text-2xl font-bold flex-1 text-center">
            {mode === 'login' && 'Đăng nhập'}
            {mode === 'register' && 'Đăng ký'}
            {mode === 'forgot' && 'Quên mật khẩu'}
            {mode === 'reset' && 'Đặt lại mật khẩu'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 text-right"
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {resetSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium text-green-800">Đặt lại mật khẩu thành công!</p>
              <p className="text-sm text-green-600">Đang chuyển về trang đăng nhập...</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Nhập email"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Nhập mật khẩu"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Nhập họ và tên"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Nhập email"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Nhập mật khẩu"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Xác nhận mật khẩu"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
        )}

        {/* Forgot Password Form - Step 1: Enter Email */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm">
                Nhập email đã đăng ký để đặt lại mật khẩu
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Nhập email của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={sendingCode}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {sendingCode ? 'Đang gửi mã...' : 'Gửi mã xác thực'}
            </button>
          </form>
        )}

        {/* Reset Password Form - Step 2: Enter New Password */}
        {mode === 'reset' && !resetSuccess && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-800 font-medium">
                Xin chào, {forgotUserName}!
              </p>
              <p className="text-gray-600 text-sm">
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
              <p>
                Mã gồm 6 chữ số đã được gửi đến <strong>{formData.email}</strong>.
                Mã sẽ hết hạn sau khoảng {codeMeta.expiresIn} phút.
              </p>
              {codeMeta.previewCode && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
                  Môi trường dev: mã của bạn là <strong>{codeMeta.previewCode}</strong>.
                </p>
              )}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={sendingCode}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline disabled:opacity-50"
              >
                {sendingCode ? 'Đang gửi lại...' : 'Gửi lại mã'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã xác thực
              </label>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                required
                placeholder="Nhập 6 chữ số"
                maxLength={6}
                inputMode="numeric"
                pattern="\d*"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-[0.5em]"
                style={{ letterSpacing: formData.verificationCode ? '0.5em' : 'normal' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
                placeholder="Xác nhận mật khẩu mới"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}

        {/* Toggle Login/Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {mode === 'login' 
                ? 'Chưa có tài khoản? Đăng ký ngay' 
                : 'Đã có tài khoản? Đăng nhập ngay'
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
