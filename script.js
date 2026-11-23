"use strict";

const STORAGE_KEY = "spendwise-expenses-v1";
const BUDGET_KEY = "spendwise-budget-v1";
const DEFAULT_BUDGET = 50000;

const expenseForm = document.getElementById("expense-form");
const budgetForm = document.getElementById("budget-form");
const expenseList = document.getElementById("expense-list");
const categoryFilter = document.getElementById("category-filter");
const feedback = document.getElementById("form-feedback");

let expenses = loadExpenses();
let budget = loadBudget();

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(item =>
      item && typeof item.id === "string" &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.amount)) &&
      typeof item.category === "string" &&
      typeof item.date === "string"
    ) : [];
  } catch (error) {
    console.warn("Could not read saved expenses:", error);
    return [];
  }
}

function loadBudget() {
  const saved = Number(localStorage.getItem(BUDGET_KEY));
  return Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_BUDGET;
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    localStorage.setItem(BUDGET_KEY, String(budget));
  } catch (error) {
    feedback.textContent = "Your browser could not save this change. Check storage settings.";
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency", currency: "KES", maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric", month: "short", year: "numeric"
  }).format(date);
}

function updateSummary() {
  const spent = expenses.reduce((total, item) => total + Number(item.amount), 0);
  const remaining = budget - spent;
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const ringPercent = Math.min(percent, 100);

  document.getElementById("budget-total").textContent = formatMoney(budget);
  document.getElementById("spent-total").textContent = formatMoney(spent);
  document.getElementById("remaining-total").textContent = formatMoney(remaining);
  document.getElementById("remaining-total").classList.toggle("over-budget", remaining < 0);
  document.getElementById("spent-percent").textContent = percent + "%";
  document.getElementById("progress-fill").style.width = ringPercent + "%";
  document.getElementById("progress-ring").style.background =
    "conic-gradient(var(--teal) " + ringPercent * 3.6 + "deg, #e8f0f1 0deg)";
  document.getElementById("budget-spent-label").textContent = formatMoney(spent);
  document.getElementById("budget-left-label").textContent = formatMoney(Math.max(remaining, 0));
  document.getElementById("budget-caption").textContent =
    spent === 0 ? "You’re off to a fresh start!" :
    remaining < 0 ? "You’re over your planned budget." :
    percent >= 80 ? "You’re getting close to your limit." : "You’re managing your money!";
  document.getElementById("budget-message").textContent =
    remaining < 0 ? "Review your spending to get back on track." :
    formatMoney(Math.max(remaining, 0)) + " available in your budget.";
}

function renderExpenses() {
  const selectedCategory = categoryFilter.value;
  const visibleExpenses = expenses
    .filter(item => selectedCategory === "All" || item.category === selectedCategory)
    .sort((a, b) => b.date.localeCompare(a.date));

  expenseList.replaceChildren();

  if (visibleExpenses.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 5;
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const icon = document.createElement("span");
    icon.textContent = "◌";
    const title = document.createElement("strong");
    title.textContent = expenses.length === 0 ? "No expenses yet" : "No matching expenses";
    const message = document.createElement("small");
    message.textContent = expenses.length === 0
      ? "Your transactions will appear here when you add them."
      : "Try choosing another category.";
    empty.append(icon, title, message);
    cell.append(empty);
    row.append(cell);
    expenseList.append(row);
  } else {
    visibleExpenses.forEach(item => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const name = document.createElement("span");
      name.className = "expense-name";
      name.textContent = item.name;
      nameCell.append(name);

      const categoryCell = document.createElement("td");
      const category = document.createElement("span");
      category.className = "category-pill";
      category.textContent = item.category;
      categoryCell.append(category);

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(item.date);

      const amountCell = document.createElement("td");
      amountCell.className = "amount-cell";
      amountCell.textContent = "− " + formatMoney(Number(item.amount));

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", "Delete " + item.name);
      deleteButton.addEventListener("click", () => deleteExpense(item.id));

      actionCell.append(deleteButton);
      row.append(nameCell, categoryCell, dateCell, amountCell, actionCell);
      expenseList.append(row);
    });
  }

  document.getElementById("transaction-count").textContent =
    expenses.length + (expenses.length === 1 ? " transaction" : " transactions");
  updateSummary();
}

function deleteExpense(id) {
  expenses = expenses.filter(item => item.id !== id);
  saveData();
  renderExpenses();
  feedback.textContent = "Expense removed.";
}

expenseForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("expense-name").value.trim();
  const amount = Number(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !date) {
    feedback.textContent = "Please enter a name, a valid amount and a date.";
    return;
  }

  expenses.push({
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() :
      Date.now().toString(36) + Math.random().toString(36).slice(2),
    name, amount, category, date
  });
  saveData();
  expenseForm.reset();
  document.getElementById("expense-date").value = new Date().toISOString().slice(0, 10);
  feedback.textContent = "Expense added successfully.";
  renderExpenses();
});

budgetForm.addEventListener("submit", event => {
  event.preventDefault();
  const newBudget = Number(document.getElementById("budget-input").value);
  if (!Number.isFinite(newBudget) || newBudget <= 0) {
    feedback.textContent = "Enter a budget greater than zero.";
    return;
  }
  budget = newBudget;
  saveData();
  renderExpenses();
  feedback.textContent = "Monthly budget updated.";
});

categoryFilter.addEventListener("change", renderExpenses);

document.getElementById("clear-all").addEventListener("click", () => {
  if (expenses.length === 0) {
    feedback.textContent = "There are no expenses to clear.";
    return;
  }
  if (window.confirm("Clear all recorded expenses? This cannot be undone.")) {
    expenses = [];
    saveData();
    renderExpenses();
    feedback.textContent = "All expenses cleared.";
  }
});

document.getElementById("budget-input").value = String(budget);
document.getElementById("expense-date").value = new Date().toISOString().slice(0, 10);
document.getElementById("today-date").textContent =
  new Intl.DateTimeFormat("en-KE", { weekday: "short", day: "numeric", month: "short" }).format(new Date());
renderExpenses();