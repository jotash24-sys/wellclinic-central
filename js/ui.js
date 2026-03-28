/* ══════════════════════════════════════════════════════════════
   WELL CLINIC CENTRAL — COMPONENTES UI
   Toast, loading, modais, utilitários visuais
   ══════════════════════════════════════════════════════════════ */

window.WC = window.WC || {};

WC.ui = {

  // ── Toast notification ──
  toast(msg, type = 'success', duration = 4000) {
    let container = document.getElementById('wcToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'wcToastContainer';
      container.className = 'wc-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `wc-toast wc-toast--${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) container.remove();
    }, duration);
  },

  // ── Loading overlay ──
  showLoading(text) {
    const el = document.getElementById('wcLoading');
    if (!el) return;
    if (text) {
      const t = el.querySelector('.wc-loading__text');
      if (t) t.textContent = text;
    }
    el.classList.remove('hide');
  },

  hideLoading() {
    const el = document.getElementById('wcLoading');
    if (el) el.classList.add('hide');
  },

  // ── Modal bottom-sheet ──
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  },

  // ── Formatar data brasileira ──
  formatDate(date) {
    if (!date) date = new Date();
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  },

  formatDateShort(date) {
    if (!date) date = new Date();
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString('pt-BR');
  },

  formatTime(date) {
    if (!date) date = new Date();
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },

  // ── Capitalizar primeira letra ──
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // ── Remover acentos (para matching) ──
  stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  },

  // ── Renderizar hero padrão ──
  renderHero(opts = {}) {
    return `
      <div class="wc-hero">
        <div class="wc-hero-top">
          <a href="${WC.config.BASE_URL}" class="wc-hero-brand">
            <span class="brand-icon" style="background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:16px;">🏥</span>
            Well Clinic Central
          </a>
          ${opts.rightLink ? `<a href="${opts.rightLink.url}" class="wc-hero-link">${opts.rightLink.text} →</a>` : ''}
          ${opts.rightAction ? `<button onclick="${opts.rightAction.onclick}" class="wc-hero-link" style="background:none;border:none;cursor:pointer;">${opts.rightAction.text}</button>` : ''}
        </div>
        <div class="wc-hero-title">${opts.title || ''}</div>
        ${opts.subtitle ? `<div class="wc-hero-subtitle">${opts.subtitle}</div>` : ''}
        ${opts.badge ? `<div style="margin-top:8px;"><span class="wc-badge wc-badge--${opts.badge.type || 'success'}"><span class="wc-badge__dot"></span> ${opts.badge.text}</span></div>` : ''}
      </div>
    `;
  },

  // ── Signature canvas setup ──
  setupSignature(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasSigned = false;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 150;
      ctx.strokeStyle = '#0F1F3A';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
    resize();

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      hasSigned = true;
    }

    function stopDraw() { isDrawing = false; }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    return {
      clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasSigned = false;
      },
      hasSigned() { return hasSigned; },
      toDataURL() { return canvas.toDataURL('image/png'); },
      resize
    };
  },

  // ── Renderizar loading + login + register padrão ──
  renderAuthOverlays() {
    return `
      <!-- Loading -->
      <div class="wc-loading" id="wcLoading">
        <div class="wc-loading__spinner"></div>
        <div class="wc-loading__text">Carregando...</div>
      </div>

      <!-- Login -->
      <div class="wc-login" id="wcLogin">
        <div class="wc-login__box">
          <div style="font-size:32px;margin-bottom:12px;">🏥</div>
          <div class="wc-login__title">Well Clinic</div>
          <div class="wc-login__subtitle">Central Operacional</div>
          <div class="wc-form-group">
            <input type="email" id="loginEmail" class="wc-input" placeholder="Seu e-mail" autocomplete="email">
          </div>
          <div class="wc-form-group">
            <input type="password" id="loginPin" class="wc-input" placeholder="Sua senha (PIN)" autocomplete="current-password" inputmode="numeric">
          </div>
          <button class="wc-btn wc-btn--primary wc-btn--full wc-btn--lg" id="btnLogin">Entrar</button>
          <div id="loginError" class="wc-text-sm wc-mt-8" style="color:var(--vermelho);display:none;"></div>
          <div class="wc-text-sm wc-text-muted wc-mt-16">Primeiro acesso? Verifique seu e-mail para o convite.</div>
        </div>
      </div>

      <!-- Registro (primeiro acesso) -->
      <div class="wc-register" id="wcRegister">
        <div class="wc-login__box">
          <div style="font-size:32px;margin-bottom:12px;">👋</div>
          <div class="wc-login__title">Bem-vindo!</div>
          <div class="wc-login__subtitle" id="registerSubtitle">Configure seu acesso</div>
          <div class="wc-form-group">
            <label class="wc-label">Como quer ser chamado?</label>
            <input type="text" id="registerApelido" class="wc-input" placeholder="Ex: Jonatã, Dra. Jaque, Gabi...">
          </div>
          <div class="wc-form-group">
            <label class="wc-label">Crie uma senha (4+ dígitos)</label>
            <input type="password" id="registerPin" class="wc-input" placeholder="Sua senha" inputmode="numeric">
          </div>
          <div class="wc-form-group">
            <label class="wc-label">Confirme a senha</label>
            <input type="password" id="registerPinConfirm" class="wc-input" placeholder="Repita a senha" inputmode="numeric">
          </div>
          <button class="wc-btn wc-btn--primary wc-btn--full wc-btn--lg" id="btnRegister">Criar Acesso</button>
          <div id="registerError" class="wc-text-sm wc-mt-8" style="color:var(--vermelho);display:none;"></div>
        </div>
      </div>

      <!-- Toast container -->
      <div class="wc-toast-container" id="wcToastContainer"></div>
    `;
  },

  // ── Bind dos eventos de login/registro ──
  bindAuthEvents(onSuccess) {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');

    if (btnLogin) {
      btnLogin.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value;
        const pin = document.getElementById('loginPin').value;
        const errEl = document.getElementById('loginError');

        if (!email || !pin) {
          errEl.textContent = 'Preencha e-mail e senha.';
          errEl.style.display = 'block';
          return;
        }

        btnLogin.disabled = true;
        btnLogin.textContent = 'Entrando...';
        errEl.style.display = 'none';

        try {
          const session = await WC.auth.login(email, pin);
          // Após login: ir para o portal (hub)
          window.location.href = WC.config.BASE_URL;
        } catch (e) {
          errEl.textContent = e.message || 'Erro ao fazer login.';
          errEl.style.display = 'block';
          btnLogin.disabled = false;
          btnLogin.textContent = 'Entrar';
        }
      });

      // Enter no PIN faz login
      document.getElementById('loginPin')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnLogin.click();
      });
    }

    if (btnRegister) {
      btnRegister.addEventListener('click', async () => {
        const apelido = document.getElementById('registerApelido').value.trim();
        const pin = document.getElementById('registerPin').value;
        const confirm = document.getElementById('registerPinConfirm').value;
        const errEl = document.getElementById('registerError');
        const params = new URLSearchParams(window.location.search);
        const inviteToken = params.get('invite');

        if (!pin || pin.length < 4) {
          errEl.textContent = 'A senha deve ter pelo menos 4 caracteres.';
          errEl.style.display = 'block';
          return;
        }

        if (pin !== confirm) {
          errEl.textContent = 'As senhas não coincidem.';
          errEl.style.display = 'block';
          return;
        }

        btnRegister.disabled = true;
        btnRegister.textContent = 'Criando...';
        errEl.style.display = 'none';

        try {
          const result = await WC.auth.setPin(inviteToken, pin, apelido);
          if (result.status !== 'ok') throw new Error(result.msg);

          WC.ui.toast('Acesso criado! Faça login para continuar.', 'success');
          document.getElementById('wcRegister').classList.remove('show');
          document.getElementById('wcLogin').classList.add('show');

          // Pré-preencher email se veio no convite
          if (result.email) {
            document.getElementById('loginEmail').value = result.email;
            document.getElementById('loginPin').focus();
          }
        } catch (e) {
          errEl.textContent = e.message || 'Erro ao criar acesso.';
          errEl.style.display = 'block';
          btnRegister.disabled = false;
          btnRegister.textContent = 'Criar Acesso';
        }
      });
    }
  }
};
