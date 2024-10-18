const ctx = document.getElementById('cryptoChart').getContext('2d');
let cryptoChart;

async function fetchCryptoData() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    return data.bitcoin.usd;
}

async function fetchChartData(days) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
    const data = await response.json();
    return data.prices.map(price => price[1]);
}

async function updateChart(days) {
    const currentPrice = await fetchCryptoData();
    const chartData = await fetchChartData(days);
    
    document.getElementById('current-price').textContent = `$${currentPrice}`;
    
    const labels = chartData.map((_, index) => index + 1); // Create labels based on the number of data points

    if (cryptoChart) {
        cryptoChart.destroy();
    }

    cryptoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bitcoin Price (USD)',
                data: chartData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        color: '#fff'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        color: '#fff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// Function to update the current price every second
async function updateLivePrice() {
    const currentPrice = await fetchCryptoData();
    document.getElementById('current-price').textContent = `$${currentPrice}`;
}

// Event listener for timeframe selection
document.getElementById('timeframe').addEventListener('change', (event) => {
    const selectedDays = event.target.value;
    updateChart(selectedDays);
});

// Initial chart load and live price update
updateChart(7);
setInterval(updateLivePrice, 1000); // Update live price every second
