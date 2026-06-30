/*
  CONFIGURAÇÃO DAS PLANILHAS
  1) Publique cada aba da sua planilha como CSV.
  2) Cole o link abaixo no campo correspondente.
  3) Se deixar vazio, o Hub usa os dados editáveis salvos no navegador.

  Colunas esperadas por aba:
  home: titulo,valor,fonte,descricao,tipo
  calendario/acoes/eventos: periodo,instituicoes,tema,descricao,canais,responsavel,status,totalLeads,leadsUNDB,leadsDB,leadsPOS,investimento,observacoes
  reunioes: data,bloco,responsavel,tarefa,prazo,status,observacoes
*/
window.HUB_CONFIG = {
  csv: {
    home: "",
    calendario: "",
    internas: "",
    externas: "",
    domBosco: "",
    undb: "",
    pos: "",
    medicina: "",
    eventos: "",
    reunioes: ""
  },
  powerbi: {
    medicina: "https://app.powerbi.com/view?r=eyJrIjoiNzI4ZWZmNmUtMjAxNS00NWVlLThhM2UtNTM1YjM1MTdjYmI1IiwidCI6ImZkOThjZTUxLTQ5ZmMtNDMyZS1hZGU3LTY0ZGQ3MWQzNGVjZSJ9",
    domBosco: "https://app.powerbi.com/view?r=eyJrIjoiN2U2MDAwNDQtY2EwOS00YTRjLWJjMzAtYWIxODVlMzJjMTMyIiwidCI6ImZkOThjZTUxLTQ5ZmMtNDMyZS1hZGU3LTY0ZGQ3MWQzNGVjZSJ9",
    rankingCallCenter: "https://app.powerbi.com/view?r=eyJrIjoiYmNlMzY0ZGYtMDNmNS00ZDg3LTlhN2UtMGI2OTc0NTZmNDdiIiwidCI6ImZkOThjZTUxLTQ5ZmMtNDMyZS1hZGU3LTY0ZGQ3MWQzNGVjZSJ9"
  }
};
