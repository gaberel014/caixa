const STORAGE_KEY = "caixa-app-transactions-v1";
const categories = {
  entrada: ["Serviços", "Produtos", "Consultoria", "Outros"],
  saida: ["Operação", "Ferramentas", "Impostos", "Transporte", "Outros"],
};
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
const dateLongFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const dateOffset = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
const monthOffset = (months, day = 12) => { const d = new Date(now.getFullYear(), now.getMonth() + months, day); return d.toISOString().slice(0, 10); };
const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const demoTransactions = [
  { id: id(), description: "Identidade visual · Estúdio Nove", category: "Serviços", type: "entrada", amount: 2450, date: dateOffset(-1), status: "concluida" },
  { id: id(), description: "Hospedagem do site", category: "Ferramentas", type: "saida", amount: 89.9, date: dateOffset(2), status: "pendente" },
  { id: id(), description: "Consultoria de marca", category: "Consultoria", type: "entrada", amount: 1800, date: dateOffset(4), status: "pendente" },
  { id: id(), description: "Internet e telefone", category: "Operação", type: "saida", amount: 159.9, date: dateOffset(-3), status: "concluida" },
  { id: id(), description: "Landing page · Marina Costa", category: "Serviços", type: "entrada", amount: 3200, date: dateOffset(-6), status: "concluida" },
  { id: id(), description: "Assinatura de ferramentas", category: "Ferramentas", type: "saida", amount: 249, date: dateOffset(8), status: "pendente" },
  { id: id(), description: "Imposto municipal", category: "Impostos", type: "saida", amount: 310, date: dateOffset(-10), status: "concluida" },
  { id: id(), description: "Pacote de conteúdo · Casa Verde", category: "Serviços", type: "entrada", amount: 1450, date: dateOffset(-14), status: "concluida" },
  { id: id(), description: "Fotografia de produto", category: "Serviços", type: "entrada", amount: 950, date: dateOffset(-22), status: "concluida" },
  { id: id(), description: "Material de escritório", category: "Operação", type: "saida", amount: 126.5, date: dateOffset(-18), status: "concluida" },
  { id: id(), description: "Consultoria de lançamento", category: "Consultoria", type: "entrada", amount: 2100, date: monthOffset(-1, 20), status: "concluida" },
  { id: id(), description: "Licença anual de software", category: "Ferramentas", type: "saida", amount: 420, date: monthOffset(-1, 8), status: "concluida" },
];

let transactions = loadTransactions();
let activeType = "entrada";
let activeFilter = "todas";
let toastTimer;

function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...demoTransactions];
  } catch { return [...demoTransactions]; }
}
function saveTransactions() { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }
function fmt(value) { return currency.format(value); }
function dateObj(value) { return new Date(`${value}T12:00:00`); }
function dateLabel(value) { return dateFormat.format(dateObj(value)).replace(" de ", " ").replace(".", ""); }
function monthKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function currentMonth(t) { return monthKey(dateObj(t.date)) === monthKey(now); }
function isPastDue(t) { return t.status === "pendente" && dateObj(t.date) < today; }
function statusText(t) { return isPastDue(t) ? "Atrasada" : t.status === "concluida" ? (t.type === "entrada" ? "Recebida" : "Paga") : "Em aberto"; }

function render() {
  const monthIncome = transactions.filter(t => t.type === "entrada" && t.status === "concluida" && currentMonth(t)).reduce((s, t) => s + Number(t.amount), 0);
  const monthExpense = transactions.filter(t => t.type === "saida" && t.status === "concluida" && currentMonth(t)).reduce((s, t) => s + Number(t.amount), 0);
  const balance = transactions.filter(t => t.status === "concluida").reduce((s, t) => s + (t.type === "entrada" ? Number(t.amount) : -Number(t.amount)), 0);
  const receivables = transactions.filter(t => t.type === "entrada" && t.status === "pendente").reduce((s, t) => s + Number(t.amount), 0);
  document.querySelector("#balance-value").textContent = fmt(balance);
  document.querySelector("#income-value").textContent = fmt(monthIncome);
  document.querySelector("#expense-value").textContent = fmt(monthExpense);
  document.querySelector("#receivable-value").textContent = fmt(receivables);
  document.querySelector("#income-foot").textContent = `${transactions.filter(t => t.type === "entrada" && t.status === "concluida" && currentMonth(t)).length} recebida(s) neste mês`;
  document.querySelector("#expense-foot").textContent = `${transactions.filter(t => t.type === "saida" && t.status === "concluida" && currentMonth(t)).length} paga(s) neste mês`;
  document.querySelector("#receivable-foot").textContent = `${transactions.filter(t => t.type === "entrada" && t.status === "pendente").length} entrada(s) em aberto`;
  renderChart(); renderAttention(); renderRows();
  document.querySelector("#count-all").textContent = transactions.length;
}

function renderChart() {
  const chart = document.querySelector("#cashflow-chart");
  const monthNames = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const data = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = monthKey(date);
    const income = transactions.filter(t => t.type === "entrada" && t.status === "concluida" && monthKey(dateObj(t.date)) === key).reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === "saida" && t.status === "concluida" && monthKey(dateObj(t.date)) === key).reduce((s, t) => s + Number(t.amount), 0);
    return { label: monthNames.format(date).replace(".", ""), income, expense };
  });
  const max = Math.max(1, ...data.flatMap(d => [d.income, d.expense]));
  chart.innerHTML = data.map(d => `<div class="chart-month"><div class="chart-bars"><span class="bar income" title="Entradas: ${fmt(d.income)}" style="height:${Math.max(d.income ? 5 : 2, d.income / max * 100)}%"></span><span class="bar expense" title="Saídas: ${fmt(d.expense)}" style="height:${Math.max(d.expense ? 5 : 2, d.expense / max * 100)}%"></span></div><span class="month-label">${d.label}</span></div>`).join("");
}

function renderAttention() {
  const target = document.querySelector("#attention-content");
  const overdue = transactions.filter(t => t.type === "entrada" && isPastDue(t)).sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = transactions.filter(t => t.type === "entrada" && t.status === "pendente" && !isPastDue(t)).sort((a, b) => a.date.localeCompare(b.date));
  const items = [...overdue.slice(0, 1), ...upcoming.slice(0, 2)];
  if (!items.length) { target.innerHTML = `<div class="attention-empty">Tudo em dia por aqui. Quando houver algo para acompanhar, aparece nesta lista. ✳</div>`; return; }
  target.innerHTML = items.map(t => `<div class="attention-item"><span class="attention-symbol ${isPastDue(t) ? "late" : ""}">${isPastDue(t) ? "!" : "◷"}</span><div class="attention-copy"><strong>${escapeHtml(t.description)}</strong><small>${isPastDue(t) ? "Passou do prazo" : `Vence em ${dateLabel(t.date)}`}</small></div><div class="attention-value">${fmt(Number(t.amount))}<small>${isPastDue(t) ? "cobrar" : "a receber"}</small></div></div>`).join("");
}

function rowMarkup(t) {
  const isIncome = t.type === "entrada";
  const state = isPastDue(t) ? "atrasada" : t.status;
  const canSettle = t.status === "pendente";
  return `<tr><td><div class="description-cell"><span class="transaction-symbol ${isIncome ? "" : "expense"}">${isIncome ? "↗" : "↙"}</span><span class="description-copy"><strong>${escapeHtml(t.description)}</strong><small>${escapeHtml(t.category)}</small></span></div></td><td><span class="category-pill">${escapeHtml(t.category)}</span></td><td class="date-cell">${dateLongFormat.format(dateObj(t.date))}</td><td><span class="status-pill ${state}">${statusText(t)}</span></td><td class="amount-cell ${isIncome ? "income" : ""}">${isIncome ? "+ " : "− "}${fmt(Number(t.amount))}</td><td>${canSettle ? `<button class="row-action" data-settle="${t.id}">${isIncome ? "Marcar recebida" : "Marcar paga"}</button>` : `<button class="row-menu" data-delete="${t.id}" aria-label="Excluir ${escapeHtml(t.description)}">···</button>`}</td></tr>`;
}
function renderRows() {
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  document.querySelector("#recent-rows").innerHTML = recent.map(rowMarkup).join("");
  document.querySelector("#recent-empty").classList.toggle("hidden", transactions.length > 0);
  document.querySelector(".table-wrap").classList.toggle("hidden", transactions.length === 0);
  const query = document.querySelector("#search-input").value.trim().toLocaleLowerCase("pt-BR");
  const filtered = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).filter(t => (activeFilter === "todas" || t.type === activeFilter) && (!query || `${t.description} ${t.category}`.toLocaleLowerCase("pt-BR").includes(query)));
  document.querySelector("#all-rows").innerHTML = filtered.map(rowMarkup).join("");
  document.querySelector("#all-empty").classList.toggle("hidden", filtered.length > 0);
  document.querySelector("#all-rows").closest(".table-wrap").classList.toggle("hidden", filtered.length === 0);
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }

function setCategories(type) {
  const select = document.querySelector("#category");
  select.innerHTML = categories[type].map(c => `<option>${c}</option>`).join("");
}
function openModal() {
  document.querySelector("#transaction-form").reset();
  document.querySelector("#date").value = dateOffset(0);
  document.querySelector("#status").value = "pendente";
  activeType = "entrada";
  document.querySelectorAll(".type-option").forEach(b => b.classList.toggle("selected", b.dataset.type === activeType));
  setCategories(activeType);
  document.querySelector("#transaction-modal").showModal();
  setTimeout(() => document.querySelector("#description").focus(), 50);
}
function showToast(message) {
  const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("visible");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("visible"), 2500);
}

document.querySelectorAll("#top-add,#heading-add,#empty-add,#list-add").forEach(button => button.addEventListener("click", openModal));
document.querySelector("#close-modal").addEventListener("click", () => document.querySelector("#transaction-modal").close());
document.querySelector("#cancel-modal").addEventListener("click", () => document.querySelector("#transaction-modal").close());
document.querySelectorAll(".type-option").forEach(button => button.addEventListener("click", () => {
  activeType = button.dataset.type; document.querySelectorAll(".type-option").forEach(b => b.classList.toggle("selected", b === button)); setCategories(activeType);
}));
document.querySelector("#transaction-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const transaction = { id: id(), description: String(form.get("description")).trim(), category: String(form.get("category")), type: activeType, amount: Number(form.get("amount")), date: String(form.get("date")), status: String(form.get("status")) };
  if (!transaction.description || transaction.amount <= 0 || !transaction.date) return;
  transactions.push(transaction); saveTransactions(); render(); document.querySelector("#transaction-modal").close(); showToast("Movimentação salva no seu dispositivo.");
});

document.addEventListener("click", event => {
  const settle = event.target.closest("[data-settle]");
  const remove = event.target.closest("[data-delete]");
  if (settle) {
    const transaction = transactions.find(t => t.id === settle.dataset.settle);
    if (transaction) { transaction.status = "concluida"; saveTransactions(); render(); showToast(transaction.type === "entrada" ? "Entrada marcada como recebida." : "Saída marcada como paga."); }
  }
  if (remove) {
    const transaction = transactions.find(t => t.id === remove.dataset.delete);
    if (transaction && confirm(`Excluir “${transaction.description}”?`)) { transactions = transactions.filter(t => t.id !== transaction.id); saveTransactions(); render(); showToast("Movimentação excluída."); }
  }
  const viewLink = event.target.closest("[data-view]");
  if (viewLink) { event.preventDefault(); setView(viewLink.dataset.view); }
});

function setView(view) {
  const isAll = view === "movimentacoes";
  document.querySelector("#overview-view").classList.toggle("hidden", isAll);
  document.querySelector("#transactions-view").classList.toggle("hidden", !isAll);
  document.querySelector("#crumb-title").textContent = isAll ? "Movimentações" : "Visão geral";
  document.querySelectorAll(".nav-item").forEach(link => link.classList.toggle("active", link.dataset.view === view));
  history.replaceState(null, "", isAll ? "#movimentacoes" : "#inicio");
  document.querySelector("#sidebar").classList.remove("open");
  renderRows();
}
document.querySelectorAll(".filter-tab").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter; document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.toggle("active", tab === button)); renderRows();
}));
document.querySelector("#search-input").addEventListener("input", renderRows);
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));

function resetExamples() {
  transactions = [...demoTransactions]; saveTransactions(); render(); document.querySelector("#confirm-modal").close(); showToast("Dados de exemplo restaurados.");
}
document.querySelectorAll("#reset-demo,#reset-demo-list").forEach(b => b.addEventListener("click", () => document.querySelector("#confirm-modal").showModal()));
document.querySelector("#cancel-reset").addEventListener("click", () => document.querySelector("#confirm-modal").close());
document.querySelector("#confirm-reset").addEventListener("click", resetExamples);
document.querySelector("#export-button").addEventListener("click", () => {
  if (!transactions.length) { showToast("Não há movimentações para exportar."); return; }
  const header = ["Descrição", "Tipo", "Categoria", "Data", "Status", "Valor"];
  const lines = transactions.map(t => [t.description, t.type, t.category, t.date, statusText(t), Number(t.amount).toFixed(2)]);
  const csv = [header, ...lines].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\r\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "movimentacoes-caixa.csv"; a.click(); URL.revokeObjectURL(url); showToast("Arquivo CSV pronto.");
});

const dateTitle = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(now);
document.querySelector("#today-label").textContent = dateTitle.toLocaleUpperCase("pt-BR");
if (now.getHours() >= 12) document.querySelector(".page-heading h1").firstChild.textContent = now.getHours() >= 18 ? "Boa noite. " : "Boa tarde. ";
if (location.hash === "#movimentacoes") setView("movimentacoes");
render();

