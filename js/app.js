const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const cfg = window.HUB_CONFIG || { sheets:{}, links:{} };

const NAV = [
  {group:'Início', id:'visao-geral', icon:'📊', label:'Visão Geral'},
  {group:'Planejamento', id:'calendario', icon:'📅', label:'Calendário Comercial'},
  {group:'Negócios', id:'dom-bosco', icon:'🏫', label:'Escola Dom Bosco'},
  {group:'Negócios', id:'undb', icon:'🎓', label:'UNDB Graduação'},
  {group:'Negócios', id:'pos', icon:'🎯', label:'Pós-Graduação'},
  {group:'Negócios', id:'medicina', icon:'🩺', label:'Medicina'},
  {group:'Operação', id:'eventos', icon:'🎪', label:'Eventos'},
  {group:'Operação', id:'acoes-internas', icon:'📢', label:'Ações Internas'},
  {group:'Operação', id:'acoes-externas', icon:'🌎', label:'Ações Externas'},
  {group:'Gestão', id:'reunioes', icon:'🤝', label:'Reunião Comercial'},
  {group:'Gestão', id:'metas', icon:'🏁', label:'Metas e Rankings'},
  {group:'Sistema', id:'configuracao', icon:'⚙️', label:'Configuração'}
];

const FALLBACK = {
  indicadores: [
    {titulo:'Matrículas 2026.2 UNDB', valor:'--', descricao:'Fonte: RM / Power BI UNDB', fonte:'UNDB', icone:'🎓', destaque:'sim', ordem:1},
    {titulo:'Matrículas Dom Bosco 2026', valor:'--', descricao:'Fonte: RM / Power BI Escola', fonte:'Dom Bosco', icone:'🏫', destaque:'sim', ordem:2},
    {titulo:'Matrículas Medicina 2026.2', valor:'--', descricao:'Fonte: RM / Power BI Medicina', fonte:'Medicina', icone:'🩺', destaque:'sim', ordem:3},
    {titulo:'Inscritos no vestibular de Med', valor:'--', descricao:'Processo seletivo tradicional', fonte:'Medicina', icone:'📝', destaque:'não', ordem:4},
    {titulo:'Inscritos ENEM Med', valor:'--', descricao:'Entrada via ENEM', fonte:'Medicina', icone:'📌', destaque:'não', ordem:5},
    {titulo:'Inscritos Transferência Externa Med', valor:'--', descricao:'Transferência externa Medicina', fonte:'Medicina', icone:'🔁', destaque:'não', ordem:6}
  ],
  calendario: [
    {periodo:'Julho', unidade:'Grupo Dom Bosco', tema:'Clínica de Férias / Férias em Movimento', descricao:'Ações comerciais do mês', responsavel:'Marketing + Comercial', status:'Planejado', prioridade:'Alta', observacoes:'Editar na planilha-base'},
    {periodo:'Agosto', unidade:'UNDB', tema:'Campanha 2026.2', descricao:'Captação e matrícula graduação', responsavel:'Marketing', status:'Planejado', prioridade:'Média', observacoes:''}
  ],
  acoesInternas: [
    {data:'', acao:'Reserva de Vagas', negocio:'Dom Bosco', responsavel:'Ilana', status:'Planejado', prazo:'', observacoes:'Ação interna'}
  ],
  acoesExternas: [
    {data:'', acao:'Ativação Comercial', negocio:'UNDB / Dom Bosco / Pós', responsavel:'Marketing', status:'Planejado', leads:'', custo:'', observacoes:'Ação externa'}
  ],
  eventos: [
    {data:'', evento:'Giro das Profissões', negocio:'UNDB Graduação', responsavel:'Marketing', status:'Concluído', leads:'', custo:'', observacoes:''}
  ],
  reunioes: [
    {data:'', bloco:'Dom Bosco', responsavel:'Ilana', tarefa:'Registrar demanda da reunião', prazo:'', prioridade:'Média', status:'Em andamento', observacoes:''},
    {data:'', bloco:'UNDB e Medicina', responsavel:'Allyson', tarefa:'Registrar demanda da reunião', prazo:'', prioridade:'Média', status:'Em andamento', observacoes:''},
    {data:'', bloco:'Ações', responsavel:'Marketing', tarefa:'Registrar demanda da reunião', prazo:'', prioridade:'Média', status:'Em andamento', observacoes:''}
  ],
  responsaveis: [
    {nome:'Allyson', area:'UNDB e Medicina'}, {nome:'Fábio', area:'Comercial'}, {nome:'Nathalia', area:'Marketing'}, {nome:'Rick', area:'Growth'}, {nome:'Rafaela', area:'CRM e Performance'}, {nome:'Ilana', area:'Dom Bosco'}
  ],
  linksPowerBI: [
    {nome:'Medicina BI 2026.2', area:'Medicina', url: cfg.links.medicina, descricao:'Processos seletivos de Medicina'},
    {nome:'Dashboard Dom Bosco', area:'Dom Bosco', url: cfg.links.domBosco, descricao:'Captação e indicadores Escola'},
    {nome:'Ranking Matrículas Call Center', area:'Call Center', url: cfg.links.rankingCallCenter, descricao:'Ranking de agendamentos e matrículas'}
  ]
};

const state = { data:{}, page:'visao-geral', loaded:false };

function normalizeKey(k){ return String(k||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
function statusClass(v){ return normalizeKey(v).replace(/_/g,'-'); }
function isYes(v){ return ['sim','s','yes','true','1'].includes(String(v||'').toLowerCase().trim()); }
function escapeHtml(v){ return String(v ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

async function loadCsv(url){
  const res = await fetch(url + (url.includes('?')?'&':'?') + 'cacheBust=' + Date.now());
  if(!res.ok) throw new Error('Falha ao carregar CSV');
  return parseCsv(await res.text());
}
function parseCsv(text){
  const rows=[]; let row=[], cur='', quote=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"' && quote && n==='"'){ cur+='"'; i++; continue; }
    if(c==='"'){ quote=!quote; continue; }
    if(c===',' && !quote){ row.push(cur); cur=''; continue; }
    if((c==='\n'||c==='\r') && !quote){ if(c==='\r'&&n==='\n') i++; row.push(cur); rows.push(row); row=[]; cur=''; continue; }
    cur+=c;
  }
  if(cur || row.length) { row.push(cur); rows.push(row); }
  const headers=(rows.shift()||[]).map(normalizeKey);
  return rows.filter(r => r.some(x => String(x).trim())).map(r => Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}

async function loadAll(){
  const entries = Object.entries(cfg.sheets || {});
  let online = 0;
  for(const [key,url] of entries){
    if(url){
      try{ state.data[key] = await loadCsv(url); online++; }
      catch(e){ console.warn(key,e); state.data[key] = FALLBACK[key] || []; }
    } else state.data[key] = FALLBACK[key] || [];
  }
  Object.keys(FALLBACK).forEach(k => { if(!state.data[k]) state.data[k]=FALLBACK[k]; });
  $('#sourceStatus').innerHTML = online ? `<span class="status-dot"></span>${online} base(s) online` : 'Usando dados de exemplo';
  state.loaded = true;
}

function buildNav(){
  const nav = $('#nav'); nav.innerHTML=''; let group='';
  NAV.forEach(item=>{
    if(item.group!==group){ group=item.group; const h=document.createElement('div'); h.className='nav-section'; h.textContent=group; nav.appendChild(h); }
    const b=document.createElement('button'); b.dataset.page=item.id; b.innerHTML=`<span class="ico">${item.icon}</span><span>${item.label}</span>`;
    b.onclick=()=>go(item.id); nav.appendChild(b);
  });
}
function go(page){ state.page=page; location.hash=page; render(); if(innerWidth<1000) $('#sidebar').classList.remove('open'); }
function intro(title, label, text){ $('#pageTitle').textContent=title; $('#pageIntro').innerHTML=`<small>${label}</small><h2>${title}</h2><p>${text}</p>`; }
function activeNav(){ $$('.nav button').forEach(b=>b.classList.toggle('active', b.dataset.page===state.page)); }

function renderCards(rows){
  const sorted=[...rows].sort((a,b)=>(Number(a.ordem)||99)-(Number(b.ordem)||99));
  return `<div class="grid">${sorted.map(r=>`<article class="metric-card ${isYes(r.destaque)?'featured':''}">
    <div class="metric-head"><span class="metric-icon">${escapeHtml(r.icone||'📌')}</span><span class="metric-source">${escapeHtml(r.fonte||'')}</span></div>
    <h3>${escapeHtml(r.titulo)}</h3><strong>${escapeHtml(r.valor||'--')}</strong><p>${escapeHtml(r.descricao||'')}</p>
  </article>`).join('')}</div>`;
}
function table(rows, opts={}){
  if(!rows || !rows.length) return '<div class="empty">Nenhum dado encontrado. Atualize a planilha-base.</div>';
  const headers = opts.headers || Object.keys(rows[0]);
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${labelize(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${headers.map(h=>cell(r[h],h)).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function cell(v,h){
  const key=normalizeKey(h), val=escapeHtml(v||'');
  if(['status','prioridade'].includes(key)) return `<td><span class="badge ${statusClass(v)}">${val||'-'}</span></td>`;
  if(key==='url' && val) return `<td><a class="badge" href="${val}" target="_blank" rel="noreferrer">Abrir</a></td>`;
  return `<td>${val||'-'}</td>`;
}
function labelize(k){ return String(k).replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase()).replace('Undb','UNDB').replace('Pos','Pós').replace('Url','Link'); }
function panel(title, rows, headers){ return `<section class="panel"><div class="panel-head"><h3>${title}</h3><span class="badge">${rows.length} registro(s)</span></div>${table(rows,{headers})}</section>`; }
function links(area){
  let rows=(state.data.linksPowerBI||[]).filter(l => !area || normalizeKey(l.area).includes(normalizeKey(area)));
  if(!rows.length && area==='Medicina') rows=[FALLBACK.linksPowerBI[0]];
  return `<div class="grid two">${rows.map(l=>`<a class="link-card" href="${escapeHtml(l.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(l.nome)}</strong><span>${escapeHtml(l.descricao||l.area)}</span></a>`).join('')}</div>`;
}

function render(){
  activeNav(); const c=$('#content');
  const page = state.page;
  const common = '<div class="editable-note">Todos os textos, números, status, prazos e observações desta página devem ser alimentados pela planilha-base configurada em <strong>js/config.js</strong>.</div>';
  if(page==='visao-geral') { intro('Hub de Inteligência Comercial','Visão Geral','Home com os principais indicadores comerciais por negócio.'); c.innerHTML = renderCards(state.data.indicadores||[]) + panel('Links rápidos Power BI', state.data.linksPowerBI||FALLBACK.linksPowerBI, ['nome','area','descricao','url']); }
  if(page==='calendario') { intro('Calendário Comercial','Planejamento','Planejamento anual, campanhas, prazos, responsáveis e status.'); c.innerHTML= common + panel('Calendário Comercial', state.data.calendario||[], ['periodo','unidade','tema','descricao','responsavel','status','prioridade','observacoes']); }
  if(page==='dom-bosco') { intro('Escola Dom Bosco','Negócio','Indicadores e links de acompanhamento da Escola Dom Bosco.'); c.innerHTML=links('Dom Bosco')+panel('Ações vinculadas ao Dom Bosco', filterBusiness('Dom Bosco'), ['data','acao','evento','tema','negocio','responsavel','status','leads','custo','observacoes']); }
  if(page==='undb') { intro('UNDB Graduação','Negócio','Indicadores, ações e calendário da graduação.'); c.innerHTML=panel('Ações e calendário UNDB', filterBusiness('UNDB'), ['data','periodo','acao','evento','tema','negocio','unidade','responsavel','status','leads','observacoes']); }
  if(page==='pos') { intro('Pós-Graduação','Negócio','Acompanhamento comercial da Pós-Graduação.'); c.innerHTML=panel('Ações e calendário Pós-Graduação', filterBusiness('Pós'), ['data','periodo','acao','evento','tema','negocio','unidade','responsavel','status','leads','observacoes']); }
  if(page==='medicina') { intro('Medicina','Negócio','Processos seletivos, inscrições, ENEM, transferência externa e dashboard específico.'); c.innerHTML=renderCards((state.data.indicadores||[]).filter(x=>normalizeKey(x.titulo).includes('med')||normalizeKey(x.fonte).includes('med'))) + '<br>' + links('Medicina') + panel('Calendário e ações de Medicina', filterBusiness('Medicina'), ['data','periodo','acao','evento','tema','negocio','unidade','responsavel','status','leads','observacoes']); }
  if(page==='eventos') { intro('Eventos','Operação','Eventos realizados, planejados, leads por negócio, custo e responsáveis.'); c.innerHTML=common + panel('Eventos e Ações', state.data.eventos||[], ['data','evento','negocio','responsavel','status','leads','custo','observacoes']); }
  if(page==='acoes-internas') { intro('Ações Internas','Operação','Ações internas por negócio, área responsável, status e prazo.'); c.innerHTML=common + panel('Ações Internas', state.data.acoesInternas||[], ['data','acao','negocio','responsavel','status','prazo','observacoes']); }
  if(page==='acoes-externas') { intro('Ações Externas','Operação','Ações de campo, eventos externos, leads, custos e responsáveis.'); c.innerHTML=common + panel('Ações Externas', state.data.acoesExternas||[], ['data','acao','negocio','responsavel','status','leads','custo','observacoes']); }
  if(page==='reunioes') { intro('Reunião Comercial','Gestão','Central das reuniões de segunda-feira com responsáveis, tarefas, prazos e observações.'); c.innerHTML=meetingBlocks()+ common + panel('Demandas da Reunião Comercial', state.data.reunioes||[], ['data','bloco','responsavel','tarefa','prazo','prioridade','status','observacoes']) + panel('Participantes fixos', state.data.responsaveis||[], ['nome','area']); }
  if(page==='metas') { intro('Metas e Rankings','Gestão','Links e acompanhamento de metas, ranking de matrículas e indicadores operacionais.'); c.innerHTML=links() + panel('Indicadores principais', state.data.indicadores||[], ['titulo','valor','fonte','descricao']); }
  if(page==='configuracao') { intro('Configuração','Sistema','Como conectar o Hub à planilha online.'); c.innerHTML=configPage(); }
}
function filterBusiness(term){
  const all=[...(state.data.calendario||[]),...(state.data.eventos||[]),...(state.data.acoesInternas||[]),...(state.data.acoesExternas||[])];
  const t=normalizeKey(term); return all.filter(r=>Object.values(r).some(v=>normalizeKey(v).includes(t)));
}
function meetingBlocks(){
  return `<div class="meeting-blocks"><div class="meeting-block"><h3>Dom Bosco</h3><p>Responsável: <strong>Ilana</strong></p></div><div class="meeting-block"><h3>UNDB e Medicina</h3><p>Responsável: <strong>Allyson</strong></p></div><div class="meeting-block"><h3>Ações</h3><p>Responsável: <strong>Marketing</strong></p></div></div>`;
}
function configPage(){
  const sample = `window.HUB_CONFIG = {\n  sheets: {\n    indicadores: 'COLE_AQUI_O_CSV_DA_ABA_INDICADORES',\n    calendario: 'COLE_AQUI_O_CSV_DA_ABA_CALENDARIO',\n    acoesInternas: 'COLE_AQUI_O_CSV_DA_ABA_ACOES_INTERNAS',\n    acoesExternas: 'COLE_AQUI_O_CSV_DA_ABA_ACOES_EXTERNAS',\n    eventos: 'COLE_AQUI_O_CSV_DA_ABA_EVENTOS',\n    reunioes: 'COLE_AQUI_O_CSV_DA_ABA_REUNIOES'\n  }\n}`;
  return `<section class="panel"><div class="panel-head"><h3>Conectar com planilha</h3></div><div style="padding:20px"><p>Publique cada aba como CSV e cole os links no arquivo <strong>js/config.js</strong>. Depois suba o arquivo atualizado no GitHub.</p><div class="admin-code"><code>${escapeHtml(sample)}</code></div><p class="footer-note">Quando os links estiverem preenchidos, o Hub atualizará os dados a cada carregamento e pelo botão “Atualizar dados”.</p></div></section>`;
}

async function init(){
  $('#powerBiMedicina').href = cfg.links?.medicina || '#';
  buildNav(); await loadAll(); state.page=(location.hash||'#visao-geral').slice(1); render();
  $('#toggleSidebar').onclick=()=>$('#sidebar').classList.toggle('open');
  $('#refreshData').onclick=async()=>{ await loadAll(); render(); };
  setInterval(async()=>{ await loadAll(); render(); }, (cfg.refreshMinutes||5)*60*1000);
}
init();
