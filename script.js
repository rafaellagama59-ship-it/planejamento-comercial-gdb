const SHEET_URL="https://docs.google.com/spreadsheets/d/1Fqx16iUm0_IF3tZdXZQwjsoXTqA-7JiZZJNyRlj6lwY/gviz/tq?tqx=out:json&gid=1149752512&range=H:P&cache=";
const months=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const statuses=["Planejado","Em andamento","Concluída","Pendente","Cancelada"];
const institutions=["UNDB","Dom Bosco","Pós-UNDB"];
const blankGoals=(arr)=>arr.map(m=>({month:m,items:[]}));
const base={
"2026":{actions:[
{period:"Junho",inst:["Dom Bosco"],theme:"Ação Final de Semana Junho",desc:"Ação externa de captação e relacionamento",channels:"Evento externo, WhatsApp, planilha",owner:"Comercial",status:"Em andamento",total:814,undb:0,db:814,pos:0},
{period:"Julho",inst:["UNDB"],theme:"Clínica de Férias",desc:"Experiência prática para acadêmicos da saúde",channels:"Instagram, Google, WhatsApp",owner:"Marketing + Comercial",status:"Planejado",total:0,undb:0,db:0,pos:0},
{period:"Julho",inst:["Dom Bosco"],theme:"Férias em Movimento",desc:"Captação e relacionamento nas férias",channels:"Instagram, WhatsApp",owner:"Thayana",status:"Planejado",total:0,undb:0,db:0,pos:0},
{period:"Agosto",inst:["Dom Bosco"],theme:"Campanha Matrícula 2027",desc:"Início da campanha de matrícula",channels:"Instagram, Google, WhatsApp",owner:"Marketing + Comercial",status:"Em andamento",total:0,undb:0,db:0,pos:0},
{period:"Setembro",inst:["Dom Bosco"],theme:"Dia da Família + Reserva",desc:"Relacionamento com responsáveis",channels:"Instagram, WhatsApp",owner:"Thayana",status:"Planejado",total:0,undb:0,db:0,pos:0},
{period:"Novembro",inst:["UNDB"],theme:"ENEM + Captação",desc:"Ações de captação no ENEM",channels:"Google, Instagram, WhatsApp",owner:"Marketing + Comercial",status:"Planejado",total:0,undb:0,db:0,pos:0},
{period:"Dezembro",inst:["Dom Bosco"],theme:"Férias em Movimento",desc:"Captação nas férias",channels:"Instagram, WhatsApp",owner:"Thayana",status:"Planejado",total:0,undb:0,db:0,pos:0}
],goals:blankGoals(months.slice(5))},
"2027":{actions:[
{period:"Janeiro",inst:["Dom Bosco"],theme:"Férias em Movimento",desc:"Captação e relacionamento nas férias",channels:"Instagram, WhatsApp",owner:"Thayana",status:"Planejado",total:0,undb:0,db:0,pos:0},
{period:"Janeiro",inst:["UNDB"],theme:"Captação de Início de Ano",desc:"Entrada 2027.1",channels:"Google, Instagram, WhatsApp",owner:"Marketing + Comercial",status:"Planejado",total:0,undb:0,db:0,pos:0},
{period:"Junho",inst:["UNDB","Dom Bosco"],theme:"Ações Juninas e Relacionamento",desc:"Ativações sazonais",channels:"Eventos externos, Instagram, WhatsApp",owner:"Comercial",status:"Planejado",total:0,undb:0,db:0,pos:0}
],goals:blankGoals(months)}
};
let year="2026";
let data=JSON.parse(localStorage.getItem("gdbEditavelInstLeadsV1")||"null")||structuredClone(base);
function save(){localStorage.setItem("gdbEditavelInstLeadsV1",JSON.stringify(data));}
function n(v){return Number(String(v??0).replace(/[^\d-]/g,""))||0}
function fmt(v){return v==="Sem meta"?"Sem meta":(Number(v)||0).toLocaleString("pt-BR")}
function calcDesv(it){if(!it.meta||it.meta==="Sem meta")return "—";let d=n(it.total)-n(it.meta);return d>0?"+"+d:String(d)}
function calcPerc(it){if(!it.meta||it.meta==="Sem meta")return "—";return Math.round((n(it.total)/n(it.meta))*100)+"%"}
function cls(v){if(v==="—")return "neutral";if(String(v).startsWith("+"))return "positive";if(String(v).startsWith("-"))return "negative";let p=n(v);if(p>=100)return"positive";if(p>=70)return"neutral";return"negative"}
function bar(p){if(p==="—")return "";let val=n(p);let c=val>=100?"":val>=70?"amber":"red";return `<span class="bar ${c}"><i style="width:${Math.min(val,100)}%"></i></span>`}
function td(value,cb){let cell=document.createElement("td");cell.contentEditable=true;cell.textContent=value;cell.onblur=()=>{cb(cell.textContent.trim());save();renderSummary()};cell.onkeydown=(e)=>{if(e.key==="Enter"){e.preventDefault();cell.blur()}};return cell}
function numInput(value,cb){
  let inp=document.createElement("input");
  inp.type="text";
  inp.inputMode="numeric";
  inp.value=String(value ?? 0);
  inp.onblur=()=>{
    const val=n(inp.value);
    inp.value=val;
    cb(val);
    save();
    renderSummary();
    renderGoals();
  };
  inp.onkeydown=(e)=>{
    if(e.key==="Enter"){
      e.preventDefault();
      inp.blur();
    }
  };
  return inp
}
function select(value,opts,cb){let s=document.createElement("select");opts.forEach(o=>{let op=document.createElement("option");op.value=o;op.textContent=o;if(o===value)op.selected=true;s.appendChild(op)});s.onchange=e=>{cb(e.target.value);save();render()};return s}
function multiInst(action){let box=document.createElement("div");box.className="inst-multi";institutions.forEach(name=>{let label=document.createElement("label");let input=document.createElement("input");input.type="checkbox";input.checked=action.inst.includes(name);input.onchange=()=>{if(input.checked&&!action.inst.includes(name))action.inst.push(name);if(!input.checked)action.inst=action.inst.filter(x=>x!==name);save();renderSummary()};label.append(input,document.createTextNode(name));box.appendChild(label)});return box}
function renderCalendar(){
  calendarYear.textContent=year;
  calendarBody.innerHTML="";
  data[year].actions.forEach((a,i)=>{
    let tr=document.createElement("tr");

    let p=document.createElement("td");
    p.appendChild(select(a.period,months,v=>a.period=v));
    tr.appendChild(p);

    let ins=document.createElement("td");
    ins.appendChild(multiInst(a));
    tr.appendChild(ins);

    tr.appendChild(td(a.theme,v=>a.theme=v));
    tr.appendChild(td(a.desc,v=>a.desc=v));
    tr.appendChild(td(a.channels,v=>a.channels=v));
    tr.appendChild(td(a.owner,v=>a.owner=v));

    let st=document.createElement("td");
    st.appendChild(select(a.status,statuses,v=>a.status=v));
    tr.appendChild(st);

    ["total","undb","db","pos"].forEach(k=>{
      let c=document.createElement("td");
      c.appendChild(numInput(a[k],v=>a[k]=v));
      tr.appendChild(c);
    });

    let del=document.createElement("td");
    let btn=document.createElement("button");
    btn.type="button";
    btn.className="delete-btn";
    btn.textContent="🗑️ Excluir";
    btn.onclick=()=>{
      if(confirm("Excluir esta ação?")){
        data[year].actions.splice(i,1);
        save();
        render();
      }
    };
    del.appendChild(btn);
    tr.appendChild(del);

    calendarBody.appendChild(tr);
  });
}

function renderGoals(){monthlyGoals.innerHTML="";data[year].goals.forEach(g=>{let total={meta:0,total:0,undb:0,db:0,pos:0};g.items.forEach(it=>{if(it.meta!=="Sem meta")total.meta+=n(it.meta);total.total+=n(it.total);total.undb+=n(it.undb);total.db+=n(it.db);total.pos+=n(it.pos)});let totalDesv=total.meta?total.total-total.meta:"—";let totalPerc=total.meta?Math.round(total.total/total.meta*100)+"%":"—";let rows=g.items.map((it,idx)=>{let desv=calcDesv(it),perc=calcPerc(it);return `<tr>
<td contenteditable="true" onblur="editGoal('${g.month}',${idx},'days',this.innerText)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}">${it.days}</td>
<td><input type="text" inputmode="numeric" value="${n(it.total)}" onblur="editGoal('${g.month}',${idx},'total',this.value)" onblur="editGoal('${g.month}',${idx},'total',this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"></td>
<td><input type="text" inputmode="numeric" value="${n(it.undb)}" onblur="editGoal('${g.month}',${idx},'undb',this.value)" onblur="editGoal('${g.month}',${idx},'undb',this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"></td>
<td><input type="text" inputmode="numeric" value="${n(it.db)}" onblur="editGoal('${g.month}',${idx},'db',this.value)" onblur="editGoal('${g.month}',${idx},'db',this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"></td>
<td><input type="text" inputmode="numeric" value="${n(it.pos)}" onblur="editGoal('${g.month}',${idx},'pos',this.value)" onblur="editGoal('${g.month}',${idx},'pos',this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"></td>
<td><input type="text" value="${it.meta}" onblur="editGoal('${g.month}',${idx},'meta',this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"></td>
<td class="${cls(desv)}">${desv}</td>
<td class="${cls(perc)}">${perc}${bar(perc)}</td></tr>`}).join("");if(!rows)rows=`<tr><td colspan="8" class="muted">Nenhuma ação cadastrada/sincronizada para este mês.</td></tr>`;monthlyGoals.innerHTML+=`<div class="month-block"><div class="month-head"><span>📅 ${g.month}</span><span><button onclick="addGoalItem('${g.month}')">+ ação</button> <span class="count">${g.items.length} ações</span></span></div><div class="table-wrap"><table class="month-table"><thead><tr><th>Dias da Ação</th><th>Total Leads</th><th>Leads UNDB</th><th>Leads DB</th><th>Leads Pós</th><th>Meta</th><th>Desvio</th><th>Atingimento</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td>TOTAL ${g.month.toUpperCase()}</td><td>${fmt(total.total)}</td><td>${fmt(total.undb)}</td><td>${fmt(total.db)}</td><td>${fmt(total.pos)}</td><td>${fmt(total.meta)}</td><td class="${cls(String(totalDesv))}">${totalDesv>0?"+"+totalDesv:totalDesv}</td><td class="${cls(totalPerc)}">${totalPerc}${bar(totalPerc)}</td></tr></tfoot></table></div></div>`})}
function editGoal(month,idx,key,value){let g=data[year].goals.find(x=>x.month===month);if(!g)return;g.items[idx][key]=key==="days"||key==="meta"?value:n(value);save();renderGoals();renderSummary()}
function addGoalItem(month){let g=data[year].goals.find(x=>x.month===month);if(!g){g={month,items:[]};data[year].goals.push(g)}g.items.push({days:"Nova ação",total:0,undb:0,db:0,pos:0,meta:0});save();renderGoals()}
function renderSummary(){let actions=data[year].actions;let sums={total:0,undb:0,db:0,pos:0};actions.forEach(a=>{sums.total+=n(a.total);sums.undb+=n(a.undb);sums.db+=n(a.db);sums.pos+=n(a.pos)});data[year].goals.forEach(g=>g.items.forEach(it=>{sums.total+=n(it.total);sums.undb+=n(it.undb);sums.db+=n(it.db);sums.pos+=n(it.pos)}));totalActions.textContent=actions.length;totalAllLeads.textContent=fmt(sums.total);totalUndbLeads.textContent=fmt(sums.undb);totalDbLeads.textContent=fmt(sums.db);totalPosLeads.textContent=fmt(sums.pos);undbLeadAside.textContent=fmt(sums.undb)+" leads";dbLeadAside.textContent=fmt(sums.db)+" leads";posLeadAside.textContent=fmt(sums.pos)+" leads";undbCount.textContent=actions.filter(a=>a.inst.includes("UNDB")).length+" ações";dbCount.textContent=actions.filter(a=>a.inst.includes("Dom Bosco")).length+" ações";posCount.textContent=actions.filter(a=>a.inst.includes("Pós-UNDB")).length+" ações"}
function parseGviz(text){return JSON.parse(text.substring(text.indexOf("{"),text.lastIndexOf("}")+1))}
function monthName(v,current){return /janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro/i.test(v)?v:current}
async function sync(){
  syncStatus.textContent="Sincronizando com Google Sheets...";
  try{
    let res=await fetch(SHEET_URL+Date.now());
    let json=parseGviz(await res.text());
    let rows=json.table.rows.map(r=>r.c.map(c=>c?String(c.v).trim():""));
    let items=[];
    let current="Junho";
    let header=[];

    rows.forEach(v=>{
      const joined=v.join(" ").toUpperCase();
      if(joined.includes("DIAS") && (joined.includes("LEADS") || joined.includes("CAPTADOS"))){
        header=v.map(x=>String(x||"").trim().toUpperCase());
        return;
      }

      current=monthName(v[0],current);
      let dias=v[1];
      if(!dias||String(dias).toUpperCase().includes("DIAS")||String(dias).toUpperCase().includes("TOTAL")||String(dias).toUpperCase().includes("MÊS"))return;

      // Modelo novo recomendado H:P:
      // H Mês | I Dias | J Total Leads | K Leads UNDB | L Leads DB | M Leads Pós | N Meta | O Desvio | P Atingimento
      // Modelo atual/antigo H:M:
      // H Mês | I Dias | J Leads Captados | K Meta | L Desvio | M Atingimento
      const temLeadsPorInstituicao = header.some(h=>h.includes("UNDB")) || header.some(h=>h.includes("PÓS")) || header.some(h=>h.includes("POS")) || header.some(h=>h.includes("DB"));

      let total=0, undb=0, db=0, pos=0, meta=0;

      if(temLeadsPorInstituicao){
        total=n(v[2]);
        undb=n(v[3]);
        db=n(v[4]);
        pos=n(v[5]);
        meta=String(v[6]||"").toLowerCase().includes("sem")?"Sem meta":n(v[6]);
        if(total===0)total=undb+db+pos;
      }else{
        // Compatível com sua tabela atual: J = Leads Captados / K = Meta.
        total=n(v[2]);
        meta=String(v[3]||"").toLowerCase().includes("sem")?"Sem meta":n(v[3]);
        undb=0; db=0; pos=0;
      }

      items.push({month:current,days:dias,total,undb,db,pos,meta});
    });

    let map={};
    data[year].goals.forEach(g=>{g.items=[];map[g.month]=g});
    items.forEach(it=>{
      if(!map[it.month]){map[it.month]={month:it.month,items:[]};data[year].goals.push(map[it.month])}
      map[it.month].items.push(it)
    });

    save();render();
    syncStatus.textContent=`Sincronização concluída: ${items.length} ações encontradas no Google Sheets.`;
  }catch(e){
    syncStatus.textContent="Erro ao sincronizar. Confira se a planilha está publicada e se a tabela está em H:P ou H:M.";
  }
}
function render(){document.querySelectorAll(".year").forEach(b=>b.classList.toggle("active",b.dataset.year===year));renderCalendar();renderGoals();renderSummary()}
document.querySelectorAll(".year").forEach(b=>b.onclick=()=>{year=b.dataset.year;render()});
document.querySelectorAll(".theme").forEach(b=>b.onclick=()=>{document.querySelectorAll(".theme").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.body.className=b.dataset.theme==="padrao"?"":"theme-"+b.dataset.theme;localStorage.setItem("gdbThemeEditavel",b.dataset.theme)});
syncBtn.onclick=sync;
addAction.onclick=()=>{data[year].actions.push({period:"Janeiro",inst:["UNDB"],theme:"Nova ação",desc:"Descreva a ação",channels:"Definir canais",owner:"Responsável",status:"Planejado",total:0,undb:0,db:0,pos:0});save();render()};
backupBtn.onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="backup-calendario-gdb.json";a.click()};
restoreBtn.onclick=()=>restoreFile.click();
restoreFile.onchange=e=>{let file=e.target.files[0];if(!file)return;let reader=new FileReader();reader.onload=()=>{try{data=JSON.parse(reader.result);save();render();alert("Backup restaurado!") }catch(err){alert("Arquivo inválido")}};reader.readAsText(file)};
note.oninput=()=>localStorage.setItem("gdbNoteEditavel",note.innerHTML);if(localStorage.getItem("gdbNoteEditavel"))note.innerHTML=localStorage.getItem("gdbNoteEditavel");
let t=localStorage.getItem("gdbThemeEditavel")||"padrao";document.querySelector(`[data-theme="${t}"]`)?.click();render();


function initVisitUndbSection(){
  const visitFields = document.querySelectorAll("[data-visit-field]");
  visitFields.forEach(el=>{
    const key = "gdbVisitUndb_" + el.dataset.visitField;
    const saved = localStorage.getItem(key);
    if(saved) el.innerHTML = saved;
    el.addEventListener("blur", ()=>localStorage.setItem(key, el.innerHTML));
  });

  const copyBtn = document.getElementById("copyVisitSummary");
  if(copyBtn){
    copyBtn.onclick = async ()=>{
      const text = `Agendamento de Visita UNDB

Além do Giro das Profissões, escolas que desejam visitar a UNDB fora do projeto anual poderão solicitar o agendamento pelo site:
https://undb.edu.br/agende-uma-visita/

O interesse será direcionado para o e-mail da Thayana. Ela fará o contato com a escola para alinhar data, horário, curso de interesse e quantidade de alunos. Depois, validará a disponibilidade com a coordenação do curso.`;
      try{
        await navigator.clipboard.writeText(text);
        alert("Resumo copiado!");
      }catch(e){
        alert(text);
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", initVisitUndbSection);
