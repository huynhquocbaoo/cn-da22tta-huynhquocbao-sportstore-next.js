import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Dụng cụ thể thao
                <span className="block text-yellow-400">chất lượng cao</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-lg">
                Khám phá bộ sưu tập dụng cụ thể thao đa dạng với chất lượng vượt trội, 
                giá cả cạnh tranh và dịch vụ tận tình.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
              >
                Mua sắm ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">1000+</div>
                <div className="text-gray-300">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-gray-300">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">99%</div>
                <div className="text-gray-300">Hài lòng</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">⚽</span>
                    </div>
                    <h3 className="font-semibold">Bóng đá</h3>
                    <p className="text-sm text-gray-300">200+ sản phẩm</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🏀</span>
                    </div>
                    <h3 className="font-semibold">Bóng rổ</h3>
                    <p className="text-sm text-gray-300">150+ sản phẩm</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🎾</span>
                    </div>
                    <h3 className="font-semibold">Tennis</h3>
                    <p className="text-sm text-gray-300">100+ sản phẩm</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">💪</span>
                    </div>
                    <h3 className="font-semibold">Gym</h3>
                    <p className="text-sm text-gray-300">300+ sản phẩm</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
