# Hub de Inteligência Comercial — Grupo Dom Bosco

Projeto estático para GitHub Pages/Netlify, preparado para ler dados de planilhas publicadas em CSV.

## Estrutura

- `index.html`
- `css/main.css`
- `js/config.js`
- `js/app.js`
- `assets/`

## Como publicar

1. Apague arquivos antigos conflitantes: `style.css`, `styles.css`, `script.js`.
2. Suba `index.html`, as pastas `css`, `js`, `assets` e este `README.md`.
3. Ative GitHub Pages em Settings > Pages > Deploy from branch > main > root.

## Como conectar a planilha

No arquivo `js/config.js`, cole os links CSV de cada aba.
Enquanto os links estiverem vazios, o Hub mostra dados de exemplo.

## Abas esperadas

- Indicadores
- Calendário Comercial
- Ações Internas
- Ações Externas
- Eventos
- Reuniões
- Responsáveis
- Links Power BI
