/* ==========================================================================
   SPA ROUTER SYSTEM - ASSOCIAÇÃO DE RADIOAMADORES MARIENSES (ARM)
   ========================================================================== */

const routes = {
    '/': {
        fragment: 'pages/home.html',
        title: 'ARM - Associação de Radioamadores Marienses',
        init: () => {
            if (typeof window.initRepeaterDashboard === 'function') window.initRepeaterDashboard();
            if (typeof window.initWeatherWidget === 'function') window.initWeatherWidget();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/sobre': {
        fragment: 'pages/sobre.html',
        title: 'A nossa História - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/sobre_arm': {
        fragment: 'pages/sobre.html',
        title: 'A nossa História - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/corpos-sociais': {
        fragment: 'pages/corpos_sociais.html',
        title: 'Corpos Sociais - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/corpos_sociais': {
        fragment: 'pages/corpos_sociais.html',
        title: 'Corpos Sociais - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/estatutos': {
        fragment: 'pages/estatutos.html',
        title: 'Estatutos de Fundação - ARM',
        init: () => {
            if (typeof window.initAccordions === 'function') window.initAccordions();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/sede': {
        fragment: 'pages/sede.html',
        title: 'A nossa Sede - ARM',
        init: () => {
            if (typeof window.initMaps === 'function') window.initMaps();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/proposta-socio': {
        fragment: 'pages/proposta_socio.html',
        title: 'Proposta de Sócio - ARM',
        init: () => {
            if (typeof window.initSignupForm === 'function') window.initSignupForm();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/proposta_socio': {
        fragment: 'pages/proposta_socio.html',
        title: 'Proposta de Sócio - ARM',
        init: () => {
            if (typeof window.initSignupForm === 'function') window.initSignupForm();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/rep-analogicos': {
        fragment: 'pages/rep_analogicos.html',
        title: 'Repetidores Analógicos RV48 - ARM',
        init: () => {
            if (typeof window.initMaps === 'function') window.initMaps();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/rep_analogicos': {
        fragment: 'pages/rep_analogicos.html',
        title: 'Repetidores Analógicos RV48 - ARM',
        init: () => {
            if (typeof window.initMaps === 'function') window.initMaps();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/rep-dmr': {
        fragment: 'pages/rep_dmr.html',
        title: 'Repetidores UHF DMR RU692 - ARM',
        init: () => {
            if (typeof window.initMaps === 'function') window.initMaps();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/rep_dmr': {
        fragment: 'pages/rep_dmr.html',
        title: 'Repetidores UHF DMR RU692 - ARM',
        init: () => {
            if (typeof window.initMaps === 'function') window.initMaps();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/digipeater': {
        fragment: 'pages/digipeater.html',
        title: 'APRS Digipeater CQ1PPA - ARM',
        init: () => {
            if (typeof window.initMaps === 'function') window.initMaps();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/ser-radioamador': {
        fragment: 'pages/ser_radioamador.html',
        title: 'Ser Radioamador - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/ser_radioamador': {
        fragment: 'pages/ser_radioamador.html',
        title: 'Ser Radioamador - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/contactos': {
        fragment: 'pages/contactos.html',
        title: 'Contactos - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/allstar': {
        fragment: 'pages/allstar.html',
        title: 'AllStar Link Node 568290 - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/fradar24': {
        fragment: 'pages/fradar24.html',
        title: 'Flightradar24 ADS-B - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/repetidor-convertido': {
        fragment: 'pages/repetidor_convertido.html',
        title: 'Conversão Repetidor UHF DMR - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/repetidor_convertido': {
        fragment: 'pages/repetidor_convertido.html',
        title: 'Conversão Repetidor UHF DMR - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/varac': {
        fragment: 'pages/varac.html',
        title: 'VaraC Keyboard Chat Guide - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/ft8': {
        fragment: 'pages/ft8.html',
        title: 'Guia Completo FT8 - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/js8call': {
        fragment: 'pages/js8call.html',
        title: 'Guia JS8Call - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/packet-mail': {
        fragment: 'pages/packet_mail.html',
        title: 'Packet Mail CQ1PMPA-10 - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/packet_mail': {
        fragment: 'pages/packet_mail.html',
        title: 'Packet Mail CQ1PMPA-10 - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/dmr': {
        fragment: 'pages/dmr.html',
        title: 'Tecnologia DMR - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/artigo-modelo': {
        fragment: 'pages/artigo_modelo.html',
        title: 'Modelo de Artigo - ARM',
        init: () => {
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/admin': {
        fragment: 'pages/admin.html',
        title: 'Painel Administração - ARM',
        init: () => {
            if (typeof window.initAdminPage === 'function') window.initAdminPage();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    },
    '/socio': {
        fragment: 'pages/socio.html',
        title: 'Área do Sócio - ARM',
        init: () => {
            if (typeof window.initSocioPortal === 'function') window.initSocioPortal();
            if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
        }
    }
};

const pageCache = {};
let isTransitioning = false;
let currentActivePath = null;

function parseHash(hash) {
    let cleanHash = hash.replace(/^#/, '');
    if (!cleanHash.startsWith('/')) {
        cleanHash = '/' + cleanHash;
    }
    
    // Normalization logic for trailing slashes / exact route lookup
    if (routes[cleanHash]) {
        return { path: cleanHash, anchor: null };
    }
    
    // Handle home anchor (e.g. #/rede-arm)
    if (cleanHash === '/rede-arm') {
        return { path: '/', anchor: 'rede-arm' };
    }
    
    return { path: '/', anchor: null };
}

function normalizeHash(hash) {
    let clean = hash.replace(/^#/, '');
    
    // Map mobirise filenames and legacy hashes to clean ones
    const aliases = {
        'index.html': '/',
        '/': '/',
        'sobre_arm.html': '/sobre',
        'corpos_sociais.html': '/corpos-sociais',
        'estatutos.html': '/estatutos',
        'sede.html': '/sede',
        'proposta_socio.html': '/proposta-socio',
        'rep_analogicos.html': '/rep-analogicos',
        'rep_dmr.html': '/rep-dmr',
        'digipeater.html': '/digipeater',
        'ser_radioamador.html': '/ser-radioamador',
        'contactos.html': '/contactos',
        'allstar.html': '/allstar',
        'fradar24.html': '/fradar24',
        'repetidor_convertido.html': '/repetidor-convertido',
        'varac.html': '/varac',
        'ft8.html': '/ft8',
        'js8call.html': '/js8call',
        'packet_mail.html': '/packet-mail',
        'dmr.html': '/dmr',
        'page7.html': '/artigo-modelo',
        'admin.html': '/admin',
        'socio.html': '/socio',
        
        '/sobre_arm': '/sobre',
        '/corpos_sociais': '/corpos-sociais',
        '/rep_analogicos': '/rep-analogicos',
        '/rep_dmr': '/rep-dmr',
        '/proposta_socio': '/proposta-socio',
        '/ser_radioamador': '/ser-radioamador',
        '/repetidor_convertido': '/repetidor-convertido',
        '/packet_mail': '/packet-mail',
        '/dmr': '/dmr',
        '/artigo-modelo': '/artigo-modelo',
        '/admin': '/admin',
        '/socio': '/socio',
        '/rede-arm': '/'
    };
    
    // Standardize leading slash
    if (!clean.startsWith('/') && clean !== 'index.html') {
        clean = '/' + clean;
    }
    
    return aliases[clean] || clean;
}

function updateActiveNavLink(hash) {
    // Remove active styles from all top-level items
    document.querySelectorAll('.navbar-item').forEach(item => item.classList.remove('active'));
    
    const normalizedTarget = normalizeHash(hash);
    
    // Highlight items based on link href matching target route
    const links = document.querySelectorAll('.navbar-link, .navbar-dropdown-link');
    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const normalizedHref = normalizeHash(href);
        
        if (normalizedHref === normalizedTarget) {
            const parentItem = link.closest('.navbar-item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        }
    });
}

async function handleRouting() {
    if (isTransitioning) return;
    
    const hash = window.location.hash || '#/';
    const { path, anchor } = parseHash(hash);
    const route = routes[path];
    
    if (!route) {
        window.location.hash = '#/';
        return;
    }
    
    const appView = document.getElementById('app-router-view');
    if (!appView) return;
    
    // Optimize: if already on current path and only need an anchor scroll
    if (currentActivePath === path && anchor) {
        const anchorEl = document.getElementById(anchor);
        if (anchorEl) {
            anchorEl.scrollIntoView({ behavior: 'smooth' });
            updateActiveNavLink(hash);
            return;
        }
    }
    
    isTransitioning = true;
    currentActivePath = path;
    
    // 1. Transition out
    appView.classList.add('fade-out');
    
    // Wait for transition animation
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // 2. Fetch fragment from server or Cache
    let htmlContent = '';
    if (pageCache[route.fragment]) {
        htmlContent = pageCache[route.fragment];
    } else {
        try {
            const response = await fetch(route.fragment);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            htmlContent = await response.text();
            pageCache[route.fragment] = htmlContent;
        } catch (error) {
            console.error("Failed to load page fragment:", error);
            htmlContent = `
                <div class="container section" style="text-align: center; padding: 120px 20px;">
                    <h2 style="color: var(--accent-danger); font-size: 2.2rem; margin-bottom: 16px;">Erro de Carregamento</h2>
                    <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 30px auto; line-height: 1.7;">
                        Não foi possível carregar esta secção. Se estiver a navegar localmente abrindo o ficheiro directamente (file://), 
                        o seu browser bloqueia requisições dinâmicas devido a restrições de segurança (CORS).
                        <br><br>
                        Por favor, carregue o site a partir de um servidor web ou mini-servidor local.
                    </p>
                    <a href="#/" class="btn btn-primary">Voltar à Página Inicial</a>
                </div>
            `;
        }
    }
    
    // 3. Inject new DOM
    appView.innerHTML = htmlContent;
    document.title = route.title;
    updateActiveNavLink(hash);
    
    // 4. Transition in
    appView.classList.remove('fade-out');
    
    // 5. Initialize page components
    try {
        route.init();
    } catch (e) {
        console.error("Failed to initialize route scripts:", e);
    }
    
    // 6. Perform scroll
    if (anchor) {
        setTimeout(() => {
            const anchorEl = document.getElementById(anchor);
            if (anchorEl) {
                anchorEl.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    } else {
        window.scrollTo(0, 0);
    }
    
    isTransitioning = false;
}

// Listen to Hash Changes and Initial load
window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', () => {
    // If hash isn't empty, run immediately. Otherwise let home load
    handleRouting();
});
