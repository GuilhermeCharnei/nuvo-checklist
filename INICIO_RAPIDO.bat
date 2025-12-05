@echo off
echo ========================================
echo    NUVO Checklist - Inicio Rapido
echo ========================================
echo.

REM Verificar se esta na pasta correta
if not exist "backend\" (
    echo ERRO: Execute este script na pasta raiz do projeto!
    pause
    exit /b 1
)

echo Escolha uma opcao:
echo.
echo 1. Instalar e Rodar Backend (Python)
echo 2. Instalar e Rodar Frontend (Node.js)
echo 3. Instalar TUDO (Backend + Frontend)
echo 4. Apenas Rodar (ja instalado)
echo 5. Sair
echo.

set /p opcao="Digite o numero da opcao: "

if "%opcao%"=="1" goto backend
if "%opcao%"=="2" goto frontend
if "%opcao%"=="3" goto tudo
if "%opcao%"=="4" goto rodar
if "%opcao%"=="5" goto fim

:backend
echo.
echo ========================================
echo Instalando Backend...
echo ========================================
cd backend

REM Criar ambiente virtual se nao existir
if not exist "venv\" (
    echo Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
call venv\Scripts\activate

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt

REM Criar .env se nao existir
if not exist ".env" (
    echo Criando arquivo .env...
    copy .env.example .env
)

REM Inicializar banco de dados
echo Inicializando banco de dados...
python init_db.py

echo.
echo Backend instalado com sucesso!
echo.
echo Para rodar o backend, execute:
echo   cd backend
echo   venv\Scripts\activate
echo   python app.py
echo.
pause
goto fim

:frontend
echo.
echo ========================================
echo Instalando Frontend...
echo ========================================
cd frontend

REM Instalar dependencias
echo Instalando dependencias...
call npm install

REM Criar .env.local se nao existir
if not exist ".env.local" (
    echo Criando arquivo .env.local...
    copy .env.example .env.local
)

echo.
echo Frontend instalado com sucesso!
echo.
echo Para rodar o frontend, execute:
echo   cd frontend
echo   npm run dev
echo.
pause
goto fim

:tudo
echo.
echo ========================================
echo Instalando TUDO...
echo ========================================

REM Backend
echo.
echo [1/2] Instalando Backend...
cd backend
if not exist "venv\" python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if not exist ".env" copy .env.example .env
python init_db.py
cd ..

REM Frontend
echo.
echo [2/2] Instalando Frontend...
cd frontend
call npm install
if not exist ".env.local" copy .env.example .env.local
cd ..

echo.
echo ========================================
echo Tudo instalado com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Abra um terminal e execute:
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 2. Abra OUTRO terminal e execute:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Acesse: http://localhost:3000
echo.
pause
goto fim

:rodar
echo.
echo ========================================
echo Rodando Backend e Frontend...
echo ========================================
echo.
echo IMPORTANTE: Este script vai abrir 2 janelas
echo - Backend (Python) - Porta 5000
echo - Frontend (Node.js) - Porta 3000
echo.
pause

REM Backend
start "NUVO Backend" cmd /k "cd backend && venv\Scripts\activate && python app.py"

REM Aguardar 3 segundos
timeout /t 3 /nobreak

REM Frontend
start "NUVO Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servicos iniciados!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Acesse o frontend no navegador!
echo.
pause
goto fim

:fim
exit /b 0
