# Học Từ Đầu — Website học tiếng Anh

## Giới thiệu

**Học Từ Đầu** là website hỗ trợ người mới bắt đầu học tiếng Anh rèn luyện các kỹ năng **Từ vựng, Nghe, Nói và Viết** theo từng trình độ. Frontend được xây dựng bằng **HTML, CSS và JavaScript**, kết hợp backend **FastAPI (Python)** để xử lý tài khoản người dùng và xác thực đăng nhập.

## Công nghệ sử dụng

### Frontend
- **HTML5** — xây dựng cấu trúc các trang.
- **CSS3** — thiết kế giao diện và bố cục.
- **JavaScript** — xử lý tương tác, bài học và gọi API backend.
- **Web Speech API** — hỗ trợ nhận diện giọng nói ở phần luyện nói.

### Backend
- **FastAPI** — framework backend chính của hệ thống.
- **Uvicorn** — ASGI server dùng để chạy FastAPI.
- **SQLAlchemy** — ORM dùng để làm việc với cơ sở dữ liệu.
- **SQLite** — cơ sở dữ liệu hiện tại của project.
- **JWT Authentication** — xác thực người dùng bằng access token.
- **bcrypt** — băm và kiểm tra mật khẩu người dùng.
- **Groq AI (qua FastAPI)** — hỗ trợ kiểm tra câu trả lời phần Nói và chấm/sửa phần Viết.
- **python-dotenv** — đọc API key từ file `.env` ở backend để không lộ khóa trong frontend.

---

## Tính năng chính

- **Luyện từ vựng (`tu-vung.html`, `tu-vung-bai-hoc.html`):** Học từ mới qua Flashcard và các bài tập tương tác.
- **Luyện nghe (`nghe.html`, `nghe-bai-hoc.html`):** Luyện nghe hội thoại và làm bài tập điền từ.
- **Luyện nói (`noi.html`, `noi-bai-hoc.html`):** Sử dụng Web Speech API để nhận giọng nói, sau đó gửi câu trả lời đến FastAPI để AI kiểm tra mức độ phù hợp và ngữ pháp.
- **Luyện viết (`viet.html`, `viet-bai-hoc.html`):** Luyện viết theo chủ đề; FastAPI gọi Groq AI để nhận xét, phát hiện lỗi, sửa bài và chấm điểm.
- **Đăng ký tài khoản:** Frontend gửi dữ liệu tới `POST /api/auth/register` của FastAPI.
- **Đăng nhập:** Frontend gửi dữ liệu tới `POST /api/auth/login` và nhận JWT access token.
- **Lấy thông tin người dùng:** Backend cung cấp `GET /api/auth/me`.
- **Cập nhật trình độ:** Backend cung cấp `PUT /api/auth/level` để cập nhật trình độ A1 → C2.

---

## Cấu trúc project

```text
learn-english-web/
├── index.html                  → Trang chủ
├── login.html                  → Trang đăng nhập
├── signup.html                 → Trang đăng ký
│
├── pages/
│   ├── tu-vung.html            → Danh sách bài học từ vựng
│   ├── tu-vung-bai-hoc.html    → Nội dung bài học từ vựng
│   ├── nghe.html               → Danh sách bài luyện nghe
│   ├── nghe-bai-hoc.html       → Nội dung bài luyện nghe
│   ├── noi.html                → Danh sách bài luyện nói
│   ├── noi-bai-hoc.html        → Nội dung bài luyện nói
│   ├── viet.html               → Danh sách bài luyện viết
│   └── viet-bai-hoc.html       → Nội dung bài luyện viết
│
├── assets/
│   ├── css/                    → Các file giao diện CSS
│   └── js/
│       ├── auth.js             → Gọi FastAPI để đăng ký/đăng nhập và quản lý JWT
│       ├── tu-vung-bai-hoc.js  → Logic phần từ vựng
│       ├── nghe-bai-hoc.js     → Logic phần nghe
│       ├── noi-bai-hoc.js      → Logic phần nói
│       └── viet-bai-hoc.js     → Logic phần viết
│
├── backend/
│   ├── main.py                 → Entry point của FastAPI
│   ├── database.py             → Cấu hình kết nối SQLite/SQLAlchemy
│   ├── models.py               → Các model cơ sở dữ liệu
│   ├── schemas.py              → Pydantic schemas
│   ├── security.py             → Xử lý mật khẩu và JWT
│   ├── .env.example            → Mẫu cấu hình biến môi trường (không chứa API key thật)
│   ├── routes/
│   │   ├── auth.py             → API đăng ký, đăng nhập và thông tin người dùng
│   │   └── ai.py               → API trung gian gọi Groq AI cho Nói/Viết
│   ├── requirements.txt        → Các thư viện Python cần cài
│   ├── start_server.bat        → File hỗ trợ chạy backend trên Windows
│
└── README.md                   → Tài liệu project
```

---

## Hướng dẫn cài đặt và chạy dự án

Project cần chạy **cả backend FastAPI và frontend**.

### 1. Chạy backend FastAPI

Mở Terminal trong VS Code và chuyển vào thư mục backend:

```bash
cd backend
```

Cài các thư viện cần thiết:

```bash
pip install -r requirements.txt
```

Tạo file cấu hình AI từ file mẫu:

```text
backend/.env.example  →  sao chép thành  backend/.env
```

Sau đó mở `backend/.env`, thay `YOUR_GROQ_API_KEY` bằng **API key mới của bạn** và đổi `JWT_SECRET_KEY` thành một chuỗi bí mật dài. Không đưa file `.env` lên GitHub hoặc nộp kèm project.

Khởi động FastAPI:

```bash
uvicorn main:app --reload
```

Khi server chạy thành công:

- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

### 2. Chạy frontend

Khuyến nghị sử dụng extension **Live Server** trong VS Code:

1. Mở thư mục `learn-english-web` bằng VS Code.
2. Nhấp chuột phải vào `index.html`.
3. Chọn **Open with Live Server**.
4. Frontend thường chạy tại `http://127.0.0.1:5500`.

> Backend FastAPI cần được chạy song song để chức năng đăng ký và đăng nhập hoạt động.

---

## Hệ thống đăng nhập và đăng ký

Phần xác thực hiện tại đã được kết nối với **FastAPI backend**, không còn chỉ mô phỏng bằng `localStorage`.

Luồng hoạt động:

1. Người dùng nhập thông tin đăng ký hoặc đăng nhập trên frontend.
2. `assets/js/auth.js` gửi request tới FastAPI tại `http://127.0.0.1:8000`.
3. Backend kiểm tra dữ liệu bằng FastAPI và SQLAlchemy.
4. Mật khẩu được lưu dưới dạng đã băm, không lưu mật khẩu thuần trong database.
5. Khi đăng nhập thành công, backend trả về **JWT access token**.
6. Frontend lưu token và một số thông tin phiên trong `localStorage` để sử dụng cho các request cần xác thực.

### Các API hiện có

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/api/auth/register` | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập và nhận JWT token |
| `GET` | `/api/auth/me` | Lấy thông tin người dùng đang đăng nhập |
| `PUT` | `/api/auth/level` | Cập nhật trình độ A1 → C2 |
| `POST` | `/api/ai/speaking/check` | AI kiểm tra câu trả lời phần Nói |
| `POST` | `/api/ai/writing/check` | AI chấm và sửa phần Viết |

---

## Phần luyện nói

Trang luyện nói sử dụng **Web Speech API (`SpeechRecognition`)** của trình duyệt để nhận giọng nói từ micro và chuyển thành văn bản.

- Hoạt động tốt nhất trên Google Chrome hoặc Microsoft Edge.
- Trình duyệt sẽ yêu cầu cấp quyền sử dụng micro.
- Nhận diện giọng nói được xử lý ở phía frontend bằng Web Speech API.
- Câu trả lời sau đó được gửi tới `POST /api/ai/speaking/check` của FastAPI.
- FastAPI giữ `GROQ_API_KEY` ở backend và gọi dịch vụ AI, vì vậy API key không xuất hiện trong JavaScript phía trình duyệt.

---

## Cơ sở dữ liệu

Project hiện sử dụng **SQLite** thông qua **SQLAlchemy**.

FastAPI tự động tạo các bảng cần thiết khi backend khởi động thông qua:

```python
Base.metadata.create_all(bind=engine)
```

Khi backend chạy lần đầu, SQLite sẽ tự tạo file `backend/hoc_tu_dau.db`. File database cục bộ được bỏ khỏi bản nộp để tránh mang theo dữ liệu tài khoản thử nghiệm.

---

## Nội dung bài học mẫu

Project hiện có các nội dung học mẫu theo từng kỹ năng, bao gồm:

- Từ vựng
- Nghe
- Nói
- Viết

Các bài học và chủ đề khác có thể tiếp tục được mở rộng bằng cách bổ sung dữ liệu và nội dung trong các file HTML/JavaScript tương ứng.

---

## Kế hoạch phát triển tiếp theo

- [x] **Tích hợp backend FastAPI**.
- [x] **Đăng ký / đăng nhập bằng REST API**.
- [x] **Xác thực JWT**.
- [x] **Lưu tài khoản bằng SQLite + SQLAlchemy**.
- [x] **Tích hợp AI qua FastAPI:** kiểm tra phần Nói và chấm/sửa phần Viết.
- [ ] **Mở rộng thang điểm phần Nói:** bổ sung điểm Vocabulary và Fluency chi tiết.
- [ ] **Mở rộng nội dung:** A2, B1, B2, C1, C2 và thêm nhiều chủ đề.
- [ ] **Lưu tiến độ học tập:** điểm số, bài đã học, lịch sử học và streak.
- [ ] **Phát triển thêm API cho nội dung bài học và kết quả học tập**.

---

## Lưu ý bảo mật

- Không ghi API key trực tiếp trong file JavaScript.
- Không commit hoặc nộp file `backend/.env`.
- Không hard-code `GROQ_API_KEY` hoặc `JWT_SECRET_KEY` trong JavaScript/Python.
- Chỉ giữ `backend/.env.example` trong project để hướng dẫn cấu hình.
- Nếu một API key từng được đưa vào source code hoặc chia sẻ trong file ZIP, nên thu hồi key đó và tạo key mới trước khi tiếp tục sử dụng.

## Tóm tắt kiến trúc

```text
Frontend (HTML/CSS/JavaScript)
          |
          | fetch / REST API
          v
FastAPI Backend (Python)
       /          \
      v            v
SQLite Database   Groq AI API
   (SQLAlchemy)   (API key chỉ ở backend)
```

**Framework backend của project: FastAPI.**
