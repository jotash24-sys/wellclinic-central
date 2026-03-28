/* ══════════════════════════════════════════════════════════════
   WELL CLINIC CENTRAL — AUTENTICAÇÃO
   Login, sessão, registro e validação
   ══════════════════════════════════════════════════════════════ */

window.WC = window.WC || {};

WC.auth = {

  // ── Obter sessão do localStorage ──
  getSession() {
    try {
      const raw = localStorage.getItem(WC.config.SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // ── Salvar sessão ──
  saveSession(data) {
    localStorage.setItem(WC.config.SESSION_KEY, JSON.stringify(data));
  },

  // ── Limpar sessão ──
  clearSession() {
    localStorage.removeItem(WC.config.SESSION_KEY);
  },

  // ── Dados do usuário logado ──
  getUser() {
    const s = this.getSession();
    if (!s) return null;
    // Compatibilidade: user pode estar no root ou em .user
    return s.user || { nome: s.nome, email: s.email, perfil: s.perfil, cargo: s.cargo, equipe: s.equipe, apelido: s.apelido };
  },

  // ── Nome de exibição ──
  getDisplayName() {
    const u = this.getUser();
    if (!u) return '';
    return u.apelido || u.nome || '';
  },

  // ── Verificar perfil ──
  hasProfile(perfis) {
    const u = this.getUser();
    if (!u) return false;
    if (typeof perfis === 'string') perfis = [perfis];
    return perfis.includes(u.perfil);
  },

  // ── Login (email + PIN) ──
  async login(email, pin) {
    const resp = await WC.api.post(WC.config.API_GASES, {
      tipo_registro: 'login',
      email: email.trim().toLowerCase(),
      pin: pin.trim()
    });

    if (resp.status !== 'ok') {
      throw new Error(resp.msg || 'Credenciais inválidas');
    }

    // Montar sessão padronizada
    const session = {
      token: resp.session_token,
      expires_at: resp.expires_at,
      nome: resp.user.nome,
      user: {
        nome: resp.user.nomeCompleto || resp.user.nome,
        apelido: resp.user.apelido || resp.user.nome,
        email: resp.user.email,
        cargo: resp.user.cargo,
        equipe: resp.user.equipe,
        perfil: resp.user.perfil
      },
      perfil: resp.user.perfil
    };

    this.saveSession(session);
    return session;
  },

  // ── Validar sessão com o backend ──
  async validateSession() {
    const session = this.getSession();
    if (!session || !session.token) return false;

    try {
      const resp = await WC.api.post(WC.config.API_GASES, {
        tipo_registro: 'validar_sessao',
        session_token: session.token
      });

      if (resp.status === 'ok') {
        // Atualizar dados do usuário se vieram novos
        if (resp.user) {
          session.user = {
            nome: resp.user.nomeCompleto || resp.user.nome,
            apelido: resp.user.apelido || session.user?.apelido || resp.user.nome,
            email: resp.user.email,
            cargo: resp.user.cargo,
            equipe: resp.user.equipe,
            perfil: resp.user.perfil
          };
          session.nome = resp.user.apelido || resp.user.nome;
          session.perfil = resp.user.perfil;
          this.saveSession(session);
        }
        return true;
      }
      return false;
    } catch (e) {
      // Falha de rede: confiar na sessão local
      console.warn('Validação de sessão falhou (rede). Confiando na sessão local.');
      return true;
    }
  },

  // ── Buscar info de convite (para primeiro acesso) ──
  async getInviteInfo(token) {
    return await WC.api.post(WC.config.API_GASES, {
      tipo_registro: 'get_invite_info',
      invite_token: token
    });
  },

  // ── Definir PIN (primeiro acesso) ──
  async setPin(inviteToken, pin, apelido) {
    return await WC.api.post(WC.config.API_GASES, {
      tipo_registro: 'set_pin',
      invite_token: inviteToken,
      new_pin: pin,
      apelido: apelido || ''
    });
  },

  // ── Logout ──
  logout() {
    this.clearSession();
    window.location.href = WC.config.BASE_URL;
  },

  // ── Inicialização padrão de qualquer página protegida ──
  // Retorna: { authenticated, session, redirectToLogin }
  async init(options = {}) {
    const loading = document.getElementById('wcLoading');
    const loginOverlay = document.getElementById('wcLogin');
    const registerOverlay = document.getElementById('wcRegister');

    // 1. Verificar se é registro (primeiro acesso via convite)
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('invite');
    if (inviteToken && registerOverlay) {
      if (loading) loading.classList.add('hide');
      registerOverlay.classList.add('show');
      return { authenticated: false, registration: true, inviteToken };
    }

    // 2. Validar sessão existente
    const isValid = await this.validateSession();
    if (loading) loading.classList.add('hide');

    if (isValid) {
      return { authenticated: true, session: this.getSession() };
    }

    // 3. Sem sessão válida: mostrar login
    if (loginOverlay) loginOverlay.classList.add('show');
    return { authenticated: false };
  }
};
