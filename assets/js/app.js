const kpiElements = document.querySelectorAll('.kpi-card');
const kpiMap = {
    cod: { unit: 'mg/L', min: 150, max: 280 },
    bod: { unit: 'mg/L', min: 50, max: 140 },
    tss: { unit: 'mg/L', min: 80, max: 220 },
    ph: { unit: '', min: 6.2, max: 7.4 },
    temperature: { unit: '°C', min: 75, max: 95 },
    overload: { unit: '%', min: 12, max: 28 },
    oer: { unit: '%', min: 20, max: 24 },
    ker: { unit: '%', min: 4, max: 6.5 },
    energy: { unit: 'kWh/ton', min: 18, max: 32 },
    sterilizerPressure: { unit: 'bar', min: 2.2, max: 3.8 },
    boilerPressure: { unit: 'bar', min: 32, max: 42 },
    cpoLevel: { unit: '%', min: 45, max: 95 },
    moistureCpo: { unit: '%', min: 0.15, max: 0.45 }
};

const defaultWarningList = [
    'Tekanan Boiler > 40 bar',
    'pH kolam limbah < 6.0',
    'Motor Press Overload',
    'Turbin OFF / Trip'
];

function updateClock() {
    const clock = document.getElementById('digital-clock');
    if (!clock) return;
    const now = new Date();
    const formatted = now.toLocaleTimeString('id-ID', { hour12: false });
    clock.textContent = formatted;
}
setInterval(updateClock, 1000);
updateClock();

function setStatus(isConnected) {
    const status = document.getElementById('mqtt-status');
    if (!status) return;
    const dot = status.querySelector('.status-dot');
    const text = status.querySelector('.status-text');
    if (isConnected) {
        dot.classList.remove('disconnected');
        dot.classList.add('connected');
        text.textContent = 'Connected';
    } else {
        dot.classList.remove('connected');
        dot.classList.add('disconnected');
        text.textContent = 'Disconnected';
    }
}

function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(10, 13, 26, 0.1)');
    return gradient;
}

const chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Data',
            data: [],
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 0,
            borderColor: 'rgba(97, 176, 255, 0.95)',
            backgroundColor: 'rgba(97, 176, 255, 0.18)',
            shadowColor: 'rgba(97, 176, 255, 0.45)',
            shadowBlur: 15
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#d7dcf5'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#9aa5c4' },
                grid: { color: 'rgba(97, 176, 255, 0.08)' }
            },
            y: {
                ticks: { color: '#9aa5c4' },
                grid: { color: 'rgba(97, 176, 255, 0.08)' }
            }
        }
    }
};

const charts = {};

function initCharts() {
    const chartIds = {
        ph: { color: 'rgba(97, 176, 255, 0.95)' },
        cod: { color: 'rgba(187, 134, 252, 0.95)' },
        sterilizer: { color: 'rgba(95, 255, 161, 0.95)' },
        digester: { color: 'rgba(255, 166, 77, 0.95)' },
        press: { color: 'rgba(255, 95, 135, 0.95)' },
        cpo: { color: 'rgba(255, 208, 105, 0.95)' },
        flow: { color: 'rgba(97, 255, 236, 0.95)' },
        energy: { color: 'rgba(120, 190, 255, 0.95)' }
    };

    Object.entries(chartIds).forEach(([key, cfg]) => {
        const canvas = document.getElementById(`chart-${key}`);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const gradient = createGradient(ctx, cfg.color);
        const config = JSON.parse(JSON.stringify(chartConfig));
        config.data.datasets[0].borderColor = cfg.color;
        config.data.datasets[0].backgroundColor = gradient;
        config.data.datasets[0].label = canvas.parentElement.querySelector('h3').textContent;
        charts[key] = new Chart(ctx, config);
    });
}

document.addEventListener('DOMContentLoaded', initCharts);

function appendChartData(chartKey, value) {
    const chart = charts[chartKey];
    if (!chart) return;
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('id-ID', { hour12: false });
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(value);
    if (chart.data.labels.length > 12) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update('none');
}

function animateKPI(element, newValue) {
    const valueEl = element.querySelector('.kpi-value');
    const numericValue = parseFloat(newValue.toFixed(2));
    valueEl.classList.add('animate');
    element.classList.add('updated');
    valueEl.textContent = numericValue;
    setTimeout(() => {
        valueEl.classList.remove('animate');
        element.classList.remove('updated');
    }, 600);
}

function updateKPIFromData(data) {
    Object.entries(kpiMap).forEach(([key]) => {
        const card = document.querySelector(`.kpi-card[data-key="${key}"]`);
        if (!card) return;
        if (key in data) {
            animateKPI(card, data[key]);
        }
    });
}

function parseMQTTMessage(message) {
    const payload = message.payloadString;
    const pairs = payload.split(';');
    const result = {};
    pairs.forEach((pair) => {
        const [rawKey, rawValue] = pair.split('=');
        if (!rawKey || typeof rawValue === 'undefined') return;
        const key = rawKey.trim();
        const value = parseFloat(rawValue.trim());
        if (!Number.isNaN(value)) {
            result[key] = value;
        }
    });
    return result;
}

function handleMQTTData(parsed) {
    const mapped = {
        cod: parsed.cod ?? parsed.COD,
        bod: parsed.bod ?? parsed.BOD,
        tss: parsed.tss ?? parsed.TSS,
        ph: parsed.ph ?? parsed.PH,
        temperature: parsed.temp ?? parsed.temperature,
        overload: parsed.overload,
        oer: parsed.oer,
        ker: parsed.ker,
        energy: parsed.energy ?? parsed.kwh,
        sterilizerPressure: parsed.sterilizer ?? parsed.sterilizerPressure,
        boilerPressure: parsed.boiler ?? parsed.boilerPressure,
        cpoLevel: parsed.cpoLevel ?? parsed.level,
        moistureCpo: parsed.moisture ?? parsed.moistureCpo
    };
    updateKPIFromData(mapped);

    if (typeof mapped.ph === 'number') appendChartData('ph', mapped.ph);
    if (typeof mapped.cod === 'number') appendChartData('cod', mapped.cod);
    if (typeof mapped.sterilizerPressure === 'number') appendChartData('sterilizer', mapped.sterilizerPressure);
    if (typeof mapped.temperature === 'number') appendChartData('digester', mapped.temperature);
    if (typeof parsed.motorPress === 'number') appendChartData('press', parsed.motorPress);
    if (typeof mapped.cpoLevel === 'number') appendChartData('cpo', mapped.cpoLevel);
    if (typeof parsed.flow === 'number') appendChartData('flow', parsed.flow);
    if (typeof mapped.energy === 'number') appendChartData('energy', mapped.energy);

    updateWarnings(parsed);
}

function updateWarnings(parsed) {
    const warningList = document.getElementById('warning-list');
    if (!warningList) return;
    warningList.innerHTML = '';
    const warnings = [...defaultWarningList];

    if (parsed.boiler && parsed.boiler > 40) {
        warnings.push(`Tekanan Boiler tinggi: ${parsed.boiler.toFixed(1)} bar`);
    }
    if (parsed.ph && parsed.ph < 6.0) {
        warnings.push(`pH POME rendah: ${parsed.ph.toFixed(2)}`);
    }
    if (parsed.motorPress && parsed.motorPress > 80) {
        warnings.push(`Motor Press overload ${parsed.motorPress.toFixed(0)}%`);
    }
    if (parsed.turbineStatus === 0) {
        warnings.push('Turbin dalam keadaan OFF / Trip');
    }

    warnings.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        warningList.appendChild(li);
    });
}

let mqttClient = null;
let simulationInterval = null;

function connectMQTT() {
    try {
        mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8000, `pks-dashboard-${Math.random().toString(16).slice(2)}`);
        mqttClient.onConnectionLost = () => {
            setStatus(false);
            restartSimulation();
        };
        mqttClient.onMessageArrived = (message) => {
            const parsed = parseMQTTMessage(message);
            handleMQTTData(parsed);
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
                restartSimulation();
            },
            useSSL: false
        });
    } catch (err) {
        console.error('MQTT connection error', err);
        setStatus(false);
        restartSimulation();
    }
}

function stopSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
}

function restartSimulation() {
    stopSimulation();
    simulationInterval = setInterval(generateSimulatedData, 4000);
}

function generateSimulatedData() {
    const simulated = {};
    Object.entries(kpiMap).forEach(([key, range]) => {
        const randomValue = range.min + Math.random() * (range.max - range.min);
        simulated[key] = randomValue;
    });
    simulated.motorPress = 60 + Math.random() * 50;
    simulated.flow = 10 + Math.random() * 8;
    handleMQTTData(simulated);
}

function setupInteractions() {
    const reloadBtn = document.getElementById('reload-btn');
    if (reloadBtn) reloadBtn.addEventListener('click', generateSimulatedData);

    const filterBtn = document.getElementById('filter-date-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        const start = document.getElementById('start-date').value;
        const end = document.getElementById('end-date').value;
        const aiSearch = document.getElementById('ai-search').value;
        const message = `Filter diterapkan untuk ${start || 'awal'} - ${end || 'akhir'}${aiSearch ? ` dengan pencarian "${aiSearch}"` : ''}`;
        console.info(message);
    });

    const aiBtn = document.getElementById('ai-search-btn');
    if (aiBtn) aiBtn.addEventListener('click', () => {
        const query = document.getElementById('ai-search').value;
        if (!query) return;
        const warningList = document.getElementById('warning-list');
        if (warningList) {
            const li = document.createElement('li');
            li.textContent = `AI Insight: ${query} - data sedang diproses`;
            warningList.prepend(li);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    connectMQTT();
    setupInteractions();
    restartSimulation();
});
