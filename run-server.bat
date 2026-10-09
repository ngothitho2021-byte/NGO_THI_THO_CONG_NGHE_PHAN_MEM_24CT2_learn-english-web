@echo off

cd /d "C:\Users\Admin\24CT2_NGO_THI_THO\web hoc ngoai ngu\learn-english-web\backend"

start "Hoc Tu Dau - FastAPI" cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8000"

exit