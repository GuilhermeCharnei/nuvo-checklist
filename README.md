# NUVO Checklist - Sistema de Gerenciamento de Produção

Sistema completo para gerenciar checklists de montagem de móveis/gabinetes a partir de PDFs.

## 🎯 Funcionalidades

- Upload e processamento automático de PDFs
- Categorização automática de peças (Gabinetes, Especiais, Avulsas)
- Sistema de checkboxes (Montado → Portas → Embarcado)
- Interface mobile-first
- Múltiplos clientes e ambientes
- Tracking de progresso em tempo real
- Sistema de arquivamento

## 🏗️ Arquitetura

```
Backend: Python (Flask) + PostgreSQL
Frontend: Next.js (React) + TailwindCSS
Deploy: Hostinger Cloud + NGINX
```

## 📦 Estrutura do Projeto

```
nuvo-checklist/
├── backend/          # API Python (Flask)
├── frontend/         # Interface React (Next.js)
├── deploy/           # Scripts de deploy
└── docs/             # Documentação
```

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

### Deploy na Hostinger

```bash
# 1. Conectar via SSH
ssh -p 65002 u201435955@167.88.41.25

# 2. Setup inicial (primeira vez apenas)
bash deploy/setup_server.sh

# 3. Deploy
bash deploy/deploy_all.sh
```

## 🔧 Configuração

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/nuvo_checklist
UPLOAD_FOLDER=./uploads
SECRET_KEY=your-secret-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📱 Tecnologias

**Backend:**
- Flask 3.0
- SQLAlchemy
- pdfplumber (PDF parsing)
- pdf2image + Pillow (detecção de cores)
- PostgreSQL

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Axios

**Deploy:**
- NGINX (reverse proxy + static files)
- Gunicorn (WSGI server)
- SSL/HTTPS (Let's Encrypt)

## 📝 Workflow

1. **Upload PDF** → Sistema processa automaticamente
2. **Identifica Cliente** → Cria/atualiza cliente
3. **Categoriza Peças** → Gabinetes (azul), Especiais (amarelo @), Avulsas
4. **Extrai Materiais** → Legs e Hinges
5. **Interface** → Checkboxes para tracking
6. **Progresso** → Atualização em tempo real
7. **Embarque** → Quando tudo marcado
8. **Arquivo** → Finaliza projeto

## 🎨 Categorização de Peças

| Tipo | Identificação | Cor no PDF |
|------|---------------|------------|
| Gabinetes | Sem @ | Azul |
| Peças Especiais | Com @ | Amarelo |
| Peças Avulsas | Sem cor | Branco |

## 🔐 Segurança

- Autenticação JWT
- Validação de uploads
- Sanitização de inputs
- HTTPS obrigatório em produção

## 📄 Licença

Propriedade de NUVO - Todos os direitos reservados
# Deploy trigger
