const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 8093);
const PIN = String(process.env.GOVO_ADMIN_PIN || '');
const ASSET_DIR = '/var/www/assets';
const DATA_DIR = '/var/www/govo-data';
const INV_FILE = path.join(ASSET_DIR, 'govo-inventory.json');
const LEADS_FILE = path.join(DATA_DIR, 'govo-leads.jsonl');

function send(res, code, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,x-govo-pin'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(new Error('invalid json')); }
    });
  });
}

function safeText(v, max = 500) {
  return String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
}

function requirePin(req) {
  const url = new URL(req.url, 'http://localhost');
  const got = req.headers['x-govo-pin'] || url.searchParams.get('pin') || '';
  return PIN && String(got) === PIN;
}

function ensureFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(INV_FILE)) {
    fs.writeFileSync(INV_FILE, JSON.stringify({
      version: 'phase6b-inventory-api',
      brand: 'GOVO Express',
      tagline: "WHEREVER YOU ARE, WE'RE THERE.",
      areas: ['Meherpur','Gangni','Bamundi','Mujibnagar','Amjhupi'],
      shops: [],
      services: []
    }, null, 2));
  }
  if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, '');
}

function loadInventory() {
  ensureFiles();
  return JSON.parse(fs.readFileSync(INV_FILE, 'utf8'));
}

function saveInventory(inv) {
  inv.updatedAt = new Date().toISOString();
  fs.writeFileSync(INV_FILE, JSON.stringify(inv, null, 2));
}

function normalizeItem(item, kind) {
  const idBase = kind + '-' + Date.now();
  return {
    id: safeText(item.id || idBase, 80),
    name: safeText(item.name, 120),
    area: safeText(item.area || 'Meherpur', 80),
    category: safeText(item.category || (kind === 'shop' ? 'Shop' : 'Service'), 100),
    status: safeText(item.status || 'active', 40),
    description: safeText(item.description || item.details || '', 700),
    cta: safeText(item.cta || (kind === 'shop' ? 'Order now' : 'Book now'), 80),
    createdAt: item.createdAt || new Date().toISOString()
  };
}

function appendLead(req, body) {
  const lead = {
    id: 'lead-' + Date.now(),
    createdAt: new Date().toISOString(),
    ip: safeText((req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0], 80),
    type: safeText(body.type || body.kind || 'customer', 40),
    name: safeText(body.name, 120),
    phone: safeText(body.phone, 80),
    area: safeText(body.area || 'Meherpur', 80),
    details: safeText(body.details || body.description || '', 900),
    raw: body
  };
  fs.appendFileSync(LEADS_FILE, JSON.stringify(lead) + '\n');
  return lead;
}

function readLeads(limit = 100) {
  ensureFiles();
  const lines = fs.readFileSync(LEADS_FILE, 'utf8').split('\n').filter(Boolean);
  return lines.slice(-limit).map(x => {
    try { return JSON.parse(x); } catch { return null; }
  }).filter(Boolean).reverse();
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'OPTIONS') return send(res, 204, { ok: true });
    if (url.pathname === '/health') return send(res, 200, { ok: true, service: 'govo-inventory-api', time: new Date().toISOString() });

    if (url.pathname === '/api/govo-inventory' && req.method === 'GET') {
      return send(res, 200, loadInventory());
    }

    if (url.pathname === '/api/govo-inventory' && req.method === 'POST') {
      if (!requirePin(req)) return send(res, 401, { ok: false, error: 'Invalid admin PIN' });

      const body = await readBody(req);
      const inv = loadInventory();

      if (body.action === 'add') {
        const kind = body.kind === 'service' ? 'service' : 'shop';
        const key = kind === 'service' ? 'services' : 'shops';
        const item = normalizeItem(body.item || body, kind);
        inv[key] = Array.isArray(inv[key]) ? inv[key] : [];
        inv[key].push(item);
        saveInventory(inv);
        return send(res, 200, { ok: true, added: item, inventory: inv });
      }

      if (body.action === 'replace' && body.inventory) {
        saveInventory(body.inventory);
        return send(res, 200, { ok: true, inventory: body.inventory });
      }

      return send(res, 400, { ok: false, error: 'Unknown action' });
    }

    if (url.pathname === '/api/govo-leads' && req.method === 'POST') {
      const body = await readBody(req);
      const lead = appendLead(req, body);
      return send(res, 200, { ok: true, lead });
    }

    if (url.pathname === '/api/govo-leads' && req.method === 'GET') {
      if (!requirePin(req)) return send(res, 401, { ok: false, error: 'Invalid admin PIN' });
      return send(res, 200, { ok: true, leads: readLeads(100) });
    }

    send(res, 404, { ok: false, error: 'Not found' });
  } catch (e) {
    send(res, 500, { ok: false, error: e.message || 'server error' });
  }
});

ensureFiles();
server.listen(PORT, '127.0.0.1', () => {
  console.log(`GOVO inventory API listening on 127.0.0.1:${PORT}`);
});
