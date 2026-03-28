/* ══════════════════════════════════════════════════════════════
   WELL CLINIC CENTRAL — CLIENTE API
   Comunicação com Apps Script (POST/GET), retry e offline
   ══════════════════════════════════════════════════════════════ */

window.WC = window.WC || {};

WC.api = {

  // ── POST genérico para Apps Script ──
  async post(url, data, options = {}) {
    const timeout = options.timeout || 30000;
    const retries = options.retries || 1;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data),
          signal: controller.signal,
          redirect: 'follow'
        });

        clearTimeout(timer);

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return await resp.json();

      } catch (e) {
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw e;
      }
    }
  },

  // ── GET genérico (para endpoints admin/dashboard) ──
  async get(url, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const fullUrl = qs ? `${url}?${qs}` : url;

    const resp = await fetch(fullUrl, { redirect: 'follow' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const text = await resp.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  },

  // ── POST com sessão (adiciona token automaticamente) ──
  async postAuth(url, data) {
    const session = WC.auth.getSession();
    if (session && session.token) {
      data.session_token = session.token;
    }
    return this.post(url, data);
  },

  // ── Fila offline (para dados que não podem se perder) ──
  _offlineQueue: [],

  queueOffline(url, data) {
    this._offlineQueue.push({ url, data, ts: Date.now() });
    this._saveQueue();
    WC.ui.toast('Sem conexão. Dados salvos para envio automático.', 'info');
  },

  async flushQueue() {
    if (this._offlineQueue.length === 0) return;

    const pending = [...this._offlineQueue];
    this._offlineQueue = [];

    for (const item of pending) {
      try {
        await this.post(item.url, item.data);
      } catch (e) {
        this._offlineQueue.push(item);
      }
    }

    this._saveQueue();

    if (this._offlineQueue.length === 0 && pending.length > 0) {
      WC.ui.toast('Dados pendentes enviados com sucesso!', 'success');
    }
  },

  _saveQueue() {
    if (this._offlineQueue.length > 0) {
      localStorage.setItem('wc_offline_queue', JSON.stringify(this._offlineQueue));
    } else {
      localStorage.removeItem('wc_offline_queue');
    }
  },

  _loadQueue() {
    try {
      const raw = localStorage.getItem('wc_offline_queue');
      if (raw) this._offlineQueue = JSON.parse(raw);
    } catch (e) { /* ignore */ }
  },

  // Inicializar: carregar fila e tentar enviar quando online
  init() {
    this._loadQueue();
    window.addEventListener('online', () => this.flushQueue());
    if (navigator.onLine) this.flushQueue();
  }
};
