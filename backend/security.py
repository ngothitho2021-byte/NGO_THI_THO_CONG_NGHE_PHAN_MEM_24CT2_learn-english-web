# backend/security.py
# ─────────────────────────────────────────────────────────
# Xử lý bảo mật: băm mật khẩu (bcrypt) và tạo/xác thực JWT.
# ─────────────────────────────────────────────────────────

from datetime import datetime, timedelta, timezone
from typing import Optional
import os

from jose import JWTError, jwt
import bcrypt as _bcrypt
from dotenv import load_dotenv

load_dotenv()


# ── Cấu hình JWT ─────────────────────────────────────────
# ⚠️ Thay SECRET_KEY bằng một chuỗi ngẫu nhiên dài khi đưa lên production!
# Sinh bằng: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY  = os.getenv("JWT_SECRET_KEY", "dev-only-change-me")
ALGORITHM   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7   # token hết hạn sau 7 ngày


# ── Hàm băm mật khẩu ─────────────────────────────────────
def hash_password(plain_password: str) -> str:
    """Nhận mật khẩu thô → trả về chuỗi bcrypt hash để lưu vào DB."""
    hashed = _bcrypt.hashpw(plain_password.encode("utf-8"), _bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu thô với hash trong DB. Trả về True nếu khớp."""
    return _bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


# ── Hàm tạo JWT token ────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Tạo JWT chứa thông tin user (email, ...).
    Token này sẽ được gửi về client → lưu localStorage → gửi kèm mỗi request.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ── Hàm xác thực JWT token ───────────────────────────────
def decode_token(token: str) -> Optional[str]:
    """
    Giải mã JWT, trả về email của user nếu token hợp lệ.
    Trả về None nếu token hết hạn hoặc bị giả mạo.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        return email
    except JWTError:
        return None
