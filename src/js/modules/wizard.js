import { state, $ } from './state.js';
import { MODELS } from '../data/models.js';
import { render } from './render.js';

const DEPLOY_LABELS = { campus: "Campus / Enterprise", datacenter: "Data Center" };
const PLAN_LABELS = { new: "Novo switch", upgrade: "Upgrade de switch" };
const PURPOSE_LABELS = { access: "Acesso", core: "Core / Agregação" };

const TREE = {
  campus: {
    access: [
      { label: "Cobre Multigig com PoE", sub: "APs Wi-Fi, câmeras IP, telefones — 802.3bt, até 1440W", models: ["FS-T1024F-FPOE"] },
      { label: "Cobre Multigig sem PoE", sub: "24x BASE-T 10G/5G/2.5G/1G + uplinks 100G", models: ["FS-T1024E"] },
      { label: "Fibra 10G (SFP+/SFP)", sub: "24x SFP+/SFP + uplinks 100G", models: ["FS-1024E"] },
    ],
    core: [
      { label: "Agregação 10G de alta densidade", sub: "48x SFP+/SFP + 6x 100G", models: ["FS-1048G"] },
      { label: "Core com uplinks 100G", sub: "alta densidade 100G QSFP28", models: ["FS-3032G", "FS-1048G"] },
      { label: "Acesso fibra 10G + uplinks 100G", sub: "combinação acesso/agregação", models: ["FS-1024E", "FS-1048G"] },
    ]
  },
  datacenter: {
    access: [
      { label: "Servidores 25G (SFP28)", sub: "48x 25G + 8x 100G de uplink", models: ["FS-2048F", "FS-2048F-B2F"] },
      { label: "Servidores 10G fibra", sub: "SFP+/SFP com uplinks 100G", models: ["FS-1024E", "FS-1048G"] },
      { label: "Servidores cobre 10G Multigig", sub: "24x BASE-T", models: ["FS-T1024E"] },
    ],
    core: [
      { label: "Spine 100G de altíssima densidade", sub: "32x 100GE/40GE QSFP28 — 6,44 Tbps", models: ["FS-3032G"] },
      { label: "Leaf 25G + Spine 100G", sub: "arquitetura leaf-spine", models: ["FS-2048F", "FS-2048F-B2F", "FS-3032G"] },
      { label: "Agregação 10G fibra", sub: "48x SFP+/SFP + 6x 100G", models: ["FS-1048G"] },
    ]
  }
};

const wiz = { deployment: null, plan: null, purpose: null, conn: null };
const ORDER = ["deployment", "plan", "purpose", "conn"];

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

export function renderWizard() {
  const w = $("#wizard");
  let html = `<div class="wiz-head"><h3>Assistente de seleção</h3><p>Responda e receba recomendações.</p></div>`;

  if (wiz.deployment) {
    html += answered("deployment", "Que tipo de switch você procura?", DEPLOY_LABELS[wiz.deployment]);
  } else {
    w.innerHTML = html + stepBlock("Que tipo de switch você procura?", [
      optBtn("deployment", "campus", "Campus / Enterprise", "Núcleo e agregação corporativa"),
      optBtn("deployment", "datacenter", "Data Center", "Servidores, leaf-spine, alta densidade"),
    ]); return;
  }

  if (wiz.plan) {
    html += answered("plan", "Comprando novo ou fazendo upgrade?", PLAN_LABELS[wiz.plan]);
  } else {
    w.innerHTML = html + stepBlock("Comprando um switch novo ou fazendo upgrade?", [
      optBtn("plan", "new", "Novo switch", "Nova implantação"),
      optBtn("plan", "upgrade", "Upgrade de switch", "Substituir ou expandir um existente"),
    ]); return;
  }

  if (wiz.purpose) {
    html += answered("purpose", "Qual a função do switch?", PURPOSE_LABELS[wiz.purpose]);
  } else {
    w.innerHTML = html + stepBlock("Qual a função do switch?", [
      optBtn("purpose", "access", "Acesso", "Conexão de hosts, servidores e dispositivos"),
      optBtn("purpose", "core", "Core / Agregação", "Núcleo, spine e uplinks de alta velocidade"),
    ]); return;
  }

  const opts = TREE[wiz.deployment][wiz.purpose];
  if (wiz.conn != null) {
    html += answered("conn", "Necessidades de conectividade", opts[wiz.conn].label);
    html += `<button class="wiz-restart" id="wizRestartBtn">↺ Recomeçar</button>`;
  } else {
    html += stepBlock("Quais são suas necessidades de conectividade?",
      opts.map((o, i) => optBtn("conn", i, o.label, o.sub)));
  }
  w.innerHTML = html;
}

export function setWiz(key, val) {
  const idx = ORDER.indexOf(key);
  ORDER.slice(idx).forEach(k => wiz[k] = null);
  wiz[key] = val;
  if (key === "conn") {
    state.recommended = TREE[wiz.deployment][wiz.purpose][val].models;
  } else {
    state.recommended = null;
  }
  renderWizard();
  render();
}

export function jumpTo(key) {
  const idx = ORDER.indexOf(key);
  ORDER.slice(idx).forEach(k => wiz[k] = null);
  state.recommended = null;
  renderWizard();
  render();
}

export function wizReset() {
  ORDER.forEach(k => wiz[k] = null);
  state.recommended = null;
  renderWizard();
  render();
}

export function showAll() {
  state.recommended = MODELS.map(m => m.id);
  render();
}
