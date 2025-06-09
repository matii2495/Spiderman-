let stock = [
  { name: "Detergente Multiusos", qty: 120, loc: "Hospital Central" },
  { name: "Trapo de Piso", qty: 80, loc: "Escuela Primaria 25" },
  { name: "Guantes de Látex", qty: 200, loc: "Municipalidad" }
];

let consumption = [
  { name: "Detergente Multiusos", qty: 20, loc: "Hospital Central" },
  { name: "Trapo de Piso", qty: 30, loc: "Escuela Primaria 25" },
  { name: "Guantes de Látex", qty: 50, loc: "Municipalidad" }
];

function saveData() {
  localStorage.setItem('stock', JSON.stringify(stock));
  localStorage.setItem('consumption', JSON.stringify(consumption));
}

function renderStock() {
  const tbody = document.querySelector('#stockTable tbody');
  tbody.innerHTML = '';
  stock.forEach((item, index) => {
    tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.loc}</td>
    <td><button onclick="deleteStock(${index})">Eliminar</button></td></tr>`;
  });
  updateCharts();
}

function renderConsumption() {
  const tbody = document.querySelector('#consumptionTable tbody');
  tbody.innerHTML = '';
  consumption.forEach(item => {
    tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.loc}</td></tr>`;
  });
  updateCharts();
}

function addStock() {
  const name = document.getElementById('itemName').value;
  const qty = parseInt(document.getElementById('itemQty').value);
  const loc = document.getElementById('itemLoc').value;
  if (name && qty && loc) {
    stock.push({ name, qty, loc });
    saveData();
    renderStock();
  }
}

function deleteStock(index) {
  stock.splice(index, 1);
  saveData();
  renderStock();
}

function addConsumption() {
  const name = document.getElementById('consumedItem').value;
  const qty = parseInt(document.getElementById('consumedQty').value);
  const loc = document.getElementById('consumedLoc').value;
  if (name && qty && loc) {
    consumption.push({ name, qty, loc });
    saveData();
    renderConsumption();
  }
}

function updateCharts() {
  const ctxStock = document.getElementById('stockChart');
  const ctxCons = document.getElementById('consumptionChart');

  const stockData = {};
  stock.forEach(item => {
    stockData[item.name] = (stockData[item.name] || 0) + item.qty;
  });

  const consData = {};
  consumption.forEach(item => {
    consData[item.loc] = (consData[item.loc] || 0) + item.qty;
  });

  new Chart(ctxStock, {
    type: 'pie',
    data: {
      labels: Object.keys(stockData),
      datasets: [{
        label: 'Stock Disponible',
        data: Object.values(stockData),
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#009688', '#FF5722']
      }]
    }
  });

  new Chart(ctxCons, {
    type: 'pie',
    data: {
      labels: Object.keys(consData),
      datasets: [{
        label: 'Consumo por Locación',
        data: Object.values(consData),
        backgroundColor: ['#F44336', '#3F51B5', '#009688', '#9C27B0', '#795548']
      }]
    }
  });
}

function exportData() {
  const data = { stock, consumption };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'symarg_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    stock = data.stock || [];
    consumption = data.consumption || [];
    saveData();
    renderStock();
    renderConsumption();
  };
  reader.readAsText(file);
}

renderStock();
renderConsumption();
