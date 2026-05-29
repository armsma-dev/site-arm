/* ==========================================================================
   LÓGICA JAVASCRIPT GLOBAL - ASSOCIAÇÃO DE RADIOAMADORES MARIENSES (ARM)
   ========================================================================== */

const GOOGLE_CLIENT_ID = "325219816250-lbjrs3ragukosk58vv7t7p3gl1hhb1ig.apps.googleusercontent.com";

// 1. GLOBAL INITIALIZATION (Runs once when index.html loads)
document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();
});

function initGlobalFeatures() {
    // A. GESTÃO DE TEMAS (TEMA ESCURO FIXO)
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');

    // B. COMPORTAMENTO DO NAVBAR AO FAZER SCROLL
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // C. MENU RESPONSIVO (HAMBURGER)
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Fechar menu ao clicar em qualquer link na barra de navegação
        navMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    }

    // D. BOTÃO VOLTAR AO TOPO (Scroll-to-Top)
    initScrollTopButton();
}

function initScrollTopButton() {
    if (document.getElementById('scroll-top-btn')) return;
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '▲';
    scrollTopBtn.title = 'Voltar ao Topo';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 2. MODULAR PAGE SPECIFIC INITIALIZERS (Triggered by SPA Router)

// Accordion for bylaws
window.initAccordions = function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Fechar outros itens ativos
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle item atual
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
};

// Repeater dashboard on home page
window.initRepeaterDashboard = function() {
    const repeaterCards = document.querySelectorAll('.repeater-btn-card');
    const repeaterDatabase = {
        'cq1vpa': {
            callsign: 'CQ1VPA',
            type: 'ANALÓGICO / ALLSTAR LINK',
            status: 'Estação Ativa',
            location: 'Pico Alto - HM76KX',
            coordinates: '36º 58\' 58,312" N / 25º 05\' 26,677" W',
            stationType: 'Repetidora Analógica (RV48)',
            freqRx: '145.600 MHz',
            freqTx: '145.000 MHz (Shift: -600 kHz)',
            protection: 'CTCSS: 88.5 Hz',
            details: 'AllStar Link Node: 568290',
            power: '25.0 W (PAR)',
            channel: 'RV48',
            link: '#/rep-analogicos'
        },
        'cq1upa': {
            callsign: 'CQ1UPA',
            type: 'DIGITAL DMR / YSF',
            status: 'Estação Ativa',
            location: 'Pico Alto - HM76KX',
            coordinates: '36º 58\' 58,312" N / 25º 05\' 26,677" W',
            stationType: 'Repetidora Digital (DMR / YSF)',
            freqRx: '438.650 MHz',
            freqTx: '431.050 MHz (Shift: -7.600 MHz)',
            protection: 'CC: 1 (Color Code)',
            details: 'Slot 1: TG 268, TG 91, TG 915 | Slot 2: TG 2686, TG 26861',
            power: '30.0 W (PAR)',
            channel: 'RU692',
            link: '#/rep-dmr'
        },
        'cq1ppa': {
            callsign: 'CQ1PPA',
            type: 'DIGIPEATER APRS',
            status: 'Estação Ativa',
            location: 'Pico Alto - HM76KX',
            coordinates: '36º 58\' 58,312" N / 25º 05\' 26,677" W',
            stationType: 'Repetidora de Pacotes APRS',
            freqRx: '144.800 MHz',
            freqTx: '144.800 MHz (Direto)',
            protection: 'Sem CTCSS',
            details: 'Protocolo Digipeater APRS Pico Alto',
            power: '25.0 W (PAR)',
            channel: '144.800 MHz',
            link: '#/digipeater'
        }
    };

    if (repeaterCards.length > 0) {
        repeaterCards.forEach(card => {
            card.addEventListener('click', () => {
                repeaterCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const repeaterId = card.getAttribute('data-repeater');
                const data = repeaterDatabase[repeaterId];
                
                if (data) {
                    const display = document.querySelector('.repeater-display');
                    if (display) display.style.opacity = '0.5';
                    
                    setTimeout(() => {
                        const callsignEl = document.getElementById('disp-callsign');
                        if (callsignEl) callsignEl.textContent = data.callsign;
                        
                        const typeEl = document.getElementById('disp-type');
                        if (typeEl) typeEl.textContent = data.type;
                        
                        const statusEl = document.getElementById('disp-status');
                        if (statusEl) statusEl.textContent = data.status;
                        
                        const locationEl = document.getElementById('disp-location');
                        if (locationEl) locationEl.textContent = data.location;
                        
                        const coordsEl = document.getElementById('disp-coords');
                        if (coordsEl) coordsEl.textContent = data.coordinates;
                        
                        const stationTypeEl = document.getElementById('disp-station-type');
                        if (stationTypeEl) stationTypeEl.textContent = data.stationType;
                        
                        const freqRxEl = document.getElementById('disp-freq-rx');
                        if (freqRxEl) freqRxEl.textContent = data.freqRx;
                        
                        const freqTxEl = document.getElementById('disp-freq-tx');
                        if (freqTxEl) freqTxEl.textContent = data.freqTx;
                        
                        const protectionEl = document.getElementById('disp-protection');
                        if (protectionEl) protectionEl.textContent = data.protection;
                        
                        const detailsEl = document.getElementById('disp-details');
                        if (detailsEl) detailsEl.textContent = data.details;
                        
                        const powerEl = document.getElementById('disp-power');
                        if (powerEl) powerEl.textContent = data.power;
                        
                        const channelEl = document.getElementById('disp-channel');
                        if (channelEl) channelEl.textContent = data.channel;
                        
                        const actionBtn = document.getElementById('disp-action-btn');
                        if (actionBtn) {
                            actionBtn.setAttribute('href', data.link);
                        }
                        
                        if (display) display.style.opacity = '1';
                    }, 150);
                }
            });
        });
    }
};

// Weather widget on home page
window.initWeatherWidget = function() {
    const weatherWidget = document.getElementById('weather-station-widget');
    if (!weatherWidget) return;

    const lat = 36.9692;
    const lon = -25.1361;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Atlantic%2FAzores&forecast_days=4`;

    const weatherCodes = {
        0: { desc: "Céu Limpo", icon: "☀️" },
        1: { desc: "Céu Limpo", icon: "🌤️" },
        2: { desc: "Parcialmente Nublado", icon: "⛅" },
        3: { desc: "Muito Nublado / Encoberto", icon: "☁️" },
        45: { desc: "Nevoeiro", icon: "🌫️" },
        48: { desc: "Nevoeiro com Depósito", icon: "🌫️" },
        51: { desc: "Chuvisco Ligeiro", icon: "🌧️" },
        53: { desc: "Chuvisco Moderado", icon: "🌧️" },
        55: { desc: "Chuvisco Intenso", icon: "🌧️" },
        61: { desc: "Chuva Fraca", icon: "🌧️" },
        63: { desc: "Chuva Moderada", icon: "🌧️" },
        65: { desc: "Chuva Forte", icon: "🌧️" },
        80: { desc: "Aguaceiros Ligeiros", icon: "🌦️" },
        81: { desc: "Aguaceiros Moderados", icon: "🌦️" },
        82: { desc: "Aguaceiros Violentos", icon: "⛈️" },
        95: { desc: "Trovoada", icon: "⛈️" },
        96: { desc: "Trovoada com Granizo Ligeiro", icon: "⛈️" },
        99: { desc: "Trovoada com Granizo Forte", icon: "⛈️" }
    };

    function getWeatherInfo(code) {
        return weatherCodes[code] || { desc: "Tempo Desconhecido", icon: "🌡️" };
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Erro de comunicação com o servidor de meteorologia.");
            return response.json();
        })
        .then(data => {
            const current = data.current;
            const weatherInfo = getWeatherInfo(current.weather_code);

            const tempEl = document.getElementById('weather-current-temp');
            if (tempEl) tempEl.textContent = Math.round(current.temperature_2m);
            
            const iconEl = document.getElementById('weather-current-icon');
            if (iconEl) iconEl.textContent = weatherInfo.icon;
            
            const descEl = document.getElementById('weather-current-desc');
            if (descEl) descEl.textContent = weatherInfo.desc;
            
            const humEl = document.getElementById('weather-humidity');
            if (humEl) humEl.textContent = `${current.relative_humidity_2m}%`;
            
            const windEl = document.getElementById('weather-wind');
            if (windEl) windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
            
            const windDirEl = document.getElementById('weather-wind-dir');
            if (windDirEl) windDirEl.textContent = `${current.wind_direction_10m}°`;
            
            const pressEl = document.getElementById('weather-pressure');
            if (pressEl) pressEl.textContent = `${Math.round(current.pressure_msl)} hPa`;

            const forecastContainer = document.getElementById('weather-forecast-days');
            if (forecastContainer && data.daily) {
                forecastContainer.innerHTML = '';
                const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                
                for (let i = 1; i < 4; i++) {
                    const dateStr = data.daily.time[i];
                    const parts = dateStr.split('-');
                    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                    const dayName = daysOfWeek[dateObj.getDay()];
                    
                    const code = data.daily.weather_code[i];
                    const info = getWeatherInfo(code);
                    
                    const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
                    const minTemp = Math.round(data.daily.temperature_2m_min[i]);

                    const dayCard = document.createElement('div');
                    dayCard.className = 'weather-forecast-day';
                    dayCard.innerHTML = `
                        <span class="forecast-name">${dayName}</span>
                        <span class="forecast-icon" title="${info.desc}">${info.icon}</span>
                        <div class="forecast-temps">
                            <span class="forecast-temp-max">${maxTemp}°</span>
                            <span class="forecast-temp-min">${minTemp}°</span>
                        </div>
                    `;
                    forecastContainer.appendChild(dayCard);
                }
            }
        })
        .catch(error => {
            console.error("Erro ao carregar meteorologia:", error);
            const descEl = document.getElementById('weather-current-desc');
            if (descEl) descEl.textContent = "Não foi possível carregar os dados.";
        });
};

// Maps dynamic init
let leafletMap = null;
let currentTileLayer = null;

function loadLeaflet(callback) {
    if (window.L) {
        callback();
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = callback;
    document.body.appendChild(script);
}

window.updateMapTheme = function(theme) {
    if (!leafletMap) return;
    
    const currentTheme = theme || document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (currentTileLayer) {
        leafletMap.removeLayer(currentTileLayer);
    }
    
    const tileUrl = currentTheme === 'light' 
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        
    currentTileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    currentTileLayer.addTo(leafletMap);
};

window.initMaps = function() {
    const mapSede = document.getElementById('map-sede');
    const mapRepeater = document.getElementById('map-repeater');
    
    if (!mapSede && !mapRepeater) return;

    // Clean up old map if it exists to avoid container-already-initialized Leaflet errors
    if (leafletMap) {
        try {
            leafletMap.remove();
        } catch (e) {
            console.error("Error removing old map instance:", e);
        }
        leafletMap = null;
        currentTileLayer = null;
    }

    loadLeaflet(() => {
        const sedeCoords = [36.975583, -25.165667];
        const picoAltoCoords = [36.982864, -25.090744];
        
        // Re-query targets to ensure reference is active in DOM
        const mapSedeEl = document.getElementById('map-sede');
        const mapRepeaterEl = document.getElementById('map-repeater');
        
        if (mapSedeEl) {
            leafletMap = L.map('map-sede').setView(sedeCoords, 14);
        } else if (mapRepeaterEl) {
            leafletMap = L.map('map-repeater').setView(picoAltoCoords, 13);
        } else {
            return;
        }

        window.updateMapTheme();

        const sedeMarker = L.marker(sedeCoords).addTo(leafletMap)
            .bindPopup('<b>Sede da ARM</b><br>Aeroporto de Santa Maria (LPAZ)<br><span style="font-size:0.8rem;color:var(--accent-primary);">Clique para abrir direções no mapa físico.</span>');
            
        const picoAltoMarker = L.marker(picoAltoCoords).addTo(leafletMap)
            .bindPopup('<b>Estação de Repetidores - Pico Alto (647m)</b><br>• CQ1VPA (VHF RV48)<br>• CQ1UPA (UHF DMR)<br>• CQ1PPA (APRS Digipeater)');

        if (mapSedeEl) {
            sedeMarker.openPopup();
        } else {
            picoAltoMarker.openPopup();
        }

        L.polyline([picoAltoCoords, sedeCoords], {
            color: 'var(--accent-primary)',
            dashArray: '8, 12',
            weight: 2.5,
            opacity: 0.8
        }).addTo(leafletMap);
    });
};
window.initScrollReveal = function() {
    const revealTargets = document.querySelectorAll(
        '.card, .repeater-dashboard, .grid-2, .grid-3, .board-group, .contacts-grid, .zoho-form-container, .widget-glow-card, .board-contacts-card'
    );

    if (revealTargets.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(target => {
        target.classList.remove('active-reveal');
        target.classList.add('reveal');
        revealObserver.observe(target);
    });
};

// 3. MEMBER SIGNUP FORM SUBMISSION
window.initSignupForm = function() {
    const form = document.getElementById('member-signup-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('signup-submit-btn');
        const messageEl = document.getElementById('signup-message');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'A processar proposta... ⏳';
        }
        
        if (messageEl) {
            messageEl.style.display = 'none';
            messageEl.textContent = '';
        }

        try {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Convert image passe photo to Base64 dataURL
            const fileInput = document.getElementById('signup-photo');
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                
                // Max file size: 1.5MB to protect SQLite D1 DB storage limits
                if (file.size > 1.5 * 1024 * 1024) {
                    throw new Error("A fotografia é demasiado grande. Escolha uma imagem até 1.5 MB.");
                }

                const base64Photo = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                data['fotografia'] = base64Photo;
            } else {
                throw new Error("A fotografia de passe é obrigatória.");
            }

            const response = await fetch('/api?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || "Erro ao submeter proposta.");
            }

            if (messageEl) {
                messageEl.style.display = 'block';
                messageEl.style.color = 'var(--accent-secondary)';
                messageEl.textContent = 'Proposta enviada com sucesso! A Direção da ARM irá analisar o seu pedido em breve. 📬';
            }
            form.reset();

        } catch (error) {
            console.error("Registration submission failed:", error);
            if (messageEl) {
                messageEl.style.display = 'block';
                messageEl.style.color = 'var(--accent-danger)';
                messageEl.textContent = error.message;
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Proposta de Inscrição ✉️';
            }
        }
    });
};

// 4. ADMIN DASHBOARD CRM LOGIC
window.initAdminPage = function() {
    let cachedDashboardData = null;
    const loginCard = document.getElementById('admin-login-card');
    const dashboardArea = document.getElementById('admin-dashboard-area');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const loginError = document.getElementById('login-error-msg');
    
    // Novas referências de autenticação
    const passwordSection = document.getElementById('password-login-section');
    const togglePasswordBtn = document.getElementById('toggle-password-login');
    const googleLoginError = document.getElementById('google-login-error-msg');
    const mockGoogleLogin = document.getElementById('mock-google-login');
    const btnMockGoogle = document.getElementById('btn-mock-google');
    const mockGoogleEmail = document.getElementById('mock-google-email');

    if (!loginCard || !dashboardArea) return;

    function showLogin() {
        loginCard.style.display = 'block';
        dashboardArea.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        if (googleLoginError) googleLoginError.style.display = 'none';
        
        // Inicializar Google Sign-In
        initGoogleSignIn();
    }

    function showDashboard() {
        loginCard.style.display = 'none';
        dashboardArea.style.display = 'flex';
        resetAdminInactivityTimer();
    }

    // Callback para lidar com o login do Google com sucesso
    async function handleGoogleCredentialResponse(response) {
        if (googleLoginError) googleLoginError.style.display = 'none';
        
        try {
            const fetchRes = await fetch('/api?action=login_google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential })
            });
            const result = await fetchRes.json();
            if (!fetchRes.ok) throw new Error(result.error || "Erro de autenticação Google.");
            
            localStorage.setItem('admin_token', result.token);
            loadDashboardData(result.token);
        } catch (err) {
            if (googleLoginError) {
                googleLoginError.style.display = 'block';
                googleLoginError.textContent = err.message;
            }
        }
    }

    function initGoogleSignIn() {
        const isLocal = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'].some(ip => window.location.hostname.includes(ip)) || window.location.hostname === '';
        
        if (window.google && typeof GOOGLE_CLIENT_ID !== 'undefined' && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE") {
            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredentialResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById("google-signin-btn"),
                    { theme: "outline", size: "large", width: 280, text: "signin_with" }
                );
            } catch (err) {
                console.error("Failed to initialize Google Sign-In:", err);
            }
        } else {
            const btnContainer = document.getElementById("google-signin-btn");
            if (btnContainer && !isLocal) {
                btnContainer.innerHTML = '<span style="font-size:0.8rem; color:var(--text-secondary);">Google login pendente de configuração do Client ID.</span>';
            }
        }

        // Ativar simulador local
        if (isLocal && mockGoogleLogin) {
            mockGoogleLogin.style.display = 'block';
        }
    }

    // Toggle password form visibility
    if (togglePasswordBtn && passwordSection) {
        togglePasswordBtn.addEventListener('click', () => {
            const isHidden = passwordSection.style.display === 'none';
            passwordSection.style.display = isHidden ? 'block' : 'none';
            togglePasswordBtn.textContent = isHidden ? 'entrar apenas com conta Google' : 'ou entrar com palavra-passe';
        });
    }

    // Click do Simulador Google local
    if (btnMockGoogle && mockGoogleEmail) {
        btnMockGoogle.addEventListener('click', async () => {
            const email = mockGoogleEmail.value;
            if (googleLoginError) googleLoginError.style.display = 'none';
            
            try {
                const response = await fetch('/api?action=login_google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isMock: true, email })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Erro ao simular login Google.");
                
                localStorage.setItem('admin_token', result.token);
                loadDashboardData(result.token);
            } catch (err) {
                if (googleLoginError) {
                    googleLoginError.style.display = 'block';
                    googleLoginError.textContent = err.message;
                }
            }
        });
    }

    // Check token
    const token = localStorage.getItem('admin_token');
    if (token) {
        loadDashboardData(token);
    } else {
        showLogin();
    }

    // Login submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password-input').value;
            const loginBtn = document.getElementById('admin-login-btn');
            
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'A autenticar... ⏳';
            }
            if (loginError) loginError.style.display = 'none';

            try {
                const response = await fetch('/api?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });
                
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Erro de login.");
                
                localStorage.setItem('admin_token', result.token);
                document.getElementById('admin-password-input').value = '';
                loadDashboardData(result.token);
            } catch (err) {
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.textContent = err.message;
                }
            } finally {
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Entrar com Password 🔑';
                }
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const curToken = localStorage.getItem('admin_token');
            localStorage.removeItem('admin_token');
            showLogin();
            
            if (curToken) {
                await fetch('/api?action=logout', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${curToken}` }
                });
            }
        });
    }

    // Tab Switching
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab-pane').forEach(pane => {
                pane.classList.remove('active-pane');
            });
            const activePane = document.getElementById(tabId);
            if (activePane) activePane.classList.add('active-pane');
        });
    });

    // Form Toggle for Accounting
    const toggleFormBtn = document.getElementById('btn-toggle-transaction-form');
    const formPanel = document.getElementById('transaction-form-panel');
    if (toggleFormBtn && formPanel) {
        toggleFormBtn.addEventListener('click', () => {
            const isHidden = formPanel.style.display === 'none';
            formPanel.style.display = isHidden ? 'block' : 'none';
            toggleFormBtn.textContent = isHidden ? 'Fechar Lançamento' : '+ Registar Receita / Despesa';
        });
    }
    const cancelFormBtn = document.getElementById('btn-cancel-transaction');
    if (cancelFormBtn && formPanel && toggleFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            formPanel.style.display = 'none';
            toggleFormBtn.textContent = '+ Registar Receita / Despesa';
            document.getElementById('accounting-transaction-form').reset();
        });
    }

    // Click do Relatório de Contas Anual
    const generateReportBtn = document.getElementById('btn-generate-annual-report');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            if (!cachedDashboardData) {
                alert("A carregar dados do painel... Por favor, aguarde.");
                return;
            }
            const yearStr = prompt("Indique o ano fiscal para o relatório (ex: 2026):", new Date().getFullYear());
            if (!yearStr) return;
            const year = parseInt(yearStr);
            if (isNaN(year)) {
                alert("Ano inválido!");
                return;
            }
            if (typeof window.generateAnnualReportPDF === 'function') {
                window.generateAnnualReportPDF(year, cachedDashboardData);
            } else {
                alert("Erro: Gerador de PDFs não foi carregado.");
            }
        });
    }

    // Auto-select category for transfers
    const transTipoSelect = document.getElementById('trans-tipo');
    const transCategoriaSelect = document.getElementById('trans-categoria');
    if (transTipoSelect && transCategoriaSelect) {
        transTipoSelect.addEventListener('change', () => {
            if (transTipoSelect.value === 'transferencia') {
                transCategoriaSelect.value = 'Transferência de Saldo';
            }
        });
    }

    // Submit general transaction
    const transactionForm = document.getElementById('accounting-transaction-form');
    if (transactionForm) {
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const curToken = localStorage.getItem('admin_token');
            const data = {
                tipo: document.getElementById('trans-tipo').value,
                meio_pagamento: document.getElementById('trans-meio').value,
                descricao: document.getElementById('trans-descricao').value,
                valor: parseFloat(document.getElementById('trans-valor').value),
                categoria: document.getElementById('trans-categoria').value,
                data: document.getElementById('trans-data').value
            };

            try {
                if (data.tipo === 'transferencia') {
                    const destAccount = data.meio_pagamento === 'banco' ? 'caixa' : 'banco';
                    
                    // Create Outflow (Despesa)
                    const outData = {
                        tipo: 'despesa',
                        meio_pagamento: data.meio_pagamento,
                        descricao: `Transferência de Saldo (Saída) - ${data.descricao}`,
                        valor: data.valor,
                        categoria: 'Transferência de Saldo',
                        data: data.data
                    };
                    
                    // Create Inflow (Receita)
                    const inData = {
                        tipo: 'receita',
                        meio_pagamento: destAccount,
                        descricao: `Transferência de Saldo (Entrada) - ${data.descricao}`,
                        valor: data.valor,
                        categoria: 'Transferência de Saldo',
                        data: data.data
                    };
                    
                    // Call API for both
                    const res1 = await fetch('/api?action=add_transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${curToken}`
                        },
                        body: JSON.stringify(outData)
                    });
                    const r1 = await res1.json();
                    if (!res1.ok) throw new Error(r1.error || "Erro ao registar a saída da transferência.");
                    
                    const res2 = await fetch('/api?action=add_transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${curToken}`
                        },
                        body: JSON.stringify(inData)
                    });
                    const r2 = await res2.json();
                    if (!res2.ok) throw new Error(r2.error || "Erro ao registar a entrada da transferência.");
                    
                    alert("Transferência de saldo registada com sucesso!");
                } else {
                    const response = await fetch('/api?action=add_transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${curToken}`
                        },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error || "Erro ao adicionar movimento.");
                    
                    alert("Movimento contabilístico registado!");
                }
                
                transactionForm.reset();
                if (formPanel) formPanel.style.display = 'none';
                if (toggleFormBtn) toggleFormBtn.textContent = '+ Registar Receita / Despesa';
                loadDashboardData(curToken);
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // CSV Import handling for QuotaGest
    const triggerCsvBtn = document.getElementById('btn-trigger-csv-import');
    const csvInput = document.getElementById('csv-import-input');

    if (triggerCsvBtn && csvInput) {
        triggerCsvBtn.addEventListener('click', () => {
            csvInput.click();
        });

        csvInput.value = ''; // Reset input to allow re-selection
        csvInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (evt) => {
                const text = evt.target.result;
                try {
                    const parsed = parseCSVText(text);
                    if (parsed.data.length === 0) {
                        throw new Error("O ficheiro CSV está vazio ou não tem linhas de dados.");
                    }

                    const mappedMembers = parsed.data.map(row => mapRowToMember(row, parsed.headers));
                    
                    // Validate mapped data
                    const validMembers = mappedMembers.filter(m => m.nome && m.numero_socio);
                    if (validMembers.length === 0) {
                        throw new Error("Não foi possível detetar sócios válidos no CSV. Verifique se os cabeçalhos das colunas (Ex: Nome, Código) estão presentes.");
                    }

                    if (!confirm(`Detetados ${validMembers.length} sócios para importação. Deseja prosseguir com a importação para o sistema?`)) {
                        csvInput.value = '';
                        return;
                    }

                    const curToken = localStorage.getItem('admin_token');
                    const response = await fetch('/api?action=import_members', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${curToken}`
                        },
                        body: JSON.stringify({ members: validMembers })
                    });
                    
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error || "Erro ao importar base de dados.");
                    
                    alert(`Sucesso! ${result.count} sócios importados com sucesso!`);
                    loadDashboardData(curToken);
                } catch (err) {
                    alert("Falha na importação: " + err.message);
                } finally {
                    csvInput.value = '';
                }
            };
            reader.readAsText(file, 'UTF-8');
        });
    }

    // -------------------------------------------------------------
    // MODAL DE EDIÇÃO DE SÓCIOS - CONTROLO E EVENTOS
    // -------------------------------------------------------------
    const editModal = document.getElementById('edit-member-modal');
    const editForm = document.getElementById('edit-member-form');
    const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');

    if (editModal && editForm) {
        const closeModal = () => {
            editModal.style.display = 'none';
            editForm.reset();
            const preview = document.getElementById('edit-socio-photo-preview');
            if (preview) preview.src = 'assets/images/logo2-65x121.png';
            const filename = document.getElementById('edit-socio-photo-filename');
            if (filename) filename.textContent = 'Nenhuma foto selecionada';
            const photoVal = document.getElementById('edit-socio-photo');
            if (photoVal) photoVal.value = '';
            const adminPhotoFileInput = document.getElementById('edit-socio-photo-file');
            if (adminPhotoFileInput) adminPhotoFileInput.value = '';
        };

        if (btnCloseEditModal) btnCloseEditModal.addEventListener('click', closeModal);
        if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeModal);

        // Admin Photo uploader listener
        const adminPhotoFileInput = document.getElementById('edit-socio-photo-file');
        if (adminPhotoFileInput) {
            adminPhotoFileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Max size check: 1.5MB
                if (file.size > 1.5 * 1024 * 1024) {
                    alert("A fotografia é demasiado grande. Escolha uma imagem até 1.5 MB.");
                    adminPhotoFileInput.value = '';
                    return;
                }
                
                try {
                    const base64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = err => reject(err);
                        reader.readAsDataURL(file);
                    });
                    
                    const hiddenInput = document.getElementById('edit-socio-photo');
                    if (hiddenInput) hiddenInput.value = base64;
                    
                    const preview = document.getElementById('edit-socio-photo-preview');
                    if (preview) preview.src = base64;
                    
                    const filename = document.getElementById('edit-socio-photo-filename');
                    if (filename) filename.textContent = file.name;
                } catch (err) {
                    alert("Erro ao processar a imagem: " + err.message);
                }
            });
        }

        // Fechar se clicar fora do modal
        window.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeModal();
            }
        });

        // Submit form de edição
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const curToken = localStorage.getItem('admin_token');
            const data = {
                id: parseInt(document.getElementById('edit-socio-id').value),
                numero_socio: parseInt(document.getElementById('edit-socio-numero').value),
                estado: document.getElementById('edit-socio-estado').value,
                nome: document.getElementById('edit-socio-nome').value,
                email: document.getElementById('edit-socio-email').value,
                telemovel: document.getElementById('edit-socio-telemovel').value,
                nif: document.getElementById('edit-socio-nif').value,
                cartao_cidadao: document.getElementById('edit-socio-cc').value,
                morada: document.getElementById('edit-socio-morada').value,
                iban: document.getElementById('edit-socio-iban').value,
                data_admissao: document.getElementById('edit-socio-admissao').value,
                fotografia: document.getElementById('edit-socio-photo').value
            };

            try {
                const response = await fetch('/api?action=edit_member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${curToken}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Erro ao editar sócio.");
                
                alert("Ficha de sócio atualizada com sucesso!");
                closeModal();
                loadDashboardData(curToken);
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // -------------------------------------------------------------
    // MODAL DE EDIÇÃO DE TRANSAÇÕES - CONTROLO E EVENTOS
    // -------------------------------------------------------------
    const editTransModal = document.getElementById('edit-transaction-modal');
    const editTransForm = document.getElementById('edit-transaction-form');
    const btnCloseEditTransModal = document.getElementById('btn-close-edit-trans-modal');
    const btnCancelEditTrans = document.getElementById('btn-cancel-edit-trans');

    if (editTransModal && editTransForm) {
        const closeTransModal = () => {
            editTransModal.style.display = 'none';
            editTransForm.reset();
        };

        if (btnCloseEditTransModal) btnCloseEditTransModal.addEventListener('click', closeTransModal);
        if (btnCancelEditTrans) btnCancelEditTrans.addEventListener('click', closeTransModal);

        // Fechar se clicar fora do modal
        window.addEventListener('click', (e) => {
            if (e.target === editTransModal) {
                closeTransModal();
            }
        });

        // Submit form de edição
        editTransForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const curToken = localStorage.getItem('admin_token');
            const data = {
                id: parseInt(document.getElementById('edit-trans-id').value),
                tipo: document.getElementById('edit-trans-tipo').value,
                meio_pagamento: document.getElementById('edit-trans-meio').value,
                descricao: document.getElementById('edit-trans-descricao').value,
                valor: parseFloat(document.getElementById('edit-trans-valor').value),
                categoria: document.getElementById('edit-trans-categoria').value,
                data: document.getElementById('edit-trans-data').value
            };

            try {
                const response = await fetch('/api?action=edit_transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${curToken}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Erro ao editar lançamento.");
                
                alert("Lançamento contabilístico atualizado com sucesso!");
                closeTransModal();
                loadDashboardData(curToken);
            } catch (err) {
                alert(err.message);
            }
        });
    }

    function parseCSVText(text) {
        const firstLine = text.split('\n')[0];
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const separator = semicolonCount > commaCount ? ';' : ',';

        const lines = text.split(/\r?\n/);
        const result = [];
        const headers = lines[0].split(separator).map(h => h.trim().replace(/^["']|["']$/g, ''));

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            let row = [];
            let insideQuote = false;
            let entry = '';
            
            const line = lines[i];
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    insideQuote = !insideQuote;
                } else if (char === separator && !insideQuote) {
                    row.push(entry.trim().replace(/^["']|["']$/g, ''));
                    entry = '';
                } else {
                    entry += char;
                }
            }
            row.push(entry.trim().replace(/^["']|["']$/g, ''));

            if (row.length === headers.length) {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                result.push(obj);
            }
        }
        return { headers, data: result };
    }

    function mapRowToMember(row, headers) {
        const getVal = (possibleHeaders) => {
            const foundHeader = headers.find(h => 
                possibleHeaders.some(p => h.toLowerCase().trim().replace(/[^a-z0-9]/g, '') === p.toLowerCase().replace(/[^a-z0-9]/g, ''))
            );
            return foundHeader ? row[foundHeader] : '';
        };

        const nome = getVal(['nome', 'nomecompleto', 'name', 'fullname']);
        const numero_socio = parseInt(getVal(['codigo', 'numerosocio', 'nrsocio', 'nr', 'n', 'codigosocio', 'number', 'id'])) || null;
        const email = getVal(['email', 'correioeletronico', 'mail', 'contactoemail']);
        const telemovel = getVal(['telemovel', 'telef', 'telefone', 'mobile', 'phone', 'contactotelefone']);
        const nif = getVal(['nif', 'nifcontribuinte', 'contribuinte', 'taxid']);
        const morada = getVal(['morada', 'rua', 'address', 'endereco']);
        const estado = getVal(['estado', 'status']) || 'Ativo';
        const data_admissao = getVal(['dataadmissao', 'dataentrada', 'datainscricao', 'inscritoem', 'date', 'admissiondate']) || new Date().toISOString().split('T')[0];
        const cartao_cidadao = getVal(['cartaocidadao', 'cc', 'bi', 'identificacao']) || '00000000 0 ZZ0';
        const sexo = getVal(['sexo', 'genero', 'gender']) || 'M';
        const data_nascimento = getVal(['datanascimento', 'nascimento', 'birthdate']) || '1980-01-01';
        const iban = getVal(['iban', 'nconta']) || '';
        const profissao = getVal(['profissao', 'profession', 'cargo']) || 'Outra';
        const habilitacoes = getVal(['habilitacoes', 'estudos', 'grau']) || 'Ensino Secundário';
        const pais = getVal(['pais', 'country']) || 'Portugal';
        const cod_postal = getVal(['codpostal', 'postalcode', 'zip']) || '9580-909';
        const freguesia = getVal(['freguesia', 'parish']) || 'Vila do Porto';
        const concelho = getVal(['concelho', 'municipio']) || 'Vila do Porto';
        const distrito = getVal(['distrito', 'regiao']) || 'Açores';

        // Mapeamento de estado
        let mappedEstado = 'Ativo';
        const estLow = estado.toLowerCase();
        if (estLow.includes('falec') || estLow.includes('inativ') || estLow.includes('susp') || estLow.includes('cancel') || estLow.includes('morto')) {
            mappedEstado = 'Inativo';
        }

        return {
            nome,
            numero_socio,
            email: email || 'geral@cu1arm.com',
            telemovel: telemovel || '910000000',
            nif: nif || '999999999',
            morada: morada || 'Santa Maria, Açores',
            estado: mappedEstado,
            data_admissao,
            cartao_cidadao,
            sexo,
            data_nascimento,
            iban,
            profissao,
            habilitacoes,
            pais,
            cod_postal,
            freguesia,
            concelho,
            distrito,
            fotografia: 'assets/images/logo2-65x121.png'
        };
    }

    // Main fetch data function
    async function loadDashboardData(authToken) {
        try {
            const response = await fetch('/api?action=get_data', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.status === 401) {
                localStorage.removeItem('admin_token');
                showLogin();
                return;
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Falha ao descarregar base de dados.");

            showDashboard();
            renderDashboard(data, authToken);
        } catch (err) {
            console.error("Dashboard load failed:", err);
            localStorage.removeItem('admin_token');
            showLogin();
            if (loginError) {
                loginError.style.display = 'block';
                loginError.textContent = "Sessão expirada. Volte a iniciar sessão.";
            }
        }
    }

    // Render Data into Board
    function renderDashboard(data, authToken) {
        cachedDashboardData = data;
        // A. Metrics Calc
        const totalSocios = data.socios.length;
        
        let cashBalance = 0;
        let bankBalance = 0;
        data.contabilidade.forEach(t => {
            const val = parseFloat(t.valor);
            const meio = t.meio_pagamento || 'banco';
            if (t.tipo === 'receita') {
                if (meio === 'banco') bankBalance += val;
                else cashBalance += val;
            } else if (t.tipo === 'despesa') {
                if (meio === 'banco') bankBalance -= val;
                else cashBalance -= val;
            }
        });
        const totalBalance = bankBalance + cashBalance;

        const currentYear = new Date().getFullYear();
        const unpaidQuotas = data.quotas.filter(q => q.ano === currentYear && q.pago === 0).length;

        document.getElementById('metric-total-members').textContent = totalSocios;
        document.getElementById('metric-total-balance').textContent = `${totalBalance.toFixed(2)}€`;
        
        const subBalancesEl = document.getElementById('metric-sub-balances');
        if (subBalancesEl) {
            subBalancesEl.textContent = `🏛️ Banco: ${bankBalance.toFixed(2)}€ | 💵 Caixa: ${cashBalance.toFixed(2)}€`;
        }
        const unpaidYearEl = document.getElementById('metric-unpaid-quotas-year');
        if (unpaidYearEl) {
            unpaidYearEl.textContent = currentYear;
        }
        document.getElementById('metric-unpaid-quotas').textContent = unpaidQuotas;

        // Tabs Count
        document.getElementById('count-candidatos').textContent = data.candidatos.length;
        document.getElementById('count-socios').textContent = totalSocios;
        const countAtualizacoesEl = document.getElementById('count-atualizacoes');
        if (countAtualizacoesEl) {
            countAtualizacoesEl.textContent = (data.update_requests || []).length;
        }

        // B. Render Candidates Table
        const candidatesBody = document.getElementById('candidatos-table-body');
        candidatesBody.innerHTML = '';
        if (data.candidatos.length === 0) {
            candidatesBody.innerHTML = `<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--text-muted);">Sem propostas pendentes de adesão.</td></tr>`;
        } else {
            data.candidatos.forEach(c => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                tr.innerHTML = `
                    <td style="padding: 12px 10px;">
                        <img src="${c.fotografia}" style="width: 42px; height: 42px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-glass);">
                    </td>
                    <td style="padding: 12px 10px;">
                        <strong style="color: var(--text-primary); font-size: 0.95rem;">${c.nome}</strong><br>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${c.email} | ${c.telemovel}</span>
                    </td>
                    <td style="padding: 12px 10px;">
                        <span style="font-family: var(--font-mono); font-size: 0.8rem;">CC: ${c.cartao_cidadao}</span><br>
                        <span style="font-family: var(--font-mono); font-size: 0.8rem;">NIF: ${c.nif}</span>
                    </td>
                    <td style="padding: 12px 10px;">
                        <span style="font-size: 0.8rem;">${c.morada}</span><br>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${c.freguesia}, ${c.concelho}</span>
                    </td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono); font-size: 0.8rem;">
                        ${c.data_submissao.split('T')[0]}
                    </td>
                    <td style="padding: 12px 10px; text-align: right; display: flex; gap: 8px; justify-content: flex-end; align-items: center; height: 66px;">
                        <button class="btn btn-primary approve-btn" data-id="${c.id}" style="padding: 6px 12px; font-size: 0.75rem; cursor: pointer;">Aprovar ✔</button>
                        <button class="btn btn-secondary reject-btn" data-id="${c.id}" style="padding: 6px 12px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-danger); color: var(--accent-danger);">Rejeitar ✖</button>
                    </td>
                `;
                candidatesBody.appendChild(tr);
            });

            // Bind approval / reject events
            document.querySelectorAll('.approve-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (!confirm("Aprovar este candidato como sócio oficial da ARM?")) return;
                    try {
                        const response = await fetch('/api?action=approve_member', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`
                            },
                            body: JSON.stringify({ id })
                        });
                        const res = await response.json();
                        if (!response.ok) throw new Error(res.error || "Erro ao aprovar.");
                        alert(res.message);
                        loadDashboardData(authToken);
                    } catch (e) {
                        alert(e.message);
                    }
                });
            });
            
            document.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (!confirm("Tem a certeza que deseja rejeitar e eliminar esta proposta?")) return;
                    try {
                        const response = await fetch('/api?action=reject_candidate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`
                            },
                            body: JSON.stringify({ id })
                        });
                        const res = await response.json();
                        if (!response.ok) throw new Error(res.error || "Erro ao rejeitar.");
                        alert("Proposta de adesão rejeitada e eliminada.");
                        loadDashboardData(authToken);
                    } catch (e) {
                        alert(e.message);
                    }
                });
            });
        }

        // B2. Render Update Requests Table
        const updatesBody = document.getElementById('atualizacoes-table-body');
        if (updatesBody) {
            updatesBody.innerHTML = '';
            const pendingUpdates = data.update_requests || [];
            if (pendingUpdates.length === 0) {
                updatesBody.innerHTML = `<tr><td colspan="5" style="padding: 24px; text-align: center; color: var(--text-muted);">Sem pedidos de alteração pendentes.</td></tr>`;
            } else {
                pendingUpdates.forEach(r => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                    
                    const dados = typeof r.dados === 'string' ? JSON.parse(r.dados) : r.dados;
                    let diffHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-size: 0.8rem;">';
                    
                    const socio = data.socios.find(s => s.id === r.socio_id);
                    const ptKeys = {
                        telemovel: "Telemóvel", telefone: "Telefone", email: "E-mail", iban: "IBAN",
                        profissao: "Profissão", habilitacoes: "Habilitações", nif: "NIF", cartao_cidadao: "C. Cidadão",
                        morada: "Morada", cod_postal: "Cód. Postal", freguesia: "Freguesia", concelho: "Concelho",
                        distrito: "Distrito", pais: "País", fotografia: "Foto (Upload)"
                    };
                    
                    for (const [key, val] of Object.entries(dados)) {
                        const oldVal = socio ? socio[key] : '';
                        if (val !== undefined && val !== null && val.toString().trim() !== (oldVal || '').toString().trim()) {
                            const label = ptKeys[key] || key;
                            if (key === 'fotografia') {
                                const oldImg = oldVal && !oldVal.includes('quotagest.pt')
                                    ? `<img src="${oldVal}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 50%; border: 1px solid var(--border-glass); vertical-align: middle;" title="Foto antiga">`
                                    : `<span style="font-size:0.75rem; color:var(--text-muted);">sem foto</span>`;
                                const newImg = val
                                    ? `<img src="${val}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 50%; border: 1px solid var(--accent-secondary); vertical-align: middle;" title="Nova foto proposta">`
                                    : `<span style="font-size:0.75rem; color:var(--text-muted);">sem foto</span>`;
                                diffHtml += `<div style="display: flex; align-items: center; gap: 6px; margin: 4px 0;"><strong>${label}:</strong> ${oldImg} ➔ ${newImg}</div>`;
                            } else {
                                diffHtml += `<div><strong>${label}:</strong> <span style="color:var(--accent-danger); text-decoration:line-through;">${oldVal || '(vazio)'}</span> ➔ <span style="color:var(--accent-secondary); font-weight:600;">${val || '(vazio)'}</span></div>`;
                            }
                        }
                    }
                    diffHtml += '</div>';

                    tr.innerHTML = `
                        <td style="padding: 12px 10px; font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary);">
                            Sócio N.º ${String(r.numero_socio).padStart(4, '0')}
                        </td>
                        <td style="padding: 12px 10px; font-weight: 600; color: var(--text-primary);">${r.nome}</td>
                        <td style="padding: 12px 10px; font-family: var(--font-mono); font-size: 0.8rem;">${r.data_submissao}</td>
                        <td style="padding: 12px 10px;">${diffHtml}</td>
                        <td style="padding: 12px 10px; text-align: right; white-space: nowrap;">
                            <button class="btn btn-primary approve-update-btn" data-id="${r.id}" style="padding: 5px 10px; font-size: 0.75rem; cursor: pointer; margin-right: 4px;">Aprovar ✔</button>
                            <button class="btn btn-secondary reject-update-btn" data-id="${r.id}" style="padding: 5px 10px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-danger); color: var(--accent-danger);">Rejeitar ✖</button>
                        </td>
                    `;
                    updatesBody.appendChild(tr);
                });

                // Bind approve / reject update requests buttons
                updatesBody.querySelectorAll('.approve-update-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const id = btn.getAttribute('data-id');
                        if (!confirm("Aprovar e aplicar estas alterações na ficha do sócio?")) return;
                        try {
                            const response = await fetch('/api?action=approve_update_request', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                                body: JSON.stringify({ request_id: id })
                            });
                            const res = await response.json();
                            if (!response.ok) throw new Error(res.error || "Erro ao aprovar.");
                            alert("Alterações aprovadas e aplicadas!");
                            loadDashboardData(authToken);
                        } catch (e) {
                            alert(e.message);
                        }
                    });
                });

                updatesBody.querySelectorAll('.reject-update-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const id = btn.getAttribute('data-id');
                        if (!confirm("Rejeitar este pedido de alteração de dados?")) return;
                        try {
                            const response = await fetch('/api?action=reject_update_request', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                                body: JSON.stringify({ request_id: id })
                            });
                            const res = await response.json();
                            if (!response.ok) throw new Error(res.error || "Erro ao rejeitar.");
                            alert("Pedido de alteração rejeitado.");
                            loadDashboardData(authToken);
                        } catch (e) {
                            alert(e.message);
                        }
                    });
                });
            }
        }

        // C. Render Members Table
        const sociosBody = document.getElementById('socios-table-body');
        sociosBody.innerHTML = '';
        if (data.socios.length === 0) {
            sociosBody.innerHTML = `<tr><td colspan="8" style="padding: 24px; text-align: center; color: var(--text-muted);">Sem sócios ativos no ficheiro.</td></tr>`;
        } else {
            data.socios.forEach(s => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                
                const badgeStyle = s.estado === 'Ativo'
                    ? 'color: var(--accent-secondary); background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.15);'
                    : 'color: var(--accent-danger); background: rgba(255,23,68,0.1); border: 1px solid rgba(255,23,68,0.15);';

                tr.innerHTML = `
                    <td style="padding: 12px 10px;">
                        <img src="${s.fotografia && !s.fotografia.includes('quotagest.pt') ? s.fotografia : 'assets/images/logo2-65x121.png'}" style="width: 38px; height: 38px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-glass);">
                    </td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary);">
                        ${String(s.numero_socio).padStart(4, '0')}
                    </td>
                    <td style="padding: 12px 10px;">
                        <strong style="color: var(--text-primary);">${s.nome}</strong><br>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${s.email}</span>
                    </td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono); font-size: 0.8rem;">${s.nif}</td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono); font-size: 0.8rem;">${s.telemovel}</td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono); font-size: 0.8rem;">${s.data_admissao}</td>
                    <td style="padding: 12px 10px; text-align: center;">
                        <span style="font-size: 0.75rem; font-weight: 600; ${badgeStyle} padding: 4px 8px; border-radius: 100px;">
                            ${s.estado}
                        </span>
                    </td>
                    <td style="padding: 12px 10px; text-align: right; white-space: nowrap;">
                        <button class="btn btn-secondary send-info-btn" data-id="${s.id}" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-primary); color: var(--accent-primary); margin-right: 4px; min-width: 32px;" title="Enviar dados de acesso por email">✉️</button>
                        <button class="btn btn-secondary edit-member-btn" data-id="${s.id}" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-secondary); color: var(--accent-secondary); margin-right: 4px; min-width: 32px;" title="Editar Sócio">✏️</button>
                        <button class="btn btn-secondary delete-member-btn" data-id="${s.id}" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-danger); color: var(--accent-danger); min-width: 32px;" title="Eliminar Sócio">🗑️</button>
                    </td>
                `;
                sociosBody.appendChild(tr);

                // Associar evento de clique para Enviar Dados do Sócio
                const sendBtn = tr.querySelector('.send-info-btn');
                if (sendBtn) {
                    sendBtn.addEventListener('click', () => {
                        const email = s.email || '';
                        const nome = s.nome || '';
                        const num = s.numero_socio || '';
                        const nif = s.nif || '';
                        
                        const subject = encodeURIComponent("Associação de Radioamadores Marienses - Acesso ao Portal do Sócio");
                        const bodyText = `Olá ${nome},\n\n` +
                                         `Já se encontra ativo o novo Portal do Sócio da ARM.\n\n` +
                                         `Pode aceder ao seu portal pessoal através do seguinte link:\n` +
                                         `https://www.cu1arm.com/#/socio\n\n` +
                                         `Para iniciar sessão, poderá utilizar a sua Conta Google (se o e-mail coincidir com o registado) ou utilizar a autenticação por credenciais introduzindo os seguintes dados:\n` +
                                         `- Número de Sócio: ${num}\n` +
                                         `- NIF: ${nif}\n\n` +
                                         `Pedimos que guarde esta informação de forma confidencial.\n\n` +
                                         `73 da Direção da ARM\n` +
                                         `Associação de Radioamadores Marienses`;
                        
                        const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
                        
                        // Copy to clipboard as backup
                        navigator.clipboard.writeText(bodyText).then(() => {
                            alert(`Os dados de acesso para o sócio ${nome} foram copiados para a sua área de transferência!\n\nDe seguida, o seu cliente de e-mail será aberto para enviar a mensagem para: ${email}`);
                            window.location.href = mailtoUrl;
                        }).catch(err => {
                            console.error("Falha ao copiar para a área de transferência:", err);
                            window.location.href = mailtoUrl;
                        });
                    });
                }

                // Associar evento de clique para Editar Sócio
                const editBtn = tr.querySelector('.edit-member-btn');
                if (editBtn) {
                    editBtn.addEventListener('click', () => {
                        const modal = document.getElementById('edit-member-modal');
                        if (!modal) return;
                        
                        document.getElementById('edit-socio-id').value = s.id;
                        document.getElementById('edit-socio-numero').value = s.numero_socio || '';
                        document.getElementById('edit-socio-estado').value = s.estado || 'Ativo';
                        document.getElementById('edit-socio-nome').value = s.nome || '';
                        document.getElementById('edit-socio-email').value = s.email || '';
                        document.getElementById('edit-socio-telemovel').value = s.telemovel || '';
                        document.getElementById('edit-socio-nif').value = s.nif || '';
                        document.getElementById('edit-socio-cc').value = s.cartao_cidadao || '';
                        document.getElementById('edit-socio-morada').value = s.morada || '';
                        document.getElementById('edit-socio-iban').value = s.iban || '';
                        document.getElementById('edit-socio-admissao').value = s.data_admissao || '';
                        
                        const editPhoto = document.getElementById('edit-socio-photo');
                        const editPhotoPreview = document.getElementById('edit-socio-photo-preview');
                        const editPhotoFilename = document.getElementById('edit-socio-photo-filename');
                        
                        if (s.fotografia && !s.fotografia.includes('quotagest.pt')) {
                            if (editPhoto) editPhoto.value = s.fotografia;
                            if (editPhotoPreview) editPhotoPreview.src = s.fotografia;
                            if (editPhotoFilename) editPhotoFilename.textContent = "Foto atual guardada";
                        } else {
                            if (editPhoto) editPhoto.value = '';
                            if (editPhotoPreview) editPhotoPreview.src = 'assets/images/logo2-65x121.png';
                            if (editPhotoFilename) editPhotoFilename.textContent = "Nenhuma foto selecionada";
                        }
                        
                        modal.style.display = 'flex';
                    });
                }

                // Associar evento de clique para Eliminar Sócio
                const deleteBtn = tr.querySelector('.delete-member-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', async () => {
                        if (!confirm(`Tem a certeza que deseja eliminar o sócio N.º ${String(s.numero_socio).padStart(4, '0')} (${s.nome})?\nEsta ação é irreversível e irá também apagar as suas quotas!`)) return;
                        try {
                            const response = await fetch('/api?action=delete_member', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                                body: JSON.stringify({ id: s.id })
                            });
                            const res = await response.json();
                            if (!response.ok) throw new Error(res.error || "Erro ao eliminar sócio.");
                            alert("Sócio eliminado com sucesso!");
                            loadDashboardData(authToken);
                        } catch (err) {
                            alert(err.message);
                        }
                    });
                }
            });
        }

        // D. Render Quotas Table
        const quotasBody = document.getElementById('quotas-table-body');
        quotasBody.innerHTML = '';
        if (data.quotas.length === 0) {
            quotasBody.innerHTML = `<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--text-muted);">Nenhum registo de quotas encontrado.</td></tr>`;
        } else {
            data.quotas.forEach(q => {
                const member = data.socios.find(s => s.id === q.socio_id);
                if (!member) return;

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                
                const badgeState = q.pago === 1 
                    ? `<span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-secondary); background: rgba(0,230,118,0.1); padding: 4px 8px; border-radius: 100px;">Paga</span>`
                    : (q.pago === 2
                        ? `<span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 100px;">Isenta</span>`
                        : `<span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-danger); background: rgba(255,23,68,0.1); padding: 4px 8px; border-radius: 100px;">Pendente</span>`);

                const action = q.pago === 1
                    ? `<button class="btn btn-secondary download-receipt-btn" data-quota-id="${q.id}" style="padding: 5px 12px; font-size: 0.75rem; cursor: pointer;">📄 Descarregar Recibo</button>`
                    : (q.pago === 2
                        ? `<button class="btn btn-secondary remove-waive-quota-btn" data-quota-id="${q.id}" style="padding: 5px 12px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-danger); color: var(--accent-danger); background: transparent;">✖ Reverter Isenção</button>`
                        : `<div style="display: flex; gap: 8px; justify-content: flex-end;">
                             <button class="btn btn-primary pay-quota-btn" data-quota-id="${q.id}" style="padding: 5px 12px; font-size: 0.75rem; cursor: pointer;">💰 Marcar Pago</button>
                             <button class="btn btn-secondary waive-quota-btn" data-quota-id="${q.id}" style="padding: 5px 12px; font-size: 0.75rem; cursor: pointer; border-color: var(--text-muted); color: var(--text-muted); background: transparent;">🎁 Isentar</button>
                           </div>`);

                tr.innerHTML = `
                    <td style="padding: 12px 10px; font-family: var(--font-mono); font-weight: 600;">
                        Sócio N.º ${String(member.numero_socio).padStart(4, '0')}
                    </td>
                    <td style="padding: 12px 10px; color: var(--text-primary); font-weight: 600;">${member.nome}</td>
                    <td style="padding: 12px 10px; text-align: center; font-family: var(--font-mono);">${q.ano}</td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono);">${parseFloat(q.valor).toFixed(2)}€</td>
                    <td style="padding: 12px 10px; text-align: center;">${badgeState}</td>
                    <td style="padding: 12px 10px; text-align: right;">${action}</td>
                `;
                quotasBody.appendChild(tr);

                // Bind quota action buttons
                if (q.pago === 1) {
                    const downloadBtn = tr.querySelector('.download-receipt-btn');
                    if (downloadBtn) {
                        downloadBtn.addEventListener('click', () => {
                            if (typeof window.generateReceiptPDF === 'function') {
                                window.generateReceiptPDF(member, q);
                            } else {
                                alert("Erro: Gerador de PDFs não foi carregado.");
                            }
                        });
                    }
                } else if (q.pago === 0) {
                    const payBtn = tr.querySelector('.pay-quota-btn');
                    if (payBtn) {
                        payBtn.addEventListener('click', async () => {
                            if (!confirm(`Confirmar o recebimento da quota ${q.ano} (25.00€) do sócio ${member.nome}?`)) return;
                            const isBank = confirm("O pagamento foi efetuado por transferência bancária (Banco)?\n\n[OK] Sim (Banco)\n[Cancelar] Não (Dinheiro em Caixa)");
                            const meio_pagamento = isBank ? 'banco' : 'caixa';
                            try {
                                const response = await fetch('/api?action=pay_quota', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${authToken}`
                                    },
                                    body: JSON.stringify({ quota_id: q.id, meio_pagamento })
                                });
                                const res = await response.json();
                                if (!response.ok) throw new Error(res.error || "Erro ao pagar.");
                                
                                alert(`Pagamento registado com sucesso! Recibo N.º ${res.numero_recibo} gerado.`);
                                
                                // Auto download PDF receipt
                                if (typeof window.generateReceiptPDF === 'function') {
                                    window.generateReceiptPDF(member, {
                                        ...q,
                                        pago: 1,
                                        numero_recibo: res.numero_recibo,
                                        data_pagamento: res.data_pagamento
                                    });
                                }
                                loadDashboardData(authToken);
                            } catch (e) {
                                alert(e.message);
                            }
                        });
                    }

                    const waiveBtn = tr.querySelector('.waive-quota-btn');
                    if (waiveBtn) {
                        waiveBtn.addEventListener('click', async () => {
                            if (!confirm(`Tem a certeza que deseja ISENTAR / PERDOAR o pagamento da quota ${q.ano} do sócio ${member.nome}?`)) return;
                            try {
                                const response = await fetch('/api?action=waive_quota', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${authToken}`
                                    },
                                    body: JSON.stringify({ quota_id: q.id })
                                });
                                const res = await response.json();
                                if (!response.ok) throw new Error(res.error || "Erro ao isentar quota.");
                                
                                alert(`Quota isentada/perdoada com sucesso!`);
                                loadDashboardData(authToken);
                            } catch (err) {
                                alert(err.message);
                            }
                        });
                    }
                } else if (q.pago === 2) {
                    const removeWaiveBtn = tr.querySelector('.remove-waive-quota-btn');
                    if (removeWaiveBtn) {
                        removeWaiveBtn.addEventListener('click', async () => {
                            if (!confirm(`Reverter a isenção da quota ${q.ano} do sócio ${member.nome}? A quota voltará ao estado Pendente.`)) return;
                            try {
                                const response = await fetch('/api?action=unwaive_quota', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${authToken}`
                                    },
                                    body: JSON.stringify({ quota_id: q.id })
                                });
                                const res = await response.json();
                                if (!response.ok) throw new Error(res.error || "Erro ao reverter isenção.");
                                
                                alert(`Isenção revertida com sucesso!`);
                                loadDashboardData(authToken);
                            } catch (err) {
                                alert(err.message);
                            }
                        });
                    }
                }
            });
        }

        // E. Render Accounting Book Table
        const contabilidadeBody = document.getElementById('contabilidade-table-body');
        contabilidadeBody.innerHTML = '';
        if (data.contabilidade.length === 0) {
            contabilidadeBody.innerHTML = `<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--text-muted);">Nenhum lançamento registado no livro de caixa.</td></tr>`;
        } else {
            data.contabilidade.forEach(t => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                
                const badgeTipo = t.tipo === 'receita'
                    ? `<span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-secondary); background: rgba(0,230,118,0.1); padding: 2px 8px; border-radius: 4px;">Receita</span>`
                    : `<span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-danger); background: rgba(255,23,68,0.1); padding: 2px 8px; border-radius: 4px;">Despesa</span>`;

                const meioLabel = (t.meio_pagamento || 'banco') === 'banco' ? '🏛️ Banco' : '💵 Caixa';
                const cellMovimento = `${badgeTipo}<br><span style="font-size: 0.75rem; color: var(--text-muted); display: inline-block; margin-top: 4px;">${meioLabel}</span>`;

                const valColored = t.tipo === 'receita'
                    ? `<span style="color: var(--accent-secondary); font-weight: 700;">+${parseFloat(t.valor).toFixed(2)}€</span>`
                    : `<span style="color: var(--accent-danger); font-weight: 700;">-${parseFloat(t.valor).toFixed(2)}€</span>`;

                tr.innerHTML = `
                    <td style="padding: 12px 10px; font-family: var(--font-mono);">${t.data}</td>
                    <td style="padding: 12px 10px; vertical-align: middle;">${cellMovimento}</td>
                    <td style="padding: 12px 10px; color: var(--text-primary); font-weight: 600;">${t.categoria}</td>
                    <td style="padding: 12px 10px; color: var(--text-secondary);">${t.descricao}</td>
                    <td style="padding: 12px 10px; text-align: right; font-family: var(--font-mono);">${valColored}</td>
                    <td style="padding: 12px 10px; text-align: right; white-space: nowrap;">
                        <button class="btn btn-secondary edit-trans-btn" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-secondary); color: var(--accent-secondary); margin-right: 4px; min-width: 32px;">✏️</button>
                        <button class="btn btn-secondary delete-trans-btn" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-danger); color: var(--accent-danger); min-width: 32px;">🗑️</button>
                    </td>
                `;
                contabilidadeBody.appendChild(tr);

                // Bind Edit click
                const editBtn = tr.querySelector('.edit-trans-btn');
                if (editBtn) {
                    editBtn.addEventListener('click', () => {
                        const modal = document.getElementById('edit-transaction-modal');
                        if (!modal) return;

                        document.getElementById('edit-trans-id').value = t.id;
                        document.getElementById('edit-trans-tipo').value = t.tipo || 'receita';
                        document.getElementById('edit-trans-meio').value = t.meio_pagamento || 'banco';
                        document.getElementById('edit-trans-descricao').value = t.descricao || '';
                        document.getElementById('edit-trans-valor').value = t.valor || '';
                        document.getElementById('edit-trans-categoria').value = t.categoria || 'Quotas';
                        document.getElementById('edit-trans-data').value = t.data || '';

                        modal.style.display = 'flex';
                    });
                }

                // Bind Delete click
                const deleteBtn = tr.querySelector('.delete-trans-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', async () => {
                        if (!confirm(`Tem a certeza que deseja eliminar este lançamento ("${t.descricao}")?`)) return;
                        try {
                            const response = await fetch('/api?action=delete_transaction', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                                body: JSON.stringify({ id: t.id })
                            });
                            const res = await response.json();
                            if (!response.ok) throw new Error(res.error || "Erro ao eliminar lançamento.");
                            alert("Lançamento contabilístico eliminado com sucesso!");
                            loadDashboardData(authToken);
                        } catch (err) {
                            alert(err.message);
                        }
                    });
                }
            });
        }
    }

    // Inactivity timeout for Admin Portal (15 minutes)
    let adminInactivityTimeout;
    const adminTimeoutDuration = 15 * 60 * 1000; // 15 mins

    function resetAdminInactivityTimer() {
        clearTimeout(adminInactivityTimeout);
        if (localStorage.getItem('admin_token')) {
            adminInactivityTimeout = setTimeout(logoutAdminDueToInactivity, adminTimeoutDuration);
        }
    }

    function logoutAdminDueToInactivity() {
        localStorage.removeItem('admin_token');
        showLogin();
        alert("A sua sessão de administração expirou por inatividade. Por favor, inicie sessão novamente.");
    }

    // Bind interaction events to reset timer
    const adminActivityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    adminActivityEvents.forEach(evt => {
        document.addEventListener(evt, resetAdminInactivityTimer, true);
    });

    // Start timer initially if logged in
    if (localStorage.getItem('admin_token')) {
        resetAdminInactivityTimer();
    }
};

// ==========================================================================
// 5. LOCAL OFFLINE TESTING MODE (LOCALSTORAGE MOCK DB ENGINE)
// ==========================================================================

function getMockDatabase() {
    const initialDb = {
    "socios":  [
                   {
                       "id":  369286,
                       "telefone":  "296886328",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/82389719498238971949.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro J Lombas N2",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-479",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  1,
                       "data_nascimento":  "1950-07-20",
                       "nome":  "Manuel António Batista dos Reis (CU1CB)",
                       "estado":  "Inativo",
                       "profissao":  "Carteiro",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369334,
                       "telefone":  "",
                       "telemovel":  "968508326",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/84612571828461257182.png",
                       "pais":  "Portugal",
                       "morada":  "Rua da Mae de Deus,10 P.O.Box 7",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-909",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  2,
                       "data_nascimento":  "1980-01-01",
                       "nome":  "António José Andrade Costa (CU1EZ)",
                       "estado":  "Ativo",
                       "profissao":  "Assistente Técnico",
                       "cartao_cidadao":  "",
                       "email":  "cu1ez@sapo.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369287,
                       "telefone":  "",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro Da Bela Vista",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  3,
                       "data_nascimento":  "1946-07-21",
                       "nome":  "Valdemar Guerreiro Sarmento (CU1AB)",
                       "estado":  "Inativo",
                       "profissao":  "Policia Segurança Pública",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369288,
                       "telefone":  "",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/37639756673763975667.png",
                       "pais":  "Portugal",
                       "morada":  "Urbº Ilha do Sol-9",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-434",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  4,
                       "data_nascimento":  "1967-07-08",
                       "nome":  "Paulo Henrique Parece Batista (CU1AMA)",
                       "estado":  "Inativo",
                       "profissao":  "Operador de Central",
                       "cartao_cidadao":  "",
                       "email":  "pauloparece@sapo.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369289,
                       "telefone":  "296882700",
                       "telemovel":  "968605470",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/62133383476213338347.png",
                       "pais":  "Portugal",
                       "morada":  "Lugar Da Cruz Teixeira, Lote 1",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-473",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  5,
                       "data_nascimento":  "1969-07-01",
                       "nome":  "Rui Jorge Parece Batista (CU1AL)",
                       "estado":  "Ativo",
                       "profissao":  "Técnico de Telecomunicações",
                       "cartao_cidadao":  "",
                       "email":  "parecerui@gmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369290,
                       "telefone":  "296882364",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Canada Do Campo",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  6,
                       "data_nascimento":  "1956-08-18",
                       "nome":  "Antonio de Andrade Resendes (CU1BD)",
                       "estado":  "Inativo",
                       "profissao":  "Ajudante de Manobra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369291,
                       "telefone":  "296882764",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Avenida De Santa Maria",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  7,
                       "data_nascimento":  "1952-01-11",
                       "nome":  "Carlos Manuel Monteiro Andrade (CU1AQ)",
                       "estado":  "Inativo",
                       "profissao":  "Controlador de tráfego aéreo",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1952-11-01"
                   },
                   {
                       "id":  369292,
                       "telefone":  "296882142",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua Jorge Leandres Chaves, 19",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  8,
                       "data_nascimento":  "1958-09-30",
                       "nome":  "Jose Caetano Torres Estrela (CU1AE)",
                       "estado":  "Inativo",
                       "profissao":  "Taxista",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369293,
                       "telefone":  "296882323",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Santa Maria, Açores",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  9,
                       "data_nascimento":  "1980-01-01",
                       "nome":  "Mario Luis Ferreira Augusto (CU1BE)",
                       "estado":  "Inativo",
                       "profissao":  "Guarda Nacional Republicana",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-02-20"
                   },
                   {
                       "id":  369294,
                       "telefone":  "296882431",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Flor Da Rosa Baixa, S/N",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  10,
                       "data_nascimento":  "1956-08-23",
                       "nome":  "João Batista Ferreira Fernandes (CU1AY)",
                       "estado":  "Inativo",
                       "profissao":  "Oficial Justiça",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-03-20"
                   },
                   {
                       "id":  369295,
                       "telefone":  "296886328",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "B. Infante D. Henquque, 24 Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  11,
                       "data_nascimento":  "1977-05-07",
                       "nome":  "Nuno Manuel Rodrigues Dos Reis (CU1BJ)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-03-20"
                   },
                   {
                       "id":  369296,
                       "telefone":  "296886184",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_female_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro De Santa Barbara, 54 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "F",
                       "numero_socio":  12,
                       "data_nascimento":  "1952-07-14",
                       "nome":  "Aida Maria Tavares Chaves (CU1YB)",
                       "estado":  "Inativo",
                       "profissao":  "Domestica",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-03-20"
                   },
                   {
                       "id":  369297,
                       "telefone":  "296886238",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro De Santa Barbara, 75 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  13,
                       "data_nascimento":  "1980-01-01",
                       "nome":  "Ricardo Jorge Morgado Batista (CU1BC)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-03-20"
                   },
                   {
                       "id":  369298,
                       "telefone":  "296882468",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Pedras De São Pedro, 36",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  14,
                       "data_nascimento":  "1977-07-20",
                       "nome":  "Fernando Jorge Cabral Braga (AUXILIAR)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-03-20"
                   },
                   {
                       "id":  369299,
                       "telefone":  "9054570417",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "112 Cornwall Rd.",
                       "distrito":  "Ontário",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "L6W 1N8",
                       "concelho":  "BRAMPTON",
                       "sexo":  "M",
                       "numero_socio":  15,
                       "data_nascimento":  "1949-11-19",
                       "nome":  "Jorge Gil Soares (VA3GIL)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-08-19"
                   },
                   {
                       "id":  369300,
                       "telefone":  "14012536233",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "239 Franklin St.",
                       "distrito":  "Rhode Island",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "RI 02809",
                       "concelho":  "Bristol",
                       "sexo":  "M",
                       "numero_socio":  16,
                       "data_nascimento":  "1943-12-13",
                       "nome":  "Virginio C. Franco (AA1AY)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-08-19"
                   },
                   {
                       "id":  369301,
                       "telefone":  "296585457",
                       "telemovel":  "966297939",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua Padre Cruz, 2",
                       "distrito":  "Açores",
                       "freguesia":  "Povoação",
                       "nif":  "999999990",
                       "cod_postal":  "9650-000",
                       "concelho":  "Povoação",
                       "sexo":  "M",
                       "numero_socio":  17,
                       "data_nascimento":  "1967-04-23",
                       "nome":  "Pedro Silveira Lobato Miranda (CU2IQA)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "miranda.pedro@sapo.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-08-19"
                   },
                   {
                       "id":  369302,
                       "telefone":  "",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "RUA DA COSTA, LOTE 4 - 1º DT",
                       "distrito":  "Lisboa",
                       "freguesia":  "Bobadela",
                       "nif":  "999999990",
                       "cod_postal":  "2685-000",
                       "concelho":  "Loures",
                       "sexo":  "M",
                       "numero_socio":  18,
                       "data_nascimento":  "1948-06-11",
                       "nome":  "Jorge Henrique Bettencourt Figueiredo (CT1DTG)",
                       "estado":  "Inativo",
                       "profissao":  "Controlador de tráfego aéreo",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-08-19"
                   },
                   {
                       "id":  369303,
                       "telefone":  "",
                       "telemovel":  "917435479",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/92116496199211649619.png",
                       "pais":  "Portugal",
                       "morada":  "Urbanizaçao Ilha Do Sol, 32 Rua C",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-434",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  19,
                       "data_nascimento":  "1948-10-13",
                       "nome":  "Eduardo Alberto dos Santos Paixão (CU1AW)",
                       "estado":  "Ativo",
                       "profissao":  "Controlador de tráfego aéreo",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-11-12"
                   },
                   {
                       "id":  369304,
                       "telefone":  "296886149",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro De Santa Barbara, 5 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  20,
                       "data_nascimento":  "1964-05-28",
                       "nome":  "Luis Filipe Gomes Costa Santos (CU1AH)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-11-12"
                   },
                   {
                       "id":  369305,
                       "telefone":  "296884156",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Mirante, S/N - Almagreira",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  21,
                       "data_nascimento":  "1966-08-02",
                       "nome":  "Ricardo L. Botelho De Sousa (AUXILIAR)",
                       "estado":  "Inativo",
                       "profissao":  "Maquinista C. Térmicas",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1995-11-30"
                   },
                   {
                       "id":  369306,
                       "telefone":  "296886595",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro De Santa Barbara, 2 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  22,
                       "data_nascimento":  "1962-06-03",
                       "nome":  "Mario Jorge Tavares de Melo Mesquita (CU1BI)",
                       "estado":  "Inativo",
                       "profissao":  "Controlador de tráfego aéreo",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1996-01-11"
                   },
                   {
                       "id":  369307,
                       "telefone":  "296882434",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Santa Maria, Açores",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  23,
                       "data_nascimento":  "1980-01-01",
                       "nome":  "Antonio Farpelha Braga (CU1AZA)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1996-03-09"
                   },
                   {
                       "id":  369308,
                       "telefone":  "",
                       "telemovel":  "962345999",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Caminho Velho Da Praia, 14",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-030",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  24,
                       "data_nascimento":  "1959-11-21",
                       "nome":  "Luis António Tavares de Melo Mesquita (CU1AG)",
                       "estado":  "Ativo",
                       "profissao":  "Controlador de tráfego aéreo",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1996-03-09"
                   },
                   {
                       "id":  369309,
                       "telefone":  "296916590",
                       "telemovel":  "927125851",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua do Machado, 45",
                       "distrito":  "Açores",
                       "freguesia":  "Santa Cruz",
                       "nif":  "999999990",
                       "cod_postal":  "9560-082",
                       "concelho":  "Lagoa",
                       "sexo":  "M",
                       "numero_socio":  25,
                       "data_nascimento":  "1967-11-07",
                       "nome":  "Manuel António de Oliveira Carreiro (CU2IE)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "maocarreiro@gmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1996-11-22"
                   },
                   {
                       "id":  369310,
                       "telefone":  "296584615",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Canada do Hotel, 10",
                       "distrito":  "Açores",
                       "freguesia":  "Furnas",
                       "nif":  "999999990",
                       "cod_postal":  "9675-061",
                       "concelho":  "Povoação",
                       "sexo":  "M",
                       "numero_socio":  26,
                       "data_nascimento":  "1959-12-23",
                       "nome":  "José Manuel da Silva Pontes (CU2AAI)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1997-02-13"
                   },
                   {
                       "id":  369311,
                       "telefone":  "296854290",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Largo Do Teatro, 5",
                       "distrito":  "Açores",
                       "freguesia":  "Furnas",
                       "nif":  "999999990",
                       "cod_postal":  "9675-001",
                       "concelho":  "Povoação",
                       "sexo":  "M",
                       "numero_socio":  27,
                       "data_nascimento":  "1950-12-09",
                       "nome":  "António José Ferreira Arruda (CU2FX)",
                       "estado":  "Inativo",
                       "profissao":  "Comerciante",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1997-02-13"
                   },
                   {
                       "id":  369312,
                       "telefone":  "296886198",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro De São Pedro, 5 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  28,
                       "data_nascimento":  "1949-08-12",
                       "nome":  "Helder Fernando da Silva Braga Pimentel (CU1ATA)",
                       "estado":  "Inativo",
                       "profissao":  "Oficial de operações Aeroportuárias",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1997-04-11"
                   },
                   {
                       "id":  369313,
                       "telefone":  "296886278",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro Da Bela Vista, 9 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  29,
                       "data_nascimento":  "1961-05-03",
                       "nome":  "Henrique F. S. A. Amaral Nunes (CU1APA)",
                       "estado":  "Inativo",
                       "profissao":  "Controlador de tráfego aéreo",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1998-01-22"
                   },
                   {
                       "id":  369314,
                       "telefone":  "296882150",
                       "telemovel":  "914279659",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Lugar Do Ginjal Lote  2",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  30,
                       "data_nascimento":  "1959-11-15",
                       "nome":  "Armando Manuel de Fraga Borges Pacheco (CU1ARB)",
                       "estado":  "Inativo",
                       "profissao":  "Tecnico de Comunicações Aeronáuticas",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1999-01-08"
                   },
                   {
                       "id":  369315,
                       "telefone":  "296883052",
                       "telemovel":  "912347333",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro J Lombas",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-479",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  31,
                       "data_nascimento":  "1967-04-19",
                       "nome":  "João Delvino Chaves Batista (CU1AAA)",
                       "estado":  "Inativo",
                       "profissao":  "Oficial de Operações SATA",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "1999-01-08"
                   },
                   {
                       "id":  369316,
                       "telefone":  "",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro De Santa Barbara, 23 - Aeroporto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-417",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  32,
                       "data_nascimento":  "1975-07-09",
                       "nome":  "Marco Paulo Chaves Faro (CU1BG)",
                       "estado":  "Inativo",
                       "profissao":  "Guarda Nacional Republicana",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2001-03-06"
                   },
                   {
                       "id":  369317,
                       "telefone":  "",
                       "telemovel":  "916466818",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Santana, S/N",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-487",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  33,
                       "data_nascimento":  "1973-01-07",
                       "nome":  "Pedro Miguel Resendes Sousa (CU1AAB)",
                       "estado":  "Ativo",
                       "profissao":  "Carpinteiro",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2001-03-06"
                   },
                   {
                       "id":  369318,
                       "telefone":  "",
                       "telemovel":  "912148437",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Lugar de Castelhana, s/n,",
                       "distrito":  "Açores",
                       "freguesia":  "São Pedro",
                       "nif":  "999999990",
                       "cod_postal":  "9580-307",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  34,
                       "data_nascimento":  "1970-05-12",
                       "nome":  "Pedro Miguel Pereira da Silveira (CU1AX)",
                       "estado":  "Inativo",
                       "profissao":  "Policia Segurança Pública",
                       "cartao_cidadao":  "",
                       "email":  "cu1axcqdx@gmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2001-06-08"
                   },
                   {
                       "id":  369319,
                       "telefone":  "",
                       "telemovel":  "912827312",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua Almirante António Ramalho Ortigão Lt 64 Rc Dto",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "8000-536",
                       "concelho":  "Faro",
                       "sexo":  "M",
                       "numero_socio":  35,
                       "data_nascimento":  "1976-03-15",
                       "nome":  "Sergio António Fonseca Oliveira (CT2KNS)",
                       "estado":  "Inativo",
                       "profissao":  "Guarda Nacional Republicana",
                       "cartao_cidadao":  "",
                       "email":  "cu1aad@gmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2001-08-08"
                   },
                   {
                       "id":  369320,
                       "telefone":  "296886012",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Largo José M. Amaral -  Termo Da Igreja",
                       "distrito":  "Açores",
                       "freguesia":  "Santo Espirito",
                       "nif":  "999999990",
                       "cod_postal":  "9580-000",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  36,
                       "data_nascimento":  "1967-09-08",
                       "nome":  "Daniel Sousa Braga (AUXILIAR)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2003-04-04"
                   },
                   {
                       "id":  369321,
                       "telefone":  "",
                       "telemovel":  "917227113",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "ALAMEDA DA GUIA, 124 - 5º DT",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "2750-368",
                       "concelho":  "Cascais",
                       "sexo":  "M",
                       "numero_socio":  37,
                       "data_nascimento":  "1947-11-29",
                       "nome":  "José Manuel Dias Soares Bernardino (CU1UZ)",
                       "estado":  "Inativo",
                       "profissao":  "Comissário de bordo",
                       "cartao_cidadao":  "",
                       "email":  "joebernard@netcabo.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2003-11-24"
                   },
                   {
                       "id":  369322,
                       "telefone":  "",
                       "telemovel":  "913524073",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/63263242606326324260.png",
                       "pais":  "Portugal",
                       "morada":  "Valverde S/N",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-492",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  38,
                       "data_nascimento":  "1980-11-11",
                       "nome":  "Ricardo Jorge Chaves Pacheco (CU1AAH)",
                       "estado":  "Ativo",
                       "profissao":  "Rececionista",
                       "cartao_cidadao":  "",
                       "email":  "ricardo_j_pacheco@hotmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2003-11-24"
                   },
                   {
                       "id":  369323,
                       "telefone":  "",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua do Porto, Vivenda Chaves",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-909",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  39,
                       "data_nascimento":  "1980-01-01",
                       "nome":  "Ricardo Manuel Pontes Chaves (CU2AAV/CU2JU)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "cu2aav@clix.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2004-03-20"
                   },
                   {
                       "id":  369324,
                       "telefone":  "",
                       "telemovel":  "",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Canada Padre Joaquim, 86",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-909",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  40,
                       "data_nascimento":  "1980-01-01",
                       "nome":  "Guilherme Joaquim Medeiros Frias (CU1IF)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "cu2if@sapo.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2004-03-20"
                   },
                   {
                       "id":  369325,
                       "telefone":  "",
                       "telemovel":  "911706133",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "S. Asantana, 34",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-909",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  41,
                       "data_nascimento":  "1946-11-19",
                       "nome":  "Martti Juhani Laibe (CU2KG)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "martti.laine@kolumbus.fi",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2013-02-18"
                   },
                   {
                       "id":  369326,
                       "telefone":  "",
                       "telemovel":  "00358400535442",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Suomusjarventie 460",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "25390",
                       "concelho":  "Kiikala",
                       "sexo":  "M",
                       "numero_socio":  42,
                       "data_nascimento":  "1941-03-15",
                       "nome":  "Pertti Simovaara (OH2PM)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "pertti.simovaara@gmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2013-02-18"
                   },
                   {
                       "id":  369327,
                       "telefone":  "296886430",
                       "telemovel":  "927962735",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/77749007347774900734.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro Da Nav C39",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "215451082",
                       "cod_postal":  "9580-540",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  43,
                       "data_nascimento":  "1984-07-07",
                       "nome":  "Hugo Miguel Gouveia Braga (CT8ACJ)",
                       "estado":  "Ativo",
                       "profissao":  "Técnico Superior",
                       "cartao_cidadao":  "12625073",
                       "email":  "braga.hugo@hotmail.com",
                       "habilitacoes":  "Licenciatura",
                       "data_admissao":  "2021-02-27"
                   },
                   {
                       "id":  369328,
                       "telefone":  "",
                       "telemovel":  "919020060",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua Infante D. Herique, nº 68",
                       "distrito":  "Açores",
                       "freguesia":  "Fajã De Cima",
                       "nif":  "999999990",
                       "cod_postal":  "9500-000",
                       "concelho":  "Ponta Delgada",
                       "sexo":  "M",
                       "numero_socio":  44,
                       "data_nascimento":  "1981-04-12",
                       "nome":  "Bruno Bettencourt Sousa Farias (CS8ABG)",
                       "estado":  "Inativo",
                       "profissao":  "Técnico de Informática",
                       "cartao_cidadao":  "",
                       "email":  "cs8abg@gmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2021-02-25"
                   },
                   {
                       "id":  369329,
                       "telefone":  "",
                       "telemovel":  "961769552",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Rua Padre José Machado Barcelo, 48",
                       "distrito":  "Açores",
                       "freguesia":  "Livramento",
                       "nif":  "999999990",
                       "cod_postal":  "9500-725",
                       "concelho":  "Ponta Delgada",
                       "sexo":  "M",
                       "numero_socio":  45,
                       "data_nascimento":  "1970-03-10",
                       "nome":  "Paulo José Pereira Medeiros (CU2CO)",
                       "estado":  "Inativo",
                       "profissao":  "Outra",
                       "cartao_cidadao":  "",
                       "email":  "cu2co@sapo.pt",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2021-02-25"
                   },
                   {
                       "id":  369330,
                       "telefone":  "",
                       "telemovel":  "910403673",
                       "iban":  "",
                       "fotografia":  "https://img.quotagest.pt/app/img/user_male_1.png",
                       "pais":  "Portugal",
                       "morada":  "Bairro Do Operário, 28",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-410",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  46,
                       "data_nascimento":  "1977-11-21",
                       "nome":  "Helder de Nunes Medeiros (CR8AVC)",
                       "estado":  "Ativo",
                       "profissao":  "Técnico Especializado",
                       "cartao_cidadao":  "",
                       "email":  "heldernmedeiros@hotmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2022-10-12"
                   },
                   {
                       "id":  369331,
                       "telefone":  "",
                       "telemovel":  "925980527",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/13281228621328122862.png",
                       "pais":  "Portugal",
                       "morada":  "Rua José Leandra Chaves, 39",
                       "distrito":  "Açores",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-533",
                       "concelho":  "Vila Do Porto",
                       "sexo":  "M",
                       "numero_socio":  47,
                       "data_nascimento":  "1982-03-07",
                       "nome":  "Carlos Alberto De Bairos Couto (CR8ACZ)",
                       "estado":  "Ativo",
                       "profissao":  "Bombeiro",
                       "cartao_cidadao":  "",
                       "email":  "carlos.couto1982@hotmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2022-10-12"
                   },
                   {
                       "id":  369335,
                       "telefone":  "",
                       "telemovel":  "961515360",
                       "iban":  "",
                       "fotografia":  "https://storage.quotagest.pt/associacoes/A0000004047/socios/88225905428822590542.png",
                       "pais":  "Portugal",
                       "morada":  "Flor Da Rosa Baixa, 42",
                       "distrito":  "Ilha de Santa Maria",
                       "freguesia":  "Vila Do Porto",
                       "nif":  "999999990",
                       "cod_postal":  "9580-477",
                       "concelho":  "Vila do Porto",
                       "sexo":  "M",
                       "numero_socio":  48,
                       "data_nascimento":  "1995-01-17",
                       "nome":  "Rui Caetano Braga Chaves (CR8ADB)",
                       "estado":  "Ativo",
                       "profissao":  "Programador Informática",
                       "cartao_cidadao":  "",
                       "email":  "ruibchaves@hotmail.com",
                       "habilitacoes":  "Outras",
                       "data_admissao":  "2023-02-26"
                   }
               ],
    "contabilidade":  [
                          {
                              "id":  972181,
                              "tipo":  "despesa",
                              "valor":  103.23,
                              "descricao":  "CQ8M WW context",
                              "data":  "2025-11-04",
                              "meio_pagamento":  "banco",
                              "categoria":  "Outros"
                          },
                          {
                              "id":  972180,
                              "tipo":  "receita",
                              "valor":  750,
                              "descricao":  "Protocolo CMVP",
                              "data":  "2025-09-01",
                              "meio_pagamento":  "banco",
                              "categoria":  "Subsídios"
                          },
                          {
                              "id":  972179,
                              "tipo":  "despesa",
                              "valor":  50.31,
                              "descricao":  "Dominio cu1arm.com",
                              "data":  "2025-04-23",
                              "meio_pagamento":  "banco",
                              "categoria":  "Manutenção Infraestruturas"
                          },
                          {
                              "id":  972178,
                              "tipo":  "despesa",
                              "valor":  47.85,
                              "descricao":  "Software contabilidade",
                              "data":  "2025-04-10",
                              "meio_pagamento":  "banco",
                              "categoria":  "Outros"
                          },
                          {
                              "id":  972177,
                              "tipo":  "despesa",
                              "valor":  731.34,
                              "descricao":  "Compra antena Hexbeam",
                              "data":  "2025-04-08",
                              "meio_pagamento":  "banco",
                              "categoria":  "Manutenção Equipamentos"
                          },
                          {
                              "id":  972176,
                              "tipo":  "despesa",
                              "valor":  0.99,
                              "descricao":  "Comissão Transferência",
                              "data":  "2024-10-16",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  763941,
                              "tipo":  "despesa",
                              "valor":  15,
                              "descricao":  "apoio atividade Ciência Viva",
                              "data":  "2024-10-14",
                              "meio_pagamento":  "banco",
                              "categoria":  "Subsídios"
                          },
                          {
                              "id":  763881,
                              "tipo":  "despesa",
                              "valor":  100,
                              "descricao":  "TRANSFERÊNCIA DE SALDO",
                              "data":  "2024-10-14",
                              "meio_pagamento":  "banco",
                              "categoria":  "Transferência de Saldo"
                          },
                          {
                              "id":  732980,
                              "tipo":  "receita",
                              "valor":  750,
                              "descricao":  "Apoio Anual CMVP",
                              "data":  "2024-06-13",
                              "meio_pagamento":  "banco",
                              "categoria":  "Subsídios"
                          },
                          {
                              "id":  732978,
                              "tipo":  "despesa",
                              "valor":  25,
                              "descricao":  "Compra Carimbo",
                              "data":  "2024-05-30",
                              "meio_pagamento":  "banco",
                              "categoria":  "Consumíveis"
                          },
                          {
                              "id":  733003,
                              "tipo":  "despesa",
                              "valor":  200,
                              "descricao":  "TRANSFERÊNCIA DE SALDO",
                              "data":  "2024-05-21",
                              "meio_pagamento":  "banco",
                              "categoria":  "Transferência de Saldo"
                          },
                          {
                              "id":  732983,
                              "tipo":  "despesa",
                              "valor":  0.99,
                              "descricao":  "Comissão Transferência",
                              "data":  "2024-05-21",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  712506,
                              "tipo":  "despesa",
                              "valor":  148.93,
                              "descricao":  "Reparação rotor",
                              "data":  "2024-05-21",
                              "meio_pagamento":  "banco",
                              "categoria":  "Manutenção Equipamentos"
                          },
                          {
                              "id":  732973,
                              "tipo":  "receita",
                              "valor":  0.01,
                              "descricao":  "Validação ebay",
                              "data":  "2024-04-24",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  732972,
                              "tipo":  "receita",
                              "valor":  0.09,
                              "descricao":  "Validação ebay",
                              "data":  "2024-04-24",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  696482,
                              "tipo":  "despesa",
                              "valor":  44.28,
                              "descricao":  "Pagamento Anual 2024",
                              "data":  "2024-04-07",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  696509,
                              "tipo":  "receita",
                              "valor":  0.15,
                              "descricao":  "Credito Paypal",
                              "data":  "2024-04-04",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  696507,
                              "tipo":  "receita",
                              "valor":  0.18,
                              "descricao":  "debito do PayPal",
                              "data":  "2024-04-04",
                              "meio_pagamento":  "banco",
                              "categoria":  "Contabilidade"
                          },
                          {
                              "id":  694609,
                              "tipo":  "receita",
                              "valor":  2082.54,
                              "descricao":  "Mudança de Banco",
                              "data":  "2024-04-03",
                              "meio_pagamento":  "banco",
                              "categoria":  "Transferência de Saldo"
                          }
                      ],
    "candidatos":  [

                   ],
    "quotas":  [
                   {
                       "id":  10001,
                       "valor":  25,
                       "socio_id":  369334,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10002,
                       "valor":  25,
                       "socio_id":  369289,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10003,
                       "valor":  25,
                       "socio_id":  369303,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10004,
                       "valor":  25,
                       "socio_id":  369308,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10005,
                       "valor":  25,
                       "socio_id":  369317,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10006,
                       "valor":  25,
                       "socio_id":  369322,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10007,
                       "valor":  25,
                       "socio_id":  369327,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10008,
                       "valor":  25,
                       "socio_id":  369330,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10009,
                       "valor":  25,
                       "socio_id":  369331,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   },
                   {
                       "id":  10010,
                       "valor":  25,
                       "socio_id":  369335,
                       "pago":  0,
                       "data_pagamento":  "",
                       "numero_recibo":  "",
                       "ano":  2026
                   }
               ]
};

    const SEED_VERSION = "20260529_v1";
    let db = localStorage.getItem('arm_mock_db');
    let dbVersion = localStorage.getItem('arm_mock_db_version');

    function sanitizePhotos(database) {
        if (database && database.socios) {
            database.socios.forEach(s => {
                if (s.fotografia && s.fotografia.includes('quotagest.pt')) {
                    s.fotografia = '';
                }
            });
        }
        if (database && database.candidatos) {
            database.candidatos.forEach(c => {
                if (c.fotografia && c.fotografia.includes('quotagest.pt')) {
                    c.fotografia = '';
                }
            });
        }
        return database;
    }

    if (!db || dbVersion !== SEED_VERSION) {
        console.log("Mock Database initialized or updated with seeded data.");
        const cleaned = sanitizePhotos(initialDb);
        localStorage.setItem('arm_mock_db', JSON.stringify(cleaned));
        localStorage.setItem('arm_mock_db_version', SEED_VERSION);
        return cleaned;
    }

    try {
        const parsed = JSON.parse(db);
        if (parsed && typeof parsed === 'object' && parsed.socios && parsed.candidatos) {
            const cleaned = sanitizePhotos(parsed);
            return cleaned;
        } else {
            throw new Error("Invalid structure");
        }
    } catch (e) {
        console.warn("Mock Database corrupted. Resetting to initial seed.", e);
        const cleaned = sanitizePhotos(initialDb);
        localStorage.setItem('arm_mock_db', JSON.stringify(cleaned));
        localStorage.setItem('arm_mock_db_version', SEED_VERSION);
        return cleaned;
    }
}

// Global window.fetch override interceptor
const originalFetch = window.fetch;
window.fetch = async function(input, init) {
    let url = typeof input === 'string' ? input : input.url;
    
    if (url.includes('/api?action=')) {
        // Safe base URL detection to prevent crashes on file:// protocol
        const base = (window.location.origin && window.location.origin !== 'null') 
            ? window.location.origin 
            : window.location.href;
            
        try {
            const parsedUrl = new URL(url, base);
            const action = parsedUrl.searchParams.get('action');
            
            // Detect local developer configurations or offline instances
            const isLocal = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'].some(ip => window.location.hostname.includes(ip)) || window.location.hostname === '';
            
            if (isLocal) {
                try {
                    // Try hitting any actual local endpoint first (in case wrangler dev is running)
                    const response = await originalFetch(input, init);
                    const contentType = response.headers.get('content-type') || '';
                    // Only return the real response if it's valid JSON (indicating wrangler dev is running and handled it)
                    if (contentType.includes('application/json')) {
                        return response;
                    }
                } catch (e) {
                    // Fail-safe redirect to local storage mock database engine
                }
                
                return await handleMockRequest(action, init);
            }
        } catch (urlError) {
            console.error("Error parsing URL in fetch interceptor:", urlError);
        }
    }
    
    return originalFetch(input, init);
};

// Mock requests resolver
async function handleMockRequest(action, initOptions) {
    const db = getMockDatabase();
    
    function autoCreateMockCurrentYearQuotas(mockDb) {
        const currentYear = new Date().getFullYear();
        let changed = false;
        if (mockDb && mockDb.socios && mockDb.quotas) {
            mockDb.socios.forEach(s => {
                if (s.estado === 'Ativo') {
                    const existing = mockDb.quotas.find(q => q.socio_id === s.id && q.ano === currentYear);
                    if (!existing) {
                        mockDb.quotas.push({
                            id: Date.now() + Math.floor(Math.random() * 100000),
                            socio_id: s.id,
                            ano: currentYear,
                            valor: 25.0,
                            pago: 0,
                            data_pagamento: '',
                            numero_recibo: ''
                        });
                        changed = true;
                    }
                }
            });
            if (changed) {
                localStorage.setItem('arm_mock_db', JSON.stringify(mockDb));
            }
        }
    }
    
    autoCreateMockCurrentYearQuotas(db);

    const body = initOptions && initOptions.body ? JSON.parse(initOptions.body) : null;
    const headers = initOptions && initOptions.headers ? initOptions.headers : {};
    const authHeader = headers['Authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    
    const responseHeaders = {
        'Content-Type': 'application/json'
    };

    function response(data, status = 200) {
        return new Response(JSON.stringify(data), {
            status,
            headers: responseHeaders
        });
    }

    // Delay simulations for visual smoothness
    await new Promise(r => setTimeout(r, 200));

    if (action === 'init') {
        return response({ message: "Mock Database initialized in LocalStorage." });
    }

    if (action === 'register') {
        const required = ['nome', 'nif', 'cartao_cidadao', 'sexo', 'data_nascimento', 'iban', 'profissao', 'habilitacoes', 'pais', 'cod_postal', 'morada', 'freguesia', 'concelho', 'distrito', 'telemovel', 'email', 'fotografia'];
        for (const field of required) {
            if (!body[field]) {
                return response({ error: `Campo '${field}' é obrigatório.` }, 400);
            }
        }
        
        const newCandidate = {
            id: Date.now(),
            ...body,
            data_submissao: new Date().toISOString()
        };
        db.candidatos.push(newCandidate);
        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Mock application submitted successfully." });
    }

    if (action === 'login') {
        // Authenticate with fallback password
        if (body.password === 'cu1arm1995') {
            const mockToken = 'mock-session-' + Date.now();
            return response({ token: mockToken, expires_at: Date.now() + 2 * 60 * 60 * 1000 });
        } else {
            return response({ error: "Palavra-passe incorreta no Mock Mode. Use 'cu1arm1995'." }, 401);
        }
    }

    if (action === 'login_google') {
        const allowedEmails = ['geral@cu1arm.com', 'hugo.braga@nav.pt'];
        if (body.isMock) {
            if (allowedEmails.includes(body.email)) {
                const mockToken = 'mock-session-google-' + Date.now();
                return response({ token: mockToken, expires_at: Date.now() + 2 * 60 * 60 * 1000 });
            } else {
                return response({ error: `O e-mail '${body.email}' não está autorizado a aceder como administrador.` }, 403);
            }
        }
        if (body.credential) {
            const mockToken = 'mock-session-google-' + Date.now();
            return response({ token: mockToken, expires_at: Date.now() + 2 * 60 * 60 * 1000 });
        }
        return response({ error: "Credencial Google em falta." }, 400);
    }

    if (action === 'import_members') {
        if (!body.members || !Array.isArray(body.members)) {
            return response({ error: "Dados dos sócios em falta ou inválidos." }, 400);
        }
        
        let count = 0;
        const currentYear = new Date().getFullYear();
        
        body.members.forEach(member => {
            if (!member.numero_socio) {
                const nextNum = db.socios.length > 0 ? Math.max(...db.socios.map(s => s.numero_socio)) + 1 : 1;
                member.numero_socio = nextNum;
            }
            
            // Check if socio with this number already exists to avoid duplicate seed
            const exists = db.socios.some(s => s.numero_socio === member.numero_socio);
            if (exists) return; // skip
            
            member.id = Date.now() + Math.floor(Math.random() * 10000) + count;
            db.socios.push(member);
            count++;
            
            // Pre-create current year quota
            db.quotas.push({
                id: Date.now() + Math.floor(Math.random() * 10000) + count + 1000,
                socio_id: member.id,
                ano: currentYear,
                valor: 25.0,
                pago: 0,
                data_pagamento: "",
                numero_recibo: ""
            });
        });
        
        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: `${count} sócios importados com sucesso.`, count });
    }

    // Require Auth Check for sensitive actions
    if (['get_data', 'approve_member', 'pay_quota', 'add_transaction', 'reject_candidate', 'import_members'].includes(action)) {
        if (!token.startsWith('mock-session-')) {
            return response({ error: "Acesso não autorizado (Mock Mode)." }, 401);
        }
    }

    if (action === 'get_data') {
        return response({
            candidatos: db.candidatos,
            socios: db.socios,
            quotas: db.quotas,
            contabilidade: db.contabilidade,
            update_requests: (db.update_requests || []).filter(r => r.status === 'pendente')
        });
    }

    if (action === 'approve_member') {
        const id = parseInt(body.id);
        const index = db.candidatos.findIndex(c => c.id === id);
        if (index === -1) return response({ error: "Candidato não encontrado." }, 404);
        
        const cand = db.candidatos[index];
        const nextSocioNum = db.socios.length > 0 ? Math.max(...db.socios.map(s => s.numero_socio)) + 1 : 1;
        const timestamp = new Date().toISOString().split('T')[0];

        const newSocio = {
            id: Date.now(),
            numero_socio: nextSocioNum,
            nome: cand.nome,
            nif: cand.nif,
            cartao_cidadao: cand.cartao_cidadao,
            sexo: cand.sexo,
            data_nascimento: cand.data_nascimento,
            iban: cand.iban,
            profissao: cand.profissao,
            habilitacoes: cand.habilitacoes,
            pais: cand.pais,
            cod_postal: cand.cod_postal,
            morada: cand.morada,
            freguesia: cand.freguesia,
            concelho: cand.concelho,
            distrito: cand.distrito,
            telemovel: cand.telemovel,
            telefone: cand.telefone,
            email: cand.email,
            estado: 'Ativo',
            data_admissao: timestamp,
            fotografia: cand.fotografia
        };

        db.socios.push(newSocio);
        db.candidatos.splice(index, 1);

        // Pre-create current year quota
        const currentYear = new Date().getFullYear();
        db.quotas.push({
            id: Date.now() + 1,
            socio_id: newSocio.id,
            ano: currentYear,
            valor: 25.0,
            pago: 0,
            data_pagamento: "",
            numero_recibo: ""
        });

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Candidato aprovado como Sócio N.º " + nextSocioNum });
    }

    if (action === 'reject_candidate') {
        const id = parseInt(body.id);
        const index = db.candidatos.findIndex(c => c.id === id);
        if (index === -1) return response({ error: "Candidato não encontrado." }, 404);
        
        db.candidatos.splice(index, 1);
        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Candidato rejeitado e proposta eliminada." });
    }

    if (action === 'pay_quota') {
        const quotaId = parseInt(body.quota_id);
        const quota = db.quotas.find(q => q.id === quotaId);
        if (!quota) return response({ error: "Quota não encontrada." }, 404);
        
        if (quota.pago === 1) return response({ error: "Quota já se encontra paga." }, 400);

        const nextReciboNum = String(db.quotas.filter(q => q.numero_recibo != '').length + 1).padStart(4, '0');
        const timestamp = new Date().toISOString().split('T')[0];

        quota.pago = 1;
        quota.data_pagamento = timestamp;
        quota.numero_recibo = nextReciboNum;

        const member = db.socios.find(s => s.id === quota.socio_id);

        db.contabilidade.push({
            id: Date.now(),
            tipo: 'receita',
            meio_pagamento: body.meio_pagamento || 'banco',
            descricao: `Quota ${quota.ano} - Sócio N.º ${member.numero_socio} (${member.nome})`,
            valor: quota.valor,
            data: timestamp,
            categoria: 'Quotas'
        });

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({
            message: "Mock Quota Payment registered.",
            numero_recibo: nextReciboNum,
            data_pagamento: timestamp
        });
    }

    if (action === 'waive_quota') {
        const quotaId = parseInt(body.quota_id);
        const quota = db.quotas.find(q => q.id === quotaId);
        if (!quota) return response({ error: "Quota não encontrada." }, 404);
        
        if (quota.pago === 1) return response({ error: "Quota já se encontra paga." }, 400);
        if (quota.pago === 2) return response({ error: "Quota já se encontra isenta." }, 400);

        quota.pago = 2;

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Mock Quota waived." });
    }

    if (action === 'unwaive_quota') {
        const quotaId = parseInt(body.quota_id);
        const quota = db.quotas.find(q => q.id === quotaId);
        if (!quota) return response({ error: "Quota não encontrada." }, 404);
        
        if (quota.pago !== 2) return response({ error: "Quota não está isenta." }, 400);

        quota.pago = 0;

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Mock Quota exemption reverted." });
    }

    if (action === 'add_transaction') {
        const { tipo, meio_pagamento, descricao, valor, data: tData, categoria } = body;
        db.contabilidade.push({
            id: Date.now(),
            tipo,
            meio_pagamento: meio_pagamento || 'banco',
            descricao,
            valor: parseFloat(valor),
            data: tData,
            categoria
        });
        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Lançamento contabilístico registado." });
    }

    if (action === 'edit_transaction') {
        const id = parseInt(body.id);
        const index = db.contabilidade.findIndex(t => t.id === id);
        if (index === -1) return response({ error: "Lançamento não encontrado." }, 404);

        db.contabilidade[index] = {
            ...db.contabilidade[index],
            tipo: body.tipo,
            meio_pagamento: body.meio_pagamento || 'banco',
            descricao: body.descricao,
            valor: parseFloat(body.valor),
            categoria: body.categoria,
            data: body.data
        };

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Lançamento atualizado com sucesso no Mock DB." });
    }

    if (action === 'delete_transaction') {
        const id = parseInt(body.id);
        const index = db.contabilidade.findIndex(t => t.id === id);
        if (index === -1) return response({ error: "Lançamento não encontrado." }, 404);

        const trans = db.contabilidade[index];
        if (trans.categoria === 'Quotas' && trans.descricao) {
            const match = trans.descricao.match(/^Quota (\d{4}) - Sócio N.º (\d+)/);
            if (match) {
                const ano = parseInt(match[1]);
                const numeroSocio = parseInt(match[2]);
                const member = db.socios.find(s => s.numero_socio === numeroSocio);
                if (member) {
                    const quota = db.quotas.find(q => q.socio_id === member.id && q.ano === ano && q.pago === 1);
                    if (quota) {
                        quota.pago = 0;
                        quota.data_pagamento = '';
                        quota.numero_recibo = '';
                    }
                }
            }
        }

        db.contabilidade.splice(index, 1);

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Lançamento eliminado com sucesso no Mock DB." });
    }

    if (action === 'edit_member') {
        const id = parseInt(body.id);
        const index = db.socios.findIndex(s => s.id === id);
        if (index === -1) return response({ error: "Sócio não encontrado." }, 404);

        db.socios[index] = {
            ...db.socios[index],
            numero_socio: parseInt(body.numero_socio),
            estado: body.estado,
            nome: body.nome,
            email: body.email,
            telemovel: body.telemovel,
            nif: body.nif,
            cartao_cidadao: body.cartao_cidadao,
            morada: body.morada,
            iban: body.iban,
            data_admissao: body.data_admissao,
            fotografia: body.fotografia
        };

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Sócio atualizado com sucesso no Mock DB." });
    }

    if (action === 'delete_member') {
        const id = parseInt(body.id);
        const index = db.socios.findIndex(s => s.id === id);
        if (index === -1) return response({ error: "Sócio não encontrado." }, 404);

        // Remove member
        db.socios.splice(index, 1);

        // Remove matching quotas
        db.quotas = db.quotas.filter(q => q.socio_id !== id);

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Sócio e quotas associadas eliminados com sucesso no Mock DB." });
    }

    if (action === 'login_socio') {
        const { email } = body;
        const socio = db.socios.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
        if (!socio) {
            return response({ error: "Este e-mail não corresponde a nenhum sócio ativo registado na ARM. Por favor, contacte a direção." }, 404);
        }
        localStorage.setItem('arm_mock_logged_socio_id', socio.id);
        const mockToken = 'mock-session-socio-' + Date.now();
        return response({ token: mockToken });
    }

    if (action === 'login_socio_credentials') {
        const num = parseInt(body.numero_socio);
        const nif = body.nif;
        const socio = db.socios.find(s => s.numero_socio === num && s.nif === nif);
        if (!socio) {
            return response({ error: "Número de Sócio ou NIF incorreto no Mock Mode." }, 404);
        }
        localStorage.setItem('arm_mock_logged_socio_id', socio.id);
        const mockToken = 'mock-session-socio-' + Date.now();
        return response({ token: mockToken });
    }

    if (action === 'get_socio_data') {
        const socioId = localStorage.getItem('arm_mock_logged_socio_id');
        const socio = db.socios.find(s => s.id === parseInt(socioId));
        if (!socio) return response({ error: "Sessão de sócio inválida." }, 401);
        const quotas = db.quotas.filter(q => q.socio_id === socio.id).sort((a,b) => b.ano - a.ano);
        return response({ socio, quotas });
    }

    if (action === 'update_socio_profile') {
        const socioId = localStorage.getItem('arm_mock_logged_socio_id');
        const socio = db.socios.find(s => s.id === parseInt(socioId));
        if (!socio) return response({ error: "Sócio não encontrado." }, 404);

        if (!db.update_requests) db.update_requests = [];

        db.update_requests.push({
            id: Date.now(),
            socio_id: socio.id,
            numero_socio: socio.numero_socio,
            nome: socio.nome,
            dados: JSON.stringify(body),
            status: 'pendente',
            data_submissao: new Date().toISOString().split('T')[0]
        });

        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Pedido de atualização registado (pendente no Mock DB)." });
    }

    if (action === 'approve_update_request') {
        const reqId = parseInt(body.request_id);
        const reqIndex = db.update_requests.findIndex(r => r.id === reqId);
        if (reqIndex === -1) return response({ error: "Pedido não encontrado." }, 404);

        const updateReq = db.update_requests[reqIndex];
        const dados = JSON.parse(updateReq.dados);
        
        const socioIndex = db.socios.findIndex(s => s.id === updateReq.socio_id);
        if (socioIndex !== -1) {
            db.socios[socioIndex] = {
                ...db.socios[socioIndex],
                ...dados
            };
        }

        updateReq.status = 'aprovado';
        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Pedido aprovado e sócio atualizado no Mock DB." });
    }

    if (action === 'reject_update_request') {
        const reqId = parseInt(body.request_id);
        const reqIndex = db.update_requests.findIndex(r => r.id === reqId);
        if (reqIndex === -1) return response({ error: "Pedido não encontrado." }, 404);

        db.update_requests[reqIndex].status = 'rejeitado';
        localStorage.setItem('arm_mock_db', JSON.stringify(db));
        return response({ message: "Pedido rejeitado no Mock DB." });
    }

    return response({ error: "Mock action not implemented." }, 404);
}

// ==========================================================================
// 6. PORTAL DO SÓCIO - MEMBER AREA LOGIC
// ==========================================================================

window.initSocioPortal = function() {
    const loginCard = document.getElementById('socio-login-card');
    const dashboardArea = document.getElementById('socio-dashboard-area');
    const loginError = document.getElementById('socio-login-error-msg');
    const mockSocioLogin = document.getElementById('mock-socio-login');
    const btnMockSocio = document.getElementById('btn-mock-socio-login');
    const mockSocioEmail = document.getElementById('mock-socio-email');
    const logoutBtn = document.getElementById('socio-logout-btn');
    const updateForm = document.getElementById('socio-update-form');

    if (!loginCard || !dashboardArea) return;

    // Toggle login forms
    const toggleCredBtn = document.getElementById('toggle-socio-cred-login');
    const toggleGoogleBtn = document.getElementById('toggle-socio-google-login');
    const googleSection = document.getElementById('socio-google-signin-section');
    const credSection = document.getElementById('socio-cred-login-section');

    if (toggleCredBtn && googleSection && credSection) {
        toggleCredBtn.addEventListener('click', () => {
            googleSection.style.display = 'none';
            credSection.style.display = 'block';
        });
    }

    if (toggleGoogleBtn && googleSection && credSection) {
        toggleGoogleBtn.addEventListener('click', () => {
            googleSection.style.display = 'block';
            credSection.style.display = 'none';
        });
    }

    // Submit credentials login
    const credLoginForm = document.getElementById('socio-cred-login-form');
    if (credLoginForm) {
        credLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const num = parseInt(document.getElementById('socio-login-num').value);
            const nif = document.getElementById('socio-login-nif').value.trim();
            if (loginError) loginError.style.display = 'none';

            try {
                const fetchRes = await fetch('/api?action=login_socio_credentials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ numero_socio: num, nif })
                });
                const result = await fetchRes.json();
                if (!fetchRes.ok) throw new Error(result.error || "Login incorreto.");

                localStorage.setItem('socio_token', result.token);
                loadSocioDashboard(result.token);
            } catch (err) {
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.textContent = err.message;
                }
            }
        });
    }

    function showLogin() {
        loginCard.style.display = 'block';
        dashboardArea.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        if (googleSection) googleSection.style.display = 'block';
        if (credSection) credSection.style.display = 'none';
        
        initSocioGoogleSignIn();
    }

    function showDashboard() {
        loginCard.style.display = 'none';
        dashboardArea.style.display = 'flex';
        resetSocioInactivityTimer();
    }

    // Google Sign-In Callback for Members
    async function handleSocioGoogleCredentialResponse(response) {
        if (loginError) loginError.style.display = 'none';
        try {
            const fetchRes = await fetch('/api?action=login_socio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential })
            });
            const result = await fetchRes.json();
            if (!fetchRes.ok) throw new Error(result.error || "Erro de autenticação.");
            
            localStorage.setItem('socio_token', result.token);
            loadSocioDashboard(result.token);
        } catch (err) {
            if (loginError) {
                loginError.style.display = 'block';
                loginError.textContent = err.message;
            }
        }
    }

    function initSocioGoogleSignIn() {
        const isLocal = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'].some(ip => window.location.hostname.includes(ip)) || window.location.hostname === '';
        
        if (window.google && typeof GOOGLE_CLIENT_ID !== 'undefined' && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE") {
            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleSocioGoogleCredentialResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById("google-socio-signin-btn"),
                    { theme: "outline", size: "large", width: 280, text: "signin_with" }
                );
            } catch (err) {
                console.error("Failed to initialize Google Sign-In:", err);
            }
        } else {
            const btnContainer = document.getElementById("google-socio-signin-btn");
            if (btnContainer && !isLocal) {
                btnContainer.innerHTML = '<span style="font-size:0.8rem; color:var(--text-secondary);">Google login pendente de configuração do Client ID.</span>';
            }
        }

        if (isLocal && mockSocioLogin) {
            mockSocioLogin.style.display = 'block';
        }
    }

    // Local simulator click
    if (btnMockSocio && mockSocioEmail) {
        btnMockSocio.addEventListener('click', async () => {
            const email = mockSocioEmail.value;
            if (loginError) loginError.style.display = 'none';
            try {
                const response = await fetch('/api?action=login_socio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isMock: true, email })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Erro ao simular login.");
                
                localStorage.setItem('socio_token', result.token);
                loadSocioDashboard(result.token);
            } catch (err) {
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.textContent = err.message;
                }
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('socio_token');
            showLogin();
        });
    }

    // Photo uploader listener
    const photoFileInput = document.getElementById('socio-update-photo-file');
    if (photoFileInput) {
        photoFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Max size check: 1.5MB
            if (file.size > 1.5 * 1024 * 1024) {
                alert("A fotografia é demasiado grande. Escolha uma imagem até 1.5 MB.");
                photoFileInput.value = '';
                return;
            }
            
            try {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = err => reject(err);
                    reader.readAsDataURL(file);
                });
                
                const hiddenInput = document.getElementById('socio-update-photo');
                if (hiddenInput) hiddenInput.value = base64;
                
                const preview = document.getElementById('socio-update-photo-preview');
                if (preview) preview.src = base64;
                
                const filename = document.getElementById('socio-update-photo-filename');
                if (filename) filename.textContent = file.name;
            } catch (err) {
                alert("Erro ao processar a imagem: " + err.message);
            }
        });
    }

    // Submit profile update request
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('socio_token');
            const data = {
                telemovel: document.getElementById('socio-update-mobile').value.trim(),
                telefone: document.getElementById('socio-update-phone').value.trim(),
                email: document.getElementById('socio-update-email').value.trim(),
                iban: document.getElementById('socio-update-iban').value.trim(),
                profissao: document.getElementById('socio-update-job').value.trim(),
                habilitacoes: document.getElementById('socio-update-degree').value.trim(),
                nif: document.getElementById('socio-update-nif').value.trim(),
                cartao_cidadao: document.getElementById('socio-update-cc').value.trim(),
                morada: document.getElementById('socio-update-address').value.trim(),
                cod_postal: document.getElementById('socio-update-zip').value.trim(),
                freguesia: document.getElementById('socio-update-freguesia').value.trim(),
                concelho: document.getElementById('socio-update-concelho').value.trim(),
                distrito: document.getElementById('socio-update-distrito').value.trim(),
                pais: document.getElementById('socio-update-pais').value.trim(),
                fotografia: document.getElementById('socio-update-photo').value.trim()
            };
            try {
                const response = await fetch('/api?action=update_socio_profile', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Erro ao submeter pedido.");
                alert("O seu pedido de alteração de dados foi submetido e encontra-se pendente de aprovação pela direção!");
                loadSocioDashboard(token);
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // Inactivity timeout for Member Portal (15 minutes)
    let socioInactivityTimeout;
    const socioTimeoutDuration = 15 * 60 * 1000; // 15 mins

    function resetSocioInactivityTimer() {
        clearTimeout(socioInactivityTimeout);
        if (localStorage.getItem('socio_token')) {
            socioInactivityTimeout = setTimeout(logoutSocioDueToInactivity, socioTimeoutDuration);
        }
    }

    function logoutSocioDueToInactivity() {
        localStorage.removeItem('socio_token');
        showLogin();
        alert("A sua sessão de sócio expirou por inatividade. Por favor, inicie sessão novamente.");
    }

    // Bind interaction events to reset timer
    const socioActivityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    socioActivityEvents.forEach(evt => {
        document.addEventListener(evt, resetSocioInactivityTimer, true);
    });

    // Check token on load
    const token = localStorage.getItem('socio_token');
    if (token) {
        loadSocioDashboard(token);
        resetSocioInactivityTimer();
    } else {
        showLogin();
    }
};

async function loadSocioDashboard(token) {
    const loginCard = document.getElementById('socio-login-card');
    const dashboardArea = document.getElementById('socio-dashboard-area');
    if (!loginCard || !dashboardArea) return;

    try {
        const response = await fetch('/api?action=get_socio_data', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (!response.ok) {
            // Token expired or invalid
            localStorage.removeItem('socio_token');
            loginCard.style.display = 'block';
            dashboardArea.style.display = 'none';
            const loginError = document.getElementById('socio-login-error-msg');
            if (loginError) {
                loginError.style.display = 'block';
                loginError.textContent = result.error || "Sessão expirada. Inicie sessão novamente.";
            }
            return;
        }

        // 1. Render Profile Details
        const socio = result.socio;
        document.getElementById('socio-welcome-title').textContent = `Olá, ${socio.nome.split(' ')[0]}!`;
        document.getElementById('socio-profile-name').textContent = socio.nome;
        document.getElementById('socio-profile-num').textContent = socio.numero_socio;
        document.getElementById('socio-profile-nif').textContent = socio.nif || '-';
        document.getElementById('socio-profile-cc').textContent = socio.cartao_cidadao || '-';
        document.getElementById('socio-profile-mobile').textContent = socio.telemovel || socio.telefone || '-';
        document.getElementById('socio-profile-email').textContent = socio.email || '-';
        document.getElementById('socio-profile-address').textContent = socio.morada || '-';
        document.getElementById('socio-profile-admissao').textContent = socio.data_admissao || '-';
        
        // Status badge styling
        const statusEl = document.getElementById('socio-profile-status');
        statusEl.textContent = socio.estado;
        if (socio.estado === 'Ativo') {
            statusEl.style.background = 'rgba(0, 230, 118, 0.1)';
            statusEl.style.color = 'var(--accent-secondary)';
        } else {
            statusEl.style.background = 'rgba(255, 23, 68, 0.1)';
            statusEl.style.color = 'var(--accent-danger)';
        }

        const fotoUrl = socio.fotografia && !socio.fotografia.includes('quotagest.pt') ? socio.fotografia : 'assets/images/logo2-65x121.png';
        document.getElementById('socio-profile-img').src = fotoUrl;

        // Prepopulate update form
        document.getElementById('socio-update-mobile').value = socio.telemovel || '';
        document.getElementById('socio-update-phone').value = socio.telefone || '';
        document.getElementById('socio-update-email').value = socio.email || '';
        document.getElementById('socio-update-iban').value = socio.iban || '';
        document.getElementById('socio-update-job').value = socio.profissao || '';
        document.getElementById('socio-update-degree').value = socio.habilitacoes || '';
        document.getElementById('socio-update-nif').value = socio.nif || '';
        document.getElementById('socio-update-cc').value = socio.cartao_cidadao || '';
        document.getElementById('socio-update-address').value = socio.morada || '';
        document.getElementById('socio-update-zip').value = socio.cod_postal || '';
        document.getElementById('socio-update-freguesia').value = socio.freguesia || '';
        document.getElementById('socio-update-concelho').value = socio.concelho || '';
        document.getElementById('socio-update-distrito').value = socio.distrito || '';
        document.getElementById('socio-update-pais').value = socio.pais || '';

        // Handle photo uploader states
        const hasValidPhoto = socio.fotografia && !socio.fotografia.includes('quotagest.pt');
        document.getElementById('socio-update-photo').value = hasValidPhoto ? socio.fotografia : '';
        const updatePreview = document.getElementById('socio-update-photo-preview');
        if (updatePreview) updatePreview.src = fotoUrl;
        const updateFilename = document.getElementById('socio-update-photo-filename');
        if (updateFilename) {
            updateFilename.textContent = hasValidPhoto ? "Foto atual guardada" : "Nenhuma foto selecionada";
        }

        // 2. Render Quotas Table
        const quotasBody = document.getElementById('socio-quotas-table-body');
        quotasBody.innerHTML = '';

        if (result.quotas.length === 0) {
            quotasBody.innerHTML = `<tr><td colspan="5" style="padding: 24px; text-align: center; color: var(--text-muted);">Não existem quotas registadas na sua conta.</td></tr>`;
        } else {
            result.quotas.forEach(q => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                
                const isPago = q.pago === 1;
                const statusBadge = isPago 
                    ? `<span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-secondary); background: rgba(0,230,118,0.1); padding: 2px 8px; border-radius: 4px;">Pago</span>`
                    : (q.pago === 2
                        ? `<span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px;">Isenta</span>`
                        : `<span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-warning); background: rgba(255,145,0,0.1); padding: 2px 8px; border-radius: 4px;">Pendente</span>`);
                
                const dataPagamento = q.data_pagamento || '-';
                
                let actionBtn = '-';
                if (q.pago === 1) {
                    actionBtn = `
                        <button class="btn btn-secondary btn-print-quota-receipt" data-quota-id="${q.id}" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer; border-color: var(--accent-secondary); color: var(--accent-secondary); outline: none;">
                            📄 Imprimir Recibo
                        </button>
                    `;
                } else if (q.pago === 2) {
                    actionBtn = `<span style="font-size: 0.8rem; color: var(--text-muted);">Isenta de Pagamento</span>`;
                }

                tr.innerHTML = `
                    <td style="padding: 12px 10px; font-weight: 600;">${q.ano}</td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono);">${parseFloat(q.valor).toFixed(2)}€</td>
                    <td style="padding: 12px 10px; text-align: center;">${statusBadge}</td>
                    <td style="padding: 12px 10px; font-family: var(--font-mono);">${dataPagamento}</td>
                    <td style="padding: 12px 10px; text-align: right;">${actionBtn}</td>
                `;
                quotasBody.appendChild(tr);

                // Bind print quota receipt button
                if (isPago) {
                    const downloadBtn = tr.querySelector('.btn-print-quota-receipt');
                    if (downloadBtn) {
                        downloadBtn.addEventListener('click', () => {
                            if (typeof window.generateReceiptPDF === 'function') {
                                window.generateReceiptPDF(socio, q);
                            } else {
                                alert("Erro: Gerador de PDFs não foi carregado.");
                            }
                        });
                    }
                }
            });
        }

        loginCard.style.display = 'none';
        dashboardArea.style.display = 'flex';
    } catch (err) {
        console.error("Error loading member dashboard:", err);
    }
}



