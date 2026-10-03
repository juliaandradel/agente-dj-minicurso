# Como rodar o seu Agente DJ 🎧

Guia para rodar o projeto inteiro no seu computador, depois do minicurso.

O projeto tem **duas metades**, e as duas precisam estar ligadas ao mesmo tempo:

| metade | o que é | onde mora |
|---|---|---|
| **o cérebro** | o agente que você construiu, que escolhe as músicas | `backend/aula_aluna.ipynb` |
| **o rosto** | o site bonito onde a pessoa digita e vê a playlist | `frontend/` |

A ordem importa: **primeiro o cérebro, depois o rosto.** O site procura o agente assim que abre; se o agente não estiver no ar, ele não acha ninguém.

---

## Antes de começar

Confira se você tem instalado:

- **Python 3.10** ou mais novo
- **VS Code** com a extensão **Jupyter** (é ela que abre os cadernos `.ipynb`)
- **Node.js 20.19** ou mais novo — é o que faz o site funcionar. Baixe em [nodejs.org](https://nodejs.org) e escolha a versão **LTS**.

Para saber se o Node já está instalado, abra um terminal e digite `node -v`. Se aparecer um número, está lá.

---

## Passo 1 — Os dois arquivos `.env` 🔑

São **dois arquivos diferentes**, os dois chamados `.env` (com o ponto na frente e nada depois), em **pastas diferentes**. Eles guardam segredos e configurações, e por isso **nunca vão para o GitHub**.

### 1a. O `.env` da pasta principal — a chave do Gemini

É a senha que deixa o seu agente conversar com a IA do Google.

1. Entre em [aistudio.google.com](https://aistudio.google.com) e faça login com sua conta Google.
2. Clique em **Get API key** → **Create API key**. Copie a chave.
3. Na **pasta principal do projeto** (a mesma onde ficam as pastas `backend` e `frontend`), crie um arquivo chamado exatamente **`.env`**.
4. Escreva **uma linha só** dentro dele:

```
GEMINI_API_KEY=cole_sua_chave_aqui
```

**Sem aspas, sem espaços antes ou depois do `=`.** Um espaço sobrando faz a chave não funcionar.

> ⚠️ Essa chave é **sua e secreta**. Nunca mande para ninguém, nunca cole no código, nunca suba no GitHub.

### 1b. O `.env` da pasta `frontend` — como o site acha o seu agente

Dentro da pasta **`frontend`**, crie outro arquivo `.env` com estas três linhas:

```
VITE_API_URL=
VITE_USE_MOCK=false
VITE_PLATFORM=spotify
```

O que cada uma faz:

- **`VITE_API_URL`** — deixe **vazia**. Vazia significa "procure o agente aqui mesmo, neste computador".
- **`VITE_USE_MOCK`** — a mais importante. Com `false`, o site usa **o seu agente**. Com `true`, ele usa um agente de mentira, com músicas inventadas, e nem fala com o seu caderno. (O `true` serve para testar o site sem ligar o caderno.)
- **`VITE_PLATFORM`** — em qual serviço os links das músicas abrem. Pode ser `spotify`, `apple` ou `deezer`.

> **Por que dois arquivos?** Porque são dois programas diferentes. O Python só enxerga o `.env` da pasta principal; o site só enxerga o da pasta `frontend`. Cada um lê o seu.

---

## Passo 2 — Instalar as bibliotecas do Python

Abra um terminal na pasta principal do projeto e rode:

```
pip install -r backend/requirements.txt
```

Isso instala tudo de uma vez: pandas, matplotlib, o Gemini, o servidor. Só precisa fazer **uma vez**.

---

## Passo 3 — Instalar o site

Ainda no terminal, entre na pasta do site e instale:

```
cd frontend
npm install
```

Pode demorar um ou dois minutos na primeira vez. Também só precisa fazer **uma vez**.

---

## Passo 4 — Ligar o cérebro 🧠

1. No VS Code, abra **`backend/aula_aluna.ipynb`** — o caderno que você construiu.
2. No canto superior direito, escolha o **kernel** (o Python que vai rodar o caderno).
3. Clique em **Run All** (▶▶) e espere o caderno rodar de cima para baixo.
4. Na **última célula**, tem que aparecer:

```
O seu agente está no ar em http://127.0.0.1:8000
```

> 🔴 **Deixe o VS Code aberto, com o caderno rodando.** O agente vive dentro dele. Se você fechar o caderno ou reiniciar o kernel, o agente desliga.

---

## Passo 5 — Ligar o rosto 💄

Abra um **terminal novo** (não use o mesmo do caderno) e rode:

```
cd frontend
npm run dev
```

Vai aparecer um endereço, normalmente **http://localhost:5173**. Clique nele (ou cole no navegador).

---

## Pronto! 🎉

Escreva uma frase no site — *"quero treinar de manhã"* — e aperte Enter.

Volte no VS Code e olhe **embaixo da célula do balcão**: o seu pedido aparece impresso lá, ao vivo. É o seu agente trabalhando.

---

## Se der errado 🩹

| O que acontece | Por quê | Como resolver |
|---|---|---|
| O site abre, mas a playlist nunca chega | O caderno não está rodando | Volte no Passo 4 e confira se apareceu "O seu agente está no ar" |
| Aparecem músicas, mas não são as suas | O `VITE_USE_MOCK` está como `true` | Troque para `false` no `frontend/.env` e rode `npm run dev` de novo |
| No caderno aparece `plano B` em vez de `gemini` | A chave do Gemini não foi lida, ou a cota do dia acabou | Confira o `.env` da pasta principal: nome certo, sem aspas, sem espaços. A playlist sai do mesmo jeito, só sem a IA |
| `ModuleNotFoundError` ao rodar o caderno | Faltou instalar as bibliotecas | Repita o Passo 2 e depois reinicie o kernel |
| Erro de **porta ocupada** (`address already in use`) | Já tem um agente rodando de uma vez anterior | No caderno, clique em **Restart** no kernel e rode tudo de novo |
| `npm: command not found` | O Node.js não está instalado | Instale em [nodejs.org](https://nodejs.org), versão LTS, e abra um terminal novo |

---

## Para desligar

- **O site:** no terminal onde você rodou `npm run dev`, aperte `Ctrl + C`.
- **O agente:** feche o caderno no VS Code, ou clique em **Restart** no kernel.
