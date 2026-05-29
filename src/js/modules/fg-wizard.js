import { fgState, $ } from './fg-state.js';
import { FG_MODELS } from '../data/fg-models.js';
import { renderFg } from './fg-render.js';

const ENV_LABELS   = { filial:"Filial / SOHO", campus:"Campus / Sede", datacenter:"Data Center / Operadora" };
const SCALE_LABELS = {
  compact:"Compacto (FW ≤ 10 Gbps)", medium:"Médio (FW 10–40 Gbps)",
  high:"Alto (FW 100–600 Gbps)", vhigh:"Muito alto (FW 600+ Gbps)"
};

const SCALE_OPTS = {
  filial:      [["compact","Compacto (FW ≤ 10 Gbps)","Desktop, baixo throughput, filiais pequenas a médias"],
                ["medium", "Médio (FW 10–40 Gbps)",  "Desktop de alta capacidade ou 1U para filiais maiores"]],
  campus:      [["medium", "Médio (FW até 40 Gbps)", "1U, NGFW focado, sedes SMB e mid-range"],
                ["high",   "Alto (FW 100+ Gbps)",    "1-2U rackmount, alta inspeção, sedes corporativas"]],
  datacenter:  [["high",   "Alto (FW 100–600 Gbps)", "2U, interfaces 25GE/100GE, DC primário"],
                ["vhigh",  "Muito alto (FW 600+ Gbps)","3U+, hiperescala, carrier-grade, chassis"]],
};

const TREE = {
  filial: {
    compact: [
      { label:"Desktop básico, FW ≤ 5 Gbps",       sub:"30G / 40F — até 700 K sessões, variante Wi-Fi disponível", models:["FG-30G","FG-40F"] },
      { label:"Inspeção SSL aprimorada",             sub:"50G / 60F — SSL Inspect 1,3 Gbps, IPS 2,25 Gbps",         models:["FG-50G","FG-60F"] },
      { label:"VPN SSL ativa na filial",             sub:"70F / 80F — SSL VPN 405–950 Mbps, até 200 usuários",      models:["FG-70F","FG-80F"] },
    ],
    medium: [
      { label:"Desktop 28 Gbps FW, 3 M sessões",    sub:"90G — 2x 10GE uplinks, VPN SSL 1,4 Gbps",                 models:["FG-90G"] },
      { label:"1U 39 Gbps, NGFW 3 Gbps",            sub:"120G — Dual PSU, gerencia 48 FortiSwitches",              models:["FG-120G"] },
      { label:"1U 39 Gbps, NGFW 7 Gbps, 11 M sess.",sub:"200G — 10GE SFP+ e 5GE RJ45, maior capacidade",          models:["FG-200G"] },
    ],
  },
  campus: {
    medium: [
      { label:"Sede até 40 Gbps FW, NGFW 3–7 Gbps", sub:"120G / 200G — 1U, Dual PSU, SFP+",                       models:["FG-120G","FG-200G"] },
      { label:"Sede com NGFW 14 Gbps, portas 25GE",  sub:"400G — 1U, 164 Gbps FW, 512 FortiAPs",                  models:["FG-400G"] },
      { label:"Sede com NGFW 29–31 Gbps",            sub:"700G / 900G — 1U, maior inspeção SSL, 50 K políticas",   models:["FG-700G","FG-900G"] },
    ],
    high: [
      { label:"HQ 198 Gbps FW, uplinks 100GE",      sub:"1000F / 1800F — 2U, NGFW 15–17 Gbps, 100 K políticas",  models:["FG-1000F","FG-1800F"] },
      { label:"HQ alta inspeção NGFW 27 Gbps",       sub:"2600F — 2U, SSL VPN 16 Gbps para 30 K usuários",        models:["FG-2600F"] },
      { label:"HQ grande, 397 Gbps FW NP8",          sub:"3000F / 3000G — 2U, NGFW 34–85 Gbps",                   models:["FG-3000F","FG-3000G"] },
    ],
  },
  datacenter: {
    high: [
      { label:"DC 387–595 Gbps, 25GE / 100GE",      sub:"3000F / 3200F / 3500F — 2U, NGFW 34–65 Gbps",           models:["FG-3000F","FG-3200F","FG-3500F"] },
      { label:"DC nova geração NP8, NGFW 85–115 G",  sub:"3000G / 3500G — alta inspeção SSL, 400GE disponível",   models:["FG-3000G","FG-3500G"] },
      { label:"DC ultra-baixa latência ou 795 Gbps", sub:"3700F (1,45 µs ULL) / 3800G (NGFW 210 Gbps, 4 PSUs)",  models:["FG-3700F","FG-3800G"] },
    ],
    vhigh: [
      { label:"Hiperescala 800 Gbps – 3,1 Tbps FW", sub:"4200F / 4400F / 4800F — 3–4U, interfaces 400GE",        models:["FG-4200F","FG-4400F","FG-4800F"] },
      { label:"Chassis ISP/Core 1,89 Tbps FW",       sub:"7081F — 12U, NGFW 330 Gbps, IPS 405 Gbps, 6 PSUs",     models:["FG-7081F"] },
      { label:"Chassis máxima capacidade",            sub:"7121F — 16U, NGFW 550 Gbps, IPS 675 Gbps, 8 PSUs",     models:["FG-7121F"] },
    ],
  },
};

const wiz = { env: null, scale: null, conn: null };
const ORDER = ["env", "scale", "conn"];

function optBtn(step, val, label, sub) {
  return `<button class="wopt" data-step="${step}" data-val="${val}">
    <span class="wopt-main">${label}</span>
    ${sub ? `<span class="wopt-sub">${sub}</span>` : ""}
    <span class="wopt-arrow">→</span>
  </button>`;
}

function stepBlock(q, opts) {
  return `<div class="wstep active"><div class="wstep-q">${q}</div><div class="wopts">${opts.join("")}</div></div>`;
}

function answered(step, q, value) {
  return `<div class="wstep done">
    <div class="wstep-q">${q}</div>
    <div class="wstep-a"><span>${value}</span><button class="wedit" data-edit="${step}">alterar</button></div>
  </div>`;
}

export function renderFgWizard() {
  const w = $("fg-wizard");
  let html = `<div class="wiz-head"><h3>Assistente de seleção</h3><p>Responda e receba recomendações.</p></div>`;

  if (wiz.env) {
    html += answered("env", "Que tipo de implantação?", ENV_LABELS[wiz.env]);
  } else {
    w.innerHTML = html + stepBlock("Que tipo de implantação?", [
      optBtn("env","filial",    "Filial / SOHO",          "Escritórios remotos e pequenas empresas"),
      optBtn("env","campus",    "Campus / Sede",           "Sedes corporativas, campus universitários"),
      optBtn("env","datacenter","Data Center / Operadora", "DC, ISP, carrier e hiperescala"),
    ]); return;
  }

  const scaleOpts = SCALE_OPTS[wiz.env];
  if (wiz.scale) {
    html += answered("scale", "Throughput de Firewall necessário?", SCALE_LABELS[wiz.scale]);
  } else {
    w.innerHTML = html + stepBlock("Qual o throughput de Firewall necessário?",
      scaleOpts.map(([v, l, s]) => optBtn("scale", v, l, s)));
    return;
  }

  const connOpts = TREE[wiz.env][wiz.scale];
  if (wiz.conn != null) {
    html += answered("conn", "Cenário de conectividade", connOpts[wiz.conn].label);
    html += `<button class="wiz-restart" id="fg-wizRestartBtn">↺ Recomeçar</button>`;
  } else {
    html += stepBlock("Qual é o cenário de conectividade?",
      connOpts.map((o, i) => optBtn("conn", i, o.label, o.sub)));
  }
  w.innerHTML = html;
}

export function setFgWiz(key, val) {
  const idx = ORDER.indexOf(key);
  ORDER.slice(idx).forEach(k => wiz[k] = null);
  wiz[key] = key === "conn" ? +val : val;
  if (key === "conn") {
    fgState.recommended = TREE[wiz.env][wiz.scale][+val].models;
  } else {
    fgState.recommended = null;
  }
  renderFgWizard();
  renderFg();
}

export function jumpFgTo(key) {
  const idx = ORDER.indexOf(key);
  ORDER.slice(idx).forEach(k => wiz[k] = null);
  fgState.recommended = null;
  renderFgWizard();
  renderFg();
}

export function fgWizReset() {
  ORDER.forEach(k => wiz[k] = null);
  fgState.recommended = null;
  renderFgWizard();
  renderFg();
}

export function fgShowAll() {
  fgState.recommended = FG_MODELS.map(m => m.id);
  renderFg();
}
