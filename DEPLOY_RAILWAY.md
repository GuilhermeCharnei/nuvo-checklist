# 🚀 Deploy no Railway - Passo a Passo

## ✅ Pré-requisitos
- ✅ Conta no Railway criada (https://railway.app)
- ✅ Conta no GitHub
- ✅ Código do projeto pronto

---

## 📋 **PASSO 1: Criar Repositório no GitHub**

### No navegador:

1. Acesse: https://github.com/new
2. **Repository name:** `nuvo-checklist`
3. **Private** ou **Public** (sua escolha)
4. **NÃO** marque "Initialize with README"
5. Clique em **"Create repository"**

---

## 💻 **PASSO 2: Inicializar Git Local**

Abra **PowerShell** na pasta do projeto:

```powershell
cd "C:\Users\Guilherme\OneDrive\Documentos\Projects in progress\CHECKLIST"
```

Execute os comandos:

```bash
# 1. Inicializar Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer commit inicial
git commit -m "Initial commit - NUVO Checklist"

# 4. Adicionar origin (SUBSTITUA pelo SEU repositório)
git remote add origin https://github.com/SEU-USUARIO/nuvo-checklist.git

# 5. Renomear branch para main
git branch -M main

# 6. Push para GitHub
git push -u origin main
```

⚠️ **IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu usuário do GitHub!

Se pedir login:
- **Username:** Seu usuário do GitHub
- **Password:** Use um **Personal Access Token** (não a senha)

**Como criar token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Marque: `repo` (full control)
3. Copie o token e use como senha

---

## 🚂 **PASSO 3: Deploy no Railway**

### 3.1 - Conectar GitHub

1. Acesse: https://railway.app/dashboard
2. Clique em **"New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Se não conectou ainda:
   - Clique em **"Configure GitHub App"**
   - Autorize o Railway
5. Selecione o repositório **`nuvo-checklist`**

### 3.2 - Railway vai detectar automaticamente

✅ Python
✅ Node.js
✅ Configurações (nixpacks.toml)

### 3.3 - Aguarde o deploy

⏱️ Primeira vez: **5-10 minutos**

Você verá:
- 🔵 Building...
- 🟡 Deploying...
- 🟢 Success!

---

## 🗄️ **PASSO 4: Adicionar Banco de Dados PostgreSQL**

1. No Railway, clique em **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway vai criar automaticamente
3. Variável `DATABASE_URL` será adicionada automaticamente

---

## ⚙️ **PASSO 5: Configurar Variáveis de Ambiente**

1. Clique no seu projeto no Railway
2. Vá em **"Variables"**
3. Adicione:

```
SECRET_KEY=cole-uma-chave-secreta-aqui
PORT=8000
FLASK_ENV=production
UPLOAD_FOLDER=/tmp/uploads
```

**Para gerar SECRET_KEY:**

No PowerShell:
```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Copie e cole o resultado em `SECRET_KEY`

---

## 🌐 **PASSO 6: Obter URL da Aplicação**

1. No Railway, clique no seu serviço
2. Vá em **"Settings"** → **"Networking"**
3. Clique em **"Generate Domain"**
4. Copie a URL: `https://seu-app.up.railway.app`

---

## ✅ **PASSO 7: Testar**

1. Acesse a URL gerada
2. Teste o upload de PDF
3. Verifique se tudo funciona!

---

## 🔄 **Atualizar Código (Depois)**

Sempre que fizer mudanças:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**Railway faz deploy automático!** 🚀

---

## 🐛 **Ver Logs (se der erro)**

1. No Railway, clique no projeto
2. Vá em **"Deployments"**
3. Clique no deploy mais recente
4. Veja os logs

---

## 💰 **Custo**

- **$5/mês de crédito grátis**
- Seu app vai usar ~$2-3/mês
- **= GRÁTIS!** 🎉

---

## 📞 **Suporte**

Se der erro:
1. Veja os logs no Railway
2. Cole o erro aqui que eu ajudo!

**Boa sorte!** 🚀
