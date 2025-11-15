const stationConfigs = {
    weighbridge: {
        title: 'Weighbridge',
        icon: 'fa-scale-balanced',
        description: 'Penerimaan TBS dan kontrol berat kendaraan',
        metrics: [
            { key: 'grossWeight', label: 'Gross Weight', unit: 'kg', min: 10000, max: 32000 },
            { key: 'tareWeight', label: 'Tare Weight', unit: 'kg', min: 8000, max: 18000 },
            { key: 'netWeight', label: 'Net Weight', unit: 'kg', min: 5000, max: 24000 },
            { key: 'queueTime', label: 'Waktu Tunggu', unit: 'menit', min: 5, max: 35 }
        ],
        tableHeaders: ['Kendaraan', 'Asal TBS', 'Gross (kg)', 'Tare (kg)', 'Net (kg)', 'Masuk', 'Keluar'],
        chartLabel: 'Net Weight'
    },
    sterilizer: {
        title: 'Sterilizer',
        icon: 'fa-temperature-high',
        description: 'Pengukusan TBS dan pengendalian tekanan',
        metrics: [
            { key: 'pressure', label: 'Tekanan', unit: 'bar', min: 2.2, max: 3.8 },
            { key: 'temperature', label: 'Suhu', unit: '°C', min: 125, max: 140 },
            { key: 'cycleTime', label: 'Cycle Time', unit: 'menit', min: 60, max: 95 },
            { key: 'doorStatus', label: 'Pintu', unit: '', values: ['Closed', 'Open'] }
        ],
        tableHeaders: ['Batch', 'Tekanan (bar)', 'Suhu (°C)', 'Cycle (menit)', 'Pintu', 'Jumlah Cycle'],
        chartLabel: 'Tekanan Sterilizer'
    },
    thresher: {
        title: 'Thresher',
        icon: 'fa-fan',
        description: 'Perontokan buah dari tandan',
        metrics: [
            { key: 'rpm', label: 'RPM', unit: 'rpm', min: 18, max: 24 },
            { key: 'motorAmp', label: 'Arus Motor', unit: 'A', min: 30, max: 65 },
            { key: 'feedRate', label: 'Feed Rate', unit: 'ton/jam', min: 8, max: 24 },
            { key: 'unstripped', label: '% Unstripped', unit: '%', min: 2, max: 12 }
        ],
        tableHeaders: ['Jam', 'RPM', 'Ampere', 'Feed Rate', '% Unstripped'],
        chartLabel: 'RPM Thresher'
    },
    digester: {
        title: 'Digester',
        icon: 'fa-flask',
        description: 'Pengadukan pulp dengan kontrol suhu',
        metrics: [
            { key: 'temperature', label: 'Suhu', unit: '°C', min: 85, max: 105 },
            { key: 'rpm', label: 'RPM', unit: 'rpm', min: 18, max: 28 },
            { key: 'level', label: 'Level', unit: '%', min: 40, max: 95 }
        ],
        tableHeaders: ['Jam', 'Suhu (°C)', 'RPM', 'Level (%)'],
        chartLabel: 'Suhu Digester'
    },
    press: {
        title: 'Press',
        icon: 'fa-industry',
        description: 'Ekstraksi minyak dengan tekanan hidrolik',
        metrics: [
            { key: 'pressure', label: 'Hydraulic Pressure', unit: 'bar', min: 45, max: 75 },
            { key: 'motorLoad', label: 'Motor Load', unit: '%', min: 40, max: 95 },
            { key: 'cakeTemp', label: 'Suhu Cake', unit: '°C', min: 70, max: 105 },
            { key: 'throughput', label: 'Tonase', unit: 'ton/jam', min: 12, max: 28 }
        ],
        tableHeaders: ['Jam', 'Tekanan (bar)', 'Motor Load (%)', 'Suhu Cake (°C)', 'Ton/jam'],
        chartLabel: 'Tekanan Press'
    },
    clarification: {
        title: 'Clarification',
        icon: 'fa-filter',
        description: 'Pemurnian minyak dan pengendalian kualitas',
        metrics: [
            { key: 'crudeTemp', label: 'Suhu Crude Oil', unit: '°C', min: 80, max: 105 },
            { key: 'tankLevel', label: 'Level Tank', unit: '%', min: 45, max: 95 },
            { key: 'purifierRpm', label: 'RPM Purifier', unit: 'rpm', min: 2800, max: 3600 },
            { key: 'vacuum', label: 'Vacuum', unit: 'mbar', min: 680, max: 750 },
            { key: 'moisture', label: 'Moisture & Dirt', unit: '%', min: 0.1, max: 0.4 }
        ],
        tableHeaders: ['Jam', 'Suhu (°C)', 'Level (%)', 'RPM', 'Vacuum (mbar)', 'Moisture (%)'],
        chartLabel: 'Level Tank Clarification'
    },
    kernel: {
        title: 'Kernel Plant',
        icon: 'fa-seedling',
        description: 'Pengolahan kernel dan kontrol kelembaban',
        metrics: [
            { key: 'rippleRpm', label: 'RPM Ripple Mill', unit: 'rpm', min: 1450, max: 1650 },
            { key: 'motorLoad', label: 'Motor Load', unit: '%', min: 50, max: 95 },
            { key: 'moisture', label: 'Moisture Kernel', unit: '%', min: 3, max: 9 },
            { key: 'siloLevel', label: 'Silo Level', unit: '%', min: 40, max: 95 }
        ],
        tableHeaders: ['Jam', 'RPM Ripple', 'Motor Load (%)', 'Moisture (%)', 'Level (%)'],
        chartLabel: 'Moisture Kernel'
    },
    boiler: {
        title: 'Boiler',
        icon: 'fa-fire',
        description: 'Pembangkitan uap untuk proses produksi',
        metrics: [
            { key: 'pressure', label: 'Tekanan Boiler', unit: 'bar', min: 28, max: 42 },
            { key: 'steamTemp', label: 'Steam Temperature', unit: '°C', min: 300, max: 410 },
            { key: 'drumLevel', label: 'Drum Water Level', unit: '%', min: 45, max: 85 },
            { key: 'steamFlow', label: 'Steam Flow', unit: 'ton/jam', min: 5, max: 18 },
            { key: 'fuelFeed', label: 'Fuel Feed Rate', unit: 'kg/jam', min: 1200, max: 2600 }
        ],
        tableHeaders: ['Jam', 'Tekanan (bar)', 'Steam (°C)', 'Drum Level (%)', 'Steam Flow', 'Fuel Feed'],
        chartLabel: 'Tekanan Boiler'
    },
    power: {
        title: 'Power Plant',
        icon: 'fa-bolt',
        description: 'Pembangkit listrik dan distribusi energi',
        metrics: [
            { key: 'kw', label: 'Daya', unit: 'kW', min: 320, max: 620 },
            { key: 'volt', label: 'Tegangan', unit: 'V', min: 380, max: 415 },
            { key: 'ampere', label: 'Arus', unit: 'A', min: 420, max: 680 },
            { key: 'frequency', label: 'Frekuensi', unit: 'Hz', min: 49.5, max: 50.5 },
            { key: 'pf', label: 'Power Factor', unit: '', min: 0.78, max: 0.95 }
        ],
        tableHeaders: ['Jam', 'kW', 'Volt', 'Ampere', 'Frequency', 'PF'],
        chartLabel: 'Daya Power Plant'
    },
    wtp: {
        title: 'Water Treatment Plant',
        icon: 'fa-water',
        description: 'Pengolahan air proses',
        metrics: [
            { key: 'ph', label: 'pH', unit: '', min: 6.5, max: 7.6 },
            { key: 'tds', label: 'TDS', unit: 'ppm', min: 300, max: 580 },
            { key: 'flow', label: 'Water Flow', unit: 'm³/jam', min: 10, max: 28 }
        ],
        tableHeaders: ['Jam', 'pH', 'TDS (ppm)', 'Flow (m³/jam)'],
        chartLabel: 'pH WTP'
    },
    pome: {
        title: 'POME & Biogas',
        icon: 'fa-recycle',
        description: 'Pengolahan limbah cair dan biogas',
        metrics: [
            { key: 'ph', label: 'pH', unit: '', min: 6.1, max: 7.2 },
            { key: 'cod', label: 'COD', unit: 'mg/L', min: 2500, max: 4500 },
            { key: 'bod', label: 'BOD', unit: 'mg/L', min: 1200, max: 2200 },
            { key: 'pondLevel', label: 'Level Kolam', unit: '%', min: 40, max: 95 },
            { key: 'biogasPressure', label: 'Tekanan Biogas', unit: 'kPa', min: 10, max: 24 }
        ],
        tableHeaders: ['Jam', 'pH', 'COD', 'BOD', 'Pond Level (%)', 'Biogas (kPa)'],
        chartLabel: 'Tekanan Biogas'
    }
};

const clockElement = document.getElementById('digital-clock');
function updateClock() {
    if (!clockElement) return;
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

const statusIndicator = document.getElementById('mqtt-status');
function setStatus(isConnected) {
    if (!statusIndicator) return;
    const dot = statusIndicator.querySelector('.status-dot');
    const text = statusIndicator.querySelector('.status-text');
    dot.classList.toggle('connected', isConnected);
    dot.classList.toggle('disconnected', !isConnected);
    text.textContent = isConnected ? 'Connected' : 'Disconnected';
}

function createStationSection(key, config) {
    const section = document.createElement('section');
    section.className = 'station-section';
    section.dataset.station = key;

    section.innerHTML = `
        <div class="station-header">
            <h2><i class="fa-solid ${config.icon}"></i>${config.title}</h2>
            <span class="glass-tag">${config.description}</span>
        </div>
        <div class="station-grid">
            ${config.metrics.map(metric => `
                <div class="station-card" data-key="${metric.key}">
                    <div class="label">${metric.label}</div>
                    <div class="value">0</div>
                    <div class="unit">${metric.unit}</div>
                </div>
            `).join('')}
        </div>
        <div class="card">
            <table class="station-table">
                <thead>
                    <tr>${config.tableHeaders.map(header => `<th>${header}</th>`).join('')}</tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="station-chart">
            <canvas id="chart-${key}"></canvas>
        </div>
    `;

    return section;
}

const stationContainer = document.getElementById('station-sections');
const chartInstances = {};

function initStations() {
    if (!stationContainer) return;
    Object.entries(stationConfigs).forEach(([key, config]) => {
        const section = createStationSection(key, config);
        stationContainer.appendChild(section);
        createStationChart(key, config.chartLabel);
        populateSampleTable(key, config.tableHeaders);
    });
}

document.addEventListener('DOMContentLoaded', initStations);

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('station-detail-filter');
    if (!select) return;
    select.addEventListener('change', () => {
        const value = select.value;
        filterStations(value);
    });
});

function filterStations(value) {
    document.querySelectorAll('.station-section').forEach(section => {
        if (value === 'all' || section.dataset.station === value) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(10, 13, 26, 0.05)');
    return gradient;
}

function createStationChart(key, label) {
    const canvas = document.getElementById(`chart-${key}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color = 'rgba(97, 176, 255, 0.95)';
    const gradient = createGradient(ctx, color);
    chartInstances[key] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label,
                data: [],
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.35,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#d7dcf5' } }
            },
            scales: {
                x: { ticks: { color: '#9aa5c4' }, grid: { color: 'rgba(97, 176, 255, 0.08)' } },
                y: { ticks: { color: '#9aa5c4' }, grid: { color: 'rgba(97, 176, 255, 0.08)' } }
            }
        }
    });
}

function populateSampleTable(key, headers) {
    const section = document.querySelector(`.station-section[data-station="${key}"]`);
    if (!section) return;
    const tbody = section.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let i = 0; i < 5; i += 1) {
        const row = document.createElement('tr');
        headers.forEach((header, index) => {
            const cell = document.createElement('td');
            cell.textContent = generateSampleCell(key, header, index, i);
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    }
}

function generateSampleCell(stationKey, header, index, rowIndex) {
    const hour = `${String(7 + rowIndex).padStart(2, '0')}:00`;
    switch (stationKey) {
        case 'weighbridge':
            return ['BK-10', 'Plasma', 28000, 12000, 16000, '07:15', '07:45'][index];
        case 'sterilizer':
            return [`Batch ${rowIndex + 1}`, (2.5 + Math.random()).toFixed(2), (128 + Math.random() * 5).toFixed(1), (70 + Math.random() * 10).toFixed(0), Math.random() > 0.2 ? 'Closed' : 'Open', (6 + rowIndex)][index];
        case 'thresher':
            return [hour, (20 + Math.random() * 2).toFixed(1), (40 + Math.random() * 12).toFixed(1), (10 + Math.random() * 6).toFixed(1), (4 + Math.random() * 4).toFixed(1)][index];
        case 'digester':
            return [hour, (95 + Math.random() * 4).toFixed(1), (22 + Math.random() * 3).toFixed(1), (65 + Math.random() * 18).toFixed(0)][index];
        case 'press':
            return [hour, (55 + Math.random() * 8).toFixed(1), (65 + Math.random() * 20).toFixed(0), (85 + Math.random() * 8).toFixed(1), (18 + Math.random() * 6).toFixed(1)][index];
        case 'clarification':
            return [hour, (92 + Math.random() * 6).toFixed(1), (70 + Math.random() * 25).toFixed(0), (3200 + Math.random() * 120).toFixed(0), (700 + Math.random() * 30).toFixed(0), (0.18 + Math.random() * 0.1).toFixed(2)][index];
        case 'kernel':
            return [hour, (1550 + Math.random() * 80).toFixed(0), (70 + Math.random() * 20).toFixed(0), (5 + Math.random() * 2.5).toFixed(2), (60 + Math.random() * 25).toFixed(0)][index];
        case 'boiler':
            return [hour, (32 + Math.random() * 4).toFixed(1), (360 + Math.random() * 30).toFixed(1), (60 + Math.random() * 15).toFixed(0), (8 + Math.random() * 4).toFixed(1), (1500 + Math.random() * 600).toFixed(0)][index];
        case 'power':
            return [hour, (420 + Math.random() * 140).toFixed(0), (400 + Math.random() * 12).toFixed(0), (480 + Math.random() * 110).toFixed(0), (49.6 + Math.random() * 0.4).toFixed(2), (0.85 + Math.random() * 0.07).toFixed(2)][index];
        case 'wtp':
            return [hour, (6.8 + Math.random() * 0.4).toFixed(2), (360 + Math.random() * 120).toFixed(0), (15 + Math.random() * 7).toFixed(1)][index];
        case 'pome':
            return [hour, (6.4 + Math.random() * 0.3).toFixed(2), (3000 + Math.random() * 800).toFixed(0), (1400 + Math.random() * 500).toFixed(0), (55 + Math.random() * 20).toFixed(0), (12 + Math.random() * 6).toFixed(1)][index];
        default:
            return '-';
    }
}

function updateStationMetrics(key, data) {
    const section = document.querySelector(`.station-section[data-station="${key}"]`);
    if (!section) return;
    stationConfigs[key].metrics.forEach((metric) => {
        const card = section.querySelector(`.station-card[data-key="${metric.key}"]`);
        if (!card) return;
        const valueEl = card.querySelector('.value');
        if (metric.values) {
            const index = Math.round(Math.random());
            valueEl.textContent = metric.values[index];
        } else {
            const value = data[metric.key] ?? metric.min + Math.random() * (metric.max - metric.min);
            valueEl.textContent = Number.parseFloat(value).toFixed(metric.unit === 'menit' || metric.unit === '' ? 0 : 2);
        }
        card.classList.add('updated');
        setTimeout(() => card.classList.remove('updated'), 600);
    });
}

function appendStationChart(key, value) {
    const chart = chartInstances[key];
    if (!chart) return;
    const now = new Date();
    chart.data.labels.push(now.toLocaleTimeString('id-ID', { hour12: false }));
    chart.data.datasets[0].data.push(value);
    if (chart.data.labels.length > 12) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update('none');
}

function parseMQTTMessage(message) {
    const payload = message.payloadString;
    const pairs = payload.split(';');
    const result = {};
    pairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        if (!key || typeof value === 'undefined') return;
        const numeric = Number.parseFloat(value);
        result[key.trim()] = Number.isNaN(numeric) ? value.trim() : numeric;
    });
    return result;
}

function dispatchStationData(parsed) {
    Object.entries(stationConfigs).forEach(([key, config]) => {
        const dataKey = parsed[key];
        const metricValue = parsed[config.metrics[0]?.key];
        updateStationMetrics(key, typeof dataKey === 'object' ? dataKey : parsed);
        if (typeof metricValue === 'number') {
            appendStationChart(key, metricValue);
        }
    });
}

let mqttClient = null;
let simulationTimer = null;

function connectMQTT() {
    try {
        mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8000, `pks-monitor-${Math.random().toString(16).slice(2)}`);
        mqttClient.onConnectionLost = () => {
            setStatus(false);
            startSimulation();
        };
        mqttClient.onMessageArrived = (message) => {
            const parsed = parseMQTTMessage(message);
            dispatchStationData(parsed);
        };
        mqttClient.connect({
            timeout: 5,
            onSuccess: () => {
                setStatus(true);
                mqttClient.subscribe('pks/#');
                stopSimulation();
            },
            onFailure: () => {
                setStatus(false);
                startSimulation();
            },
            useSSL: false
        });
    } catch (error) {
        console.error(error);
        setStatus(false);
        startSimulation();
    }
}

function startSimulation() {
    stopSimulation();
    simulationTimer = setInterval(() => {
        Object.entries(stationConfigs).forEach(([key, config]) => {
            const simulated = {};
            config.metrics.forEach((metric) => {
                if (metric.values) {
                    simulated[metric.key] = metric.values[Math.round(Math.random())];
                } else {
                    simulated[metric.key] = metric.min + Math.random() * (metric.max - metric.min);
                }
            });
            updateStationMetrics(key, simulated);
            appendStationChart(key, simulated[config.metrics[0].key]);
        });
    }, 4500);
}

function stopSimulation() {
    if (simulationTimer) {
        clearInterval(simulationTimer);
        simulationTimer = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    connectMQTT();
    startSimulation();
});
