# 📱 Guia de Uso - NUVO Checklist

## 🎯 Visão Geral

O NUVO Checklist é um sistema para gerenciar checklists de produção de móveis a partir de PDFs.

### Fluxo de Trabalho

```
1. Upload PDF → 2. Sistema Processa → 3. Checklist Criado
                                            ↓
4. Marcar: Montado → 5. Marcar: Portas → 6. Marcar: Embarcado
                                            ↓
                                    7. Arquivar Projeto
```

---

## 📤 1. Upload de PDF

### Como fazer upload:

1. Na tela inicial, clique no botão **"+ Upload PDF"**
2. Arraste um PDF ou clique em "Selecionar Arquivo"
3. Clique em **"Upload"**
4. Aguarde o processamento (pode levar alguns segundos)

### O que o sistema faz:

✅ Identifica o **Cliente** automaticamente
✅ Detecta o **Ambiente** (BENCH, TALL WALL, etc)
✅ Categoriza **Peças**:
- 🔵 **Azul** sem @ = Gabinetes
- 🟡 **Amarelo** com @ = Peças Especiais
- ⚪ **Sem cor** = Peças Avulsas

✅ Extrai **Materiais** (Legs e Hinges)
✅ Cria estrutura de **Checkboxes**

### Se o cliente já existe:

O sistema adiciona o novo ambiente ao cliente existente.

---

## 📋 2. Visualizar Clientes

### Tela Inicial

Lista todos os clientes ativos com:
- Nome do cliente
- Job name
- Número de ambientes
- Progresso geral (%)
- Última atualização

### Filtrar/Buscar

Use a barra de busca para encontrar clientes por nome ou job.

---

## 🏗️ 3. Gerenciar Projeto

### Abrir Cliente

Clique em um cliente para ver detalhes.

### Resumo Geral

Mostra:
- **Progresso Total** (barra colorida)
- **Estatísticas**:
  - Montado: X/Y (%)
  - Portas: X/Y (%)
  - Embarcado: X/Y (%)
- **Tabela por Ambiente**

### Navegar entre Ambientes

Use as **abas** no topo para alternar entre ambientes (BENCH, TALL WALL, TV WALL, etc).

---

## ✅ 4. Checkboxes - Como Funciona

### Sequência de Trabalho

Cada peça tem 3 checkboxes principais:

#### 1️⃣ Montado
- Marque quando a peça estiver montada
- **Obrigatório** antes de marcar portas ou embarcar

#### 2️⃣ Portas (Colocadas/Embaladas)
- Só pode marcar se "Montado" estiver OK
- Ao clicar, escolha:
  - **Colocadas** - Portas já instaladas no gabinete
  - **Embaladas** - Portas embaladas separadamente

#### 3️⃣ Embarcado 🚚
- Só pode marcar se "Montado" estiver OK
- Modal de confirmação antes de marcar
- Indica que a peça foi para o caminhão

### Status Visual

Cada peça mostra um badge de status:
- ⏳ **Pendente** - Nada marcado
- 🔧 **Montado** - Apenas montado
- 🚪 **Portas OK** - Montado + Portas
- 🚚 **Embarcado** - Tudo pronto, no caminhão

---

## 🔧 5. Tipos de Peças

### 📦 Gabinetes (Azul)

Peças principais. Exemplo:
```
☑ Cab# 504 • Base Box
   56 3/4" × 7 1/4" × 17 1/4"
   ☑ Montado
   ☑ Portas: Colocadas
   ☐ Embarcado
```

### ⭐ Peças Especiais (Amarelo com @)

Peças customizadas. Exemplo:
```
☐ Cab# 103 • Custom Panel @
   24" × 36" × 3/4"
   ☐ Montado
   ☐ Embarcado
```

### 🔧 Peças Avulsas (Sem cor)

Peças extras. Exemplo:
```
☑ Cab# 501 • Toe Strip
   15 10-1/8" × 6 5" × 3/4"
   ☑ Montado
   ☑ Embarcado
```

---

## ⚙️ 6. Materiais

### Legs (Pés de Gabinete)

```
⚙️ LEGS
☑ 8x Hafele Axilo Square 4"
```

- Checkbox único para todos os pés
- Marque quando instalados

### Hinges (Dobradiças)

```
🔩 HINGES
☐ 11x Salice 110° Opening Angle
```

- Checkbox único para todas as hinges
- Marque quando instaladas

---

## ➕ 7. Checkpoints Customizados

### Adicionar Checkpoint

1. Dentro de uma peça, clique **"+ Adicionar Checkpoint"**
2. Digite o nome (ex: "QC Aprovado", "Cliente Conferiu")
3. Clique em ✓

### Usar Checkpoint

Marque/desmarque como qualquer checkbox.

### Exemplo:

```
☑ Cab# 504 • Base Box
   ☑ Montado
   ☑ Portas: Colocadas
   ☐ Embarcado
   ☑ QC Aprovado (custom)
   ☐ Cliente Conferiu (custom)
```

---

## 📊 8. Acompanhar Progresso

### Por Cliente

Na tela inicial, veja:
- Barra de progresso
- % de conclusão
- Montado, Portas, Embarcado

### Por Ambiente

No resumo do cliente, veja tabela:

| Ambiente | Mont | Port | Emb |
|----------|------|------|-----|
| BENCH    | 10/14| 10/14| 2/14|
| TV WALL  | 12/59| 8/59 | 1/59|

---

## 📁 9. Arquivar Projetos

### Quando Arquivar

Quando o projeto estiver finalizado (tudo embarcado).

### Como Arquivar

1. Abra o cliente
2. No resumo, clique **"Arquivar Projeto"**
3. Confirme

### Ver Arquivados

Na tela inicial, clique **"📁 Ver Arquivados"**

### Desarquivar

1. Vá para Arquivados
2. Clique em **"Desarquivar"** no cliente

---

## 💡 10. Dicas de Uso

### ✅ Boas Práticas

1. **Faça upload assim que receber o PDF**
2. **Marque checkboxes em tempo real** (não deixe acumular)
3. **Use checkpoints customizados** para controle extra
4. **Arquive projetos finalizados** para manter organizado
5. **Acompanhe progresso diariamente**

### ⚠️ Coisas a Saber

- Não pode embarcar sem montar
- Peças com portas: monte → portas → embarque
- Peças avulsas: monte → embarque (pula portas)
- Salvamento é automático ao marcar checkbox
- Sistema funciona offline (mas não salva no servidor)

### 📱 Mobile

- Interface otimizada para celular/tablet
- Use enquanto trabalha na produção
- Marque checkboxes direto do chão de fábrica

---

## 🎨 11. Cores e Ícones

### Status das Peças

| Ícone | Significado |
|-------|-------------|
| ⏳ | Pendente (nada feito) |
| 🔧 | Montado |
| 🚪 | Portas OK |
| 🚚 | Embarcado |

### Tipos de Peças

| Ícone | Tipo |
|-------|------|
| 📦 | Gabinetes |
| ⭐ | Peças Especiais |
| 🔧 | Peças Avulsas |
| ⚙️ | Legs |
| 🔩 | Hinges |

### Progresso

| Cor | Significado |
|-----|-------------|
| 🔴 Vermelho | 0-39% |
| 🟡 Amarelo | 40-79% |
| 🟢 Verde | 80-100% |

---

## ❓ 12. FAQ

### Posso editar informações das peças?
Não. As informações vêm do PDF e não podem ser editadas. Se houver erro no PDF, suba um novo.

### E se eu marcar errado?
Basta desmarcar o checkbox. O sistema salva automaticamente.

### Posso deletar um cliente?
Sim, arquivando. Projetos arquivados não aparecem na lista principal mas podem ser recuperados.

### O sistema funciona offline?
Parcialmente. Você pode visualizar, mas não pode fazer upload de novos PDFs ou salvar alterações sem internet.

### Múltiplas pessoas podem usar ao mesmo tempo?
Sim! Cada pessoa vê as atualizações em tempo real (após refresh).

### Posso exportar o progresso?
Atualmente não, mas está planejado para versões futuras.

---

## 🚀 13. Atalhos

### Teclado (Desktop)

- `Ctrl + U` - Upload PDF
- `Esc` - Fechar modais
- `Tab` - Navegar entre checkboxes

### Gestos (Mobile)

- **Deslizar** - Navegar entre abas
- **Tap longo** - Expandir/recolher seção

---

## 📞 14. Suporte

Precisa de ajuda?

1. Consulte este guia
2. Verifique o README.md
3. Entre em contato com TI

---

## 🎉 Pronto!

Agora você sabe usar o NUVO Checklist!

**Próximos passos:**
1. Faça upload de um PDF
2. Explore a interface
3. Marque alguns checkboxes
4. Acompanhe o progresso

Bom trabalho! 💪
