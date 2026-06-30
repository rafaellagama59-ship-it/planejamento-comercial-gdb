const STATUS = ["Planejado","Em andamento","Concluído","Atrasado","Cancelado"];
const AREAS = ["Dom Bosco","UNDB","Medicina","Pós-graduação","Marketing","Ações","Comercial"];
const STORAGE_KEY = "hub-inteligencia-comercial-v4";

const pages = [
  {id:"home", icon:"📊", title:"Visão Geral", group:"Principal", subtitle:"Home com os principais indicadores comerciais por negócio."},
  {id:"calendario", icon:"📅", title:"Calendário Comercial", group:"Principal", subtitle:"Planejamento macro de campanhas, ações e datas comerciais."},
  {id:"dom-bosco", icon:"🏫", title:"Escola Dom Bosco", group:"Negócios", subtitle:"Acompanhamento do negócio Escola Dom Bosco."},
  {id:"undb", icon:"🎓", title:"UNDB Graduação", group:"Negócios", subtitle:"Acompanhamento comercial da graduação."},
  {id:"pos", icon:"🎯", title:"Pós-Graduação", group:"Negócios", subtitle:"Acompanhamento comercial da pós-graduação."},
  {id:"medicina", icon:"🩺", title:"Medicina", group:"Negócios", subtitle:"Processos seletivos, vestibular, ENEM e transferência externa."},
  {id:"eventos", icon:"🎪", title:"Eventos", group:"Operação", subtitle:"Eventos realizados, planejados, leads e custos."},
  {id:"acoes-internas", icon:"🏢", title:"Ações Internas", group:"Operação", subtitle:"Ações internas do calendário comercial."},
  {id:"acoes-externas", icon:"🌎", title:"Ações Externas", group:"Operação", subtitle:"Ações externas, visitas, ativações e captação."},
  {id:"reunioes", icon:"🤝", title:"Reunião Comercial", group:"Gestão", subtitle:"Demandas da reunião de segunda-feira: data, responsáveis, tarefas e observações."},
  {id:"metas", icon:"🎯", title:"Metas e Power BI", group:"Gestão", subtitle:"Links dos dashboards e metas de acompanhamento."}
];

const defaultData = {
  indicadores: [
    {titulo:"Matrículas 2026.2 UNDB", valor:"--", fonte:"Fonte: RM / Power BI UNDB"},
    {titulo:"Matrículas Dom Bosco 2026", valor:"--", fonte:"Fonte: RM / Power BI Escola"},
    {titulo:"Matrículas Medicina 2026.2", valor:"--", fonte:"Fonte: RM / Power BI Medicina"},
    {titulo:"Inscritos no vestibular de Med", valor:"--", fonte:"Processo seletivo tradicional"},
    {titulo:"Inscritos ENEM Med", valor:"--", fonte:"Entrada via ENEM"},
    {titulo:"Inscritos Transferência Externa Med", valor:"--", fonte:"Transferência externa Medicina"}
  ],
  calendario: [
    {periodo:"Julho", instituicao:"UNDB / Medicina", tema:"Clínica de Férias", descricao:"Experiência prática para acadêmicos da saúde", canais:"Instagram, Google, WhatsApp", responsavel:"Marketing + Comercial", prazo:"01/07/2026", status:"Planejado", observacoes:"Acompanhar captação"},
    {periodo:"Agosto", instituicao:"Dom Bosco", tema:"Campanha Matrícula 2027", descricao:"Abertura de captação e reserva de vagas", canais:"WhatsApp, Meta, visitas", responsavel:"Ilana", prazo:"15/08/2026", status:"Em andamento", observacoes:"Alinhar calendário com escola"}
  ],
  acoesInternas: [
    {data:"", area:"Marketing", acao:"Revisar calendário interno", responsavel:"Rafaela", prazo:"", status:"Planejado", observacoes:""}
  ],
  acoesExternas: [
    {data:"", area:"Ações", acao:"Visita comercial externa", responsavel:"Marketing", prazo:"", status:"Planejado", observacoes:""}
  ],
  eventos: [
    {data:"", evento:"Giro das Profissões", negocio:"UNDB", responsavel:"Marketing", leads:"", custo:"", status:"Planejado", observacoes:""}
  ],
  reunioes: [
    {data:"", bloco:"Dom Bosco", responsavel:"Ilana", tarefa:"", prazo:"", status:"Planejado", observacoes:""},
    {data:"", bloco:"UNDB e Medicina", responsavel:"Allyson", tarefa:"", prazo:"", status:"Planejado", observacoes:""},
    {data:"", bloco:"Ações - Marketing", responsavel:"Marketing", tarefa:"", prazo:"", status:"Planejado", observacoes:""}
  ],
  negocio: [
    {area:"Dom Bosco", indicador:"Leads", valor:"", meta:"", responsavel:"Ilana", status:"Planejado", observacoes:""},
    {area:"UNDB", indicador:"Matrículas", valor:"", meta:"", responsavel:"Allyson", status:"Planejado", observacoes:""},
    {area:"Pós-graduação", indicador:"Leads", valor:"", meta:"", responsavel:"Marketing", status:"Planejado", observacoes:""},
    {area:"Medicina", indicador:"Inscritos", valor:"", meta:"", responsavel:"Allyson", status:"Planejado", observacoes:""}
  ]
};

let data = loadData();
let currentPage = location.hash.replace("#","") || "home";

function loadData(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultData); }
  catch { return structuredClone(defaultData); }
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); flash("Alterações salvas."); }
function resetData(){ if(confirm("Restaurar dados de exemplo? Isso apaga as edições salvas neste navegador.")){ data=structuredClone(defaultData); saveData(); render(); } }
function flash(msg){ const old=document.querySelector(".toast"); if(old) old.remove(); const t=document.createElement("div"); t.className="toast"; t.textContent=msg; Object.assign(t.style,{position:"fixed",right:"22px",bottom:"22px",background:"#062b63",color:"#fff",padding:"14px 18px",borderRadius:"12px",fontWeight:"900",zIndex:9}); document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }

function buildNav(){
  const nav=document.getElementById("nav"); nav.innerHTML=""; let group="";
  pages.forEach(p=>{ if(p.group!==group){ group=p.group; const s=document.createElement("div"); s.className="nav-section"; s.textContent=group; nav.appendChild(s); }
    const b=document.createElement("button"); b.className="nav-item"+(p.id===currentPage?" active":""); b.innerHTML=`<span>${p.icon}</span><span>${p.title}</span>`; b.onclick=()=>{ currentPage=p.id; location.hash=p.id; render(); }; nav.appendChild(b);
  });
}

function setHeader(){ const p=pages.find(x=>x.id===currentPage)||pages[0]; pageTitle.textContent=p.title; pageSubtitle.textContent=p.subtitle; addRowBtn.style.display = ["home","metas"].includes(currentPage)?"none":"inline-block"; }

function editable(value, path, type="text"){
  const [collection,row,key]=path;
  return `<input type="${type}" value="${escapeHtml(value||"")}" data-collection="${collection}" data-row="${row}" data-key="${key}">`;
}
function textarea(value,path){ const [collection,row,key]=path; return `<textarea data-collection="${collection}" data-row="${row}" data-key="${key}">${escapeHtml(value||"")}</textarea>`; }
function select(value,path, options=STATUS){ const [collection,row,key]=path; return `<select data-collection="${collection}" data-row="${row}" data-key="${key}">${options.map(o=>`<option ${o===(value||"")?"selected":""}>${escapeHtml(o)}</option>`).join("")}</select>`; }
function escapeHtml(v){ return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;"); }

function renderHome(){
  content.innerHTML = `<div class="notice"><strong>Visão Geral</strong><br>Esses 6 cards são editáveis. Quando a planilha estiver conectada no <code>js/config.js</code>, eles podem ser alimentados automaticamente.</div><div class="grid kpi-grid">${data.indicadores.map((k,i)=>`<div class="card kpi"><label>${editable(k.titulo,["indicadores",i,"titulo"])}</label><div class="value">${editable(k.valor,["indicadores",i,"valor"])}</div><div class="muted">${editable(k.fonte,["indicadores",i,"fonte"])}</div></div>`).join("")}</div>${powerCards()}`;
}
function powerCards(){ const p=window.HUB_CONFIG.powerBI; return `<div class="grid power-grid"><div class="card power-card"><h3>Power BI Medicina</h3><p>Processos seletivos e indicadores de Medicina.</p><a target="_blank" href="${p.medicina}">Abrir dashboard</a></div><div class="card power-card"><h3>Power BI Dom Bosco</h3><p>Captação e acompanhamento da Escola.</p><a target="_blank" href="${p.domBosco}">Abrir dashboard</a></div><div class="card power-card"><h3>Ranking Call Center</h3><p>Ranking de matrículas do call center.</p><a target="_blank" href="${p.callCenter}">Abrir dashboard</a></div></div>`; }

function renderTable(collection, columns, title){
  const rows=data[collection]||[];
  content.innerHTML = `<div class="section-title"><h2>${title}</h2><span>${rows.length} registros</span></div><div class="table-wrap"><table><thead><tr>${columns.map(c=>`<th>${c.label}</th>`).join("")}<th>Ação</th></tr></thead><tbody>${rows.map((r,i)=>`<tr>${columns.map(c=>`<td>${cell(collection,i,c,r[c.key])}</td>`).join("")}<td><button class="delete-row" data-del="${collection}" data-row="${i}">Excluir</button></td></tr>`).join("")}</tbody></table></div>`;
}
function cell(collection,i,c,value){
  if(c.type==="textarea") return textarea(value,[collection,i,c.key]);
  if(c.type==="status") return select(value,[collection,i,c.key],STATUS);
  if(c.type==="area") return select(value,[collection,i,c.key],AREAS);
  if(c.type==="number") return editable(value,[collection,i,c.key],"number");
  if(c.type==="date") return editable(value,[collection,i,c.key],"date");
  return editable(value,[collection,i,c.key]);
}
const col = {
  calendario:[{key:"periodo",label:"Período"},{key:"instituicao",label:"Instituição"},{key:"tema",label:"Tema"},{key:"descricao",label:"Descrição",type:"textarea"},{key:"canais",label:"Canais"},{key:"responsavel",label:"Responsável"},{key:"prazo",label:"Prazo",type:"date"},{key:"status",label:"Status",type:"status"},{key:"observacoes",label:"Observações",type:"textarea"}],
  acoesInternas:[{key:"data",label:"Data",type:"date"},{key:"area",label:"Área",type:"area"},{key:"acao",label:"Ação/Tarefa"},{key:"responsavel",label:"Responsável"},{key:"prazo",label:"Prazo",type:"date"},{key:"status",label:"Status",type:"status"},{key:"observacoes",label:"Observações",type:"textarea"}],
  acoesExternas:[{key:"data",label:"Data",type:"date"},{key:"area",label:"Área",type:"area"},{key:"acao",label:"Ação/Tarefa"},{key:"responsavel",label:"Responsável"},{key:"prazo",label:"Prazo",type:"date"},{key:"status",label:"Status",type:"status"},{key:"observacoes",label:"Observações",type:"textarea"}],
  eventos:[{key:"data",label:"Data",type:"date"},{key:"evento",label:"Evento"},{key:"negocio",label:"Negócio",type:"area"},{key:"responsavel",label:"Responsável"},{key:"leads",label:"Leads",type:"number"},{key:"custo",label:"Custo"},{key:"status",label:"Status",type:"status"},{key:"observacoes",label:"Observações",type:"textarea"}],
  reunioes:[{key:"data",label:"Data",type:"date"},{key:"bloco",label:"Bloco"},{key:"responsavel",label:"Responsável"},{key:"tarefa",label:"Tarefa/Demanda",type:"textarea"},{key:"prazo",label:"Prazo",type:"date"},{key:"status",label:"Status",type:"status"},{key:"observacoes",label:"Observações",type:"textarea"}],
  negocio:[{key:"area",label:"Área",type:"area"},{key:"indicador",label:"Indicador"},{key:"valor",label:"Valor"},{key:"meta",label:"Meta"},{key:"responsavel",label:"Responsável"},{key:"status",label:"Status",type:"status"},{key:"observacoes",label:"Observações",type:"textarea"}]
};
function render(){ buildNav(); setHeader(); if(currentPage==="home") return renderHome(); if(currentPage==="metas") { content.innerHTML=powerCards()+`<div class="notice" style="margin-top:16px">Use a planilha-base para alimentar metas e links. Os botões acima já estão cadastrados no <code>js/config.js</code>.</div>`; return; } const map={"calendario":"calendario","acoes-internas":"acoesInternas","acoes-externas":"acoesExternas","eventos":"eventos","reunioes":"reunioes","dom-bosco":"negocio","undb":"negocio","pos":"negocio","medicina":"negocio"}; const collection=map[currentPage]||"calendario"; renderTable(collection,col[collection], pages.find(p=>p.id===currentPage).title); }

function addRow(){ const map={"calendario":"calendario","acoes-internas":"acoesInternas","acoes-externas":"acoesExternas","eventos":"eventos","reunioes":"reunioes","dom-bosco":"negocio","undb":"negocio","pos":"negocio","medicina":"negocio"}; const collection=map[currentPage]; if(!collection) return; const row={}; col[collection].forEach(c=> row[c.key]= c.type==="status"?"Planejado":""); data[collection].push(row); render(); }

document.addEventListener("input", e=>{ const el=e.target; if(!el.dataset.collection) return; data[el.dataset.collection][Number(el.dataset.row)][el.dataset.key]=el.value; });
document.addEventListener("change", e=>{ const el=e.target; if(!el.dataset.collection) return; data[el.dataset.collection][Number(el.dataset.row)][el.dataset.key]=el.value; });
document.addEventListener("click", e=>{ if(e.target.dataset.del){ data[e.target.dataset.del].splice(Number(e.target.dataset.row),1); render(); }});
saveBtn.onclick=saveData; resetBtn.onclick=resetData; addRowBtn.onclick=addRow; window.addEventListener("hashchange",()=>{ currentPage=location.hash.replace("#","")||"home"; render(); });
render();
