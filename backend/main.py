# backend/main.py
# ─────────────────────────────────────────────────────────
# Đây là entry point của ứng dụng FastAPI.
# Chạy bằng lệnh: uvicorn main:app --reload
# ─────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.auth import router as auth_router
from routes.ai import router as ai_router

# ── Tự động tạo bảng trong SQLite khi khởi động ──────────
# Nếu bảng đã có thì bỏ qua, không xóa dữ liệu.
Base.metadata.create_all(bind=engine)

# ── Khởi tạo ứng dụng FastAPI ────────────────────────────
app = FastAPI(
    title="Học Từ Đầu API",
    description="""
## API backend cho trang web học tiếng Anh **Học Từ Đầu**

### Các tính năng:
- 🔐 Đăng ký / Đăng nhập với JWT Authentication
- 👤 Quản lý thông tin tài khoản
- 📊 Lưu trình độ học (A1 → C2)
- 🤖 AI hỗ trợ kiểm tra phần Nói và Viết qua backend

### Cách dùng Swagger UI:
1. Gọi `POST /api/auth/register` hoặc `POST /api/auth/login`
2. Copy `access_token` từ response
3. Click nút **Authorize 🔒** ở trên → dán token vào
4. Giờ có thể gọi các endpoint cần xác thực
    """,
    version="1.0.0",
)

# ── CORS: cho phép frontend (HTML) gọi API ───────────────
# Khi chạy Live Server ở port 5500, frontend origin là http://127.0.0.1:5500
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",    # VS Code Live Server
        "http://localhost:5500",
        "http://localhost:3000",     # nếu dùng port khác
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],            # Authorization, Content-Type, ...
)

# ── Đăng ký các router ───────────────────────────────────
app.include_router(auth_router)
app.include_router(ai_router)

# ── Health check endpoint ─────────────────────────────────
@app.get("/", tags=["Root"])
def read_root():
    """Kiểm tra server có đang chạy không."""
    return {
        "message": "✅ Học Từ Đầu API đang chạy!",
        "docs": "http://127.0.0.1:8000/docs",
        "version": "1.0.0"
    }
