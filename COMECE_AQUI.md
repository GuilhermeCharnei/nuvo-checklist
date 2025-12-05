# 🚀 COMECE AQUI - NUVO Checklist

## 📁 O que foi criado?

✅ **Sistema completo de gerenciamento de checklists de produção**

### Estrutura do Projeto:

```
CHECKLIST/
├── backend/                 # Backend Python (Flask)
│   ├── app.py              # Aplicação principal
│   ├── models.py           # Modelos do banco de dados
│   ├── pdf_parser.py       # Parser de PDF com detecção de cores
│   ├── init_db.py          # Script de inicialização do BD
│   ├── requirements.txt    # Dependências Python
│   └── .env.example        # Exemplo de configuração
│
├── frontend/               # Frontend React/Next.js
│   ├── app/
│   │   ├── page.jsx       # Tela inicial (lista clientes)
│   │   ├── client/[id]/   # Detalhes do cliente
│   │   ├── archive/       # Clientes arquivados
│   │   └── components/    # Componentes reutilizáveis
│   ├── package.json
│   └── .env.example
│
├── deploy/                # Scripts de deploy
│   ├── setup_server.sh   # Setup inicial do servidor
│   └── deploy_all.sh     # Deploy completo
│
├── README.md             # Documentação principal
├── INSTALACAO.md         # Guia de instalação
├── GUIA_DE_USO.md        # Manual do usuário
└── .gitignore
```

---

## 🎯 Próximos Passos

### Opção 1: Testar Localmente (RECOMENDADO PRIMEIRO!)

```bash
# 1. Backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# ou: source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
copy .env.example .env
python init_db.py
python app.py

# 2. Frontend (nova janela)
cd frontend
npm install
copy .env.example .env.local
npm run dev

# 3. Abrir navegador
http://localhost:3000
```

**Teste:**
- Upload de um PDF
- Navegue pelos clientes
- Marque checkboxes
- Veja o progresso atualizar

---

### Opção 2: Deploy na Hostinger (Após testar)

```bash
# 1. Conectar ao servidor
ssh -p 65002 u201435955@167.88.41.25

# 2. Fazer upload dos arquivos
# Via SCP, FTP ou Git

# 3. Setup inicial (apenas 1ª vez)
cd /var/www/nuvo-checklist
chmod +x deploy/setup_server.sh
./deploy/setup_server.sh

# 4. Deploy
chmod +x deploy/deploy_all.sh
./deploy/deploy_all.sh

# 5. Configurar domínio no NGINX
sudo nano /etc/nginx/sites-available/nuvo-checklist
# Substituir "seu-dominio.com"

# 6. SSL (opcional mas recomendado)
sudo certbot --nginx -d seu-dominio.com
```

---

## 📚 Documentação Disponível

| Arquivo | Conteúdo |
|---------|----------|
| **README.md** | Visão geral do projeto, arquitetura, tecnologias |
| **INSTALACAO.md** | Guia completo de instalação (local + produção) |
| **GUIA_DE_USO.md** | Manual do usuário, como usar a aplicação |
| **COMECE_AQUI.md** | Este arquivo - ponto de partida |

---

## ✨ Funcionalidades Implementadas

### Upload e Processamento
- ✅ Upload de PDF
- ✅ Detecção automática de cores (azul/amarelo)
- ✅ Identificação de cliente
- ✅ Categorização de peças (gabinetes/especiais/avulsas)
- ✅ Extração de materiais (legs/hinges)

### Interface
- ✅ Mobile-first design
- ✅ Lista de clientes com progresso
- ✅ Detalhes do cliente
- ✅ Resumo geral com estatísticas
- ✅ Abas por ambiente
- ✅ Sistema de checkboxes (Montado → Portas → Embarcado)
- ✅ Checkpoints customizados
- ✅ Sistema de arquivamento

### Backend
- ✅ API REST completa
- ✅ Banco de dados (PostgreSQL/SQLite)
- ✅ Parser de PDF robusto
- ✅ Salvamento automático

---

## 🔧 Tecnologias Utilizadas

**Backend:**
- Python 3.10+
- Flask (framework web)
- SQLAlchemy (ORM)
- pdfplumber (parsing de PDF)
- pdf2image + Pillow (detecção de cores)
- PostgreSQL (produção) / SQLite (desenvolvimento)

**Frontend:**
- Next.js 14 (React framework)
- TailwindCSS (estilização)
- Axios (HTTP client)

**Deploy:**
- NGINX (reverse proxy + static files)
- Gunicorn (WSGI server Python)
- systemd (serviços)

---

## 🎓 Como o Sistema Funciona

### 1. Upload de PDF
```
Usuário → Upload PDF → Backend recebe
                          ↓
                    pdf_parser.py
                    - Extrai texto
                    - Converte em imagem
                    - Detecta cores
                    - Identifica cliente
                    - Categoriza peças
                          ↓
                    Salva no Banco de Dados
```

### 2. Exibição
```
Frontend → Requisita dados → Backend (API)
    ↓                             ↓
Renderiza                   Busca no BD
Componentes                 Retorna JSON
    ↓
Usuário vê interface
```

### 3. Checkboxes
```
Usuário marca → Frontend → API PUT /pieces/{id}/progress
                             ↓
                      Atualiza BD
                             ↓
                      Retorna sucesso
                             ↓
                   Frontend atualiza UI
```

---

## 🎯 Categorização de Peças (Como Funciona)

O sistema usa **análise de cores do PDF**:

### Algoritmo:

1. **Converte PDF em imagem** (pdf2image)
2. **Divide imagem em linhas** (~50 linhas por página)
3. **Para cada linha:**
   - Extrai pixels da região
   - Conta pixels azuis (RGB: alto B, baixo R/G)
   - Conta pixels amarelos (RGB: alto R/G, baixo B)
   - Se >20% azul → `color = 'blue'`
   - Se >20% amarelo → `color = 'yellow'`
   - Senão → `color = 'none'`
4. **Categoriza peça:**
   - `blue` sem `@` → **Gabinete**
   - `yellow` com `@` → **Peça Especial**
   - `none` → **Peça Avulsa**

---

## 🐛 Resolução de Problemas

### Erro ao instalar dependências Python

```bash
# Atualizar pip
pip install --upgrade pip

# Instalar dependências do sistema (Linux)
sudo apt install python3-dev libpq-dev poppler-utils
```

### Erro ao instalar dependências Node.js

```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules
npm install
```

### PDF não está sendo processado corretamente

1. **Verifique o formato:** Deve ser PDF real, não digitalização
2. **Cores:** Verifique se cores estão corretas no PDF
3. **Logs:** Veja logs do backend para detalhes

```bash
# Ver logs
python app.py  # Modo debug
```

### CORS Error no frontend

```bash
# Verifique se backend está rodando
# Verifique FRONTEND_URL no backend/.env
# Deve ser: http://localhost:3000 (desenvolvimento)
```

---

## 📈 Melhorias Futuras (Sugestões)

- [ ] Autenticação de usuários
- [ ] Exportação para Excel/PDF
- [ ] Notificações em tempo real
- [ ] Dashboard com gráficos
- [ ] Histórico de alterações
- [ ] Comentários em peças
- [ ] Fotos/anexos por peça
- [ ] App mobile nativo
- [ ] Integração com ERP
- [ ] Relatórios customizados

---

## 🤝 Contribuindo

Para adicionar funcionalidades:

1. **Backend:** Edite `backend/app.py` e `backend/models.py`
2. **Frontend:** Crie componentes em `frontend/app/components/`
3. **Teste localmente** antes de fazer deploy
4. **Documente** suas alterações

---

## 📞 Contato

**Desenvolvido para:** NUVO
**Data:** Dezembro 2024

---

## ✅ Checklist de Deployment

Antes de colocar em produção:

- [ ] Testou localmente
- [ ] Configurou variáveis de ambiente (.env)
- [ ] Alterou SECRET_KEY do Flask
- [ ] Configurou banco de dados PostgreSQL
- [ ] Configurou domínio no NGINX
- [ ] Ativou SSL/HTTPS
- [ ] Testou upload de PDF
- [ ] Testou checkboxes
- [ ] Verificou logs sem erros
- [ ] Criou backup do banco de dados
- [ ] Documentou URL e credenciais

---

## 🎉 Conclusão

Você tem um sistema completo e funcional!

**Para começar agora:**

1. Leia INSTALACAO.md
2. Teste localmente
3. Faça deploy na Hostinger
4. Treine a equipe com GUIA_DE_USO.md

**Boa sorte! 🚀**
