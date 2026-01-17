'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:bg-slate-800 transition-all border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Địa chỉ</h3>
                  <p className="text-blue-200 mt-1">Trường Đại Học Trà Vinh</p>
                  <p className="text-slate-400 text-sm">126 Nguyễn Thiện Thành, P.5, TP. Trà Vinh</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:bg-slate-800 transition-all border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Phone className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Điện thoại</h3>
                  <p className="text-green-300 mt-1 text-xl font-semibold">0358 242 501</p>
                  <p className="text-slate-400 text-sm">Hỗ trợ từ 8:00 - 21:00 hàng ngày</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:bg-slate-800 transition-all border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Email</h3>
                  <p className="text-purple-300 mt-1">q.bao2k4@gmail.com</p>
                  <p className="text-slate-400 text-sm">Phản hồi trong vòng 24 giờ</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:bg-slate-800 transition-all border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Giờ làm việc</h3>
                  <p className="text-orange-300 mt-1">Thứ 2 - Chủ nhật</p>
                  <p className="text-slate-400 text-sm">8:00 sáng - 9:00 tối</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Zalo Contact */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center border border-slate-700">
            <div className="text-center">
              {/* Zalo Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-white text-2xl font-bold">Z</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Liên hệ qua Zalo</h2>
              <p className="text-blue-200 mb-6">
                Mọi thắc mắc hay tư vấn liên hệ qua Zalo
              </p>
              
              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
                <img
                  src="/images/zalo-qr.png"
                  alt="QR Code Zalo"
                  className="w-56 h-56 object-contain"
                />
              </div>
              
              {/* Phone Number */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30">
                <p className="text-sm opacity-90 mb-1">Số điện thoại</p>
                <p className="text-2xl font-bold tracking-wider">0358 242 501</p>
              </div>
              
              <p className="text-slate-400 text-sm mt-4">
                Quét mã QR hoặc gọi điện để được tư vấn ngay!
              </p>
            </div>
          </div>
        </div>

        {/* Map Section (Optional) */}
        <div className="mt-12 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">📍 Bản đồ</h2>
          </div>
          <div className="h-64 bg-slate-900 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0134045167387!2d106.34431931531688!3d9.934963892864858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a017e1a5a3c3c5%3A0x6b8b4b4b4b4b4b4b!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBUcsOgIFZpbmg!5e0!3m2!1svi!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ SportStore"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

