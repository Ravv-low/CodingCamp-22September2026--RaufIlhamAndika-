let transactions = [];

// Elemen DOM
const form = document.getElementById('expense-form');
const itemNameInput = document.getElementById('item-name');
const itemAmountInput = document.getElementById('item-amount');
const itemCategoryInput = document.getElementById('item-category');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');
const themeToggleBtn = document.getElementById('theme-toggle');
const sortSelect = document.getElementById('sort-select');

// Chart.js
const ctx = document.getElementById('expense-chart').getContext('2d');
let expenseChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Food', 'Transport', 'Fun'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#e74c3c', '#3498db', '#f1c40f']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

// Optional Challenge 5: Dark/Light Mode
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggleBtn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Event Listener Form
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const amount = parseFloat(itemAmountInput.value);
  const category = itemCategoryInput.value;

  if (!name || isNaN(amount) || !category) {
    alert('Harap isi semua kolom dengan benar!');
    return;
  }

  const newTransaction = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category
  };

  transactions.push(newTransaction);
  updateUI();
  form.reset();
});

// Optional Challenge 3: Sort Transactions
sortSelect.addEventListener('change', () => {
  updateUI();
});

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
}

function updateUI() {
  renderList();
  renderBalance();
  renderChart();
}

function renderList() {
  transactionList.innerHTML = '';

  // Buat copy array untuk pengurutan
  let displayData = [...transactions];
  const sortValue = sortSelect.value;

  if (sortValue === 'high-low') {
    displayData.sort((a, b) => b.amount - a.amount);
  } else if (sortValue === 'low-high') {
    displayData.sort((a, b) => a.amount - b.amount);
  }

  displayData.forEach(t => {
    const tr = document.createElement('tr');
    
    // Optional Challenge 4: Highlight Spending (> Rp 100.000)
    if (t.amount > 100000) {
      tr.classList.add('highlight-high');
    }

    tr.innerHTML = `
      <td>${t.name}</td>
      <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
      <td>${t.category}</td>
      <td><button class="btn-delete" onclick="deleteTransaction(${t.id})">Hapus</button></td>
    `;
    transactionList.appendChild(tr);
  });
}

function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalBalanceEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function renderChart() {
  const categoryTotals = { Food: 0, Transport: 0, Fun: 0 };

  transactions.forEach(t => {
    if (categoryTotals[t.category] !== undefined) {
      categoryTotals[t.category] += t.amount;
    }
  });

  expenseChart.data.datasets[0].data = [
    categoryTotals.Food,
    categoryTotals.Transport,
    categoryTotals.Fun
  ];
  expenseChart.update();
}