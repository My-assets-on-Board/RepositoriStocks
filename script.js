const holdings = [
  { symbol: 'AAPL', company: 'Apple Inc.', shares: 18, avgCost: 172.4, currentPrice: 198.7 },
  { symbol: 'MSFT', company: 'Microsoft', shares: 12, avgCost: 318.2, currentPrice: 342.25 },
  { symbol: 'NVDA', company: 'NVIDIA', shares: 10, avgCost: 628.5, currentPrice: 742.8 },
  { symbol: 'AMZN', company: 'Amazon', shares: 14, avgCost: 147.8, currentPrice: 169.35 },
  { symbol: 'TSLA', company: 'Tesla', shares: 8, avgCost: 213.9, currentPrice: 188.4 }
];

const totalValueEl = document.querySelector('#total-value');
const dayChangeEl = document.querySelector('#day-change');
const totalGainLossEl = document.querySelector('#total-gain-loss');
const searchInput = document.querySelector('#search-input');
const holdingsBody = document.querySelector('#holdings-body');
const stockForm = document.querySelector('#stock-form');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

function getHoldingMetrics(holding) {
  const marketValue = holding.shares * holding.currentPrice;
  const investedValue = holding.shares * holding.avgCost;
  const gainLoss = marketValue - investedValue;
  return { marketValue, investedValue, gainLoss };
}

function renderPortfolio(filterText = '') {
  const normalized = filterText.trim().toLowerCase();

  const filteredHoldings = holdings.filter((holding) => {
    const haystack = `${holding.symbol} ${holding.company}`.toLowerCase();
    return haystack.includes(normalized);
  });

  let totalValue = 0;
  let totalGainLoss = 0;
  let dayChange = 0;

  const rows = filteredHoldings.map((holding) => {
    const { marketValue, investedValue, gainLoss } = getHoldingMetrics(holding);
    totalValue += marketValue;
    totalGainLoss += gainLoss;
    dayChange += (holding.currentPrice - holding.avgCost) * holding.shares * 0.15;

    return `
      <tr>
        <td><strong>${holding.symbol}</strong></td>
        <td>${holding.company}</td>
        <td>${holding.shares}</td>
        <td>${formatCurrency(holding.avgCost)}</td>
        <td>${formatCurrency(holding.currentPrice)}</td>
        <td>${formatCurrency(marketValue)}</td>
        <td class="${gainLoss >= 0 ? 'positive' : 'negative'}">${formatCurrency(gainLoss)}</td>
      </tr>
    `;
  }).join('');

  holdingsBody.innerHTML = rows || `
    <tr>
      <td colspan="7">No holdings match your search.</td>
    </tr>
  `;

  totalValueEl.textContent = formatCurrency(totalValue);
  totalGainLossEl.textContent = formatCurrency(totalGainLoss);
  totalGainLossEl.className = totalGainLoss >= 0 ? 'positive' : 'negative';
  dayChangeEl.textContent = formatCurrency(dayChange);
  dayChangeEl.className = dayChange >= 0 ? 'positive' : 'negative';
}

searchInput.addEventListener('input', (event) => {
  renderPortfolio(event.target.value);
});

stockForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const symbol = document.querySelector('#symbol').value.trim().toUpperCase();
  const company = document.querySelector('#company').value.trim();
  const shares = Number(document.querySelector('#shares').value);
  const avgCost = Number(document.querySelector('#avgCost').value);
  const currentPrice = Number(document.querySelector('#currentPrice').value);

  if (!symbol || !company || !shares || !avgCost || !currentPrice) {
    return;
  }

  holdings.push({
    symbol,
    company,
    shares,
    avgCost,
    currentPrice
  });

  stockForm.reset();
  renderPortfolio(searchInput.value);
});

renderPortfolio();
