# Học Từ Đầu — Trang web học tiếng Anh (bản tĩnh)

## Cấu trúc project

```
learn-english-web/
├── index.html                 → Trang chủ (chọn trình độ A1-C2, nav có Đăng nhập/Đăng ký)
├── login.html                 → Đăng nhập (mô phỏng, lưu bằng localStorage)
├── signup.html                → Đăng ký (mô phỏng, lưu bằng localStorage)
├── pages/
│   ├── tu-vung.html            → Chọn trình độ + chủ đề từ vựng
│   ├── tu-vung-bai-hoc.html    → Bài học: flashcard + bài tập điền từ (chủ đề Food)
│   ├── nghe.html                → Chọn trình độ + chủ đề nghe
│   ├── nghe-bai-hoc.html        → Bài nghe: hội thoại nhà hàng, điền từ còn thiếu
│   ├── noi.html                  → Chọn trình độ + tình huống luyện nói
│   └── noi-bai-hoc.html          → Bài nói: hội thoại thật, dùng mic (Web Speech API)
├── assets/
│   ├── css/style.css            → CSS dùng chung, theme xanh dương/trắng
│   └── js/
│       ├── auth.js               → Đăng nhập/đăng ký mô phỏng
│       ├── tu-vung-bai-hoc.js    → Logic flashcard + điền từ
│       ├── nghe-bai-hoc.js       → Logic hội thoại nghe điền từ
│       └── noi-bai-hoc.js        → Logic hội thoại luyện nói bằng mic
└── README.md
```

## Cách chạy

Dùng VS Code + extension **Live Server** (khuyến nghị) — chuột phải vào
`index.html` → "Open with Live Server". Cách này cần thiết để tính năng
**mic (nhận diện giọng nói)** ở trang Nói hoạt động ổn định — một số trình
duyệt chặn mic nếu mở file trực tiếp bằng `file://`.

## Về phần Đăng nhập/Đăng ký

Đây là bản MÔ PHỎNG — tài khoản chỉ lưu trong trình duyệt của bạn
(localStorage), CHƯA phải hệ thống thật. Nếu bạn xóa dữ liệu trình duyệt,
tài khoản demo sẽ mất. Khi làm FastAPI, toàn bộ logic trong `auth.js` sẽ
được thay bằng lệnh gọi API thật (`/api/register`, `/api/login`) và lưu
vào database.

Thử ngay: vào `login.html` khi CHƯA đăng ký tài khoản nào → hệ thống sẽ báo
"Bạn chưa có tài khoản, vui lòng đăng ký" đúng như bạn yêu cầu.

## Về phần luyện Nói (mic)

Trang `noi-bai-hoc.html` dùng Web Speech API (`SpeechRecognition`) — hoạt
động tốt nhất trên **Chrome hoặc Edge**. Trình duyệt sẽ hỏi xin quyền dùng
mic, bạn cần bấm "Allow". Nếu trình duyệt không hỗ trợ (ví dụ Safari), trang
tự động chuyển sang ô nhập chữ để bạn vẫn luyện tập được.

Lưu ý: hiện tại hệ thống chỉ **ghi nhận và hiển thị lại** câu bạn nói,
CHƯA chấm điểm đúng/sai ngữ pháp hay phát âm — phần chấm điểm bằng AI sẽ
cần có backend (FastAPI + gọi API AI) mới làm được.

## Nội dung mẫu đã có đầy đủ

Hiện tại mới xây dựng đầy đủ nội dung cho **trình độ A1, chủ đề "Food"**
ở cả 3 kỹ năng để làm mẫu. Các chủ đề khác hiển thị "🔒 Sắp mở khóa" —
để thêm chủ đề mới, bạn copy cấu trúc của Food (từ vựng → bài nghe → bài
nói) rồi đổi nội dung.

## Bước tiếp theo

- Khi học tới FastAPI: thay toàn bộ dữ liệu cứng (`words`, `dialogue`,
  `script`) bằng API thật, thay `auth.js` bằng đăng nhập/đăng ký thật
- Thêm nội dung cho các chủ đề còn "khóa"
- Thêm hệ thống lưu tiến độ học viên vào database
