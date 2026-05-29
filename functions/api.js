/* ==========================================================================
   CLOUDFLARE PAGES FUNCTIONS BACKEND API - CRM ARM
   ========================================================================== */

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    // Add CORS headers for developer convenience
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (!env.DB) {
        return new Response(JSON.stringify({ error: "Cloudflare D1 Database binding 'DB' was not found in settings." }), {
            status: 500,
            headers: corsHeaders
        });
    }

    try {
        switch (action) {
            case 'init':
                return await handleInit(env.DB, corsHeaders);
            case 'register':
                return await handleRegister(request, env.DB, corsHeaders);
            case 'login':
                return await handleLogin(request, env, corsHeaders);
            case 'login_google':
                return await handleLoginGoogle(request, env, corsHeaders);
            case 'import_members':
                return await handleImportMembers(request, env.DB, corsHeaders);
            case 'logout':
                return await handleLogout(request, env.DB, corsHeaders);
            case 'get_data':
                return await handleGetData(request, env.DB, corsHeaders);
            case 'approve_member':
                return await handleApproveMember(request, env.DB, corsHeaders);
            case 'pay_quota':
                return await handlePayQuota(request, env.DB, corsHeaders);
            case 'add_transaction':
                return await handleAddTransaction(request, env.DB, corsHeaders);
            case 'reject_candidate':
                return await handleRejectCandidate(request, env.DB, corsHeaders);
            case 'edit_member':
                return await handleEditMember(request, env.DB, corsHeaders);
            case 'delete_member':
                return await handleDeleteMember(request, env.DB, corsHeaders);
            case 'edit_transaction':
                return await handleEditTransaction(request, env.DB, corsHeaders);
            case 'delete_transaction':
                return await handleDeleteTransaction(request, env.DB, corsHeaders);
            case 'login_socio':
                return await handleLoginSocio(request, env, corsHeaders);
            case 'login_socio_credentials':
                return await handleLoginSocioCredentials(request, env.DB, corsHeaders);
            case 'waive_quota':
                return await handleWaiveQuota(request, env.DB, corsHeaders);
            case 'unwaive_quota':
                return await handleUnwaiveQuota(request, env.DB, corsHeaders);
            case 'unpay_quota':
                return await handleUnpayQuota(request, env.DB, corsHeaders);
            case 'get_socio_data':
                return await handleGetSocioData(request, env.DB, corsHeaders);
            case 'update_socio_profile':
                return await handleUpdateSocioProfile(request, env.DB, corsHeaders);
            case 'approve_update_request':
                return await handleApproveUpdateRequest(request, env.DB, corsHeaders);
            case 'reject_update_request':
                return await handleRejectUpdateRequest(request, env.DB, corsHeaders);
            default:
                return new Response(JSON.stringify({ error: "Invalid action." }), {
                    status: 400,
                    headers: corsHeaders
                });
        }
    } catch (err) {
        console.error("API error:", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error." }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 1. INITIALIZE DATABASE TABLES
async function handleInit(db, headers) {
    const tables = [
        `CREATE TABLE IF NOT EXISTS candidatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            nif TEXT,
            cartao_cidadao TEXT,
            sexo TEXT,
            data_nascimento TEXT,
            iban TEXT,
            profissao TEXT,
            habilitacoes TEXT,
            pais TEXT,
            cod_postal TEXT,
            morada TEXT,
            freguesia TEXT,
            concelho TEXT,
            distrito TEXT,
            telemovel TEXT,
            telefone TEXT,
            email TEXT,
            data_submissao TEXT,
            fotografia TEXT,
            qrz_url TEXT,
            rgpd_email INTEGER DEFAULT 1,
            rgpd_sms INTEGER DEFAULT 1,
            rgpd_imagemvideo INTEGER DEFAULT 1,
            rgpd_audio INTEGER DEFAULT 1
        );`,
        `CREATE TABLE IF NOT EXISTS socios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_socio INTEGER UNIQUE,
            nome TEXT,
            nif TEXT,
            cartao_cidadao TEXT,
            sexo TEXT,
            data_nascimento TEXT,
            iban TEXT,
            profissao TEXT,
            habilitacoes TEXT,
            pais TEXT,
            cod_postal TEXT,
            morada TEXT,
            freguesia TEXT,
            concelho TEXT,
            distrito TEXT,
            telemovel TEXT,
            telefone TEXT,
            email TEXT,
            estado TEXT,
            data_admissao TEXT,
            fotografia TEXT,
            qrz_url TEXT,
            rgpd_email INTEGER DEFAULT 1,
            rgpd_sms INTEGER DEFAULT 1,
            rgpd_imagemvideo INTEGER DEFAULT 1,
            rgpd_audio INTEGER DEFAULT 1
        );`,
        `CREATE TABLE IF NOT EXISTS quotas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            socio_id INTEGER,
            ano INTEGER,
            valor REAL,
            pago INTEGER,
            data_pagamento TEXT,
            numero_recibo TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS contabilidade (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT,
            meio_pagamento TEXT DEFAULT 'banco',
            descricao TEXT,
            valor REAL,
            data TEXT,
            categoria TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS admin_sessions (
            token TEXT PRIMARY KEY,
            expires_at INTEGER
        );`,
        `CREATE TABLE IF NOT EXISTS socio_sessions (
            token TEXT PRIMARY KEY,
            socio_id INTEGER,
            expires_at INTEGER
        );`,
        `CREATE TABLE IF NOT EXISTS update_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            socio_id INTEGER,
            numero_socio INTEGER,
            nome TEXT,
            dados TEXT,
            status TEXT DEFAULT 'pendente',
            data_submissao TEXT
        );`
    ];

    for (const sql of tables) {
        await db.prepare(sql).run();
    }

    // Migração de schema segura para base de dados existente
    try {
        await db.prepare("ALTER TABLE contabilidade ADD COLUMN meio_pagamento TEXT DEFAULT 'banco'").run();
    } catch (e) {
        // Coluna provavelmente já existe, ignorar
    }

    // Migrações de schema para QRZ e RGPD em base de dados existente
    const migrations = [
        "ALTER TABLE socios ADD COLUMN qrz_url TEXT",
        "ALTER TABLE socios ADD COLUMN rgpd_email INTEGER DEFAULT 1",
        "ALTER TABLE socios ADD COLUMN rgpd_sms INTEGER DEFAULT 1",
        "ALTER TABLE socios ADD COLUMN rgpd_imagemvideo INTEGER DEFAULT 1",
        "ALTER TABLE socios ADD COLUMN rgpd_audio INTEGER DEFAULT 1",
        "ALTER TABLE candidatos ADD COLUMN qrz_url TEXT",
        "ALTER TABLE candidatos ADD COLUMN rgpd_email INTEGER DEFAULT 1",
        "ALTER TABLE candidatos ADD COLUMN rgpd_sms INTEGER DEFAULT 1",
        "ALTER TABLE candidatos ADD COLUMN rgpd_imagemvideo INTEGER DEFAULT 1",
        "ALTER TABLE candidatos ADD COLUMN rgpd_audio INTEGER DEFAULT 1"
    ];
    
    for (const sql of migrations) {
        try {
            await db.prepare(sql).run();
        } catch (e) {
            // Ignorar se a coluna já existe
        }
    }

    return new Response(JSON.stringify({ message: "D1 database initialized successfully." }), {
        status: 200,
        headers
    });
}

// 2. REGISTER A MEMBER CANDIDATE (PUBLIC SUBMISSION)
async function handleRegister(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    const data = await request.json();
    const required = ['nome', 'nif', 'cartao_cidadao', 'sexo', 'data_nascimento', 'iban', 'profissao', 'habilitacoes', 'pais', 'cod_postal', 'morada', 'freguesia', 'concelho', 'distrito', 'telemovel', 'email', 'fotografia'];

    for (const field of required) {
        if (!data[field]) {
            return new Response(JSON.stringify({ error: `Field '${field}' is mandatory.` }), { status: 400, headers });
        }
    }

    const timestamp = new Date().toISOString();

    await db.prepare(`
        INSERT INTO candidatos (
            nome, nif, cartao_cidadao, sexo, data_nascimento, iban, profissao, habilitacoes, 
            pais, cod_postal, morada, freguesia, concelho, distrito, telemovel, telefone, email, data_submissao, fotografia,
            qrz_url, rgpd_email, rgpd_sms, rgpd_imagemvideo, rgpd_audio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        data.nome, data.nif, data.cartao_cidadao, data.sexo, data.data_nascimento, data.iban, data.profissao, data.habilitacoes,
        data.pais, data.cod_postal, data.morada, data.freguesia, data.concelho, data.distrito, data.telemovel, data.telefone || '', data.email, timestamp, data.fotografia,
        data.qrz_url || '',
        data.rgpd_email !== undefined ? data.rgpd_email : 1,
        data.rgpd_sms !== undefined ? data.rgpd_sms : 1,
        data.rgpd_imagemvideo !== undefined ? data.rgpd_imagemvideo : 1,
        data.rgpd_audio !== undefined ? data.rgpd_audio : 1
    ).run();

    return new Response(JSON.stringify({ message: "Application submitted successfully." }), { status: 200, headers });
}

// 3. ADMIN LOGIN
async function handleLogin(request, env, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    const { password } = await request.json();
    const expectedPassword = env.ADMIN_PASSWORD || 'cu1arm1995';

    if (password !== expectedPassword) {
        return new Response(JSON.stringify({ error: "Incorrect administrator password." }), { status: 401, headers });
    }

    // Generate random session token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity

    await env.DB.prepare(`
        INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)
    `).bind(token, expiresAt).run();

    return new Response(JSON.stringify({ token, expires_at: expiresAt }), { status: 200, headers });
}

// 3.B ADMIN GOOGLE LOGIN
async function handleLoginGoogle(request, env, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    const { credential, isMock, email: mockEmail } = await request.json();

    let email = '';

    // Handle simulator requests locally or if testing
    if (isMock) {
        email = mockEmail;
    } else {
        if (!credential) {
            return new Response(JSON.stringify({ error: "Missing Google login credential token." }), { status: 400, headers });
        }

        // Verify Google ID token using Google TokenInfo API
        try {
            const tokeninfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
            const response = await fetch(tokeninfoUrl);
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Invalid token response from Google verification endpoint.");
            }
            
            const payload = await response.json();
            
            // Check Google Client ID matches if defined
            const expectedClientId = env.GOOGLE_CLIENT_ID;
            if (expectedClientId && payload.aud !== expectedClientId) {
                return new Response(JSON.stringify({ error: "Google client ID mismatch. Token audience is unauthorized." }), { status: 403, headers });
            }
            
            if (payload.email_verified !== 'true' && payload.email_verified !== true) {
                return new Response(JSON.stringify({ error: "The Google account email is not verified." }), { status: 403, headers });
            }
            
            email = payload.email;
        } catch (e) {
            console.error("Google token verification failed:", e);
            return new Response(JSON.stringify({ error: `Google verification failed: ${e.message}` }), { status: 401, headers });
        }
    }

    if (!email) {
        return new Response(JSON.stringify({ error: "Could not retrieve user email from Google." }), { status: 400, headers });
    }

    // Check if user email is authorized in env
    const allowedEmailsStr = env.ALLOWED_ADMIN_EMAILS || 'geral@cu1arm.com,presidente@cu1arm.com,tesoureiro@cu1arm.com,secretario@cu1arm.com';
    const allowedEmails = allowedEmailsStr.split(',').map(e => e.trim().toLowerCase());

    if (!allowedEmails.includes(email.toLowerCase())) {
        return new Response(JSON.stringify({ error: `A conta '${email}' não tem privilégios de administração.` }), { status: 403, headers });
    }

    // Generate random session token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity

    await env.DB.prepare(`
        INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)
    `).bind(token, expiresAt).run();

    return new Response(JSON.stringify({ token, expires_at: expiresAt }), { status: 200, headers });
}

// Helper to check authentication
async function isAuthenticated(request, db) {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/, '').trim();

    if (!token) return false;

    const session = await db.prepare(`
        SELECT expires_at FROM admin_sessions WHERE token = ?
    `).bind(token).first();

    if (!session) return false;

    // Check if expired
    if (Date.now() > session.expires_at) {
        // Clean up expired session
        await db.prepare(`DELETE FROM admin_sessions WHERE token = ?`).bind(token).run();
        return false;
    }

    return true;
}

// 4. ADMIN LOGOUT
async function handleLogout(request, db, headers) {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/, '').trim();

    if (token) {
        await db.prepare(`DELETE FROM admin_sessions WHERE token = ?`).bind(token).run();
    }

    return new Response(JSON.stringify({ message: "Logged out successfully." }), { status: 200, headers });
}

// 5. READ DATABASE FOR CRM BOARD
async function handleGetData(request, db, headers) {
    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized access." }), { status: 401, headers });
    }

    // Clean up expired sessions periodically on data fetch
    await db.prepare(`DELETE FROM admin_sessions WHERE expires_at < ?`).bind(Date.now()).run();

    // Auto-create current year quotas if missing
    await autoCreateCurrentYearQuotas(db);

    // Dynamic schema creation safety net
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS update_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            socio_id INTEGER,
            numero_socio INTEGER,
            nome TEXT,
            dados TEXT,
            status TEXT DEFAULT 'pendente',
            data_submissao TEXT
        );
    `).run();

    const candidatos = (await db.prepare(`SELECT * FROM candidatos ORDER BY data_submissao DESC`).all()).results;
    const socios = (await db.prepare(`SELECT * FROM socios ORDER BY numero_socio ASC`).all()).results;
    const quotas = (await db.prepare(`SELECT * FROM quotas ORDER BY ano DESC`).all()).results;
    const contabilidade = (await db.prepare(`SELECT * FROM contabilidade ORDER BY data DESC`).all()).results;
    const updateRequests = (await db.prepare(`SELECT * FROM update_requests WHERE status = 'pendente' ORDER BY data_submissao DESC`).all()).results;

    return new Response(JSON.stringify({
        candidatos,
        socios,
        quotas,
        contabilidade,
        update_requests: updateRequests
    }), { status: 200, headers });
}

// 6. APPROVE MEMBER APPLICANT
async function handleApproveMember(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { id } = await request.json();
    if (!id) {
        return new Response(JSON.stringify({ error: "Candidate ID is required." }), { status: 400, headers });
    }

    // Retrieve candidate details
    const candidate = await db.prepare(`SELECT * FROM candidatos WHERE id = ?`).bind(id).first();
    if (!candidate) {
        return new Response(JSON.stringify({ error: "Candidate not found." }), { status: 404, headers });
    }

    // Find next sequential Member ID
    const maxSocio = await db.prepare(`SELECT MAX(numero_socio) as max_val FROM socios`).first();
    const nextSocioNum = (maxSocio.max_val || 0) + 1;
    const timestamp = new Date().toISOString().split('T')[0];

    // Insert into active members table
    await db.prepare(`
        INSERT INTO socios (
            numero_socio, nome, nif, cartao_cidadao, sexo, data_nascimento, iban, profissao, habilitacoes,
            pais, cod_postal, morada, freguesia, concelho, distrito, telemovel, telefone, email, estado, data_admissao, fotografia,
            qrz_url, rgpd_email, rgpd_sms, rgpd_imagemvideo, rgpd_audio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        nextSocioNum, candidate.nome, candidate.nif, candidate.cartao_cidadao, candidate.sexo, candidate.data_nascimento, candidate.iban, candidate.profissao, candidate.habilitacoes,
        candidate.pais, candidate.cod_postal, candidate.morada, candidate.freguesia, candidate.concelho, candidate.distrito, candidate.telemovel, candidate.telefone, candidate.email, 'Ativo', timestamp, candidate.fotografia,
        candidate.qrz_url || '',
        candidate.rgpd_email !== undefined ? candidate.rgpd_email : 1,
        candidate.rgpd_sms !== undefined ? candidate.rgpd_sms : 1,
        candidate.rgpd_imagemvideo !== undefined ? candidate.rgpd_imagemvideo : 1,
        candidate.rgpd_audio !== undefined ? candidate.rgpd_audio : 1
    ).run();

    // Get the newly created member ID
    const newSocio = await db.prepare(`SELECT id FROM socios WHERE numero_socio = ?`).bind(nextSocioNum).first();

    // Delete candidate registration
    await db.prepare(`DELETE FROM candidatos WHERE id = ?`).bind(id).run();

    // Pre-create current year quota registry as unpaid
    const currentYear = new Date().getFullYear();
    await db.prepare(`
        INSERT INTO quotas (socio_id, ano, valor, pago, data_pagamento, numero_recibo)
        VALUES (?, ?, 25.0, 0, '', '')
    `).bind(newSocio.id, currentYear).run();

    return new Response(JSON.stringify({ message: "Candidate approved as member number " + nextSocioNum }), { status: 200, headers });
}

// 7. PAY QUOTA FEE AND AUTO LOG AS REVENUE
async function handlePayQuota(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { quota_id, meio_pagamento } = await request.json();
    if (!quota_id) {
        return new Response(JSON.stringify({ error: "Quota ID is required." }), { status: 400, headers });
    }

    // Retrieve quota entry details
    const quota = await db.prepare(`SELECT * FROM quotas WHERE id = ?`).bind(quota_id).first();
    if (!quota) {
        return new Response(JSON.stringify({ error: "Quota not found." }), { status: 404, headers });
    }

    if (quota.pago === 1) {
        return new Response(JSON.stringify({ error: "Quota is already paid." }), { status: 400, headers });
    }

    // Find next receipts sequential code
    const maxRecibo = await db.prepare(`SELECT MAX(CAST(numero_recibo AS INTEGER)) as max_rec FROM quotas WHERE numero_recibo != ''`).first();
    const nextReciboNum = String((maxRecibo.max_rec || 0) + 1).padStart(4, '0');
    
    const timestamp = new Date().toISOString().split('T')[0];

    // Mark quota as paid
    await db.prepare(`
        UPDATE quotas SET pago = 1, data_pagamento = ?, numero_recibo = ? WHERE id = ?
    `).bind(timestamp, nextReciboNum, quota_id).run();

    // Get member name
    const member = await db.prepare(`SELECT nome, numero_socio FROM socios WHERE id = ?`).bind(quota.socio_id).first();

    // Register transaction entry in bookkeeping contabilidade ledger
    await db.prepare(`
        INSERT INTO contabilidade (tipo, meio_pagamento, descricao, valor, data, categoria)
        VALUES ('receita', ?, ?, ?, ?, 'Quotas')
    `).bind(
        meio_pagamento || 'banco',
        `Quota ${quota.ano} - Sócio N.º ${member.numero_socio} (${member.nome})`,
        quota.valor,
        timestamp
    ).run();

    return new Response(JSON.stringify({ 
        message: "Quota payment registered.", 
        numero_recibo: nextReciboNum, 
        data_pagamento: timestamp 
    }), { status: 200, headers });
}

// 7B. WAIVE/EXEMPT PENDING QUOTA (ADMIN ONLY)
async function handleWaiveQuota(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { quota_id } = await request.json();
    if (!quota_id) {
        return new Response(JSON.stringify({ error: "Quota ID is required." }), { status: 400, headers });
    }

    // Retrieve quota entry details
    const quota = await db.prepare(`SELECT * FROM quotas WHERE id = ?`).bind(quota_id).first();
    if (!quota) {
        return new Response(JSON.stringify({ error: "Quota not found." }), { status: 404, headers });
    }

    if (quota.pago === 1) {
        return new Response(JSON.stringify({ error: "Quota is already paid." }), { status: 400, headers });
    }
    if (quota.pago === 2) {
        return new Response(JSON.stringify({ error: "Quota is already waived/exempt." }), { status: 400, headers });
    }

    // Mark quota as waived (pago = 2)
    await db.prepare(`
        UPDATE quotas SET pago = 2, data_pagamento = NULL, numero_recibo = NULL WHERE id = ?
    `).bind(quota_id).run();

    return new Response(JSON.stringify({ message: "Quota waived/exempt successfully." }), { status: 200, headers });
}

async function handleUnwaiveQuota(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { quota_id } = await request.json();
    if (!quota_id) {
        return new Response(JSON.stringify({ error: "Quota ID is required." }), { status: 400, headers });
    }

    // Retrieve quota entry details
    const quota = await db.prepare(`SELECT * FROM quotas WHERE id = ?`).bind(quota_id).first();
    if (!quota) {
        return new Response(JSON.stringify({ error: "Quota not found." }), { status: 404, headers });
    }

    if (quota.pago !== 2) {
        return new Response(JSON.stringify({ error: "Quota is not waived/exempt." }), { status: 400, headers });
    }

    // Revert quota status to unpaid/pending (pago = 0)
    await db.prepare(`
        UPDATE quotas SET pago = 0 WHERE id = ?
    `).bind(quota_id).run();

    return new Response(JSON.stringify({ message: "Exemption reverted successfully." }), { status: 200, headers });
}

async function handleUnpayQuota(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { quota_id } = await request.json();
    if (!quota_id) {
        return new Response(JSON.stringify({ error: "Quota ID is required." }), { status: 400, headers });
    }

    // Retrieve quota entry details
    const quota = await db.prepare(`SELECT * FROM quotas WHERE id = ?`).bind(quota_id).first();
    if (!quota) {
        return new Response(JSON.stringify({ error: "Quota not found." }), { status: 404, headers });
    }

    if (quota.pago !== 1) {
        return new Response(JSON.stringify({ error: "Quota is not paid." }), { status: 400, headers });
    }

    // Get member name and number
    const member = await db.prepare(`SELECT nome, numero_socio FROM socios WHERE id = ?`).bind(quota.socio_id).first();
    if (member) {
        const descPattern = `Quota ${quota.ano} - Sócio N.º ${member.numero_socio} (${member.nome})`;
        // Delete matching transaction in bookkeeping contabilidade ledger if exists
        await db.prepare(`
            DELETE FROM contabilidade WHERE categoria = 'Quotas' AND descricao = ?
        `).bind(descPattern).run();
    }

    // Revert quota status to unpaid/pending (pago = 0)
    await db.prepare(`
        UPDATE quotas SET pago = 0, data_pagamento = '', numero_recibo = '' WHERE id = ?
    `).bind(quota_id).run();

    return new Response(JSON.stringify({ message: "Quota payment reverted successfully." }), { status: 200, headers });
}

// 8. ADD GENERAL TRANSACTION (INCOME / EXPENSE)
async function handleAddTransaction(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { tipo, meio_pagamento, descricao, valor, data, categoria } = await request.json();
    if (!tipo || !meio_pagamento || !descricao || !valor || !data || !categoria) {
        return new Response(JSON.stringify({ error: "All transaction fields are mandatory." }), { status: 400, headers });
    }

    await db.prepare(`
        INSERT INTO contabilidade (tipo, meio_pagamento, descricao, valor, data, categoria)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(tipo, meio_pagamento, descricao, parseFloat(valor), data, categoria).run();

    return new Response(JSON.stringify({ message: "Transaction logged successfully." }), { status: 200, headers });
}

// 9. REJECT AND DELETE MEMBER APPLICANT
async function handleRejectCandidate(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { id } = await request.json();
    if (!id) {
        return new Response(JSON.stringify({ error: "Candidate ID is required." }), { status: 400, headers });
    }

    await db.prepare(`DELETE FROM candidatos WHERE id = ?`).bind(id).run();

    return new Response(JSON.stringify({ message: "Candidate rejected." }), { status: 200, headers });
}

// 10. BATCH IMPORT MEMBERS
async function handleImportMembers(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { members } = await request.json();
    if (!members || !Array.isArray(members)) {
        return new Response(JSON.stringify({ error: "Missing or invalid members data." }), { status: 400, headers });
    }

    let count = 0;
    const currentYear = new Date().getFullYear();

    for (const member of members) {
        let num = member.numero_socio;
        if (!num) {
            const row = await db.prepare("SELECT MAX(numero_socio) as max_num FROM socios").first();
            num = (row && row.max_num ? row.max_num : 0) + 1;
        }

        // Check if member already exists by number to prevent duplicates
        const exists = await db.prepare("SELECT id FROM socios WHERE numero_socio = ?").bind(num).first();
        if (exists) continue; // skip

        // Insert member
        await db.prepare(`
            INSERT INTO socios (
                numero_socio, nome, nif, cartao_cidadao, sexo, data_nascimento, iban, profissao, 
                habilitacoes, pais, cod_postal, morada, freguesia, concelho, distrito, telemovel, telefone, email, estado, data_admissao, fotografia,
                qrz_url, rgpd_email, rgpd_sms, rgpd_imagemvideo, rgpd_audio
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            num, member.nome, member.nif, member.cartao_cidadao, member.sexo, member.data_nascimento, member.iban, member.profissao,
            member.habilitacoes, member.pais, member.cod_postal, member.morada, member.freguesia, member.concelho, member.distrito, 
            member.telemovel, member.telefone || '', member.email, member.estado, member.data_admissao, member.fotografia,
            member.qrz_url || '',
            member.rgpd_email !== undefined ? member.rgpd_email : 1,
            member.rgpd_sms !== undefined ? member.rgpd_sms : 1,
            member.rgpd_imagemvideo !== undefined ? member.rgpd_imagemvideo : 1,
            member.rgpd_audio !== undefined ? member.rgpd_audio : 1
        ).run();

        // Get inserted row ID to create quota
        const insertedSocio = await db.prepare("SELECT id FROM socios WHERE numero_socio = ?").bind(num).first();
        if (insertedSocio) {
            await db.prepare(`
                INSERT INTO quotas (socio_id, ano, valor, pago, data_pagamento, numero_recibo)
                VALUES (?, ?, 25.0, 0, '', '')
            `).bind(insertedSocio.id, currentYear).run();
        }

        count++;
    }

    return new Response(JSON.stringify({ message: `${count} sócios importados com sucesso.`, count }), { status: 200, headers });
}

// 11. EDIT MEMBER PROFILE
async function handleEditMember(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const data = await request.json();
    const { id, numero_socio, estado, nome, email, telemovel, nif, cartao_cidadao, morada, iban, data_admissao, fotografia, qrz_url, rgpd_email, rgpd_sms, rgpd_imagemvideo, rgpd_audio } = data;

    if (!id || !numero_socio || !estado || !nome || !email || !telemovel || !nif || !cartao_cidadao || !morada || !data_admissao) {
        return new Response(JSON.stringify({ error: "Mandatory member fields are missing." }), { status: 400, headers });
    }

    // Check if another member is already using the same member number
    const numCollision = await db.prepare(`
        SELECT id FROM socios WHERE numero_socio = ? AND id != ?
    `).bind(numero_socio, id).first();

    if (numCollision) {
        return new Response(JSON.stringify({ error: `O número de sócio ${numero_socio} já está atribuído a outro associado.` }), { status: 400, headers });
    }

    await db.prepare(`
        UPDATE socios SET 
            numero_socio = ?,
            estado = ?,
            nome = ?,
            email = ?,
            telemovel = ?,
            nif = ?,
            cartao_cidadao = ?,
            morada = ?,
            iban = ?,
            data_admissao = ?,
            fotografia = ?,
            qrz_url = ?,
            rgpd_email = ?,
            rgpd_sms = ?,
            rgpd_imagemvideo = ?,
            rgpd_audio = ?
        WHERE id = ?
    `).bind(
        numero_socio,
        estado,
        nome,
        email,
        telemovel,
        nif,
        cartao_cidadao,
        morada,
        iban || '',
        data_admissao,
        fotografia || '',
        qrz_url || '',
        rgpd_email !== undefined ? rgpd_email : 1,
        rgpd_sms !== undefined ? rgpd_sms : 1,
        rgpd_imagemvideo !== undefined ? rgpd_imagemvideo : 1,
        rgpd_audio !== undefined ? rgpd_audio : 1,
        id
    ).run();

    return new Response(JSON.stringify({ message: "Member profile updated successfully." }), { status: 200, headers });
}

// 12. DELETE MEMBER AND ASSOCIATED QUOTAS
async function handleDeleteMember(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { id } = await request.json();
    if (!id) {
        return new Response(JSON.stringify({ error: "Member ID is required." }), { status: 400, headers });
    }

    // Delete the member record
    await db.prepare(`DELETE FROM socios WHERE id = ?`).bind(id).run();

    // Delete the associated quotas for referential integrity
    await db.prepare(`DELETE FROM quotas WHERE socio_id = ?`).bind(id).run();

    return new Response(JSON.stringify({ message: "Member and associated quotas deleted successfully." }), { status: 200, headers });
}

// 13. EDIT BOOKKEEPING TRANSACTION
async function handleEditTransaction(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const data = await request.json();
    const { id, tipo, meio_pagamento, descricao, valor, categoria, data: tData } = data;

    if (!id || !tipo || !meio_pagamento || !descricao || !valor || !categoria || !tData) {
        return new Response(JSON.stringify({ error: "Mandatory transaction fields are missing." }), { status: 400, headers });
    }

    await db.prepare(`
        UPDATE contabilidade SET 
            tipo = ?,
            meio_pagamento = ?,
            descricao = ?,
            valor = ?,
            categoria = ?,
            data = ?
        WHERE id = ?
    `).bind(
        tipo,
        meio_pagamento,
        descricao,
        parseFloat(valor),
        categoria,
        tData,
        id
    ).run();

    return new Response(JSON.stringify({ message: "Transaction updated successfully." }), { status: 200, headers });
}

// 14. DELETE BOOKKEEPING TRANSACTION
async function handleDeleteTransaction(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { id } = await request.json();
    if (!id) {
        return new Response(JSON.stringify({ error: "Transaction ID is required." }), { status: 400, headers });
    }

    // Retrieve transaction details before deleting
    const transaction = await db.prepare(`SELECT * FROM contabilidade WHERE id = ?`).bind(id).first();
    if (!transaction) {
        return new Response(JSON.stringify({ error: "Transaction not found." }), { status: 404, headers });
    }

    // Revert quota status if this was a quota payment transaction
    if (transaction.categoria === 'Quotas' && transaction.descricao) {
        const match = transaction.descricao.match(/^Quota (\d{4}) - Sócio N.º (\d+)/);
        if (match) {
            const ano = parseInt(match[1]);
            const numeroSocio = parseInt(match[2]);
            const member = await db.prepare(`SELECT id FROM socios WHERE numero_socio = ?`).bind(numeroSocio).first();
            if (member) {
                await db.prepare(`
                    UPDATE quotas SET pago = 0, data_pagamento = '', numero_recibo = '' 
                    WHERE socio_id = ? AND ano = ? AND pago = 1
                `).bind(member.id, ano).run();
            }
        }
    }

    await db.prepare(`DELETE FROM contabilidade WHERE id = ?`).bind(id).run();

    return new Response(JSON.stringify({ message: "Transaction deleted successfully." }), { status: 200, headers });
}

// ==========================================================================
// 15. MEMBER PORTAL - LOGIN
// ==========================================================================
async function handleLoginSocio(request, env, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    const { credential, isMock, email: mockEmail } = await request.json();
    let email = '';

    if (isMock) {
        email = mockEmail;
    } else {
        if (!credential) {
            return new Response(JSON.stringify({ error: "Missing Google login credential token." }), { status: 400, headers });
        }

        try {
            const tokeninfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
            const response = await fetch(tokeninfoUrl);
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Invalid token response from Google verification endpoint.");
            }
            const payload = await response.json();
            
            // Check Google Client ID matches if defined
            const expectedClientId = env.GOOGLE_CLIENT_ID;
            if (expectedClientId && payload.aud !== expectedClientId) {
                return new Response(JSON.stringify({ error: "Google client ID mismatch." }), { status: 403, headers });
            }
            if (payload.email_verified !== 'true' && payload.email_verified !== true) {
                return new Response(JSON.stringify({ error: "The Google account email is not verified." }), { status: 403, headers });
            }
            email = payload.email;
        } catch (e) {
            console.error("Google token verification failed:", e);
            return new Response(JSON.stringify({ error: `Google verification failed: ${e.message}` }), { status: 401, headers });
        }
    }

    if (!email) {
        return new Response(JSON.stringify({ error: "Could not retrieve user email from Google." }), { status: 400, headers });
    }

    // Verify email is registered in 'socios' table and state is Active
    const member = await env.DB.prepare(`
        SELECT id, nome, numero_socio, estado FROM socios WHERE LOWER(email) = LOWER(?)
    `).bind(email.trim()).first();

    if (!member) {
        return new Response(JSON.stringify({ error: `O e-mail '${email}' não está associado a nenhum sócio registado na ARM. Por favor, contacte a direção.` }), { status: 403, headers });
    }

    if (member.estado !== 'Ativo') {
        return new Response(JSON.stringify({ error: "A sua conta de sócio não está ativa. Por favor, contacte a direção." }), { status: 403, headers });
    }

    // Generate random member session token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours validity

    await env.DB.prepare(`
        INSERT INTO socio_sessions (token, socio_id, expires_at) VALUES (?, ?, ?)
    `).bind(token, member.id, expiresAt).run();

    return new Response(JSON.stringify({ token, expires_at: expiresAt }), { status: 200, headers });
}

// ==========================================================================
// 15B. MEMBER PORTAL - CREDENTIALS LOGIN (N.º Sócio & NIF)
// ==========================================================================
async function handleLoginSocioCredentials(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    const { numero_socio, nif } = await request.json();

    if (!numero_socio || !nif) {
        return new Response(JSON.stringify({ error: "Número de Sócio e NIF são obrigatórios." }), { status: 400, headers });
    }

    const socioNum = parseInt(numero_socio, 10);
    if (isNaN(socioNum)) {
        return new Response(JSON.stringify({ error: "Número de Sócio inválido." }), { status: 400, headers });
    }

    const cleanInputNif = nif.toString().trim().replace(/[\s-]/g, '');
    if (!cleanInputNif) {
        return new Response(JSON.stringify({ error: "NIF inválido." }), { status: 400, headers });
    }

    // Find member by numero_socio
    const member = await db.prepare(`
        SELECT id, nif, estado FROM socios WHERE numero_socio = ?
    `).bind(socioNum).first();

    if (!member) {
        return new Response(JSON.stringify({ error: "Número de Sócio ou NIF incorreto." }), { status: 403, headers });
    }

    const cleanDbNif = (member.nif || '').toString().trim().replace(/[\s-]/g, '');
    if (cleanDbNif !== cleanInputNif) {
        return new Response(JSON.stringify({ error: "Número de Sócio ou NIF incorreto." }), { status: 403, headers });
    }

    if (member.estado !== 'Ativo') {
        return new Response(JSON.stringify({ error: "A sua conta de sócio não está ativa. Por favor, contacte a direção." }), { status: 403, headers });
    }

    // Generate random member session token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours validity

    await db.prepare(`
        INSERT INTO socio_sessions (token, socio_id, expires_at) VALUES (?, ?, ?)
    `).bind(token, member.id, expiresAt).run();

    return new Response(JSON.stringify({ token, expires_at: expiresAt }), { status: 200, headers });
}

// Helper to check member authentication
async function getAuthenticatedSocioId(request, db) {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/, '').trim();

    if (!token) return null;

    const session = await db.prepare(`
        SELECT socio_id, expires_at FROM socio_sessions WHERE token = ?
    `).bind(token).first();

    if (!session) return null;

    if (Date.now() > session.expires_at) {
        // Clean up expired session
        await db.prepare(`DELETE FROM socio_sessions WHERE token = ?`).bind(token).run();
        return null;
    }

    return session.socio_id;
}

// ==========================================================================
// 16. MEMBER PORTAL - GET PROFILE AND QUOTAS
// ==========================================================================
async function handleGetSocioData(request, db, headers) {
    const socioId = await getAuthenticatedSocioId(request, db);
    if (!socioId) {
        return new Response(JSON.stringify({ error: "Sessão inválida ou expirada." }), { status: 401, headers });
    }

    // Clean up expired sessions periodically on data fetch
    await db.prepare(`DELETE FROM socio_sessions WHERE expires_at < ?`).bind(Date.now()).run();

    // Auto-create current year quotas if missing
    await autoCreateCurrentYearQuotas(db);

    const socio = await db.prepare(`SELECT * FROM socios WHERE id = ?`).bind(socioId).first();
    const quotas = (await db.prepare(`SELECT * FROM quotas WHERE socio_id = ? ORDER BY ano DESC`).bind(socioId).all()).results;

    return new Response(JSON.stringify({ socio, quotas }), { status: 200, headers });
}

// ==========================================================================
// 17. MEMBER PORTAL - UPDATE PROFILE REQUEST (PENDING DIRECTION APPROVAL)
// ==========================================================================
async function handleUpdateSocioProfile(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    const socioId = await getAuthenticatedSocioId(request, db);
    if (!socioId) {
        return new Response(JSON.stringify({ error: "Sessão inválida ou expirada." }), { status: 401, headers });
    }

    // Dynamic schema creation safety net
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS update_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            socio_id INTEGER,
            numero_socio INTEGER,
            nome TEXT,
            dados TEXT,
            status TEXT DEFAULT 'pendente',
            data_submissao TEXT
        );
    `).run();

    const bodyData = await request.json();

    // Check if the member exists
    const member = await db.prepare(`SELECT nome, numero_socio FROM socios WHERE id = ?`).bind(socioId).first();
    if (!member) {
        return new Response(JSON.stringify({ error: "Sócio não encontrado." }), { status: 404, headers });
    }

    const timestamp = new Date().toISOString().split('T')[0];

    // Insert pending update request instead of modifying socio details directly
    await db.prepare(`
        INSERT INTO update_requests (socio_id, numero_socio, nome, dados, status, data_submissao)
        VALUES (?, ?, ?, ?, 'pendente', ?)
    `).bind(socioId, member.numero_socio, member.nome, JSON.stringify(bodyData), timestamp).run();

    return new Response(JSON.stringify({ message: "Pedido de atualização submetido à direção com sucesso." }), { status: 200, headers });
}

// ==========================================================================
// 18. UPDATE PROFILE REQUESTS (ADMIN ACTIONS)
// ==========================================================================
async function handleApproveUpdateRequest(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { request_id } = await request.json();
    if (!request_id) {
        return new Response(JSON.stringify({ error: "Request ID is required." }), { status: 400, headers });
    }

    const updateReq = await db.prepare(`SELECT * FROM update_requests WHERE id = ?`).bind(request_id).first();
    if (!updateReq) {
        return new Response(JSON.stringify({ error: "Request not found." }), { status: 404, headers });
    }

    const dados = JSON.parse(updateReq.dados);

    // Apply updates to the member record
    await db.prepare(`
        UPDATE socios SET
            telemovel = ?, telefone = ?, email = ?, iban = ?,
            profissao = ?, habilitacoes = ?, nif = ?, cartao_cidadao = ?,
            morada = ?, cod_postal = ?, freguesia = ?, concelho = ?,
            distrito = ?, pais = ?, fotografia = ?, qrz_url = ?,
            rgpd_email = ?, rgpd_sms = ?, rgpd_imagemvideo = ?, rgpd_audio = ?
        WHERE id = ?
    `).bind(
        dados.telemovel, dados.telefone, dados.email, dados.iban,
        dados.profissao, dados.habilitacoes, dados.nif, dados.cartao_cidadao,
        dados.morada, dados.cod_postal, dados.freguesia, dados.concelho,
        dados.distrito, dados.pais, dados.fotografia, dados.qrz_url || '',
        dados.rgpd_email !== undefined ? dados.rgpd_email : 1,
        dados.rgpd_sms !== undefined ? dados.rgpd_sms : 1,
        dados.rgpd_imagemvideo !== undefined ? dados.rgpd_imagemvideo : 1,
        dados.rgpd_audio !== undefined ? dados.rgpd_audio : 1,
        updateReq.socio_id
    ).run();

    // Mark update request as approved
    await db.prepare(`UPDATE update_requests SET status = 'aprovado' WHERE id = ?`).bind(request_id).run();

    return new Response(JSON.stringify({ message: "Sócio profile updated successfully." }), { status: 200, headers });
}

async function handleRejectUpdateRequest(request, db, headers) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
    }

    if (!(await isAuthenticated(request, db))) {
        return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers });
    }

    const { request_id } = await request.json();
    if (!request_id) {
        return new Response(JSON.stringify({ error: "Request ID is required." }), { status: 400, headers });
    }

    await db.prepare(`UPDATE update_requests SET status = 'rejeitado' WHERE id = ?`).bind(request_id).run();

    return new Response(JSON.stringify({ message: "Update request rejected." }), { status: 200, headers });
}

async function autoCreateCurrentYearQuotas(db) {
    const currentYear = new Date().getFullYear();
    const activeMembers = (await db.prepare(`SELECT id FROM socios WHERE estado = 'Ativo'`).all()).results;
    if (activeMembers && activeMembers.length > 0) {
        for (const m of activeMembers) {
            const existing = await db.prepare(`SELECT id FROM quotas WHERE socio_id = ? AND ano = ?`).bind(m.id, currentYear).first();
            if (!existing) {
                await db.prepare(`
                    INSERT INTO quotas (socio_id, ano, valor, pago, data_pagamento, numero_recibo)
                    VALUES (?, ?, 25.0, 0, '', '')
                `).bind(m.id, currentYear).run();
            }
        }
    }
}


