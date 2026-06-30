# Hub de Inteligência Comercial — Grupo Dom Bosco

Projeto estático para GitHub Pages.

## Arquivos

- `index.html`
- `css/main.css`
- `js/config.js`
- `js/app.js`
- `assets/`

## Como atualizar dados automaticamente

1. Crie/atualize a planilha-base.
2. Publique cada aba como CSV.
3. Abra `js/config.js`.
4. Cole os links em `window.HUB_CONFIG.csv`.
5. Faça commit no GitHub.

Enquanto os links CSV estiverem vazios, o Hub permite edição direta na página e salva no navegador com `localStorage`.

## Campos editáveis

- Todos os campos das tabelas são editáveis.
- Status usa lista de seleção.
- É possível adicionar e excluir linhas.
- Há exportação/importação de backup JSON.
