import { state, $, $$, capLabel } from './state.js';
import { MODELS } from '../data/models.js';
import { isInBom } from './bom.js';

function matches(m) {
  if (state.mode === "simple") {
    if (!state.recommended) return false;
    return state.recommended.includes(m.id);
  }
  if (state.series.length && !state.series.includes(m.series)) return false;
  if (state.media.length && !state.media.some(x => m.media.includes(x))) return false;
  if (state.cap && m.cap < state.cap) return false;
  if (state.poe && !m.poe) return false;
  if (state.macsec && !m.macsec) return false;
  if (state.search) {
    const q = state.search.toLowerCase();
    if (!(m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q))) return false;
  }
  return true;
}

function sortList(list) {
  const s = state.sort;
  return [...list].sort((a, b) => {
    if (s === "cap-desc") return b.cap - a.cap;
    if (s === "cap-asc") return a.cap - b.cap;
    if (s === "ports-desc") return b.portDensity - a.portDensity;
    if (s === "name") return a.name.localeCompare(b.name);
    return 0;
  });
}

export function render() {
  const reco = $("#recoBanner");
  const grid = $("#grid");
  const list = sortList(MODELS.filter(matches));
  $("#count").textContent = list.length;

  if (state.mode === "simple" && state.recommended) {
    reco.style.display = "block";
    reco.innerHTML = `<div class="reco">
        <div>
          <span class="reco-tag">Recomendado para você</span>
          <p>Com base nas suas respostas, estes são os modelos FortiSwitch indicados.</p>
        </div>
        <div class="reco-actions">
          <button id="recoAll">Ver todos os modelos</button>
          <button id="recoRestart">Recomeçar</button>
        </div>
      </div>`;
  } else {
    reco.style.display = "none";
    reco.innerHTML = "";
  }

  grid.innerHTML = "";

  if (state.mode === "simple" && !state.recommended) {
    grid.innerHTML = `<div class="empty wiz-empty">
        <div class="wiz-empty-ico"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/></svg></div>
        <h4>Responda às perguntas ao lado</h4>
        <p>O assistente vai recomendar os switches ideais para o seu cenário.</p>
        <button class="ghost-btn" id="seeAll">Ou ver todos os modelos</button>
      </div>`;
    return;
  }

  if (!list.length) {
    grid.innerHTML = `<div class="empty"><h4>Nenhum modelo corresponde aos filtros</h4><p>Ajuste os critérios ou limpe os filtros para ver todos os equipamentos.</p></div>`;
    return;
  }

  list.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = (i * 0.04) + "s";
    const checked = state.compare.includes(m.id) ? "checked" : "";
    const inBom = isInBom('fs', m.sku);
    const safeDesc = (m.desc || '').replace(/"/g, '&quot;');
    card.innerHTML = `
      <div class="card-img" data-model="${m.id}">
        <!-- PLACEHOLDER DE IMAGEM — Pedro: substituir pelo <img> do ${m.id} -->
        <span class="series-badge">SÉRIE ${m.series}</span>
        ${m.poe ? '<span class="poe-badge">PoE</span>' : ''}
        <div class="ph">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 11h.01M9 11h.01M12 11h.01M15 11h.01M18 11h.01M6 14h12"/></svg>
          <small>Imagem do equipamento</small>
        </div>
      </div>
      <div class="card-body">
        <div class="name">${m.name}</div>
        <div class="sku">${m.sku}</div>
        <div class="ports">${m.ports}</div>
        <div class="chips">
          <span class="chip"><b>${capLabel(m.cap)}</b></span>
          <span class="chip">${m.mpps.toLocaleString('pt-BR')} Mpps</span>
          <span class="chip">${m.form}</span>
        </div>
        <div class="spec-rows">
          <div class="srow"><span>Tabela MAC</span><b>${m.mac}</b></div>
          <div class="srow"><span>Latência</span><b>${m.latency}</b></div>
          <div class="srow"><span>Consumo máx.</span><b>${m.power}</b></div>
          <div class="srow"><span>MACsec</span><b>${m.macsec ? '<span style="color:var(--ok)">Sim</span>' : '<span style="color:var(--muted-2)">—</span>'}</b></div>
        </div>
        <div class="card-foot">
          <button class="btn-detail" data-detail="${m.id}">Ver detalhes</button>
          <button class="btn-bom ${inBom ? 'bom-active' : ''}"
                  data-bom="${m.id}" data-bom-product="fs"
                  data-bom-name="${m.name}" data-bom-sku="${m.sku}" data-bom-desc="${safeDesc}"
                  title="${inBom ? 'Remover do BoM' : 'Adicionar ao BoM'}">
            <i class="fa-solid ${inBom ? 'fa-circle-minus' : 'fa-cart-plus'}"></i>
          </button>
          <label class="cmp">
            <input type="checkbox" class="cmp-check" data-id="${m.id}" ${checked}>
            <span class="cbox"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4L19 7"/></svg></span>
            Comparar
          </label>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

export function updateCounts() {
  $$(".count[data-series]").forEach(el => {
    el.textContent = MODELS.filter(m => m.series === el.dataset.series).length;
  });
}
