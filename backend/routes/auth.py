# backend/routes/auth.py
# ─────────────────────────────────────────────────────────
# Các API endpoint cho Đăng ký / Đăng nhập / Thông tin user.
# Mỗi @router.post / @router.get là 1 endpoint.
# ─────────────────────────────────────────────────────────

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

# import từ các module cùng cấp
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import get_db
from models   import User
from schemas  import RegisterRequest, LoginRequest, TokenResponse, UserInfo, LevelUpdate
from security import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])
bearer_scheme = HTTPBearer()          # đọc token từ header: Authorization: Bearer <token>


# ── Hàm phụ: lấy user hiện tại từ JWT token ─────────────
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency được inject vào bất kỳ endpoint nào cần xác thực.
    FastAPI tự động gọi hàm này và truyền kết quả vào endpoint.
    """
    token = credentials.credentials
    email = decode_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản.")
    return user


# ═══════════════════════════════════════════════════════
# POST /api/auth/register  — Đăng ký tài khoản mới
# ═══════════════════════════════════════════════════════
@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    """
    Nhận: { name, email, password }
    Trả về: JWT token + thông tin user (nếu đăng ký thành công)
    Lỗi 400: email đã tồn tại
    """
    # Kiểm tra email đã tồn tại chưa
    existing = db.query(User).filter(User.email == body.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email này đã có tài khoản. Hãy đăng nhập thay vì đăng ký."
        )

    # Tạo user mới với mật khẩu đã được băm
    new_user = User(
        name=body.name,
        email=body.email.lower(),
        hashed_password=hash_password(body.password),
        level="A1"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)   # đọc lại từ DB để lấy id, created_at

    # Tạo JWT token chứa email của user
    token = create_access_token(data={"sub": new_user.email})

    return TokenResponse(
        access_token=token,
        user_name=new_user.name,
        user_email=new_user.email,
        user_level=new_user.level
    )


# ═══════════════════════════════════════════════════════
# POST /api/auth/login  — Đăng nhập
# ═══════════════════════════════════════════════════════
@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """
    Nhận: { email, password }
    Trả về: JWT token + thông tin user
    Lỗi 401: email không tồn tại hoặc sai mật khẩu
    """
    user = db.query(User).filter(User.email == body.email.lower()).first()

    # Không phân biệt "email không tồn tại" hay "sai mật khẩu"
    # để tránh bị khai thác dò email
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng."
        )

    token = create_access_token(data={"sub": user.email})

    return TokenResponse(
        access_token=token,
        user_name=user.name,
        user_email=user.email,
        user_level=user.level
    )


# ═══════════════════════════════════════════════════════
# GET /api/auth/me  — Lấy thông tin user đang đăng nhập
# ═══════════════════════════════════════════════════════
@router.get("/me", response_model=UserInfo)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Endpoint được bảo vệ bởi JWT.
    Gọi kèm header: Authorization: Bearer <token>
    """
    return current_user


# ═══════════════════════════════════════════════════════
# PUT /api/auth/level  — Cập nhật trình độ người học
# ═══════════════════════════════════════════════════════
@router.put("/level", response_model=UserInfo)
def update_level(
    body: LevelUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cập nhật trình độ (A1→C2) cho user đang đăng nhập."""
    current_user.level = body.level
    db.commit()
    db.refresh(current_user)
    return current_user
