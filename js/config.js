/*
  CONFIGURAÇÃO DA PLANILHA
  1) Publique cada aba da planilha como CSV ou use o link CSV do Google Sheets.
  2) Cole cada link abaixo.
  3) Enquanto ficar vazio, o Hub usa dados de exemplo.

  Colunas esperadas por aba:
  indicadores: titulo,valor,descricao,fonte,icone,destaque,ordem
  calendario/acoes/eventos/reunioes: use os cabeçalhos que aparecem nas tabelas do Hub.
*/
window.HUB_CONFIG = {
  refreshMinutes: 5,
  links: {
    medicina: 'https://app.powerbi.com/view?r=eyJrIjoiNzI4ZWZmNmUtMjAxNS00NWVlLThhM2UtNTM1YjM1MTdjYmI1IiwidCI6ImZkOThjZTUxLTQ5ZmMtNDMyZS1hZGU3LTY0ZGQ3MWQzNGVjZSJ9',
    domBosco: 'https://app.powerbi.com/view?r=eyJrIjoiN2U2MDAwNDQtY2EwOS00YTRjLWJjMzAtYWIxODVlMzJjMTMyIiwidCI6ImZkOThjZTUxLTQ5ZmMtNDMyZS1hZGU3LTY0ZGQ3MWQzNGVjZSJ9',
    rankingCallCenter: 'https://app.powerbi.com/view?r=eyJrIjoiYmNlMzY0ZGYtMDNmNS00ZDg3LTlhN2UtMGI2OTc0NTZmNDdiIiwidCI6ImZkOThjZTUxLTQ5ZmMtNDMyZS1hZGU3LTY0ZGQ3MWQzNGVjZSJ9'
  },
  sheets: {
    indicadores: '',
    calendario: '',
    acoesInternas: '',
    acoesExternas: '',
    eventos: '',
    reunioes: '',
    responsaveis: '',
    linksPowerBI: ''
  }
};
