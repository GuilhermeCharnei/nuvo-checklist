@echo off
echo ========================================
echo   DEPLOY AUTOMATICO NA HOSTINGER
echo ========================================
echo.
echo Este script vai fazer o upload completo
echo.
echo Servidor: 167.88.41.25
echo Porta: 65002
echo Usuario: u201435955
echo Senha: Infonuvo25!
echo.
echo IMPORTANTE: Digite a senha quando solicitado!
echo.
pause

set SERVER=167.88.41.25
set PORT=65002
set USER=u201435955
set REMOTE_DIR=/home/u201435955/nuvo-checklist

echo [1/6] Criando diretorio remoto...
ssh -p %PORT% %USER%@%SERVER% "mkdir -p %REMOTE_DIR%/backend %REMOTE_DIR%/frontend %REMOTE_DIR%/deploy"

echo.
echo [2/6] Upload Backend...
scp -P %PORT% -r backend/* %USER%@%SERVER%:%REMOTE_DIR%/backend/

echo.
echo [3/6] Upload Frontend...
scp -P %PORT% -r frontend/* %USER%@%SERVER%:%REMOTE_DIR%/frontend/

echo.
echo [4/6] Upload Scripts de Deploy...
scp -P %PORT% -r deploy/* %USER%@%SERVER%:%REMOTE_DIR%/deploy/

echo.
echo [5/6] Upload Documentacao...
scp -P %PORT% README.md INSTALACAO.md GUIA_DE_USO.md COMECE_AQUI.md .gitignore %USER%@%SERVER%:%REMOTE_DIR%/

echo.
echo [6/6] Configurando permissoes...
ssh -p %PORT% %USER%@%SERVER% "cd %REMOTE_DIR% && chmod +x deploy/*.sh"

echo.
echo ========================================
echo   UPLOAD CONCLUIDO!
echo ========================================
echo.
echo Agora vamos conectar ao servidor e fazer o deploy...
echo.
pause

echo.
echo Conectando ao servidor...
echo.
echo Execute os seguintes comandos:
echo   cd %REMOTE_DIR%
echo   ./deploy/setup_server.sh
echo   ./deploy/deploy_all.sh
echo.

ssh -p %PORT% %USER%@%SERVER%
