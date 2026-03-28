/* ══════════════════════════════════════════════════════════════
   WELL CLINIC CENTRAL — CONFIGURAÇÃO
   URLs, constantes e mapeamentos do sistema
   ══════════════════════════════════════════════════════════════ */

window.WC = window.WC || {};

WC.config = {
  // ── APIs ──
  API_GASES: 'https://script.google.com/macros/s/AKfycbyJqDDH8h5gaybLSk1v11-JOYL-FMvHot1BI9fq1mo5JBMWGyY4E6pG3J7ydN9SWMDUiA/exec',
  API_CHECKLIST: 'https://script.google.com/macros/s/AKfycbzAEfzJP8hpnPkWQJDqXtIqeDRLlOu74OKwwtDAXW5DRt257a1XvntsGs4ZMyvwCemT/exec',

  // ── URLs do sistema ──
  BASE_URL: 'https://jotash24-sys.github.io/wellclinic-central',

  // ── Sessão ──
  SESSION_KEY: 'wc_session',
  SESSION_DURATION_DAYS: 365,

  // ── Módulos disponíveis ──
  MODULES: {
    gases:     { title: 'Controle de Gases',   icon: '🫁', page: 'gases.html',     color: 'verde' },
    checklist: { title: 'Checklist do Dia',     icon: '✅', page: 'checklist.html',  color: 'dourado' },
    dashboard: { title: 'Dashboard',            icon: '📊', page: 'dashboard.html',  color: 'azul', perfil: ['gestor'] },
    // Futuros módulos:
    // entregas:   { title: 'Controle de Entregas', icon: '📦', page: 'entregas.html',   color: 'dourado' },
    // financeiro: { title: 'Financeiro',           icon: '💰', page: 'financeiro.html',  color: 'verde', perfil: ['gestor'] },
    // ponto:      { title: 'Controle de Ponto',    icon: '🕐', page: 'ponto.html',       color: 'azul' },
  },

  // ── Cilindros (inventário padrão) ──
  CILINDROS: [
    { id: 'O2-10-A', tipo: 'Oxigênio',       capacidade: '10m³' },
    { id: 'O2-10-B', tipo: 'Oxigênio',       capacidade: '10m³' },
    { id: 'O2-10-C', tipo: 'Oxigênio',       capacidade: '10m³' },
    { id: 'O2-10-D', tipo: 'Oxigênio',       capacidade: '10m³' },
    { id: 'O2-1.5-A', tipo: 'Oxigênio',      capacidade: '1,5m³' },
    { id: 'O2-1.5-B', tipo: 'Oxigênio',      capacidade: '1,5m³' },
    { id: 'N2O-33-A', tipo: 'Óxido Nitroso', capacidade: '33kg' },
    { id: 'N2O-33-B', tipo: 'Óxido Nitroso', capacidade: '33kg' },
    { id: 'N2O-33-C', tipo: 'Óxido Nitroso', capacidade: '33kg' },
    { id: 'N2O-33-D', tipo: 'Óxido Nitroso', capacidade: '33kg' },
    { id: 'N2O-7-A', tipo: 'Óxido Nitroso',  capacidade: '7kg' },
    { id: 'N2O-7-B', tipo: 'Óxido Nitroso',  capacidade: '7kg' },
  ],

  // ── Mapa de contingência por dia da semana ──
  CONTINGENCIA: {
    0: 'Jonatã',    // Domingo
    1: 'Jonatã',    // Segunda
    2: 'Gabriela',  // Terça
    3: 'Siegfried',  // Quarta
    4: 'Henrique',   // Quinta
    5: 'Gabriela',  // Sexta
    6: 'Jonatã',    // Sábado
  },

  // ── Tipos de gás para NF ──
  TIPOS_GAS_NF: [
    'Óxido Nitroso — 33kg',
    'Óxido Nitroso — 7kg',
    'Oxigênio — 10m³',
    'Oxigênio — 1,5m³',
  ],
};
