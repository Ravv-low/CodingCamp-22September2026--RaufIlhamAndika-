// Array penampung transaksi
let transactions = [];

// Elemen DOM
const form = document.getElementById('expense-form');
const itemNameInput = document.getElementById('item-name');
const itemAmountInput = document.getElementById('item-amount');
const itemCategoryInput = document.getElementById('item-category');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');

// Inisialisasi Chart.js
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

// Event listener saat form disubmit
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const amount = parseFloat(itemAmountInput.value);
  const category = itemCategoryInput.value;

  // Validasi sederhana
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

// Fungsi untuk menghapus transaksi berdasarkan ID
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
}

// Fungsi utama memperbarui tampilan
function updateUI() {
  renderList();
  renderBalance();
  renderChart();
}

// 1. Render Tabel Transaksi
function renderList() {
  transactionList.innerHTML = '';

  transactions.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.name}</td>
      <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
      <td>${t.category}</td>
      <td><button class="btn-delete" onclick="deleteTransaction(${t.id})">Hapus</button></td>
    `;
    transactionList.appendChild(tr);
  });
}

// 2. Render Total Pengeluaran
function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalBalanceEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// 3. Render Grafik Kategori
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