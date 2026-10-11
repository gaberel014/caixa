const STORAGE_KEY = "caixa-business-v2";
const OLD_STORAGE_KEY = "caixa-app-transactions-v1";
const categories = {
  entrada: ["Serviços", "Produtos", "Consultoria", "Reembolso", "Outros"],
  saida: ["Operação", "Ferramentas", "Impostos", "Transporte", "Pró-labore", "Outros"],
};
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const longDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
const shortDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
const today = new Date(); today.setHours(0, 0, 0, 0);
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const offsetDate = days => { const d = new Date(today); d.setDate(d.getDate()+days); return isoDate(d); };
const monthOffset = (months, day=12) => isoDate(new Date(today.getFullYear(), today.getMonth()+months, day));
const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const money = amount => currency.format(Number(amount) || 0);
const dateObject = value => { const [y,m,d] = String(value || "").split("-").map(Number); return y && m && d ? new Date(y,m-1,d,12) : new Date(NaN); };
const monthKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
const monthLabel = date => new Intl.DateTimeFormat("pt-BR", { month:"short", year:"2-digit" }).format(date).replace(".","");
const dateLabel = value => { const d=dateObject(value); return Number.isNaN(d.getTime()) ? "—" : shortDate.format(d).replace(" de "," ").replace(".",""); };
const isCurrentMonth = t => monthKey(dateObject(t.date)) === monthKey(today);
const isOverdue = t => t.status === "pendente" && dateObject(t.date) < today;
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);

const demoClients = [
  { id:"client-studio-nove", name:"Estúdio Nove", email:"financeiro@estudionove.com", phone:"(11) 98888-1212", notes:"Projeto de identidade visual" },
  { id:"client-marina", name:"Marina Costa", email:"marina@exemplo.com", phone:"(11) 97777-3434", notes:"Indicação da Ana" },
  { id:"client-casa-verde", name:"Casa Verde", email:"oi@casaverde.com", phone:"(21) 96666-9090", notes:"Pacote de conteúdo mensal" },
];
const demoProjects = [
  { id:"project-studio-identity", title:"Identidade visual", clientId:"client-studio-nove", amount:4900, date:offsetDate(20), status:"andamento", notes:"Duas parcelas combinadas" },
  { id:"project-marina-consult", title:"Consultoria de marca", clientId:"client-marina", amount:1800, date:offsetDate(4), status:"andamento", notes:"Entrega e recebimento previstos para este mês" },
  { id:"project-casa-content", title:"Pacote de conteúdo", clientId:"client-casa-verde", amount:1450, date:offsetDate(12), status:"andamento", notes:"Renovação mensal" },
  { id:"project-marina-landing", title:"Landing page", clientId:"client-marina", amount:3200, date:offsetDate(-6), status:"concluido", notes:"Entregue" },
  { id:"project-brand-quote", title:"Kit de redes sociais", clientId:"client-studio-nove", amount:1250, date:offsetDate(30), status:"orcamento", notes:"Aguardando aprovação" },
];
const demoTransactions = [
  { id:"tx-01", description:"Identidade visual · parcela 1/2", category:"Serviços", type:"entrada", amount:2450, date:offsetDate(-1), status:"concluida", clientId:"client-studio-nove", projectId:"project-studio-identity", notes:"Primeira parcela" },
  { id:"tx-02", description:"Hospedagem do site", category:"Ferramentas", type:"saida", amount:89.9, date:offsetDate(2), status:"pendente", clientId:"", notes:"Plano mensal" },
  { id:"tx-03", description:"Consultoria de marca", category:"Consultoria", type:"entrada", amount:1800, date:offsetDate(4), status:"pendente", clientId:"client-marina", projectId:"project-marina-consult", notes:"Enviar cobrança após a entrega" },
  { id:"tx-04", description:"Internet e telefone", category:"Operação", type:"saida", amount:159.9, date:offsetDate(-3), status:"concluida", clientId:"", notes:"" },
  { id:"tx-05", description:"Landing page", category:"Serviços", type:"entrada", amount:3200, date:offsetDate(-6), status:"concluida", clientId:"client-marina", projectId:"project-marina-landing", notes:"Projeto finalizado" },
  { id:"tx-06", description:"Assinatura de ferramentas", category:"Ferramentas", type:"saida", amount:249, date:offsetDate(8), status:"pendente", clientId:"", notes:"Design e armazenamento" },
  { id:"tx-07", description:"Imposto municipal", category:"Impostos", type:"saida", amount:310, date:offsetDate(-10), status:"concluida", clientId:"", notes:"" },
  { id:"tx-08", description:"Pacote de conteúdo", category:"Serviços", type:"entrada", amount:1450, date:offsetDate(12), status:"pendente", clientId:"client-casa-verde", projectId:"project-casa-content", notes:"Parcela deste mês" },
  { id:"tx-09", description:"Fotografia de produto", category:"Serviços", type:"entrada", amount:950, date:offsetDate(-22), status:"concluida", clientId:"client-casa-verde", notes:"" },
  { id:"tx-10", description:"Material de escritório", category:"Operação", type:"saida", amount:126.5, date:offsetDate(-18), status:"concluida", clientId:"", notes:"" },
  { id:"tx-11", description:"Consultoria de lançamento", category:"Consultoria", type:"entrada", amount:2100, date:monthOffset(-1,20), status:"concluida", clientId:"client-marina", notes:"" },
  { id:"tx-12", description:"Licença anual de software", category:"Ferramentas", type:"saida", amount:420, date:monthOffset(-1,8), status:"concluida", clientId:"", notes:"" },
  { id:"tx-13", description:"Manutenção do portfólio", category:"Serviços", type:"entrada", amount:780, date:offsetDate(25), status:"pendente", clientId:"client-studio-nove", notes:"" },
];

function freshState() { return { version:3, clients:demoClients.map(c=>({...c})), projects:demoProjects.map(p=>({...p})), transactions:demoTransactions.map(t=>({...t})) }; }
function loadState() {
  try {
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved){const value=JSON.parse(saved);if(Array.isArray(value.transactions)&&Array.isArray(value.clients))return {...value,version:3,projects:Array.isArray(value.projects)?value.projects:[]};}
    const old=localStorage.getItem(OLD_STORAGE_KEY);
    if(old){const transactions=JSON.parse(old);if(Array.isArray(transactions))return {version:3,clients:[],projects:[],transactions:transactions.map(t=>({...t,clientId:t.clientId||"",projectId:t.projectId||"",notes:t.notes||""}))};}
  } catch {}
  return freshState();
}
let state=loadState();
let currentView="inicio";
let activeType="entrada";
let activeFilter="todos";
let activeHorizon=30;
let editingTransactionId=null;
let editingClientId=null;
let editingProjectId=null;
let toastTimer=null;

function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function clientById(id){return state.clients.find(c=>c.id===id);}
function clientName(id){return clientById(id)?.name||"Sem cliente";}
function projectById(id){return state.projects.find(p=>p.id===id);}
function projectName(id){return projectById(id)?.title||"";}
function statusName(t){if(isOverdue(t))return "Atrasado";if(t.status==="concluida")return t.type==="entrada"?"Recebido":"Pago";return "Em aberto";}
function inMonth(t,key=monthKey(today)){return monthKey(dateObject(t.date))===key;}
function total(list,condition){return list.filter(condition).reduce((sum,t)=>sum+Number(t.amount||0),0);}
function openTransactions(){return state.transactions.filter(t=>t.status==="pendente");}

function render(){
  renderDashboard();renderTransactions();renderClients();renderProjects();renderPlanning();renderReports();
  document.querySelector("#count-all").textContent=state.transactions.length;
}
function renderDashboard(){
  const income=total(state.transactions,t=>t.type==="entrada"&&t.status==="concluida");
  const expense=total(state.transactions,t=>t.type==="saida"&&t.status==="concluida");
  const monthIncome=total(state.transactions,t=>t.type==="entrada"&&t.status==="concluida"&&isCurrentMonth(t));
  const monthExpense=total(state.transactions,t=>t.type==="saida"&&t.status==="concluida"&&isCurrentMonth(t));
  const receivables=total(state.transactions,t=>t.type==="entrada"&&t.status==="pendente");
  const balance=income-expense;
  const horizon=new Date(today);horizon.setDate(horizon.getDate()+30);
  const soon=state.transactions.filter(t=>t.status==="pendente"&&dateObject(t.date)>=today&&dateObject(t.date)<=horizon);
  const forecast=balance+total(soon,t=>t.type==="entrada")-total(soon,t=>t.type==="saida");
  document.querySelector("#balance-value").textContent=money(balance);
  document.querySelector("#income-value").textContent=money(monthIncome);
  document.querySelector("#expense-value").textContent=money(monthExpense);
  document.querySelector("#receivable-value").textContent=money(receivables);
  document.querySelector("#income-foot").textContent=`${state.transactions.filter(t=>t.type==="entrada"&&t.status==="concluida"&&isCurrentMonth(t)).length} recebimento(s)`;
  document.querySelector("#expense-foot").textContent=`${state.transactions.filter(t=>t.type==="saida"&&t.status==="concluida"&&isCurrentMonth(t)).length} despesa(s)`;
  document.querySelector("#receivable-foot").textContent=`${state.transactions.filter(t=>t.type==="entrada"&&t.status==="pendente").length} cobrança(s) em aberto`;
  document.querySelector("#forecast-value").textContent=money(forecast);
  document.querySelector("#forecast-note").textContent=`Saldo estimado em 30 dias · ${soon.length} conta(s) prevista(s)`;
  const formattedToday=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(today).toLocaleUpperCase("pt-BR");
  document.querySelector("#today-label").textContent=formattedToday;
  renderChart();renderAttention();renderPipeline();
  const latest=[...state.transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  document.querySelector("#recent-rows").innerHTML=latest.map(rowMarkup).join("");
  document.querySelector("#recent-empty").classList.toggle("hidden",state.transactions.length>0);
  document.querySelector("#overview-view .table-wrap").classList.toggle("hidden",state.transactions.length===0);
}
function renderChart(){
  const target=document.querySelector("#cashflow-chart");
  const months=Array.from({length:6},(_,i)=>new Date(today.getFullYear(),today.getMonth()-5+i,1));
  const data=months.map(date=>{const key=monthKey(date);return {label:monthLabel(date),income:total(state.transactions,t=>t.type==="entrada"&&t.status==="concluida"&&inMonth(t,key)),expense:total(state.transactions,t=>t.type==="saida"&&t.status==="concluida"&&inMonth(t,key))};});
  const max=Math.max(1,...data.flatMap(d=>[d.income,d.expense]));
  target.innerHTML=data.map(d=>`<div class="chart-month"><div class="chart-bars"><span class="bar income" title="Recebido: ${money(d.income)}" style="height:${Math.max(d.income?4:2,d.income/max*100)}%"></span><span class="bar expense" title="Pago: ${money(d.expense)}" style="height:${Math.max(d.expense?4:2,d.expense/max*100)}%"></span></div><span class="month-label">${escapeHtml(d.label)}</span></div>`).join("");
}
function renderAttention(){
  const target=document.querySelector("#attention-content");
  const open=[...openTransactions()].sort((a,b)=>a.date.localeCompare(b.date));
  const overdue=open.filter(isOverdue);
  const upcoming=open.filter(t=>!isOverdue(t));
  const items=[...overdue.slice(0,2),...upcoming.slice(0,3-overdue.slice(0,2).length)];
  if(!items.length){target.innerHTML=`<div class="attention-empty">Tudo em dia. Novas contas em aberto aparecem aqui quando forem cadastradas.</div>`;return;}
  target.innerHTML=items.map(t=>`<div class="attention-item"><span class="attention-symbol ${isOverdue(t)?"late":""}">${isOverdue(t)?"!":"◷"}</span><div class="attention-copy"><strong>${escapeHtml(t.description)}</strong><small>${isOverdue(t)?`Atrasado · ${escapeHtml(clientName(t.clientId))}`:`Vence ${escapeHtml(dateLabel(t.date))} · ${escapeHtml(clientName(t.clientId))}`}</small></div><div class="attention-value">${money(t.amount)}<small>${t.type==="entrada"?"a receber":"a pagar"}</small></div></div>`).join("");
}
function renderPipeline(){
  const target=document.querySelector("#pipeline-content");
  const pendingIncoming=openTransactions().filter(t=>t.type==="entrada");
  const quotes=state.projects.filter(p=>p.status==="orcamento").length;
  const active=state.projects.filter(p=>p.status==="andamento").length;
  const activeValue=total(state.projects,p=>p.status==="andamento");
  const stats=[
    {label:"Orçamentos",value:quotes,small:"aguardando decisão"},
    {label:"Em andamento",value:active,small:"serviços ativos"},
    {label:"Valor contratado",value:money(activeValue),small:`${pendingIncoming.length} recebimento(s) em aberto`},
  ];
  target.innerHTML=stats.map(s=>`<div class="pipeline-stat"><span>${s.label}</span><strong>${s.value}</strong><small>${s.small}</small></div>`).join("");
}
function rowMarkup(t){
  const entry=t.type==="entrada";const stateClass=isOverdue(t)?"atrasada":t.status;const customer=clientName(t.clientId);const project=projectName(t.projectId);const category=escapeHtml(t.category||"Outros");const context=customer==="Sem cliente"?category:`${customer}${project?` · ${project}`:""}`;
  return `<tr><td><div class="description-cell"><span class="transaction-symbol ${entry?"":"expense"}">${entry?"↗":"↙"}</span><span class="description-copy"><strong>${escapeHtml(t.description)}</strong><small>${t.notes?escapeHtml(t.notes):entry?"Recebimento":"Despesa"}</small></span></div></td><td><span class="category-pill">${escapeHtml(context)}</span></td><td class="date-cell">${escapeHtml(longDate.format(dateObject(t.date)))}</td><td><span class="status-pill ${stateClass}">${statusName(t)}</span></td><td class="amount-cell ${entry?"income":""}">${entry?"+":"−"} ${money(t.amount)}</td><td><div class="row-actions">${t.status==="pendente"?`<button class="row-action" data-settle="${t.id}">${entry?"Recebido":"Pago"}</button>`:""}<button class="row-action" data-edit="${t.id}" aria-label="Editar">Editar</button><button class="row-action danger" data-delete="${t.id}" aria-label="Excluir">×</button></div></td></tr>`;
}
function renderTransactions(){
  const search=(document.querySelector("#search-input")?.value||"").trim().toLocaleLowerCase("pt-BR");
  const filtered=[...state.transactions].sort((a,b)=>b.date.localeCompare(a.date)).filter(t=>{
    const typeMatches=activeFilter==="todos"||(activeFilter==="abertos"?t.status==="pendente":t.type===activeFilter);
    const client=clientName(t.clientId).toLocaleLowerCase("pt-BR");
    return typeMatches&&(!search||`${t.description} ${t.category} ${client} ${t.notes||""}`.toLocaleLowerCase("pt-BR").includes(search));
  });
  document.querySelector("#all-rows").innerHTML=filtered.map(rowMarkup).join("");
  document.querySelector("#all-empty").classList.toggle("hidden",filtered.length>0);
  document.querySelector("#transactions-view .table-wrap").classList.toggle("hidden",filtered.length===0);
}
function renderClients(){
  const query=(document.querySelector("#client-search")?.value||"").trim().toLocaleLowerCase("pt-BR");
  const clients=state.clients.filter(c=>`${c.name} ${c.email||""} ${c.phone||""}`.toLocaleLowerCase("pt-BR").includes(query));
  const openByClient=new Map();
  for(const t of state.transactions.filter(x=>x.type==="entrada"&&x.status==="pendente"&&x.clientId))openByClient.set(t.clientId,(openByClient.get(t.clientId)||0)+Number(t.amount));
  const activeIds=new Set(state.transactions.filter(t=>t.type==="entrada"&&t.clientId).map(t=>t.clientId));
  document.querySelector("#client-count").textContent=state.clients.length;
  document.querySelector("#client-open-count").textContent=[...openByClient.values()].filter(v=>v>0).length;
  document.querySelector("#client-open-total").textContent=money([...openByClient.values()].reduce((a,b)=>a+b,0));
  document.querySelector("#client-grid").innerHTML=clients.map(c=>{
    const amount=openByClient.get(c.id)||0;const open=state.transactions.filter(t=>t.clientId===c.id&&t.type==="entrada"&&t.status==="pendente").length;
    return `<article class="client-card"><div class="client-card-top"><span class="client-avatar">${escapeHtml((c.name||"?").trim().slice(0,1).toLocaleUpperCase("pt-BR"))}</span><span class="client-name"><strong>${escapeHtml(c.name)}</strong><small>${activeIds.has(c.id)?"Cliente ativo":"Sem recebimentos ainda"}</small></span><button class="client-menu" data-client-edit="${c.id}" aria-label="Editar cliente">···</button></div><div class="client-details"><div class="client-detail"><span>E-mail</span><strong>${escapeHtml(c.email||"Não informado")}</strong></div><div class="client-detail"><span>Telefone</span><strong>${escapeHtml(c.phone||"Não informado")}</strong></div><div class="client-detail"><span>Em aberto</span><strong>${open} lançamento(s)</strong></div></div><div class="client-footer"><span>Saldo a receber</span><strong>${money(amount)}</strong></div><div class="client-card-actions"><button class="row-action" data-client-remind="${c.id}">Copiar lembrete</button><button class="row-action danger" data-client-delete="${c.id}">Excluir</button></div></article>`;
  }).join("");
  const empty=clients.length===0;document.querySelector("#clients-empty").classList.toggle("hidden",!empty);document.querySelector("#client-grid").classList.toggle("hidden",empty);
}
function serviceStatusName(status){return ({orcamento:"Orçamento",andamento:"Em andamento",concluido:"Entregue",cancelado:"Cancelado"})[status]||"Em andamento";}
function renderProjects(){
  const query=(document.querySelector("#service-search")?.value||"").trim().toLocaleLowerCase("pt-BR");
  const projects=[...state.projects].sort((a,b)=>b.date.localeCompare(a.date)).filter(p=>`${p.title} ${clientName(p.clientId)} ${p.notes||""}`.toLocaleLowerCase("pt-BR").includes(query));
  document.querySelector("#service-quotes").textContent=state.projects.filter(p=>p.status==="orcamento").length;
  document.querySelector("#service-active").textContent=state.projects.filter(p=>p.status==="andamento").length;
  document.querySelector("#service-value").textContent=money(total(state.projects,p=>p.status==="andamento"));
  document.querySelector("#service-grid").innerHTML=projects.map(p=>{
    const billed=total(state.transactions,t=>t.projectId===p.id&&t.type==="entrada"&&t.status==="concluida");
    const open=total(state.transactions,t=>t.projectId===p.id&&t.type==="entrada"&&t.status==="pendente");
    const next={orcamento:"andamento",andamento:"concluido"}[p.status];
    return `<article class="service-card"><div class="service-card-top"><span class="service-status ${escapeHtml(p.status)}">${serviceStatusName(p.status)}</span><button class="client-menu" data-project-edit="${p.id}" aria-label="Editar serviço">···</button></div><h3>${escapeHtml(p.title)}</h3><p class="service-client">${escapeHtml(clientName(p.clientId))}</p><div class="service-value-row"><span>Valor combinado</span><strong>${money(p.amount)}</strong></div><div class="service-progress"><span style="width:${p.status==="orcamento"?"14":p.status==="andamento"?"58":p.status==="concluido"?"100":"0"}%"></span></div><div class="service-meta"><span>Prazo ${escapeHtml(dateLabel(p.date))}</span><span>Recebido ${money(billed)}</span></div>${open?`<div class="service-open">${money(open)} ainda a receber</div>`:""}${p.notes?`<p class="service-notes">${escapeHtml(p.notes)}</p>`:""}<div class="service-actions">${next?`<button class="row-action" data-project-next="${p.id}">Marcar ${next==="andamento"?"em andamento":"entregue"}</button>`:""}<button class="row-action" data-service-transaction="${p.id}">＋ Lançamento</button><button class="row-action danger" data-project-delete="${p.id}" aria-label="Excluir serviço">Excluir</button></div></article>`;
  }).join("");
  const empty=projects.length===0;document.querySelector("#services-empty").classList.toggle("hidden",!empty);document.querySelector("#service-grid").classList.toggle("hidden",empty);
}
function renderPlanning(){
  const end=new Date(today);end.setDate(end.getDate()+activeHorizon);
  const pending=openTransactions();const inRange=pending.filter(t=>dateObject(t.date)>=today&&dateObject(t.date)<=end);
  const overdue=pending.filter(isOverdue);
  const income=total(inRange,t=>t.type==="entrada");const expenses=total(inRange,t=>t.type==="saida");
  const balance=total(state.transactions,t=>t.type==="entrada"&&t.status==="concluida")-total(state.transactions,t=>t.type==="saida"&&t.status==="concluida");
  document.querySelector("#plan-current").textContent=money(balance);document.querySelector("#plan-incoming").textContent=money(income);document.querySelector("#plan-outgoing").textContent=money(expenses);document.querySelector("#plan-projected").textContent=money(balance+income-expenses);
  document.querySelector("#plan-incoming-count").textContent=`${inRange.filter(t=>t.type==="entrada").length} recebimento(s) no período`;
  document.querySelector("#plan-outgoing-count").textContent=`${inRange.filter(t=>t.type==="saida").length} despesa(s) no período`;
  document.querySelector("#plan-horizon-note").textContent=`Ao final dos próximos ${activeHorizon} dias`;
  const groups=new Map();
  const list=[...overdue,...inRange].sort((a,b)=>{if(isOverdue(a)!==isOverdue(b))return isOverdue(a)?-1:1;return a.date.localeCompare(b.date);});
  for(const t of list){const key=isOverdue(t)?"atrasados":t.date;(groups.get(key)||groups.set(key,[]).get(key)).push(t);}
  const timeline=document.querySelector("#timeline");
  timeline.innerHTML=[...groups.entries()].map(([key,items])=>{const title=key==="atrasados"?"Atrasados":longDate.format(dateObject(key));const day=key==="atrasados"?"Vencidos":dateLabel(key);return `<div class="timeline-day"><div class="timeline-date"><strong>${escapeHtml(day)}</strong>${key==="atrasados"?"Regularize ou atualize":"Vencimento"}</div><div class="timeline-items">${items.map(t=>`<div class="timeline-item"><span class="transaction-symbol ${t.type==="entrada"?"":"expense"}">${t.type==="entrada"?"↗":"↙"}</span><strong>${escapeHtml(t.description)} <small>· ${escapeHtml(clientName(t.clientId))}</small></strong><span class="timeline-amount ${t.type}">${t.type==="entrada"?"+":"−"} ${money(t.amount)}</span><button class="row-action" data-edit="${t.id}" aria-label="Editar lançamento">Editar</button></div>`).join("")}</div></div>`;}).join("");
  document.querySelector("#timeline-empty").classList.toggle("hidden",list.length>0);timeline.classList.toggle("hidden",list.length===0);
}
function reportMonths(){const months=Array.from({length:12},(_,i)=>new Date(today.getFullYear(),today.getMonth()-11+i,1));return months;}
function renderReports(){
  const select=document.querySelector("#report-month");const chosen=select.value||monthKey(today);const months=reportMonths();
  if(select.options.length!==months.length){select.innerHTML=months.map(d=>`<option value="${monthKey(d)}">${new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(d)}</option>`).join("");}
  if([...select.options].some(o=>o.value===chosen))select.value=chosen;
  const key=select.value||monthKey(today);const income=total(state.transactions,t=>t.type==="entrada"&&t.status==="concluida"&&inMonth(t,key));const expense=total(state.transactions,t=>t.type==="saida"&&t.status==="concluida"&&inMonth(t,key));
  document.querySelector("#report-income").textContent=money(income);document.querySelector("#report-expense").textContent=money(expense);document.querySelector("#report-net").textContent=money(income-expense);
  document.querySelector("#report-income-count").textContent=`${state.transactions.filter(t=>t.type==="entrada"&&t.status==="concluida"&&inMonth(t,key)).length} recebimento(s)`;
  document.querySelector("#report-expense-count").textContent=`${state.transactions.filter(t=>t.type==="saida"&&t.status==="concluida"&&inMonth(t,key)).length} despesa(s)`;
  const totals=new Map();for(const t of state.transactions.filter(t=>t.type==="saida"&&t.status==="concluida"&&inMonth(t,key)))totals.set(t.category||"Outros",(totals.get(t.category||"Outros")||0)+Number(t.amount));
  const rows=[...totals.entries()].sort((a,b)=>b[1]-a[1]);const max=Math.max(1,...rows.map(r=>r[1]));
  document.querySelector("#category-list").innerHTML=rows.length?rows.map(([name,value])=>`<div class="category-row"><span class="category-row-name">${escapeHtml(name)}</span><span class="category-track"><span class="category-fill" style="display:block;width:${Math.max(4,value/max*100)}%"></span></span><span class="category-row-value">${money(value)}</span></div>`).join(""):`<div class="category-empty">Sem despesas pagas neste período.</div>`;
}

function fillCategories(type,selected=""){const select=document.querySelector("#category");select.innerHTML=categories[type].map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");if(selected&&categories[type].includes(selected))select.value=selected;}
function fillClients(selected=""){const select=document.querySelector("#client-id");select.innerHTML=`<option value="">Sem cliente associado</option>`+state.clients.map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join("");select.value=selected||"";}
function fillProjects(selected="",clientId=""){const select=document.querySelector("#project-id");const projects=state.projects.filter(p=>p.status!=="cancelado"&&(!clientId||p.clientId===clientId));select.innerHTML=`<option value="">Sem serviço associado</option>`+projects.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.title)}</option>`).join("");select.value=selected||"";}
function setType(type,selectedCategory=""){activeType=type;document.querySelectorAll(".type-option").forEach(b=>b.classList.toggle("selected",b.dataset.type===type));fillCategories(type,selectedCategory);}
function openTransactionModal(existing=null,defaultType="entrada"){
  const form=document.querySelector("#transaction-form");form.reset();editingTransactionId=existing?.id||null;
  document.querySelector("#transaction-modal-title").textContent=existing?"Editar lançamento":"Novo lançamento";
  setType(existing?.type||defaultType,existing?.category||"");fillClients(existing?.clientId||"");fillProjects(existing?.projectId||"",existing?.clientId||"");
  document.querySelector("#description").value=existing?.description||"";document.querySelector("#amount").value=existing?.amount||"";document.querySelector("#date").value=existing?.date||offsetDate(0);document.querySelector("#notes").value=existing?.notes||"";document.querySelector("#status").checked=existing?.status==="concluida";
  document.querySelector("#transaction-modal").showModal();setTimeout(()=>document.querySelector("#description").focus(),20);
}
function openClientModal(existing=null){
  document.querySelector("#client-form").reset();editingClientId=existing?.id||null;document.querySelector("#client-modal-title").textContent=existing?"Editar cliente":"Novo cliente";
  document.querySelector("#client-name").value=existing?.name||"";document.querySelector("#client-email").value=existing?.email||"";document.querySelector("#client-phone").value=existing?.phone||"";document.querySelector("#client-notes").value=existing?.notes||"";
  document.querySelector("#client-modal").showModal();setTimeout(()=>document.querySelector("#client-name").focus(),20);
}
function openProjectModal(existing=null){
  if(!state.clients.length){showToast("Cadastre um cliente antes de criar um serviço.");setView("clientes");openClientModal();return;}
  document.querySelector("#service-form").reset();editingProjectId=existing?.id||null;document.querySelector("#service-modal-title").textContent=existing?"Editar serviço":"Novo serviço";
  document.querySelector("#service-client").innerHTML=state.clients.map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join("");
  document.querySelector("#service-title").value=existing?.title||"";document.querySelector("#service-client").value=existing?.clientId||state.clients[0].id;document.querySelector("#service-amount").value=existing?.amount??"";document.querySelector("#service-date").value=existing?.date||offsetDate(14);document.querySelector("#service-status").value=existing?.status||"orcamento";document.querySelector("#service-notes").value=existing?.notes||"";
  document.querySelector("#service-modal").showModal();setTimeout(()=>document.querySelector("#service-title").focus(),20);
}
function showToast(message){const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("visible"),2600);}
function closeDialog(id){document.querySelector(`#${id}`).close();}
function setView(view){
  const views={inicio:"overview-view",lancamentos:"transactions-view",clientes:"clients-view",servicos:"services-view",planejamento:"planning-view",relatorios:"reports-view"};
  currentView=views[view]?view:"inicio";for(const [key,id] of Object.entries(views))document.querySelector(`#${id}`).classList.toggle("hidden",key!==currentView);
  const names={inicio:"Visão geral",lancamentos:"Lançamentos",clientes:"Clientes",servicos:"Serviços",planejamento:"Fluxo futuro",relatorios:"Relatórios"};document.querySelector("#crumb-title").textContent=names[currentView];
  document.querySelectorAll(".nav-item").forEach(a=>a.classList.toggle("active",a.dataset.view===currentView));document.querySelector("#sidebar").classList.remove("open");history.replaceState(null,"",`#${currentView}`);render();
}

document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeDialog(b.dataset.close)));
document.querySelectorAll("#top-add,#heading-add,#empty-add,#list-add,#list-empty-add,#plan-add").forEach(b=>b.addEventListener("click",()=>openTransactionModal()));
document.querySelector("#client-add").addEventListener("click",()=>openClientModal());document.querySelector("#client-empty-add").addEventListener("click",()=>openClientModal());
document.querySelectorAll(".type-option").forEach(b=>b.addEventListener("click",()=>setType(b.dataset.type)));
document.querySelector("#transaction-form").addEventListener("submit",event=>{
  event.preventDefault();const fd=new FormData(event.currentTarget);const item={id:editingTransactionId||makeId(),description:String(fd.get("description")||"").trim(),category:String(fd.get("category")||"Outros"),type:activeType,amount:Number(fd.get("amount")),date:String(fd.get("date")||""),status:document.querySelector("#status").checked?"concluida":"pendente",clientId:String(fd.get("clientId")||""),projectId:String(fd.get("projectId")||""),notes:String(fd.get("notes")||"").trim()};
  if(!item.description||!Number.isFinite(item.amount)||item.amount<=0||!item.date){showToast("Confira a descrição, o valor e a data.");return;}
  const index=state.transactions.findIndex(t=>t.id===item.id);if(index>=0)state.transactions[index]=item;else state.transactions.push(item);saveState();closeDialog("transaction-modal");render();showToast(editingTransactionId?"Lançamento atualizado.":"Lançamento salvo neste navegador.");editingTransactionId=null;
});
document.querySelector("#client-form").addEventListener("submit",event=>{
  event.preventDefault();const fd=new FormData(event.currentTarget);const item={id:editingClientId||makeId(),name:String(fd.get("name")||"").trim(),email:String(fd.get("email")||"").trim(),phone:String(fd.get("phone")||"").trim(),notes:String(fd.get("notes")||"").trim()};if(!item.name){showToast("Informe o nome do cliente.");return;}
  const index=state.clients.findIndex(c=>c.id===item.id);if(index>=0)state.clients[index]=item;else state.clients.push(item);saveState();closeDialog("client-modal");render();showToast(editingClientId?"Cliente atualizado.":"Cliente cadastrado.");editingClientId=null;
});
document.querySelector("#service-form").addEventListener("submit",event=>{
  event.preventDefault();const fd=new FormData(event.currentTarget);const item={id:editingProjectId||makeId(),title:String(fd.get("title")||"").trim(),clientId:String(fd.get("clientId")||""),amount:Number(fd.get("amount")),date:String(fd.get("date")||""),status:String(fd.get("status")||"orcamento"),notes:String(fd.get("notes")||"").trim()};
  if(!item.title||!item.clientId||!Number.isFinite(item.amount)||item.amount<0||!item.date){showToast("Confira o nome, cliente, valor combinado e prazo.");return;}
  const existing=state.projects.find(p=>p.id===item.id);const linked=state.transactions.filter(t=>t.projectId===item.id);if(existing&&existing.clientId!==item.clientId&&linked.length&&!confirm(`Este serviço tem ${linked.length} lançamento(s) associado(s). Atualizar o cliente desses lançamentos também?`))return;
  const index=state.projects.findIndex(p=>p.id===item.id);if(index>=0)state.projects[index]=item;else state.projects.push(item);if(existing&&existing.clientId!==item.clientId)state.transactions=state.transactions.map(t=>t.projectId===item.id?{...t,clientId:item.clientId}:t);saveState();closeDialog("service-modal");render();showToast(editingProjectId?"Serviço atualizado.":"Serviço cadastrado.");editingProjectId=null;
});
document.querySelector("#project-id").addEventListener("change",event=>{const p=projectById(event.target.value);if(p)fillClients(p.clientId);});
document.querySelector("#client-id").addEventListener("change",event=>fillProjects("",event.target.value));
document.querySelectorAll("#service-add,#service-empty-add,#service-add-footer").forEach(b=>b.addEventListener("click",()=>openProjectModal()));
document.addEventListener("click",async event=>{
  const nav=event.target.closest("[data-view]");if(nav){event.preventDefault();setView(nav.dataset.view);return;}
  const settle=event.target.closest("[data-settle]");if(settle){const t=state.transactions.find(x=>x.id===settle.dataset.settle);if(t){t.status="concluida";saveState();render();showToast(t.type==="entrada"?"Recebimento marcado como recebido.":"Despesa marcada como paga.");}return;}
  const edit=event.target.closest("[data-edit]");if(edit){const t=state.transactions.find(x=>x.id===edit.dataset.edit);if(t)openTransactionModal(t);return;}
  const remove=event.target.closest("[data-delete]");if(remove){const t=state.transactions.find(x=>x.id===remove.dataset.delete);if(t&&confirm(`Excluir “${t.description}”?`)){state.transactions=state.transactions.filter(x=>x.id!==t.id);saveState();render();showToast("Lançamento excluído.");}return;}
  const clientEdit=event.target.closest("[data-client-edit]");if(clientEdit){const c=clientById(clientEdit.dataset.clientEdit);if(c)openClientModal(c);return;}
  const clientDelete=event.target.closest("[data-client-delete]");if(clientDelete){const c=clientById(clientDelete.dataset.clientDelete);if(!c)return;const linked=state.transactions.some(t=>t.clientId===c.id)||state.projects.some(p=>p.clientId===c.id);if(linked){showToast("Este cliente tem serviços ou lançamentos associados; mantenha o histórico.");return;}if(confirm(`Excluir o cadastro de ${c.name}?`)){state.clients=state.clients.filter(x=>x.id!==c.id);saveState();render();showToast("Cliente excluído.");}return;}
  const remind=event.target.closest("[data-client-remind]");if(remind){const c=clientById(remind.dataset.clientRemind);if(c){const due=state.transactions.filter(t=>t.clientId===c.id&&t.type==="entrada"&&t.status==="pendente");if(!due.length){showToast("Este cliente não tem recebimentos em aberto.");return;}const amount=due.reduce((s,t)=>s+Number(t.amount),0);const message=`Olá, ${c.name}! Tudo bem? Passando para lembrar dos recebimentos em aberto, no total de ${money(amount)}. Se já realizou o pagamento, pode desconsiderar esta mensagem. Obrigado!`;try{await navigator.clipboard.writeText(message);showToast("Lembrete copiado. Revise antes de enviar.");}catch{showToast(message);}}return;}
  const projectEdit=event.target.closest("[data-project-edit]");if(projectEdit){const p=projectById(projectEdit.dataset.projectEdit);if(p)openProjectModal(p);return;}
  const projectNext=event.target.closest("[data-project-next]");if(projectNext){const p=projectById(projectNext.dataset.projectNext);if(p){p.status=p.status==="orcamento"?"andamento":"concluido";saveState();render();showToast(`Serviço marcado: ${serviceStatusName(p.status).toLocaleLowerCase("pt-BR")}.`);}return;}
  const projectDelete=event.target.closest("[data-project-delete]");if(projectDelete){const p=projectById(projectDelete.dataset.projectDelete);if(!p)return;const linked=state.transactions.some(t=>t.projectId===p.id);if(!confirm(`Excluir “${p.title}”?${linked?" Os lançamentos serão mantidos sem serviço associado.":""}`))return;state.projects=state.projects.filter(x=>x.id!==p.id);state.transactions=state.transactions.map(t=>t.projectId===p.id?{...t,projectId:""}:t);saveState();render();showToast("Serviço removido; lançamentos preservados.");return;}
  const projectTransaction=event.target.closest("[data-service-transaction]");if(projectTransaction){const p=projectById(projectTransaction.dataset.serviceTransaction);if(p)openTransactionModal(null,"entrada");if(p){fillClients(p.clientId);fillProjects(p.id,p.clientId);document.querySelector("#project-id").value=p.id;}return;}
});
document.querySelectorAll(".filter-tab").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll(".filter-tab").forEach(x=>x.classList.toggle("active",x===b));renderTransactions();}));
document.querySelector("#search-input").addEventListener("input",renderTransactions);document.querySelector("#client-search").addEventListener("input",renderClients);
document.querySelector("#service-search").addEventListener("input",renderProjects);
document.querySelectorAll(".horizon-tab").forEach(b=>b.addEventListener("click",()=>{activeHorizon=Number(b.dataset.days);document.querySelectorAll(".horizon-tab").forEach(x=>x.classList.toggle("active",x===b));renderPlanning();}));
document.querySelector("#report-month").addEventListener("change",renderReports);document.querySelector("#mobile-menu").addEventListener("click",()=>document.querySelector("#sidebar").classList.toggle("open"));

function csvCell(value){return `"${String(value??"").replaceAll('"','""')}"`;}
function downloadFile(name,content,type){const blob=new Blob(["\ufeff",content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
function exportTransactions(){const rows=[["Descricao","Tipo","Categoria","Cliente","Servico","Vencimento","Status","Valor","Observacao"],...state.transactions.map(t=>[t.description,t.type,t.category,clientById(t.clientId)?.name||"",projectName(t.projectId),t.date,statusName(t),Number(t.amount).toFixed(2),t.notes||""])];downloadFile("caixa-lancamentos.csv",rows.map(r=>r.map(csvCell).join(";")).join("\r\n"),"text/csv;charset=utf-8");showToast("CSV pronto para baixar.");}
function exportClients(){const rows=[["Nome","Email","Telefone","Observacoes","Em aberto"],...state.clients.map(c=>[c.name,c.email,c.phone,c.notes,total(state.transactions,t=>t.clientId===c.id&&t.type==="entrada"&&t.status==="pendente").toFixed(2)])];downloadFile("caixa-clientes.csv",rows.map(r=>r.map(csvCell).join(";")).join("\r\n"),"text/csv;charset=utf-8");showToast("Lista de clientes exportada.");}
function exportBackup(){downloadFile("caixa-backup.json",JSON.stringify({...state,backupCreatedAt:new Date().toISOString()},null,2),"application/json;charset=utf-8");showToast("Cópia de segurança pronta.");}
function reportForClaude(){
  const key=document.querySelector("#report-month").value||monthKey(today);const monthName=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(new Date(`${key}-01T12:00:00`));
  const income=total(state.transactions,t=>t.type==="entrada"&&t.status==="concluida"&&inMonth(t,key));const expense=total(state.transactions,t=>t.type==="saida"&&t.status==="concluida"&&inMonth(t,key));
  const upcoming=new Date(today);upcoming.setDate(upcoming.getDate()+30);const nextOpen=state.transactions.filter(t=>t.status==="pendente"&&dateObject(t.date)>=today&&dateObject(t.date)<=upcoming);
  const openIncoming=total(nextOpen,t=>t.type==="entrada");const openExpenses=total(nextOpen,t=>t.type==="saida");
  const byCategory=new Map();for(const t of state.transactions.filter(t=>t.type==="saida"&&t.status==="concluida"&&inMonth(t,key)))byCategory.set(t.category||"Outros",(byCategory.get(t.category||"Outros")||0)+Number(t.amount));
  const categoriesText=[...byCategory.entries()].sort((a,b)=>b[1]-a[1]).map(([name,value])=>`- ${name}: ${money(value)}`).join("\n")||"- Nenhuma despesa paga registrada";
  return `Analise estes totais agregados do meu pequeno negócio para ${monthName}. Os números são registros inseridos por mim, podem estar incompletos e não representam extrato bancário.\n\nRecebido no mês: ${money(income)}\nDespesas pagas no mês: ${money(expense)}\nResultado registrado: ${money(income-expense)}\nRecebimentos em aberto nos próximos 30 dias: ${money(openIncoming)}\nDespesas em aberto nos próximos 30 dias: ${money(openExpenses)}\nDespesas pagas por categoria:\n${categoriesText}\n\nAponte 3 observações úteis e 2 perguntas que eu deveria responder para entender melhor meu caixa. Separe fatos dos números de hipóteses. Não dê orientação tributária ou de investimento.`;
}
async function copyReportForClaude(){const brief=reportForClaude();try{await navigator.clipboard.writeText(brief);showToast("Resumo copiado. Cole na conversa do Claude quando quiser.");}catch{window.prompt("Copie o resumo e cole no Claude:",brief);}}
document.querySelector("#backup-button").addEventListener("click",exportBackup);document.querySelector("#report-backup").addEventListener("click",exportBackup);document.querySelector("#report-csv").addEventListener("click",exportTransactions);document.querySelector("#client-export").addEventListener("click",exportClients);
document.querySelector("#claude-summary").addEventListener("click",copyReportForClaude);
document.querySelector("#restore-button").addEventListener("click",()=>document.querySelector("#backup-file").click());
document.querySelector("#backup-file").addEventListener("change",async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
    if(file.size>2_000_000)throw new Error("large");
    const imported=JSON.parse(await file.text());
    const projects=Array.isArray(imported.projects)?imported.projects:[];
    const validDate=value=>typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(dateObject(value).getTime())&&isoDate(dateObject(value))===value;
    const validClients=Array.isArray(imported.clients)&&imported.clients.every(c=>c&&typeof c.id==="string"&&typeof c.name==="string");
    const validProjects=projects.every(p=>p&&typeof p.id==="string"&&typeof p.title==="string"&&validDate(p.date)&&["orcamento","andamento","concluido","cancelado"].includes(p.status)&&Number.isFinite(Number(p.amount))&&Number(p.amount)>=0);
    const validTransactions=Array.isArray(imported.transactions)&&imported.transactions.every(t=>t&&typeof t.id==="string"&&typeof t.description==="string"&&["entrada","saida"].includes(t.type)&&["pendente","concluida"].includes(t.status)&&validDate(t.date)&&Number.isFinite(Number(t.amount))&&Number(t.amount)>0);
    if(!validClients||!validProjects||!validTransactions)throw new Error("format");
    if(!confirm("Restaurar este backup vai substituir os dados atuais deste navegador. Continuar?"))return;
    state={version:3,clients:imported.clients,projects,transactions:imported.transactions};saveState();render();showToast("Backup restaurado neste navegador.");
  }catch{showToast("Backup inválido ou maior que 2 MB.");}finally{event.target.value="";}
});
document.querySelector("#csv-template").addEventListener("click",()=>downloadFile("modelo-caixa.csv","Descricao;Tipo;Categoria;Cliente;Servico;Vencimento;Status;Valor;Observacao\r\n\"Parcela 1\";entrada;Serviços;Cliente Exemplo;Site institucional;2026-10-31;pendente;500,00;Parcela 1\r\n","text/csv;charset=utf-8"));
document.querySelector("#import-button").addEventListener("click",()=>document.querySelector("#csv-file").click());document.querySelector("#report-import").addEventListener("click",()=>document.querySelector("#csv-file").click());
function parseCsv(text){
  const delimiter=(text.split(/\r?\n/,1)[0].match(/;/g)||[]).length>=(text.split(/\r?\n/,1)[0].match(/,/g)||[]).length?";":",";const rows=[];let row=[],field="",quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'&&quoted&&text[i+1]==='"'){field+='"';i++;continue;}if(ch==='"'){quoted=!quoted;continue;}if(ch===delimiter&&!quoted){row.push(field);field="";continue;}if((ch==="\n"||ch==="\r")&&!quoted){if(ch==="\r"&&text[i+1]==="\n")i++;row.push(field);if(row.some(v=>v.trim()))rows.push(row);row=[];field="";continue;}field+=ch;}
  row.push(field);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
function normalizeHeader(value){return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]/g,"");}
function parseMoney(value){let s=String(value||"").replace(/[R$\s]/g,"");if(s.includes(",")){s=s.replace(/\./g,"").replace(",",".");}else if((s.match(/\./g)||[]).length>1){s=s.replace(/\./g,"");}const n=Number(s);return Number.isFinite(n)?Math.abs(n):NaN;}
function parseCsvDate(value){const s=String(value||"").trim();if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;const m=s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);return m?`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`:"";}
function importCsvText(text){
  const rows=parseCsv(text);if(rows.length<2){showToast("O arquivo não tem linhas para importar.");return;}
  const header=rows.shift().map(normalizeHeader);const find=names=>header.findIndex(h=>names.includes(h));const ix={description:find(["descricao","description","memo","historico","lancamento","detalhe"]),type:find(["tipo","type","natureza"]),category:find(["categoria","category"]),client:find(["cliente","client","favorecido","beneficiario"]),project:find(["servico","servicooprojeto","projeto","project"]),date:find(["vencimento","data","date","duedate"]),status:find(["status","situacao"]),amount:find(["valor","amount","total"]),notes:find(["observacao","observacoes","notes","nota"])};
  if(ix.description<0||ix.amount<0||ix.date<0){showToast("O CSV precisa ter colunas de descrição, valor e vencimento.");return;}
  const additions=[];let skipped=0;
  for(const row of rows){const get=k=>ix[k]<0?"":String(row[ix[k]]||"").trim();const description=get("description");const amount=parseMoney(get("amount"));const date=parseCsvDate(get("date"));if(!description||!Number.isFinite(amount)||amount<=0||!date){skipped++;continue;}
    const rawType=normalizeHeader(get("type"));const type=["saida","despesa","expense","debit","pagamento"].includes(rawType)?"saida":"entrada";const rawStatus=normalizeHeader(get("status"));const status=["pago","recebido","concluido","concluida","paid","received"].includes(rawStatus)?"concluida":"pendente";const clientText=get("client");let client=state.clients.find(c=>normalizeHeader(c.name)===normalizeHeader(clientText));if(clientText&&!['semcliente','semclienteassociado'].includes(normalizeHeader(clientText))&&!client){client={id:makeId(),name:clientText,email:"",phone:"",notes:""};state.clients.push(client);}const projectText=get("project");const project=state.projects.find(p=>normalizeHeader(p.title)===normalizeHeader(projectText)&&(!client||p.clientId===client.id));if(project&&!client)client=clientById(project.clientId);
    const duplicate=state.transactions.some(t=>t.description.toLocaleLowerCase("pt-BR")===description.toLocaleLowerCase("pt-BR")&&Number(t.amount)===amount&&t.date===date);if(duplicate){skipped++;continue;}
    additions.push({id:makeId(),description,category:get("category")||"Outros",type,amount,date,status,clientId:client?.id||"",projectId:project?.id||"",notes:get("notes")});
  }
  if(!additions.length){showToast(`Nenhum novo lançamento importado${skipped?` · ${skipped} ignorado(s)`:""}.`);return;}
  state.transactions.push(...additions);saveState();render();showToast(`${additions.length} lançamento(s) importado(s)${skipped?` · ${skipped} ignorado(s)`:""}.`);
}
document.querySelector("#csv-file").addEventListener("change",async event=>{const file=event.target.files?.[0];if(!file)return;try{importCsvText(await file.text());}catch{showToast("Não foi possível ler esse arquivo CSV.");}finally{event.target.value="";}});
document.querySelector("#reset-demo").addEventListener("click",()=>document.querySelector("#confirm-modal").showModal());document.querySelector("#cancel-reset").addEventListener("click",()=>closeDialog("confirm-modal"));document.querySelector("#confirm-reset").addEventListener("click",()=>{state=freshState();saveState();closeDialog("confirm-modal");render();showToast("Dados de exemplo restaurados.");});

const dateTitle=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(today);
const hashView=location.hash.replace("#","");
if(["lancamentos","clientes","servicos","planejamento","relatorios"].includes(hashView))setView(hashView);else render();
document.querySelector("#today-label").textContent=dateTitle.toLocaleUpperCase("pt-BR");

