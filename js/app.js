const STORE_KEY = "hub-inteligencia-comercial-editavel-v1";
const statusOptions = ["Planejado","Em andamento","Concluído","Atrasado","Aguardando terceiro","Cancelado"];
const areas = ["Dom Bosco","UNDB Graduação","Pós-Graduação","Medicina","Eventos e Ações","Marketing","Comercial"];
const responsaveis = ["Ilana","Allyson","Fábio","Nathalia","Rick","Rafaela","Thayana","Marketing","Comercial"];

const defaultState = {
  indicadores: [
    {titulo:"Matrículas 2026.2 UNDB", valor:"--", fonte:"Fonte: RM / Power BI UNDB", destaque:true},
    {titulo:"Matrículas Dom Bosco 2026", valor:"--", fonte:"Fonte: RM / Power BI Escola", destaque:true},
    {titulo:"Matrículas Medicina 2026.2", valor:"--", fonte:"Fonte: RM / Power BI Medicina", destaque:true},
    {titulo:"Inscritos no vestibular de Med", valor:"--", fonte:"Processo seletivo tradicional", destaque:false},
    {titulo:"Inscritos ENEM Med", valor:"--", fonte:"Entrada via ENEM", destaque:false},
    {titulo:"Inscritos Transferência Externa Med", valor:"--", fonte:"Transferência externa Medicina", destaque:false}
  ],
  calendario: [
    {periodo:"Julho", acao:"Clínica de Férias", area:"UNDB Graduação", responsavel:"Marketing", prazo:"2026-07-01", status:"Planejado", observacoes:"Experiência prática para acadêmicos da saúde."},
    {periodo:"Julho", acao:"Férias em Movimento", area:"Dom Bosco", responsavel:"Ilana", prazo:"2026-07-01", status:"Em andamento", observacoes:"Captação e relacionamento nas férias."}
  ],
  internas: [
    {data:"2026-07-01", acao:"Alinhamento de captação", area:"Marketing", responsavel:"Rafaela", prazo:"2026-07-05", status:"Planejado", observacoes:"Definir régua de acompanhamento."}
  ],
  externas: [
    {data:"2026-07-01", acao:"Ação em praça/evento", area:"Eventos e Ações", responsavel:"Marketing", prazo:"2026-07-10", status:"Planejado", observacoes:"Registrar leads por negócio."}
  ],
  eventos: [
    {data:"2026-07-01", evento:"Evento exemplo", negocio:"Dom Bosco", responsavel:"Marketing", status:"Planejado", leadsDB:"0", leadsUNDB:"0", leadsPos:"0", custo:"0", observacoes:""}
  ],
  reunioes: [
    {data:"2026-07-06", bloco:"Dom Bosco", responsavel:"Ilana", tarefa:"Acompanhar demandas comerciais da escola", prazo:"2026-07-10", status:"Planejado", observacoes:"Reunião de segunda-feira."},
    {data:"2026-07-06", bloco:"UNDB e Medicina", responsavel:"Allyson", tarefa:"Atualizar status de inscrições e matrículas", prazo:"2026-07-10", status:"Planejado", observacoes:""},
    {data:"2026-07-06", bloco:"Ações - Marketing", responsavel:"Rafaela", tarefa:"Organizar ações e próximos passos", prazo:"2026-07-10", status:"Planejado", observacoes:""}
  ],
  links: [
    {nome:"Power BI Medicina", url: window.HUB_CONFIG?.powerbi?.medicina || ""},
    {nome:"Power BI Dom Bosco", url: window.HUB_CONFIG?.powerbi?.domBosco || ""},
    {nome:"Ranking Matrículas Call Center", url: window.HUB_CONFIG?.powerbi?.rankingCallCenter || ""}
  ]
};

let state = loadState();
let current = "visao";
const pages = [
  {id:"visao", icon:"📊", label:"Visão Geral", subtitle:"Indicadores principais por negócio."},
  {id:"calendario", icon:"📅", label:"Calendário Comercial", subtitle:"Planejamento comercial e ações por período."},
  {id:"dom", icon:"🏫", label:"Escola Dom Bosco", subtitle:"Acompanhamento comercial da escola."},
  {id:"undb", icon:"🎓", label:"UNDB Graduação", subtitle:"Acompanhamento comercial da graduação."},
  {id:"pos", icon:"🎯", label:"Pós-Graduação", subtitle:"Acompanhamento comercial da pós."},
  {id:"medicina", icon:"🩺", label:"Medicina", subtitle:"Processos seletivos, inscritos e links do Power BI."},
  {id:"eventos", icon:"🎪", label:"Eventos", subtitle:"Eventos realizados, leads, custos e responsáveis."},
  {id:"internas", icon:"🏢", label:"Ações Internas", subtitle:"Ações internas e demandas por responsável."},
  {id:"externas", icon:"🌎", label:"Ações Externas", subtitle:"Ações externas e ativações de campo."},
  {id:"reunioes", icon:"🤝", label:"Reunião Comercial", subtitle:"Demandas da reunião de segunda-feira."},
  {id:"links", icon:"🔗", label:"Power BI", subtitle:"Links dos dashboards estratégicos."}
];

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || structuredClone(defaultState); }
  catch(e){ return structuredClone(defaultState); }
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); toast("Alterações salvas neste navegador."); }
function resetState(){ state = structuredClone(defaultState); saveState(); render(); }

function init(){ renderNav(); bindGlobal(); routeFromHash(); window.addEventListener("hashchange", routeFromHash); }
function renderNav(){
  document.getElementById("nav").innerHTML = pages.map(p=>`<button class="nav-btn" data-id="${p.id}">${p.icon} ${p.label}</button>`).join("");
  document.querySelectorAll(".nav-btn").forEach(btn=>btn.onclick=()=>{ location.hash = btn.dataset.id; });
}
function routeFromHash(){ current = location.hash.replace("#","") || "visao"; if(!pages.some(p=>p.id===current)) current="visao"; render(); }
function bindGlobal(){
  document.getElementById("saveBtn").onclick = saveState;
  document.getElementById("exportBtn").onclick = exportBackup;
  document.getElementById("importFile").onchange = importBackup;
}
function render(){
  const page = pages.find(p=>p.id===current);
  document.getElementById("pageTitle").textContent = page.label;
  document.getElementById("pageSubtitle").textContent = page.subtitle;
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.id===current));
  const view = document.getElementById("view");
  if(current==="visao") view.innerHTML = renderVisao();
  if(current==="calendario") view.innerHTML = renderSimpleTable("calendario", columnsCalendario());
  if(current==="dom") view.innerHTML = renderNegocio("Dom Bosco", "domBosco");
  if(current==="undb") view.innerHTML = renderNegocio("UNDB Graduação", "");
  if(current==="pos") view.innerHTML = renderNegocio("Pós-Graduação", "");
  if(current==="medicina") view.innerHTML = renderMedicina();
  if(current==="eventos") view.innerHTML = renderSimpleTable("eventos", columnsEventos());
  if(current==="internas") view.innerHTML = renderSimpleTable("internas", columnsAcoes());
  if(current==="externas") view.innerHTML = renderSimpleTable("externas", columnsAcoes());
  if(current==="reunioes") view.innerHTML = renderSimpleTable("reunioes", columnsReunioes());
  if(current==="links") view.innerHTML = renderLinks();
  bindEditable(); bindTables();
}
function renderVisao(){
  return `<section class="panel"><h2>Indicadores principais</h2><p>Todos os textos e valores abaixo são editáveis. Clique no campo, altere e depois salve.</p></section>
  <section class="grid kpi-grid">${state.indicadores.map((k,i)=>`<article class="card kpi ${k.destaque?'primary':''}">
    <label class="editable" contenteditable data-path="indicadores.${i}.titulo">${escapeHtml(k.titulo)}</label>
    <div class="value editable" contenteditable data-path="indicadores.${i}.valor">${escapeHtml(k.valor)}</div>
    <div class="source editable" contenteditable data-path="indicadores.${i}.fonte">${escapeHtml(k.fonte)}</div>
  </article>`).join("")}</section>`;
}
function renderNegocio(nome, linkKey){
  const link = linkKey ? window.HUB_CONFIG?.powerbi?.[linkKey] : "";
  return `<section class="panel"><h2>${nome}</h2><p>Área editável para acompanhamento do negócio. Use as tabelas do calendário, eventos e reunião para registrar ações.</p></section>
  <section class="grid kpi-grid">${state.indicadores.slice(0,3).map((k,i)=>`<article class="card kpi"><label>${escapeHtml(k.titulo)}</label><div class="value">${escapeHtml(k.valor)}</div><div class="source">${escapeHtml(k.fonte)}</div></article>`).join("")}</section>
  ${link ? `<section class="panel link-card"><div><h2>Dashboard Power BI</h2><p>Abrir painel detalhado.</p></div><a class="btn primary" target="_blank" href="${link}">Abrir Power BI</a></section>`:""}`;
}
function renderMedicina(){
  return `${renderNegocio("Medicina", "medicina")}<section class="panel"><h2>Indicadores de Medicina</h2><p>Os três indicadores de inscritos ficam na Visão Geral e podem ser editados lá.</p></section>`;
}
function columnsCalendario(){return [
  ["periodo","Período","text"],["acao","Ação","textarea"],["area","Área","area"],["responsavel","Responsável","responsavel"],["prazo","Prazo","date"],["status","Status","status"],["observacoes","Observações","textarea"]
]}
function columnsAcoes(){return [["data","Data","date"],["acao","Ação","textarea"],["area","Área","area"],["responsavel","Responsável","responsavel"],["prazo","Prazo","date"],["status","Status","status"],["observacoes","Observações","textarea"]]}
function columnsReunioes(){return [["data","Data","date"],["bloco","Bloco","text"],["responsavel","Responsável","responsavel"],["tarefa","Tarefa/Demanda","textarea"],["prazo","Prazo","date"],["status","Status","status"],["observacoes","Observações","textarea"]]}
function columnsEventos(){return [["data","Data","date"],["evento","Evento","textarea"],["negocio","Negócio","area"],["responsavel","Responsável","responsavel"],["status","Status","status"],["leadsDB","Leads DB","number"],["leadsUNDB","Leads UNDB","number"],["leadsPos","Leads Pós","number"],["custo","Custo","number"],["observacoes","Observações","textarea"]]}
function renderSimpleTable(key, columns){
  return `<section class="panel"><h2>${titleByKey(key)}</h2><p>Edite qualquer campo, escolha o status e salve.</p><div class="toolbar"><button class="btn primary" data-add="${key}">+ Nova linha</button><button class="btn ghost" onclick="saveState()">Salvar alterações</button></div></section>
  <div class="table-wrap"><table class="data-table"><thead><tr>${columns.map(c=>`<th>${c[1]}</th>`).join("")}<th>Ações</th></tr></thead><tbody>
  ${state[key].map((row,i)=>`<tr>${columns.map(c=>`<td>${field(key,i,c,row[c[0]] ?? "")}</td>`).join("")}<td><button class="btn small danger" data-del="${key}" data-index="${i}">Excluir</button></td></tr>`).join("")}
  </tbody></table></div>`;
}
function field(key,i,c,value){
  const [prop,label,type] = c; const path = `${key}.${i}.${prop}`;
  if(type==="textarea") return `<textarea class="cell-textarea" data-input="${path}">${escapeHtml(value)}</textarea>`;
  if(type==="status") return `<select class="cell-select ${statusClass(value)}" data-input="${path}">${statusOptions.map(s=>`<option ${s===value?'selected':''}>${s}</option>`).join("")}</select>`;
  if(type==="area") return `<select class="cell-select" data-input="${path}">${areas.map(s=>`<option ${s===value?'selected':''}>${s}</option>`).join("")}</select>`;
  if(type==="responsavel") return `<select class="cell-select" data-input="${path}">${responsaveis.map(s=>`<option ${s===value?'selected':''}>${s}</option>`).join("")}</select>`;
  if(type==="date") return `<input class="cell-date" type="date" data-input="${path}" value="${escapeHtml(value)}">`;
  if(type==="number") return `<input class="cell-number" type="number" data-input="${path}" value="${escapeHtml(value)}">`;
  return `<input class="cell-input" type="text" data-input="${path}" value="${escapeHtml(value)}">`;
}
function bindEditable(){
  document.querySelectorAll("[contenteditable][data-path]").forEach(el=>{el.oninput=()=>setPath(el.dataset.path, el.textContent.trim());});
}
function bindTables(){
  document.querySelectorAll("[data-input]").forEach(el=>{el.oninput=()=>{setPath(el.dataset.input, el.value); if(el.tagName==="SELECT") el.className = `cell-select ${statusClass(el.value)}`;}; el.onchange=el.oninput;});
  document.querySelectorAll("[data-add]").forEach(btn=>btn.onclick=()=>addRow(btn.dataset.add));
  document.querySelectorAll("[data-del]").forEach(btn=>btn.onclick=()=>{state[btn.dataset.del].splice(Number(btn.dataset.index),1); render();});
}
function addRow(key){
  const map = {calendario:{periodo:"",acao:"Nova ação",area:"Marketing",responsavel:"Rafaela",prazo:"",status:"Planejado",observacoes:""}, internas:{data:"",acao:"Nova ação interna",area:"Marketing",responsavel:"Rafaela",prazo:"",status:"Planejado",observacoes:""}, externas:{data:"",acao:"Nova ação externa",area:"Eventos e Ações",responsavel:"Marketing",prazo:"",status:"Planejado",observacoes:""}, eventos:{data:"",evento:"Novo evento",negocio:"Dom Bosco",responsavel:"Marketing",status:"Planejado",leadsDB:"0",leadsUNDB:"0",leadsPos:"0",custo:"0",observacoes:""}, reunioes:{data:"",bloco:"",responsavel:"Rafaela",tarefa:"Nova demanda",prazo:"",status:"Planejado",observacoes:""}};
  state[key].push(map[key]); render();
}
function renderLinks(){
  return `<section class="panel"><h2>Dashboards Power BI</h2><p>Links estratégicos do Hub.</p></section><section class="grid">${state.links.map((l,i)=>`<article class="card link-card"><div><strong class="editable" contenteditable data-path="links.${i}.nome">${escapeHtml(l.nome)}</strong><p class="editable" contenteditable data-path="links.${i}.url">${escapeHtml(l.url)}</p></div><a class="btn primary" target="_blank" href="${escapeHtml(l.url)}">Abrir</a></article>`).join("")}</section>`;
}
function setPath(path,value){ const parts=path.split("."); let obj=state; while(parts.length>1){obj=obj[parts.shift()];} obj[parts[0]]=value; }
function titleByKey(k){ return {calendario:"Calendário Comercial", internas:"Ações Internas", externas:"Ações Externas", eventos:"Eventos", reunioes:"Reunião Comercial"}[k] || k; }
function statusClass(s){ return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll(' ','-').replace('em-andamento','andamento'); }
function escapeHtml(v){ return String(v).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }
function toast(msg){ const old=document.querySelector('.toast'); if(old) old.remove(); const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2600); }
function exportBackup(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='backup-hub-inteligencia-comercial.json'; a.click(); URL.revokeObjectURL(a.href); }
function importBackup(e){ const file=e.target.files[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{ try{ state=JSON.parse(reader.result); saveState(); render(); }catch(err){ alert('Arquivo inválido.'); }}; reader.readAsText(file); }
init();
