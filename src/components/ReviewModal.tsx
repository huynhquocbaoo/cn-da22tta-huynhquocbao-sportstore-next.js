'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  orderId: number;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  orderId,
  onReviewSubmitted 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    setSubmitting(true);

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập để đánh giá');
        return;
      }
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          comment: ''
        })
      });

      if (response.ok) {
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
        setRating(0);
        onReviewSubmitted();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Đánh giá sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Đóng"
            aria-label="Đóng modal đánh giá"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Sản phẩm: <span className="font-medium">{productName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                  title={`Đánh giá ${star} sao`}
                  aria-label={`Đánh giá ${star} sao`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rating === 0 && 'Vui lòng chọn số sao'}
              {rating === 1 && 'Rất tệ'}
              {rating === 2 && 'Tệ'}
              {rating === 3 && 'Bình thường'}
              {rating === 4 && 'Tốt'}
              {rating === 5 && 'Rất tốt'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
