@echo off
:: System Node.js is now used
echo 🚀 Starting AI Interview Application...

:: Start Backend in a new window
echo 📡 Starting Backend on port 5001...
start "AI Interview Backend" cmd /k "cd Backened && npm run dev"

:: Wait a few seconds for backend to initialize
ping 127.0.0.1 -n 4 > nul

:: Start Frontend in a new window
echo 💻 Starting Frontend...
start "AI Interview Frontend" cmd /k "cd Frontened\interview && npm start"

echo.
echo ✅ Startup commands sent. Check the new terminal windows for logs.
echo.
