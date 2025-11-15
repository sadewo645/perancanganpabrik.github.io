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

const neonLinePalette = ['rgba(99, 102, 241, 1)', 'rgba(236, 72, 153, 1)', 'rgba(110, 231, 183, 1)'];

function ensureNeonGlowPlugin() {
    if (window.__pksNeonGlowRegistered) return;
    const neonGlow = {
        id: 'neonGlow',
        beforeDatasetDraw(chart, args) {
            const ctx = chart.ctx;
            ctx.save();
            const dataset = chart.config.data.datasets[args.index];
            ctx.shadowColor = dataset.borderColor || 'rgba(99, 102, 241, 0.6)';
            ctx.shadowBlur = dataset.glowBlur ?? 18;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        },
        afterDatasetDraw(chart) {
            chart.ctx.restore();
        }
    };
    Chart.register(neonGlow);
    window.__pksNeonGlowRegistered = true;
}

function withAlpha(color, alpha) {
    if (color.startsWith('rgba')) {
        return color.replace(/rgba\(([^)]+),\s*[^)]+\)/, `rgba($1, ${alpha})`);
    }
    return color;
}

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
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height || 300);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(8, 10, 24, 0)');
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
            borderWidth: 2.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
            pointBorderWidth: 1,
            pointBorderColor: '#0a1026',
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.18)',
            glowBlur: 20
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            intersect: false
        },
        plugins: {
            legend: {
                labels: {
                    color: '#d7dcf5'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(20,20,50,0.85)',
                borderColor: '#8B5CF6',
                borderWidth: 1,
                titleColor: '#fff',
                bodyColor: '#fff',
                cornerRadius: 6,
                padding: 10,
                displayColors: false
            }
        },
        scales: {
            x: {
                ticks: { color: '#9aa5c4' },
                grid: { color: 'rgba(99, 102, 241, 0.12)' }
            },
            y: {
                ticks: { color: '#9aa5c4' },
                grid: { color: 'rgba(99, 102, 241, 0.12)' }
            }
        }
    }
};

const charts = {};

function initCharts() {
    ensureNeonGlowPlugin();
    const chartKeys = ['ph', 'cod', 'sterilizer', 'digester', 'press', 'cpo', 'flow', 'energy'];
    chartKeys.forEach((key, index) => {
        const canvas = document.getElementById(`chart-${key}`);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const color = neonLinePalette[index % neonLinePalette.length];
        const gradient = createGradient(ctx, withAlpha(color, 0.55));
        const config = JSON.parse(JSON.stringify(chartConfig));
        const dataset = config.data.datasets[0];
        dataset.borderColor = color;
        dataset.pointBackgroundColor = color;
        dataset.backgroundColor = gradient;
        dataset.label = canvas.parentElement.querySelector('h3')?.textContent || dataset.label;
        dataset.glowBlur = 22;
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
    chart.data.datasets[0].data.push(Number.parseFloat(value.toFixed(2)));
    if (chart.data.labels.length > 12) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update('none');
}

function animateKPI(valueEl, newValue) {
    if (!valueEl) return;
    const numericValue = Number.parseFloat(newValue);
    if (Number.isNaN(numericValue)) return;
    const formatted = Number.parseFloat(numericValue.toFixed(2));
    const card = valueEl.closest('.kpi-card');
    valueEl.classList.add('animate');
    if (card) card.classList.add('updated');
    valueEl.textContent = formatted;
    setTimeout(() => {
        valueEl.classList.remove('animate');
        if (card) card.classList.remove('updated');
    }, 600);
}

function updateKPIFromData(data) {
    Object.keys(kpiMap).forEach((key) => {
        const valueEl = document.getElementById(`kpi-${key}`);
        if (!valueEl) return;
        if (Object.prototype.hasOwnProperty.call(data, key) && typeof data[key] === 'number') {
            animateKPI(valueEl, data[key]);
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

function setupLayoutControls() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (!toggleBtn || !document.querySelector('.sidebar')) return;
    const body = document.body;
    let userOverride = false;

    const setCollapsed = (collapsed) => {
        body.classList.toggle('sidebar-collapsed', collapsed);
        toggleBtn.setAttribute('aria-expanded', String(!collapsed));
        toggleBtn.setAttribute('title', collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = collapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
        }
    };

    const handleResize = () => {
        if (userOverride) return;
        setCollapsed(window.innerWidth <= 1200);
    };

    setCollapsed(window.innerWidth <= 1200);

    toggleBtn.addEventListener('click', () => {
        userOverride = true;
        const collapsed = body.classList.contains('sidebar-collapsed');
        setCollapsed(!collapsed);
    });

    window.addEventListener('resize', handleResize);
}

document.addEventListener('DOMContentLoaded', () => {
    connectMQTT();
    setupInteractions();
    setupLayoutControls();
    restartSimulation();
});
