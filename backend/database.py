from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite lưu tại: backend/hoc_tu_dau.db
DATABASE_URL = "sqlite:///./hoc_tu_dau.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # cần cho SQLite + FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tất cả model kế thừa Base này để SQLAlchemy tự tạo bảng
Base = declarative_base()


# ── Dependency: cấp 1 session DB mỗi request, tự đóng sau khi xong ──
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
