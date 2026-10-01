@echo off
echo ================================================
echo  HOC TU DAU - Khoi dong Backend FastAPI
echo ================================================
echo.

REM Kiem tra Python da cai chua
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Python chua duoc cai dat!
    echo Tai tai: https://www.python.org/downloads/
    pause
    exit /b 1
)

cd /d "%~dp0"

REM Nhac cau hinh bien moi truong cho AI/JWT
if not exist ".env" (
    echo [CANH BAO] Chua co file backend\.env
    echo Hay copy .env.example thanh .env va dien GROQ_API_KEY moi truoc khi dung tinh nang AI.
    echo.
)

REM Tao virtual environment neu chua co
if not exist "venv" (
    echo [1/3] Tao virtual environment...
    python -m venv venv
)

REM Kich hoat venv
echo [2/3] Kich hoat virtual environment...
call venv\Scripts\activate.bat

REM Cai thu vien
echo [3/3] Cai dat thu vien (requirements.txt)...
pip install -r requirements.txt -q

echo.
echo ================================================
echo  Server dang khoi dong tai: http://127.0.0.1:8000
echo  Swagger UI (tai lieu API): http://127.0.0.1:8000/docs
echo.
echo  Nhan Ctrl+C de dung server
echo ================================================
echo.

REM Chay FastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 8000

pause
