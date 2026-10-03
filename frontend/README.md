# Agente DJ — Minicurso `<div>a`

Aplicação educacional que cria playlists a partir de uma cena descrita em linguagem natural.

O projeto faz parte da trilha de Dados da 4ª edição do minicurso `<div>a`, iniciativa do CITi voltada à inclusão de mulheres nas áreas de tecnologia.

## Objetivo

Ensinar, de forma prática:

- o que é um dataset;
- como explorar e transformar dados com Python;
- como criar filtros e um sistema de recomendação;
- como um agente de IA utiliza ferramentas;
- a diferença entre consultar dados reais e inventar uma resposta.

O Gemini não escolhe músicas diretamente. Ele transforma o pedido da pessoa em parâmetros. Uma função Python consulta o dataset e seleciona somente músicas existentes.

## Fluxo principal

```text
Pedido em português
→ Gemini interpreta a cena
→ gera parâmetros estruturados
→ Python consulta o dataset
→ algoritmo pontua as músicas
→ interface apresenta a playlist
→ pessoa acessa as faixas nas plataformas
```

Exemplo de pedido:

```text
Quero músicas animadas para uma viagem com minhas amigas.
```

Possível interpretação:

```python
{
    "energia_minima": 0.70,
    "dancabilidade_minima": 0.65,
    "valencia_minima": 0.60,
    "quantidade": 5,
}
```

## Arquitetura prevista

```text
Frontend
React + TypeScript + Vite
        ↓ HTTP
Backend
FastAPI + Python
        ↓
Dataset local + recomendador + Gemini
```

A lógica do backend será criada e testada primeiro em um Jupyter Notebook dentro do VS Code. Depois, as funções estáveis serão expostas por uma API FastAPI.

## Estrutura do projeto

```text
agente-dj-diva/
├── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── backend/
    ├── .venv/
    ├── agente_dj.ipynb
    └── data/
        └── spotify_tracks_original.csv
```

Arquivos que serão criados posteriormente:

```text
backend/
├── data/
│   └── musicas_diva.csv
├── app/
│   ├── main.py
│   ├── agent.py
│   ├── recommender.py
│   └── platforms.py
└── tests/
```

## Estado atual

- [x] Node.js, npm, Python e Git instalados.
- [x] Frontend React com TypeScript criado usando Vite.
- [x] Ambiente virtual Python criado em `backend/.venv`.
- [x] pandas instalado.
- [x] Dataset principal escolhido.
- [x] Dataset original baixado.
- [ ] Kernel do Jupyter confirmado como `backend/.venv`.
- [ ] Auditoria do dataset feita no notebook.
- [ ] Dataset limpo gerado.
- [ ] Exploração e gráficos concluídos.
- [ ] Função recomendadora implementada.
- [ ] Integração com Gemini implementada.
- [ ] API FastAPI criada.
- [ ] Interface React construída.
- [ ] Links multiplataforma implementados.
- [ ] Testes e fallback concluídos.

## Dataset

Fonte:

[Spotify Tracks Dataset — 114K Songs Across 114 Genres](https://github.com/sai-chaitanya-reddy/spotify-tracks-dataset)

Arquivo original:

```text
backend/data/spotify_tracks_original.csv
```

Características verificadas:

```text
Registros:        114.000
Colunas:               20
IDs únicos:        89.741
Artistas:          31.430
Gêneros:              114
Registros repetidos: 24.259
Popularidade zero:    9.348
```

Principais colunas:

| Coluna | Descrição |
|---|---|
| `track_id` | Identificador da faixa no Spotify |
| `track_name` | Nome da música |
| `artists` | Artista ou artistas |
| `album_name` | Nome do álbum |
| `popularity` | Popularidade entre 0 e 100 |
| `explicit` | Indica conteúdo explícito |
| `danceability` | Facilidade para dançar |
| `energy` | Intensidade percebida |
| `valence` | Positividade musical |
| `tempo` | Batidas por minuto |
| `acousticness` | Presença de características acústicas |
| `instrumentalness` | Probabilidade de não haver vocais |
| `track_genre` | Gênero atribuído à faixa |

### Limitações conhecidas

- Uma faixa pode aparecer em mais de um gênero.
- Alguns gêneros estão classificados de forma imprecisa.
- Existem artistas e músicas pouco conhecidos.
- A popularidade representa o momento em que os dados foram coletados.
- O arquivo não contém data de lançamento.
- A classificação `funk` também inclui funk internacional.
- O dataset não deve ser enviado integralmente ao Gemini.

O dataset original deve permanecer intacto. A limpeza gerará:

```text
backend/data/musicas_diva.csv
```

## Regras iniciais de limpeza

As regras ainda devem ser validadas durante a exploração:

1. Ordenar as músicas por popularidade.
2. Remover duplicatas usando `track_id`.
3. Remover registros sem ID, título ou artista.
4. Remover faixas com conteúdo explícito.
5. Remover faixas com atributos numéricos inválidos.
6. Começar com popularidade mínima igual a 50.
7. Traduzir as colunas usadas pelas participantes.
8. Criar o link do Spotify com o `track_id`.
9. Preservar a fonte original separadamente.

Formato esperado da base didática:

```text
id_spotify
titulo
artista
album
genero
popularidade
duracao_ms
energia
dancabilidade
positividade
bpm
acustica
instrumentalidade
ao_vivo
link_spotify
```

## Regras do recomendador

A primeira versão deve:

- receber valores desejados de energia, dançabilidade e positividade;
- calcular a distância entre o pedido e cada música;
- ordenar pelas músicas mais próximas;
- evitar repetir artistas na mesma playlist;
- selecionar somente músicas presentes no dataset;
- retornar cinco músicas por padrão;
- permitir algum grau de variedade entre execuções.

Uma fórmula inicial pode usar distância ponderada:

```python
distancia = (
    abs(energia - energia_desejada) * peso_energia
    + abs(dancabilidade - dancabilidade_desejada)
      * peso_dancabilidade
    + abs(positividade - positividade_desejada)
      * peso_positividade
)
```

Os pesos devem ser ajustados durante os testes.

## Integração com o Gemini

Responsabilidade do Gemini:

- interpretar o pedido em português;
- identificar o clima desejado;
- produzir parâmetros estruturados;
- decidir quando chamar a ferramenta de busca.

Responsabilidade do Python:

- consultar o dataset;
- aplicar filtros;
- calcular pontuações;
- escolher as músicas;
- construir os links;
- devolver dados verificáveis.

A chave do Gemini deve ficar no backend. Ela nunca deve aparecer no React, no notebook publicado ou no Git.

Arquivo futuro:

```text
.env
```

Exemplo:

```text
GEMINI_API_KEY=chave_aqui
```

O `.env` deve estar no `.gitignore`.

## Ambiente de desenvolvimento

### Backend

Ativar o ambiente virtual no PowerShell:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
```

Instalar dependências iniciais:

```powershell
python -m pip install pandas ipykernel
```

No notebook, verificar o interpretador:

```python
import sys

print(sys.executable)
```

O caminho deve terminar em:

```text
backend\.venv\Scripts\python.exe
```

Se aparecer `C:\mmsys64\...`, o kernel incorreto foi selecionado.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

O endereço padrão do Vite é:

```text
http://localhost:5173
```

## Próximos passos

### 1. Auditar o dataset

No notebook:

- carregar o CSV;
- verificar dimensões e tipos;
- contar valores ausentes;
- contar IDs duplicados;
- examinar popularidade;
- examinar conteúdo explícito;
- explorar gêneros;
- visualizar exemplos de registros problemáticos.

### 2. Limpar e exportar

Criar um DataFrame limpo e exportar:

```text
backend/data/musicas_diva.csv
```

### 3. Explorar os dados

Criar atividades didáticas com:

- filtros;
- ordenação;
- agrupamentos;
- médias por gênero;
- histogramas;
- gráficos de energia, dançabilidade e positividade.

### 4. Criar o recomendador

Implementar e testar `buscar_musicas()` sem IA.

### 5. Integrar o Gemini

O modelo transforma linguagem natural em parâmetros para `buscar_musicas()`.

### 6. Criar a API

Extrair as funções testadas no notebook e expor uma rota FastAPI.

Exemplo futuro:

```text
POST /playlist
```

### 7. Construir a interface

A interface React deverá ter:

- campo para descrever a cena;
- exemplos de pedidos;
- botão para montar a playlist;
- estado de carregamento;
- mensagens de erro;
- lista de músicas;
- links para plataformas;
- layout responsivo.

## Critérios de conclusão do MVP

O MVP estará pronto quando:

- uma pessoa escrever um pedido em português;
- o Gemini produzir filtros válidos;
- a função consultar somente o CSV;
- a resposta contiver cinco músicas reais;
- nenhum artista se repetir indevidamente;
- todos os links do Spotify forem válidos;
- uma falha do Gemini produzir uma mensagem compreensível;
- a chave da API permanecer protegida;
- frontend e backend funcionarem localmente;
- o fluxo completo puder ser demonstrado em poucos minutos.

## Riscos

| Risco | Mitigação |
|---|---|
| Internet instável | Base local e modo sem Gemini |
| Limite da API | Reduzir chamadas e manter fallback |
| Gemini gerar parâmetros inválidos | Validar os valores no backend |
| Músicas desconhecidas | Aplicar popularidade mínima |
| Resultado repetitivo | Sortear entre as melhores candidatas |
| Artista repetido | Limitar uma faixa por artista |
| Gênero incorreto | Não usar gênero como único critério |
| Chave exposta | Manter segredo apenas no backend |
| Notebook usar Python errado | Verificar `sys.executable` |

## Decisões pendentes

- Valor definitivo da popularidade mínima.
- Quantidade final de músicas na base didática.
- Uso ou não de gêneros como filtro.
- Estratégia para Apple Music e Deezer.
- Modelo específico do Gemini.
- Funcionamento exato do modo sem IA.
- Hospedagem da aplicação.
- Identidade visual final.

## Princípio do projeto


O agente nunca deve inventar uma música.

A IA interpreta a intenção. O código consulta os dados. A playlist vem da base real.