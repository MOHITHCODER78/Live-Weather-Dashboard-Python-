// Dashboard Configuration
let map, mainMarker;
let trendChart, tempGauge;

// Initial state
const state = {
    city: 'London',
    coords: [51.505, -0.09],
    weather: null,
    history: [],
    radarTimer: null,
    isRadarPlaying: false,
    radarLayers: []
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initCharts();
    setupEventListeners();
    updateDashboard('London');
    loadHistory();
    
    // Simulate live update indicator
    setInterval(() => {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();
    }, 1000);
});

function initMap() {
    const apiKey = document.body.dataset.apiKey;
    
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView(state.coords, 10);

    // Base Layers
    const darkBase = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
        maxZoom: 19,
        attribution: '© CartoDB'
    });
    const osmBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
    
    // Default to the premium dark theme
    darkBase.addTo(map);

    // Weather Layers (OpenWeatherMap)
    const precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, { opacity: 0.6 });
    const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, { opacity: 0.6 });
    const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, { opacity: 0.4 });

    const baseMaps = { "Dark Mode": darkBase, "Standard": osmBase };
    const overlayMaps = { "Precipitation": precipitationLayer, "Wind Speed": windLayer, "Temperature": tempLayer };

    L.control.layers(baseMaps, overlayMaps, { position: 'bottomright', collapsed: true }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);

    mainMarker = L.marker(state.coords).addTo(map);

    // Force map to recognize its container size after a tiny delay
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    map.on('mousemove', (e) => {
        document.getElementById('mapCoordinates').textContent = 
            `Lat: ${e.latlng.lat.toFixed(2)}, Lon: ${e.latlng.lng.toFixed(2)}`;
    });
}

function initCharts() {
    // Temperature Gauge
    const gaugeOptions = {
        series: [0],
        chart: { height: 140, type: 'radialBar', offsetY: -10 },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: { fontSize: '14px', color: '#94a3b8', offsetY: 80 },
                    value: {
                        offsetY: 40,
                        fontSize: '24px',
                        color: '#fff',
                        formatter: (val) => val + '°C'
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91]
            },
        },
        stroke: { dashArray: 4 },
        labels: ['Current Temp'],
    };

    tempGauge = new ApexCharts(document.querySelector("#tempGauge"), gaugeOptions);
    tempGauge.render();

    // Trend Chart
    const trendOptions = {
        series: [{ name: 'Predictive Temp', data: [] }],
        chart: {
            type: 'area',
            height: 120,
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
            dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.2 }
        },
        dataLabels: { 
            enabled: true,
            style: {
                colors: ['#fff'],
                fontSize: '10px',
                fontFamily: 'Inter',
                fontWeight: 600
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(56, 189, 248, 0.3)',
                opacity: 0.2,
                dropShadow: { enabled: false }
            },
            offsetY: -10,
            formatter: (val) => val.toFixed(0) + '°'
        },
        stroke: { curve: 'smooth', width: 3, colors: ['#38bdf8'] },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100],
                colorStops: [
                    { offset: 0, color: '#38bdf8', opacity: 0.4 },
                    { offset: 100, color: '#6366f1', opacity: 0.05 }
                ]
            }
        },
        xaxis: {
            type: 'datetime',
            labels: { 
                show: true,
                style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 500 },
                datetimeFormatter: { hour: 'HH:mm' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                show: true,
                style: { colors: '#94a3b8', fontSize: '10px' },
                formatter: (val) => val.toFixed(0) + '°'
            }
        },
        grid: {
            borderColor: 'rgba(255,255,255,0.03)',
            strokeDashArray: 4,
            padding: { left: 10, right: 10, top: 0, bottom: 0 }
        },
        markers: {
            size: 4,
            colors: ['#38bdf8'],
            strokeColors: '#020617',
            strokeWidth: 2,
            hover: { size: 6 }
        },
        colors: ['#38bdf8'],
        tooltip: { 
            theme: 'dark',
            x: { format: 'HH:mm' },
            marker: { show: false },
            y: {
                formatter: (val) => val.toFixed(1) + '°C',
                title: { formatter: () => 'Predictive:' }
            }
        }
    };

    trendChart = new ApexCharts(document.querySelector("#trendChart"), trendOptions);
    trendChart.render();
}

function setupEventListeners() {
    const searchInput = document.getElementById('citySearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                updateDashboard(searchInput.value);
                searchInput.value = '';
            }
        });
    }
    // Fullscreen Logic
    document.getElementById('mapFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.error(e));
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        // Force map update after screen state change
        setTimeout(() => map.invalidateSize(), 500);
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        if (map) map.invalidateSize();
    });

    const radarBtn = document.getElementById('radarPlay');
    if (radarBtn) radarBtn.addEventListener('click', toggleRadarLoop);

    const exportBtn = document.getElementById('exportReport');
    if (exportBtn) exportBtn.addEventListener('click', exportDashboardToPDF);

    // Mobile UI Handlers
    const panelL = document.querySelector('.panel-left');
    const panelR = document.querySelector('.panel-right');
    const toggleL = document.getElementById('toggleLeft');
    const toggleR = document.getElementById('toggleRight');
    const backdrop = document.getElementById('panelBackdrop');

    const togglePanel = (target) => {
        const isActive = target.classList.contains('active');
        // Close all if opening a new one
        panelL.classList.remove('active');
        panelR.classList.remove('active');
        
        if (!isActive) {
            target.classList.add('active');
            backdrop.classList.add('active');
        } else {
            backdrop.classList.remove('active');
        }
    };

    if (toggleL) toggleL.onclick = () => togglePanel(panelL);
    if (toggleR) toggleR.onclick = () => togglePanel(panelR);
    if (backdrop) backdrop.onclick = () => {
        panelL.classList.remove('active');
        panelR.classList.remove('active');
        backdrop.classList.remove('active');
    };

    // Mobile Search Handlers
    const mSearchTrigger = document.getElementById('mobileSearchTrigger');
    const mSearchOverlay = document.getElementById('mobileSearchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const mSearchInput = document.getElementById('mobileCitySearch');

    if (mSearchTrigger) mSearchTrigger.onclick = () => {
        mSearchOverlay.classList.add('active');
        mSearchInput.focus();
    };
    if (closeSearch) closeSearch.onclick = () => mSearchOverlay.classList.remove('active');
    
    if (mSearchInput) {
        mSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                updateDashboard(mSearchInput.value);
                mSearchOverlay.classList.remove('active');
                mSearchInput.value = '';
            }
        });
    }
}

function toggleRadarLoop() {
    const btn = document.getElementById('radarPlay');
    state.isRadarPlaying = !state.isRadarPlaying;
    
    if (state.isRadarPlaying) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-stop"></i>';
        startRadarLoop();
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-play"></i>';
        stopRadarLoop();
    }
}

function startRadarLoop() {
    const apiKey = document.body.dataset.apiKey;
    const timestamps = [600, 1200, 1800, 2400, 3000]; // simulate historical data steps
    let currentIdx = 0;

    state.radarTimer = setInterval(() => {
        // Clear previous radar layer if exists
        if (state.currentRadar) map.removeLayer(state.currentRadar);
        
        // In a real scenario, OWM provides historical tiles via different paths
        // Here we simulate movement by slightly shifting or fetching different layers
        state.currentRadar = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            opacity: 0.6,
            zIndex: 1000
        }).addTo(map);

        currentIdx = (currentIdx + 1) % timestamps.length;
    }, 1000);
}

function stopRadarLoop() {
    clearInterval(state.radarTimer);
    if (state.currentRadar) map.removeLayer(state.currentRadar);
}

async function exportDashboardToPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.querySelector('.dashboard-wrapper');
    const exportBtn = document.getElementById('exportReport');
    
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#020617',
            scale: 2,
            useCORS: true,
            allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ARC-Weather-Report-${state.city}.pdf`);
        
        exportBtn.innerHTML = '<i class="fas fa-check"></i> Success';
    } catch (err) {
        console.error('PDF Export Failed:', err);
        exportBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
    } finally {
        setTimeout(() => {
            exportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Export';
        }, 3000);
    }
}

function toggleFullscreenMap() {
    const mapContainer = document.querySelector('.map-container');
    mapContainer.classList.toggle('map-fullscreen');
    setTimeout(() => map.invalidateSize(), 400);
}

async function updateDashboard(city) {
    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        state.weather = data;
        state.coords = [data.coord.lat, data.coord.lon];
        
        updateMap(data.coord.lat, data.coord.lon, data.name);
        
        // Immediate update with current data
        updateMetrics(data);
        updateAlerts(data);
        
        // Trigger enriched data processing
        processForecast(city);
        fetchAnalysis(city);
        generateAIBriefing(data);
        loadHistory();
        
    } catch (err) {
        console.error("Dashboard Update Failed:", err);
    }
}

function updateMap(lat, lon, name) {
    map.flyTo([lat, lon], 10);
    mainMarker.setLatLng([lat, lon])
              .bindPopup(`<b>${name}</b><br>${state.weather.weather[0].description}`)
              .openPopup();
}

function updateMetrics(data, forecastExtreme = 0, forecastSevere = 0) {
    if (!data || !data.main) return;

    // Update Temperature Gauge
    tempGauge.updateSeries([Math.round(data.main.temp)]);
    
    // Update Theme Glow
    const wrapper = document.querySelector('.dashboard-wrapper');
    if (wrapper) {
        wrapper.classList.remove('cold-glow', 'warm-glow', 'hot-glow');
        if (data.main.temp < 15) wrapper.classList.add('cold-glow');
        else if (data.main.temp < 28) wrapper.classList.add('warm-glow');
        else wrapper.classList.add('hot-glow');
    }

    // Weather Condition Logic
    const weatherId = data.weather && data.weather[0] ? data.weather[0].id : 800;
    const temp = data.main.temp;
    const wind = data.wind ? data.wind.speed : 0;
    const visibility = data.visibility || 10000;

    // Detection logic
    const isCurrExtreme = (weatherId === 781 || weatherId === 771 || weatherId === 762 || weatherId === 504) || temp > 38 || wind > 20;
    const isCurrSevere = (weatherId >= 200 && weatherId < 300) || (weatherId >= 500 && weatherId <= 504) || (weatherId >= 600 && weatherId <= 622) || temp > 32 || wind > 12 || visibility < 2000;

    const totalExtreme = (isCurrExtreme ? 1 : 0) + forecastExtreme;
    const totalSevere = (isCurrSevere ? 1 : 0) + forecastSevere;
    
    // Update Bubble Counts
    const extEl = document.getElementById('countExtreme');
    const sevEl = document.getElementById('countSevere');
    const bubbleExt = document.getElementById('bubbleExtreme');
    const bubbleSev = document.getElementById('bubbleSevere');

    if (extEl) extEl.textContent = totalExtreme;
    if (sevEl) sevEl.textContent = totalSevere;
    if (bubbleExt) bubbleExt.classList.toggle('pulse-alert', totalExtreme > 0);
    if (bubbleSev) bubbleSev.classList.toggle('pulse-alert', totalSevere > 0);

    // Update System Status Bar
    const statusText = document.getElementById('systemStatus');
    if (statusText) {
        if (totalExtreme > 0) {
            statusText.style.color = 'var(--color-extreme)';
            statusText.innerHTML = `<i class="fas fa-biohazard"></i> ALERT: EXTREME ANOMALY DETECTED`;
        } else if (totalSevere > 0) {
            statusText.style.color = 'var(--color-severe)';
            statusText.innerHTML = `<i class="fas fa-triangle-exclamation"></i> WARNING: SEVERE WEATHER PATTERNS`;
        } else {
            statusText.style.color = '#10b981';
            statusText.innerHTML = `<span class="status-dot"></span> SYSTEM NOMINAL | DATALINK STABLE`;
        }
    }

    // Update Basic Metrics
    const humEl = document.getElementById('valHumidity');
    const windEl = document.getElementById('valWind');
    if (humEl) humEl.textContent = data.main.humidity + '%';
    if (windEl) windEl.textContent = wind.toFixed(1) + ' m/s';
}

function updateAlerts(data) {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    container.innerHTML = '';

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check for severe/extreme conditions for details
    const weatherId = data.weather[0].id;
    const temp = data.main.temp;
    const wind = data.wind ? data.wind.speed : 0;
    
    let missionAlerts = [];
    
    if (weatherId >= 200 && weatherId < 300) missionAlerts.push({ title: 'Storm Detected', type: 'SEVERE', desc: 'Active thunderstorm cell identified in current sector.' });
    if (temp > 32) missionAlerts.push({ title: 'Thermal Stress', type: 'WARNING', desc: 'High temperature levels may impact operations.' });
    if (wind > 12) missionAlerts.push({ title: 'High Velocity Winds', type: 'DATA', desc: `Wind speed detected at ${wind.toFixed(1)} m/s. Secure light equipment.` });
    if (data.visibility < 2000) missionAlerts.push({ title: 'Low Visibility', type: 'ALERT', desc: 'Atmospheric particulates or moisture reducing optical range.' });

    const standardAlerts = [
        { title: `Atmospheric Observation: ${data.name}`, type: 'ANALYSIS', desc: `Current pressure gradient at ${data.main.pressure} hPa. Sky condition: ${data.weather[0].description}.` },
        { title: 'Geospatial Intelligence', type: 'DATA', desc: `Optical visibility confirmed at ${data.visibility / 1000}km. Cloud density measured at ${data.clouds.all}%.` }
    ];

    [...missionAlerts, ...standardAlerts].forEach(a => {
        const div = document.createElement('div');
        div.className = 'alert-item';
        if (a.type === 'SEVERE' || a.type === 'ALERT') div.style.borderLeftColor = 'var(--color-extreme)';
        else if (a.type === 'WARNING') div.style.borderLeftColor = 'var(--color-severe)';
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.7rem; font-weight: 800; color: ${a.type === 'SEVERE' ? 'var(--color-extreme)' : 'var(--accent-blue)'}; letter-spacing: 0.1em;">${a.type}</span>
                <span style="font-size: 0.65rem; color: var(--text-secondary);">${timestamp}</span>
            </div>
            <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; color: var(--text-primary);">${a.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">${a.desc}</div>
        `;
        container.appendChild(div);
    });
}

async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        const history = await response.json();
        const container = document.getElementById('historyContainer');
        if (!history || history.length === 0 || !container) return;

        container.innerHTML = '';
        history.forEach(h => {
            const div = document.createElement('div');
            div.className = 'alert-item';
            div.style.borderLeftColor = 'var(--accent-purple)';
            div.style.cursor = 'pointer';
            div.onclick = () => updateDashboard(h.city);
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; font-size: 0.85rem;">${h.city}</span>
                    <span style="font-size: 0.8rem; color: var(--accent-blue);">${Math.round(h.temp)}°C</span>
                </div>
                <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 4px;">Last Searched: ${h.time}</div>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.warn("Could not load history", err);
    }
}

async function fetchAnalysis(city) {
    try {
        const response = await fetch(`/api/analysis?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        if (data.error) return;
        const avgEl = document.getElementById('avgTemp');
        const rangeEl = document.getElementById('rangeTemp');
        if (avgEl) avgEl.textContent = data.avg_temp + '°C';
        if (rangeEl) rangeEl.textContent = `${data.max_temp}° / ${data.min_temp}°`;
    } catch (err) {
        console.warn("Analysis Failed", err);
    }
}

async function processForecast(city) {
    try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        if (data.error) return;

        // 1. Calculate Alerts
        let fExtreme = 0;
        let fSevere = 0;
        data.list.forEach(item => {
            const id = item.weather[0].id;
            const temp = item.main.temp;
            const wind = item.wind ? item.wind.speed : 0;
            if ((id === 781 || id === 771 || id === 762 || id === 504) || temp > 38 || wind > 20) fExtreme++;
            else if ((id >= 200 && id < 300) || (id >= 500 && id <= 504) || (id >= 600 && id <= 622) || temp > 32 || wind > 12) fSevere++;
        });
        updateMetrics(state.weather, fExtreme, fSevere);

        // 2. Update Trend Chart (Next 24h)
        const now = Math.floor(Date.now() / 1000);
        const next24h = data.list.filter(item => item.dt <= now + 86400).slice(0, 8);
        const seriesData = next24h.map(item => ({ x: new Date(item.dt * 1000).getTime(), y: item.main.temp }));
        trendChart.updateSeries([{ name: 'Temperature', data: seriesData }]);

        // 3. Render 5-Day UI
        const container = document.getElementById('dayForecast');
        if (container) {
            const dailyData = {};
            const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
            
            data.list.forEach(item => {
                const dateObj = new Date(item.dt * 1000);
                const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                
                // Skip today if we already have 5 days or if it's the current hour
                if (day === today && Object.keys(dailyData).length === 0) return;

                if (!dailyData[day]) {
                    dailyData[day] = { max: item.main.temp, min: item.main.temp, icon: item.weather[0].icon, humidity: item.main.humidity, count: 1 };
                } else {
                    dailyData[day].max = Math.max(dailyData[day].max, item.main.temp);
                    dailyData[day].min = Math.min(dailyData[day].min, item.main.temp);
                    // Update humidity only if it's not set
                    if (dateObj.getHours() >= 12 && dateObj.getHours() <= 15) {
                        dailyData[day].icon = item.weather[0].icon;
                        dailyData[day].humidity = item.main.humidity;
                    }
                }
            });

            container.innerHTML = '';
            // Get first 5 days that aren't today
            Object.keys(dailyData).slice(0, 5).forEach(day => {
                const info = dailyData[day];
                const div = document.createElement('div');
                div.className = 'day-item';
                div.innerHTML = `
                    <span class="day-name">${day}</span>
                    <div class="day-icon-wrapper"><i class="fas ${getWeatherIcon(info.icon)} day-icon"></i></div>
                    <div class="day-temp-range"><span class="max">${Math.round(info.max)}°</span><span class="min">${Math.round(info.min)}°</span></div>
                    <div class="day-details"><span><i class="fas fa-droplet"></i> ${info.humidity}%</span></div>
                `;
                container.appendChild(div);
            });
        }
    } catch (err) {
        console.warn("Forecast processing failed", err);
    }
}

// Remove old standalone functions to clean up
// (They are now part of processForecast)
async function fetchTrendData() {}
async function renderDayForecast() {}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01': 'fa-sun',
        '02': 'fa-cloud-sun',
        '03': 'fa-cloud',
        '04': 'fa-cloud-meatball',
        '09': 'fa-cloud-showers-heavy',
        '10': 'fa-cloud-rain',
        '11': 'fa-bolt-lightning',
        '13': 'fa-snowflake',
        '50': 'fa-smog'
    };
    const code = iconCode.substring(0, 2);
    return iconMap[code] || 'fa-cloud';
}

function generateAIBriefing(data) {
    const el = document.getElementById('aiBriefingContent');
    if (!el) return;

    const temp = data.main.temp;
    const wind = data.wind.speed;
    const cond = data.weather[0].main;
    const city = data.name;

    let briefing = "";
    
    if (temp > 35) {
        briefing = `ALERT: Critical thermal escalation detected in ${city}. High risk of dehydration and equipment overheating. System recommendation: Hydrate and minimize outdoor exposure.`;
    } else if (temp < 0) {
        briefing = `WARNING: Sub-zero thermal levels locked for ${city}. Risk of icing on transit routes. Strategic recommendation: Activate insulation protocols.`;
    } else if (wind > 15) {
        briefing = `DATA: High velocity wind patterns identified in ${city} at ${wind}m/s. Secure light structure assets immediately.`;
    } else if (cond === 'Rain' || cond === 'Drizzle') {
        briefing = `INTEL: Precipitation event active in ${city}. Optical range restricted. Datalink remains stable.`;
    } else {
        briefing = `SAT-LOG: Environmental patterns for ${city} are within baseline parameters. Signal strength optimal. No immediate tactical shifts required.`;
    }

    // Typewriter effect
    el.textContent = "";
    let i = 0;
    const type = () => {
        if (i < briefing.length) {
            el.textContent += briefing.charAt(i);
            i++;
            setTimeout(type, 20);
        }
    };
    type();
}
