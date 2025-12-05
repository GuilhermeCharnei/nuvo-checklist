#!/bin/bash

#######################################
# Script de Setup Inicial do Servidor
# Hostinger Cloud Setup
#######################################

set -e

echo "🚀 Iniciando setup do servidor..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
echo "📦 Instalando dependências..."
sudo apt install -y \
    python3.10 \
    python3-pip \
    python3-venv \
    postgresql \
    postgresql-contrib \
    nginx \
    git \
    poppler-utils \
    curl

# Instalar Node.js 18.x
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalações
echo "✓ Python: $(python3 --version)"
echo "✓ Node.js: $(node --version)"
echo "✓ npm: $(npm --version)"
echo "✓ PostgreSQL: $(psql --version)"

# Criar banco de dados PostgreSQL
echo "🗄️ Configurando PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE nuvo_checklist;"
sudo -u postgres psql -c "CREATE USER nuvo_user WITH PASSWORD 'nuvo_password_2024';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nuvo_checklist TO nuvo_user;"

# Criar estrutura de diretórios
echo "📁 Criando estrutura de diretórios..."
sudo mkdir -p /var/www/nuvo-checklist
sudo chown -R $USER:$USER /var/www/nuvo-checklist

# Configurar firewall (se necessário)
echo "🔒 Configurando firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 65002/tcp  # Porta SSH customizada
sudo ufw --force enable

echo "✅ Setup inicial concluído!"
echo ""
echo "Próximos passos:"
echo "1. Clone o repositório em /var/www/nuvo-checklist"
echo "2. Execute ./deploy/deploy_all.sh"
