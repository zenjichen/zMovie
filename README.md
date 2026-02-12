# 🎬 CamCam - Trang Web Xem Phim Online

Trang web xem phim online hiện đại, sử dụng API từ OPhim với đầy đủ tính năng và giao diện đẹp mắt.

## ✨ Tính năng

### 🎯 Tính năng chính
- **Trang chủ động** - Hero section với phim nổi bật
- **Danh sách phim** - Phim mới, phim lẻ, phim bộ, hoạt hình
- **Tìm kiếm** - Tìm kiếm phim theo tên
- **Lọc phim** - Theo thể loại, quốc gia
- **Chi tiết phim** - Thông tin đầy đủ về phim
- **Xem phim** - Player tích hợp với danh sách tập

### 🎨 Giao diện
- **Dark Mode** - Giao diện tối hiện đại
- **Responsive** - Tương thích mọi thiết bị
- **Animations** - Hiệu ứng mượt mà
- **Premium Design** - Thiết kế cao cấp với gradient, shadows

### 🚀 API Features
Sử dụng đầy đủ các endpoint từ OPhim API:
- ✅ Phim trang chủ
- ✅ Danh sách phim (có bộ lọc)
- ✅ Tìm kiếm phim
- ✅ Danh sách thể loại
- ✅ Phim theo thể loại
- ✅ Danh sách quốc gia
- ✅ Phim theo quốc gia
- ✅ Thông tin chi tiết phim
- ✅ Danh sách tập phim

## 🛠️ Công nghệ sử dụng

- **HTML5** - Cấu trúc semantic
- **CSS3** - Styling với CSS Variables, Flexbox, Grid
- **JavaScript (Vanilla)** - Logic và API integration
- **OPhim API** - Nguồn dữ liệu phim
- **Google Fonts (Inter)** - Typography hiện đại

## 📦 Cài đặt

### Cách 1: Chạy trực tiếp
1. Clone hoặc tải project về
2. Mở file `index.html` bằng trình duyệt web
3. Hoặc sử dụng Live Server (VS Code extension)

### Cách 2: Sử dụng HTTP Server
```bash
# Sử dụng Python
python -m http.server 8000

# Sử dụng Node.js
npx http-server

# Sử dụng PHP
php -S localhost:8000
```

Sau đó truy cập: `http://localhost:8000`

## 📖 Hướng dẫn sử dụng

### Xem phim
1. Trang chủ hiển thị các phim mới nhất
2. Click vào poster phim để xem chi tiết
3. Click "Xem phim" hoặc chọn tập để xem

### Tìm kiếm
1. Nhập tên phim vào ô tìm kiếm
2. Nhấn Enter để tìm kiếm
3. Kết quả sẽ hiển thị ở phần "Phim mới cập nhật"

### Lọc phim
1. Click vào "Thể loại" hoặc "Quốc gia" trên menu
2. Chọn thể loại/quốc gia muốn xem
3. Danh sách phim sẽ được cập nhật

## 🎯 Cấu trúc project

```
camcam/
├── index.html          # Trang chính
├── styles.css          # CSS styling
├── app.js             # JavaScript logic
└── README.md          # Tài liệu này
```

## 🔧 Cấu hình

### API Configuration
File `app.js` chứa cấu hình API:

```javascript
const API_BASE = 'https://ophim1.com';
const API_ENDPOINTS = {
    home: '/danh-sach/phim-moi-cap-nhat',
    single: '/v1/api/danh-sach/phim-le',
    series: '/v1/api/danh-sach/phim-bo',
    animation: '/v1/api/danh-sach/hoat-hinh',
    search: '/v1/api/tim-kiem',
    detail: '/phim',
    categories: '/the-loai',
    countries: '/quoc-gia',
};
```

### Tùy chỉnh giao diện
File `styles.css` sử dụng CSS Variables:

```css
:root {
    --primary: #f31260;
    --secondary: #9333ea;
    --background: #0a0a0a;
    --surface: #18181b;
    /* ... */
}
```

## 🌟 Tính năng nổi bật

### 1. Hero Section động
- Tự động load phim mới nhất làm banner
- Background gradient đẹp mắt
- Call-to-action buttons

### 2. Movie Cards
- Hover effects mượt mà
- Hiển thị thông tin đầy đủ
- Quality badges
- Lazy loading images

### 3. Modal System
- Chi tiết phim với layout đẹp
- Video player fullscreen
- Smooth animations
- Click outside to close

### 4. Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly interface

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px - Full features
- **Tablet**: 768px - 1024px - Optimized layout
- **Mobile**: < 768px - Mobile menu, stacked layout
- **Small Mobile**: < 480px - 2-column grid

## 🎨 Design System

### Colors
- **Primary**: Pink (#f31260) - CTAs, highlights
- **Secondary**: Purple (#9333ea) - Gradients
- **Background**: Dark (#0a0a0a) - Main background
- **Surface**: Dark Gray (#18181b) - Cards, modals

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Sizes**: Responsive scaling

### Spacing
- **Container**: Max-width 1400px
- **Padding**: 24px (desktop), 16px (mobile)
- **Gaps**: 8px, 12px, 16px, 24px, 32px

## 🚀 Performance

### Optimizations
- Lazy loading images
- Skeleton loading states
- Efficient API calls
- Minimal dependencies
- CSS animations (GPU accelerated)

### Best Practices
- Semantic HTML
- Accessible markup
- SEO-friendly structure
- Error handling
- Loading states

## 🐛 Troubleshooting

### Phim không load
- Kiểm tra kết nối internet
- Kiểm tra console để xem lỗi API
- API OPhim có thể bị giới hạn rate limit

### Video không phát
- Kiểm tra link embed từ API
- Một số phim có thể chưa có link xem
- Thử tập khác hoặc phim khác

### Giao diện bị lỗi
- Hard refresh (Ctrl + F5)
- Clear browser cache
- Kiểm tra CSS đã load đầy đủ

## 📝 TODO / Cải tiến

- [ ] Thêm pagination cho danh sách phim
- [ ] Lưu lịch sử xem phim (localStorage)
- [ ] Bookmark phim yêu thích
- [ ] Filter nâng cao (năm, rating)
- [ ] Light mode theme
- [ ] PWA support
- [ ] Comments system
- [ ] User ratings

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:
1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Project này sử dụng API từ [OPhim](https://ophim.cc) - một API miễn phí cho cộng đồng.

## 🙏 Credits

- **API**: [OPhim API](https://ophim.cc)
- **Fonts**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Icons**: SVG inline icons
- **Design**: Inspired by modern streaming platforms

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

**Made with ❤️ by CamCam Team**

Powered by OPhim API v2.1.3
