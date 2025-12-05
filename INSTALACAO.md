# 📦 Guia de Instalação - NUVO Checklist

## 🎯 Opções de Instalação

### Opção 1: Desenvolvimento Local (Testar antes de deploy)
### Opção 2: Deploy na Hostinger Cloud (Produção)

---

## 🖥️ OPÇÃO 1: Desenvolvimento Local

### Pré-requisitos
- Python 3.10+ instalado
- Node.js 18+ instalado
- PostgreSQL ou SQLite

### Passo 1: Backend (Python)

```bash
# Navegar para pasta do backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac

# Editar .env e configurar (pode deixar padrão para desenvolvimento)

# Inicializar banco de dados
python init_db.py

# Rodar servidor
python app.py
```

Backend estará rodando em: http://localhost:5000

### Passo 2: Frontend (React/Next.js)

```bash
# Nova janela do terminal
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
copy .env.example .env.local  # Windows
# ou
cp .env.example .env.local    # Linux/Mac

# Editar .env.local (pode deixar padrão)

# Rodar servidor de desenvolvimento
npm run dev
```

Frontend estará rodando em: http://localhost:3000

### Passo 3: Testar

1. Abra http://localhost:3000 no navegador
2. Clique em "Upload PDF"
3. Faça upload de um dos PDFs de exemplo
4. Navegue pelos clientes e ambientes
5. Marque checkboxes para testar funcionalidades

---

## 🌐 OPÇÃO 2: Deploy na Hostinger Cloud

### Pré-requisitos
- Servidor Hostinger Cloud
- Acesso SSH
- Domínio configurado (opcional mas recomendado)

### Passo 1: Conectar ao Servidor

```bash
ssh -p 65002 u201435955@167.88.41.25
```

### Passo 2: Clonar o Projeto

```bash
cd /var/www
sudo mkdir nuvo-checklist
sudo chown -R $USER:$USER nuvo-checklist
cd nuvo-checklist

# Opção A: Via Git (se você fez commit)
git clone https://github.com/seu-usuario/nuvo-checklist.git .

# Opção B: Via Upload (SCP/FTP)
# Faça upload de todos os arquivos para /var/www/nuvo-checklist
```

### Passo 3: Setup Inicial do Servidor (Apenas 1ª vez)

```bash
cd /var/www/nuvo-checklist
chmod +x deploy/setup_server.sh
./deploy/setup_server.sh
```

Este script irá:
- ✅ Atualizar sistema
- ✅ Instalar Python, Node.js, PostgreSQL, NGINX
- ✅ Criar banco de dados
- ✅ Configurar firewall

### Passo 4: Deploy da Aplicação

```bash
chmod +x deploy/deploy_all.sh
./deploy/deploy_all.sh
```

Este script irá:
- ✅ Instalar dependências do backend
- ✅ Inicializar banco de dados
- ✅ Configurar Gunicorn
- ✅ Build do frontend
- ✅ Configurar NGINX
- ✅ Criar serviços systemd

### Passo 5: Configurar Domínio

Edite o arquivo de configuração do NGINX:

```bash
sudo nano /etc/nginx/sites-available/nuvo-checklist
```

Substitua `seu-dominio.com` pelo seu domínio real.

Recarregue o NGINX:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Passo 6: Configurar SSL (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções na tela.

### Passo 7: Verificar Status

```bash
# Status do backend
sudo systemctl status nuvo-backend

# Status do frontend
sudo systemctl status nuvo-frontend

# Status do NGINX
sudo systemctl status nginx

# Ver logs
sudo journalctl -u nuvo-backend -f
sudo journalctl -u nuvo-frontend -f
```

---

## 🔧 Comandos Úteis

### Desenvolvimento Local

```bash
# Backend
cd backend
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
python app.py

# Frontend
cd frontend
npm run dev
```

### Produção (Hostinger)

```bash
# Restart serviços
sudo systemctl restart nuvo-backend
sudo systemctl restart nuvo-frontend
sudo systemctl reload nginx

# Ver logs em tempo real
sudo journalctl -u nuvo-backend -f
sudo journalctl -u nuvo-frontend -f
tail -f /var/log/nginx/error.log

# Atualizar código
cd /var/www/nuvo-checklist
git pull
./deploy/deploy_all.sh

# Backup do banco de dados
pg_dump nuvo_checklist > backup_$(date +%Y%m%d).sql
```

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Ver logs
sudo journalctl -u nuvo-backend -n 50

# Verificar se porta 5000 está livre
sudo lsof -i :5000

# Testar manualmente
cd /var/www/nuvo-checklist/backend
source venv/bin/activate
python app.py
```

### Frontend não inicia

```bash
# Ver logs
sudo journalctl -u nuvo-frontend -n 50

# Verificar se porta 3000 está livre
sudo lsof -i :3000

# Rebuild
cd /var/www/nuvo-checklist/frontend
npm run build
npm start
```

### NGINX erro 502 Bad Gateway

```bash
# Verificar se backend está rodando
sudo systemctl status nuvo-backend

# Verificar logs
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t
```

### Upload de PDF não funciona

```bash
# Verificar permissões da pasta uploads
cd /var/www/nuvo-checklist/backend
ls -la uploads/
chmod 755 uploads/

# Verificar tamanho máximo no NGINX
sudo nano /etc/nginx/sites-available/nuvo-checklist
# Adicionar: client_max_body_size 50M;
```

---

## 📞 Suporte

Para problemas técnicos:
1. Verifique os logs
2. Consulte a documentação
3. Entre em contato com o desenvolvedor

---

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
cd /var/www/nuvo-checklist
git pull
./deploy/deploy_all.sh
```

---

## 🎉 Pronto!

Sua aplicação está rodando!

- **Frontend**: http://seu-dominio.com (ou http://localhost:3000 local)
- **Backend API**: http://seu-dominio.com/api (ou http://localhost:5000/api local)
