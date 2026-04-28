# Run script for Churn Prediction Project

Write-Host ">>> Starting Customer Churn Prediction Project..." -ForegroundColor Cyan

# 1. Start Backend
Write-Host "[1/2] Starting Backend (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python main.py" -WindowStyle Normal

# 2. Start Frontend
Write-Host "[2/2] Starting Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host ">>> Both servers are starting!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
