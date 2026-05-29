import { state } from './modules/state.js';
import { render, updateCounts } from './modules/render.js';
import { openDetail } from './modules/detail.js';
import { renderCmpBar, openCompare } from './modules/compare.js';
import { renderWizard, setWiz, jumpTo, wizReset, showAll } from './modules/wizard.js';
import { loadModels } from './data/models.js';

import { fgState } from './modules/fg-state.js';
import { renderFg, updateFgCounts } from './modules/fg-render.js';
import { openFgDetail } from './modules/fg-detail.js';
import { renderFgWizard, setFgWiz, jumpFgTo, fgWizReset, fgShowAll } from './modules/fg-wizard.js';
import { loadFgModels } from './data/fg-models.js';
import { renderFgCmpBar, openFgCompare } from './modules/fg-compare.js';
import { initOnboarding } from './modules/onboarding.js';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

// ── Produto ativo ─────────────────────────────────────────────────────────
let activeProduct = 'fortiswitch';

function setProduct(product) {
  activeProduct = product;
  $$(".prod-btn").forEach(b => b.classList.toggle("active", b.dataset.product === product));
  $("view-fortiswitch").hidden = product !== "fortiswitch";
  $("view-fortigate").hidden   = product !== "fortigate";
  $("footer-fs").hidden = product !== "fortiswitch";
  $("footer-fg").hidden = product !== "fortigate";
  state.compare = [];
  fgState.compare = [];
  $$(".cmp-check, .fg-cmp-check").forEach(x => x.checked = false);
  renderCmpBar();
}

$$(".prod-btn").forEach(b => b.addEventListener("click", () => setProduct(b.dataset.product)));

// ── FortiSwitch — filtros avançados ───────────────────────────────────────
$$(".f-series").forEach(c => c.addEventListener("change", () => {
  state.series = [...$$(".f-series:checked")].map(x => x.value);
  render();
}));

$$(".f-media").forEach(c => c.addEventListener("change", () => {
  state.media = [...$$(".f-media:checked")].map(x => x.value);
  render();
}));

$("capPills").addEventListener("click", e => {
  const p = e.target.closest(".pill");
  if (!p) return;
  $$("#capPills .pill").forEach(x => x.classList.remove("active"));
  p.classList.add("active");
  state.cap = +p.dataset.cap;
  render();
});

$("f-poe").addEventListener("change",   e => { state.poe   = e.target.checked; render(); });
$("f-macsec").addEventListener("change",e => { state.macsec = e.target.checked; render(); });
$("search").addEventListener("input",   e => { state.search = e.target.value;  render(); });
$("sort").addEventListener("change",    e => { state.sort   = e.target.value;  render(); });

$("resetBtn").addEventListener("click", () => {
  state.series = []; state.media = []; state.cap = 0;
  state.poe = false; state.macsec = false; state.search = "";
  $$(".f-series, .f-media").forEach(x => x.checked = false);
  $("f-poe").checked = false; $("f-macsec").checked = false; $("search").value = "";
  $$("#capPills .pill").forEach(x => x.classList.remove("active"));
  document.querySelector('#capPills .pill[data-cap="0"]').classList.add("active");
  render();
});

// ── FortiSwitch — grid ────────────────────────────────────────────────────
$("grid").addEventListener("click", e => {
  if (e.target.id === "seeAll") { showAll(); return; }
  const d = e.target.closest("[data-detail]");
  if (d) { openDetail(d.dataset.detail); return; }
});

$("grid").addEventListener("change", e => {
  const c = e.target.closest(".cmp-check");
  if (!c) return;
  const id = c.dataset.id;
  if (c.checked) {
    if (state.compare.length >= 4) { c.checked = false; alert("Máximo de 4 modelos na comparação."); return; }
    state.compare.push(id);
  } else {
    state.compare = state.compare.filter(x => x !== id);
  }
  renderCmpBar();
});

// ── FortiSwitch — modo ────────────────────────────────────────────────────
function setMode(mode) {
  state.mode = mode;
  $$(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  $("simplePanel").hidden  = mode !== "simple";
  $("advancedPanel").hidden = mode !== "advanced";
  render();
}
$$(".mode-btn").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));

// ── FortiSwitch — wizard ──────────────────────────────────────────────────
$("wizard").addEventListener("click", e => {
  const o = e.target.closest(".wopt");
  if (o) { setWiz(o.dataset.step, o.dataset.step === "conn" ? +o.dataset.val : o.dataset.val); return; }
  const ed = e.target.closest("[data-edit]");
  if (ed) { jumpTo(ed.dataset.edit); return; }
  if (e.target.id === "wizRestartBtn") { wizReset(); return; }
});

$("recoBanner").addEventListener("click", e => {
  if (e.target.id === "recoAll") showAll();
  if (e.target.id === "recoRestart") wizReset();
});

// ── FortiGate — filtros avançados ─────────────────────────────────────────
$$(".fg-segment").forEach(c => c.addEventListener("change", () => {
  fgState.segments = [...$$(".fg-segment:checked")].map(x => x.value);
  renderFg();
}));

$("fg-fwPills").addEventListener("click", e => {
  const p = e.target.closest(".pill");
  if (!p) return;
  $$("#fg-fwPills .pill").forEach(x => x.classList.remove("active"));
  p.classList.add("active");
  fgState.fw = +p.dataset.fw;
  renderFg();
});

$("fg-ngfwPills").addEventListener("click", e => {
  const p = e.target.closest(".pill");
  if (!p) return;
  $$("#fg-ngfwPills .pill").forEach(x => x.classList.remove("active"));
  p.classList.add("active");
  fgState.ngfw = +p.dataset.ngfw;
  renderFg();
});

$("fg-f-wifi").addEventListener("change", e => { fgState.wifi = e.target.checked; renderFg(); });
$("fg-search").addEventListener("input",  e => { fgState.search = e.target.value; renderFg(); });
$("fg-sort").addEventListener("change",   e => { fgState.sort   = e.target.value; renderFg(); });

$("fg-resetBtn").addEventListener("click", () => {
  fgState.segments = []; fgState.fw = 0; fgState.ngfw = 0;
  fgState.wifi = false; fgState.search = "";
  $$(".fg-segment").forEach(x => x.checked = false);
  $("fg-f-ha").checked = false; $("fg-f-sdwan").checked = false; $("fg-f-wifi").checked = false;
  $("fg-search").value = "";
  $$("#fg-fwPills .pill, #fg-ngfwPills .pill").forEach(x => x.classList.remove("active"));
  document.querySelector('#fg-fwPills .pill[data-fw="0"]').classList.add("active");
  document.querySelector('#fg-ngfwPills .pill[data-ngfw="0"]').classList.add("active");
  renderFg();
});

// ── FortiGate — grid ──────────────────────────────────────────────────────
$("fg-grid").addEventListener("click", e => {
  if (e.target.id === "fg-seeAll")     { fgShowAll(); return; }
  if (e.target.id === "fg-recoAll")    { fgShowAll(); return; }
  if (e.target.id === "fg-recoRestart"){ fgWizReset(); return; }
  const d = e.target.closest("[data-fg-detail]");
  if (d) { openFgDetail(d.dataset.fgDetail); return; }
});

$("fg-grid").addEventListener("change", e => {
  const c = e.target.closest(".fg-cmp-check");
  if (!c) return;
  const id = c.dataset.id;
  if (c.checked) {
    if (fgState.compare.length >= 4) { c.checked = false; alert("Máximo de 4 modelos na comparação."); return; }
    fgState.compare.push(id);
  } else {
    fgState.compare = fgState.compare.filter(x => x !== id);
  }
  renderFgCmpBar();
});

$("fg-recoBanner").addEventListener("click", e => {
  if (e.target.id === "fg-recoAll")    fgShowAll();
  if (e.target.id === "fg-recoRestart") fgWizReset();
});

// ── FortiGate — modo ──────────────────────────────────────────────────────
function setFgMode(mode) {
  fgState.mode = mode;
  $$(".fg-mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  $("fg-simplePanel").hidden  = mode !== "simple";
  $("fg-advancedPanel").hidden = mode !== "advanced";
  renderFg();
}
$$(".fg-mode-btn").forEach(b => b.addEventListener("click", () => setFgMode(b.dataset.mode)));

// ── FortiGate — wizard ────────────────────────────────────────────────────
$("fg-wizard").addEventListener("click", e => {
  const o = e.target.closest(".wopt");
  if (o) { setFgWiz(o.dataset.step, o.dataset.val); return; }
  const ed = e.target.closest("[data-edit]");
  if (ed) { jumpFgTo(ed.dataset.edit); return; }
  if (e.target.id === "fg-wizRestartBtn") { fgWizReset(); return; }
});

// ── Barra de comparação — FortiSwitch ────────────────────────────────────
$("cmpTags").addEventListener("click", e => {
  const b = e.target.closest("[data-rm]");
  if (!b) return;
  state.compare = state.compare.filter(x => x !== b.dataset.rm);
  const chk = document.querySelector(`.cmp-check[data-id="${b.dataset.rm}"]`);
  if (chk) chk.checked = false;
  renderCmpBar();
});

$("cmpClear").addEventListener("click", () => {
  if (activeProduct === "fortigate") {
    fgState.compare = [];
    $$(".fg-cmp-check").forEach(x => x.checked = false);
    renderFgCmpBar();
  } else {
    state.compare = [];
    $$(".cmp-check").forEach(x => x.checked = false);
    renderCmpBar();
  }
});

$("cmpGo").addEventListener("click", () => {
  if (activeProduct === "fortigate") openFgCompare();
  else openCompare();
});

// ── Remoção de tags FG na barra ───────────────────────────────────────────
document.addEventListener("click", e => {
  const b = e.target.closest("[data-fg-rm]");
  if (!b) return;
  fgState.compare = fgState.compare.filter(x => x !== b.dataset.fgRm);
  const chk = document.querySelector(`.fg-cmp-check[data-id="${b.dataset.fgRm}"]`);
  if (chk) chk.checked = false;
  renderFgCmpBar();
});

// ── Modal ─────────────────────────────────────────────────────────────────
$("modalClose").addEventListener("click", () => $("overlay").classList.remove("show"));
$("overlay").addEventListener("click", e => { if (e.target.id === "overlay") $("overlay").classList.remove("show"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") $("overlay").classList.remove("show"); });

// ── Init ──────────────────────────────────────────────────────────────────
Promise.all([loadModels(), loadFgModels()]).then(() => {
  updateCounts();
  updateFgCounts();
  renderWizard();
  renderFgWizard();
  setMode("simple");
  setFgMode("simple");
  setProduct("fortiswitch");
  initOnboarding();
}).catch(err => {
  document.body.innerHTML = `<div style="padding:2rem;font-family:sans-serif;color:#c00"><b>Erro ao carregar dados:</b> ${err.message}</div>`;
});
