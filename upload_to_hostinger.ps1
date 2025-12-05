# Script PowerShell para Upload Automático na Hostinger
# Execute com: powershell -ExecutionPolicy Bypass -File upload_to_hostinger.ps1

$SERVER = "167.88.41.25"
$PORT = "65002"
$USER = "u201435955"
$REMOTE_DIR = "/home/u201435955/nuvo-checklist"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  UPLOAD PARA HOSTINGER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
if (-not (Test-Path "backend")) {
    Write-Host "ERRO: Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "Conectando ao servidor..." -ForegroundColor Yellow
Write-Host "Servidor: $SERVER" -ForegroundColor Gray
Write-Host "Porta: $PORT" -ForegroundColor Gray
Write-Host "Usuario: $USER" -ForegroundColor Gray
Write-Host ""

# Opção 1: Usar SCP (requer senha manual)
Write-Host "Fazendo upload dos arquivos..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANTE: Você precisará digitar a senha quando solicitado" -ForegroundColor Green
Write-Host "Senha: Infonuvo25!" -ForegroundColor Green
Write-Host ""

# Criar diretório remoto
Write-Host "[1/3] Criando diretório remoto..." -ForegroundColor Cyan
ssh -p $PORT ${USER}@${SERVER} "mkdir -p $REMOTE_DIR"

# Upload backend
Write-Host "[2/3] Upload backend..." -ForegroundColor Cyan
scp -P $PORT -r backend ${USER}@${SERVER}:${REMOTE_DIR}/

# Upload frontend
Write-Host "[3/3] Upload frontend..." -ForegroundColor Cyan
scp -P $PORT -r frontend ${USER}@${SERVER}:${REMOTE_DIR}/

# Upload deploy scripts
Write-Host "[4/5] Upload scripts de deploy..." -ForegroundColor Cyan
scp -P $PORT -r deploy ${USER}@${SERVER}:${REMOTE_DIR}/

# Upload documentação
Write-Host "[5/5] Upload documentação..." -ForegroundColor Cyan
scp -P $PORT README.md INSTALACAO.md GUIA_DE_USO.md .gitignore ${USER}@${SERVER}:${REMOTE_DIR}/

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  UPLOAD CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Conecte ao servidor:" -ForegroundColor White
Write-Host "   ssh -p $PORT ${USER}@${SERVER}" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Execute o setup:" -ForegroundColor White
Write-Host "   cd $REMOTE_DIR" -ForegroundColor Gray
Write-Host "   chmod +x deploy/setup_server.sh" -ForegroundColor Gray
Write-Host "   ./deploy/setup_server.sh" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Faça o deploy:" -ForegroundColor White
Write-Host "   chmod +x deploy/deploy_all.sh" -ForegroundColor Gray
Write-Host "   ./deploy/deploy_all.sh" -ForegroundColor Gray
Write-Host ""

pause
