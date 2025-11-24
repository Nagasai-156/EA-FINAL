@echo off
echo 🚀 Electronics Astra Backend Setup
echo ==================================

REM Start database
echo 📦 Starting PostgreSQL database...
docker-compose up -d

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak > nul

REM Install dependencies
echo 📥 Installing dependencies...
call npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run prisma:generate

REM Run migrations
echo 🗄️  Running database migrations...
call npm run prisma:migrate

echo.
echo ✅ Setup complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Server will be available at: http://localhost:4000
pause
