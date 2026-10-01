# backend/schemas.py
# ─────────────────────────────────────────────────────────
# Pydantic schemas — định nghĩa dữ liệu vào/ra cho API.
# FastAPI tự validate và generate docs (Swagger) từ đây.
# ─────────────────────────────────────────────────────────

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# ── Dữ liệu người dùng GỬI LÊN khi ĐĂNG KÝ ──────────────
class RegisterRequest(BaseModel):
    name: str     = Field(..., min_length=1, max_length=100, example="Nguyễn Văn A")
    email: EmailStr                                          # tự validate định dạng email
    password: str = Field(..., min_length=6, example="matkhau123")


# ── Dữ liệu người dùng GỬI LÊN khi ĐĂNG NHẬP ────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


# ── Dữ liệu SERVER TRẢ VỀ sau khi đăng nhập / đăng ký ───
class TokenResponse(BaseModel):
    access_token: str           # JWT token — lưu vào localStorage phía client
    token_type: str = "bearer"
    user_name: str              # tên hiển thị trên nav
    user_email: str
    user_level: str             # A1 / A2 / B1 ...


# ── Dữ liệu thông tin user (trả về khi /me) ──────────────
class UserInfo(BaseModel):
    id: int
    name: str
    email: str
    level: str

    class Config:
        from_attributes = True   # cho phép đọc từ SQLAlchemy ORM object


# ── Cập nhật trình độ ─────────────────────────────────────
class LevelUpdate(BaseModel):
    level: str = Field(..., pattern="^(A1|A2|B1|B2|C1|C2)$")
