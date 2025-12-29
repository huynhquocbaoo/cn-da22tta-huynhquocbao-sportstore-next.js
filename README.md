# SportStore - Trang web bán dụng cụ thể thao

Một trang web thương mại điện tử hiện đại được xây dựng bằng Next.js 14, TypeScript và Tailwind CSS, chuyên bán dụng cụ thể thao chất lượng cao.

## 🚀 Tính năng chính

### 🏠 Trang chủ
- Hero section với thống kê ấn tượng
- Danh mục sản phẩm đa dạng
- Sản phẩm nổi bật với đánh giá
- Lý do chọn SportStore

### 🛍️ Sản phẩm
- **Danh sách sản phẩm** với bộ lọc thông minh
- **Chi tiết sản phẩm** với gallery ảnh
- **Tìm kiếm** theo danh mục, thương hiệu, giá
- **Sắp xếp** theo độ phổ biến, giá, đánh giá
- **Xem dạng lưới/danh sách**

### 🛒 Giỏ hàng & Thanh toán
- **Giỏ hàng** với quản lý số lượng
- **Thanh toán** với form đầy đủ
- **Tính phí vận chuyển** tự động
- **Xác nhận đơn hàng** thành công

### 📱 Responsive Design
- **Mobile-first** approach
- **Tablet** và **Desktop** tối ưu
- **Navigation** thân thiện mobile

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 16** - React framework với App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Headless UI** - Accessible UI components

### Backend
- **Next.js API Routes** - Server-side API
- **MySQL 8.0** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database
- **MySQL** - Relational database (XAMPP)

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js** 18+ và npm
- **XAMPP** với MySQL đã được cài đặt và chạy
- **MySQL** service đang chạy trên port 3306

### Các bước cài đặt

1. **Cài đặt XAMPP và khởi động MySQL:**
   - Tải XAMPP từ: https://www.apachefriends.org/
   - Cài đặt và khởi động MySQL service trong XAMPP Control Panel

2. **Clone repository:**
```bash
git clone <repository-url>
cd sports-store
```

3. **Cài đặt dependencies:**
```bash
npm install
```

4. **Khởi tạo database:**
```bash
npm run init-db
```

5. **Chạy development server:**
```bash
npm run dev
```

6. **Mở trình duyệt:**
```
http://localhost:3000
```

### Thông tin đăng nhập mặc định

- **Email:** admin@sportsstore.com
- **Password:** admin123

## 🏗️ Cấu trúc dự án

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── products/          # Products pages
│   │   ├── page.tsx       # Products list
│   │   └── [id]/          # Product detail
│   │       └── page.tsx
│   ├── cart/              # Shopping cart
│   │   └── page.tsx
│   └── checkout/          # Checkout process
│       └── page.tsx
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── HeroSection.tsx    # Homepage hero
│   ├── Categories.tsx     # Product categories
│   ├── FeaturedProducts.tsx # Featured products
│   ├── WhyChooseUs.tsx    # Why choose us section
│   ├── ProductCard.tsx    # Product card component
│   ├── ProductFilters.tsx # Product filters
│   ├── ProductGallery.tsx # Product image gallery
│   ├── ProductTabs.tsx    # Product detail tabs
│   └── RelatedProducts.tsx # Related products
└── globals.css            # Global styles
```

## 🎨 Thiết kế

### Màu sắc chính
- **Primary:** Blue (#2563eb)
- **Secondary:** Yellow (#eab308)
- **Success:** Green (#16a34a)
- **Warning:** Orange (#ea580c)
- **Error:** Red (#dc2626)

### Typography
- **Font:** Geist Sans (Google Fonts)
- **Headings:** Bold, responsive sizing
- **Body:** Regular weight, readable line-height

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🚀 Scripts có sẵn

```bash
# Development
npm run dev          # Development server
npm run dev:silent   # Development server (không mở browser)

# Production
npm run build        # Production build
npm run start        # Start production server

# Database
npm run init-db      # Khởi tạo database
npm run test-db      # Test database connection
npm run fix-db       # Sửa lỗi database
npm run add-admin    # Thêm quyền admin cho user
npm run fix-admin    # Sửa quyền admin
npm run create-orders # Tạo bảng orders

# Code Quality
npm run lint         # Run ESLint
```

## 📄 Trang chính

- **/** - Trang chủ
- **/products** - Danh sách sản phẩm
- **/products/[id]** - Chi tiết sản phẩm
- **/cart** - Giỏ hàng
- **/checkout** - Thanh toán

## 🔧 Tùy chỉnh

### Thêm sản phẩm mới
Chỉnh sửa dữ liệu mock trong các file:
- `src/app/products/page.tsx`
- `src/components/FeaturedProducts.tsx`

### Thay đổi màu sắc
Cập nhật Tailwind classes trong các component hoặc tùy chỉnh `tailwind.config.js`

### Thêm trang mới
Tạo thư mục mới trong `src/app/` với file `page.tsx`

## 📈 Performance

- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals:** Optimized
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic với App Router

## 🔒 Bảo mật

- **TypeScript** cho type safety
- **ESLint** cho code quality
- **Form validation** client-side
- **Sanitized inputs** (cần implement server-side)

## 🚀 Deployment

### Cấu hình Database

Ứng dụng sử dụng MySQL với XAMPP. Đảm bảo:

1. **XAMPP đã được cài đặt và MySQL đang chạy**
2. **Database `sports_store` đã được tạo:**
   ```bash
   npm run init-db
   ```
3. **Cấu hình database trong `src/lib/config.ts`:**
   ```typescript
   DATABASE: {
     host: 'localhost',
     user: 'root',
     password: '',  // Mật khẩu MySQL của bạn (mặc định XAMPP là rỗng)
     database: 'sports_store',
     port: 3306,
   }
   ```

### Email quên mật khẩu

- Cấu hình SMTP trong `.env` (xem `env.example`) với các biến `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`.
- Nếu chưa cấu hình SMTP, mã đặt lại mật khẩu sẽ chỉ được log trong server (hữu ích cho dev, không nên dùng cho production).

### 📚 Hướng dẫn chi tiết

Xem tất cả hướng dẫn trong folder **[docs](./docs/)**:

- **[HƯỚNG_DẪN_CÀI_ĐẶT.md](./docs/HƯỚNG_DẪN_CÀI_ĐẶT.md)** - 📖 Hướng dẫn cài đặt với XAMPP
- **[SETUP.md](./docs/SETUP.md)** - ⚙️ Hướng dẫn setup
- **[CAC_BUOC_CHAY.md](./docs/CAC_BUOC_CHAY.md)** - 📝 Các bước chạy ứng dụng

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker Compose
1. Sao chép file cấu hình mẫu:
   ```bash
   cp env.example .env
   ```
2. Cập nhật `JWT_SECRET`, `DB_PASSWORD` (và các biến khác nếu cần).
3. Chạy toàn bộ stack:
   ```bash
   docker compose up --build
   ```
4. Mở `http://localhost:3000`.
5. Nếu trên máy đã có MySQL (XAMPP, WAMP,…), docker-compose mặc định map cổng host `3307 -> 3306` để tránh xung đột. Sửa lại trong `docker-compose.yml` nếu bạn cần cổng khác.

👉 Xem hướng dẫn chi tiết trong [`docs/DOCKER.md`](./docs/DOCKER.md).
