# backend/models.py
# ─────────────────────────────────────────────────────────
# Định nghĩa các bảng trong database bằng SQLAlchemy ORM.
# Mỗi class Python = 1 bảng trong SQLite.
# ─────────────────────────────────────────────────────────

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """
    Bảng `users` — lưu thông tin tài khoản người học.

    Cột:
        id       : Khóa chính, tự tăng
        name     : Họ tên hiển thị
        email    : Email (duy nhất, dùng để đăng nhập)
        hashed_password : Mật khẩu đã băm bcrypt (KHÔNG lưu raw)
        level    : Trình độ tiếng Anh (A1, A2, B1, B2, C1, C2)
        created_at : Thời điểm tạo tài khoản
    """
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String(100), nullable=False)
    email           = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    level           = Column(String(10), default="A1")          # trình độ mặc định A1
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
