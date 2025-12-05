#!/bin/bash

#######################################
# Script de Deploy Completo
# Backend + Frontend + NGINX
#######################################

set -e

PROJECT_DIR="/var/www/nuvo-checklist"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "🚀 Iniciando deploy..."

# 1. Deploy Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Deploy Backend (Python)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $BACKEND_DIR

# Criar/ativar ambiente virtual
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

source venv/bin/activate

# Instalar dependências
echo "Instalando dependências Python..."
pip install --upgrade pip
pip install -r requirements.txt

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cat > .env << EOF
FLASK_ENV=production
SECRET_KEY=$(openssl rand -hex 32)
PORT=5000
DATABASE_URL=postgresql://nuvo_user:nuvo_password_2024@localhost/nuvo_checklist
UPLOAD_FOLDER=./uploads
FRONTEND_URL=https://seu-dominio.com
EOF
fi

# Criar pasta de uploads
mkdir -p uploads

# Inicializar banco de dados
echo "Inicializando banco de dados..."
python init_db.py

# Configurar Gunicorn como serviço
echo "Configurando Gunicorn..."
sudo tee /etc/systemd/system/nuvo-backend.service > /dev/null << EOF
[Unit]
Description=NUVO Checklist Backend (Gunicorn)
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin"
ExecStart=$BACKEND_DIR/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app

[Install]
WantedBy=multi-user.target
EOF

# Recarregar e iniciar serviço
sudo systemctl daemon-reload
sudo systemctl enable nuvo-backend
sudo systemctl restart nuvo-backend

echo "✅ Backend deploy concluído!"

# 2. Deploy Frontend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Deploy Frontend (Next.js)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $FRONTEND_DIR

# Criar .env.local
if [ ! -f ".env.local" ]; then
    echo "Criando .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api
EOF
fi

# Instalar dependências
echo "Instalando dependências Node.js..."
npm install

# Build de produção
echo "Buildando aplicação..."
npm run build

echo "✅ Frontend deploy concluído!"

# 3. Configurar NGINX
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Configurando NGINX"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sudo tee /etc/nginx/sites-available/nuvo-checklist > /dev/null << 'EOF'
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    client_max_body_size 50M;

    # Frontend (Next.js static)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/nuvo-checklist /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar NGINX
sudo systemctl reload nginx

echo "✅ NGINX configurado!"

# 4. Configurar Frontend como serviço
echo ""
echo "Configurando Next.js como serviço..."

sudo tee /etc/systemd/system/nuvo-frontend.service > /dev/null << EOF
[Unit]
Description=NUVO Checklist Frontend (Next.js)
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=$FRONTEND_DIR
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nuvo-frontend
sudo systemctl restart nuvo-frontend

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOY COMPLETO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Aplicação disponível em: http://seu-dominio.com"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs backend:  sudo journalctl -u nuvo-backend -f"
echo "  - Ver logs frontend: sudo journalctl -u nuvo-frontend -f"
echo "  - Restart backend:   sudo systemctl restart nuvo-backend"
echo "  - Restart frontend:  sudo systemctl restart nuvo-frontend"
echo "  - Status NGINX:      sudo systemctl status nginx"
echo ""
echo "🔒 Próximo passo: Configurar SSL com Let's Encrypt:"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com"
