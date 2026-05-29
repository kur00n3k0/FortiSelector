import { fgState, $, $$, fwLabel, sessLabel } from './fg-state.js';
import { FG_MODELS } from '../data/fg-models.js';

const SEGMENT_LABEL = { entry:"Entry / SOHO", smb:"SMB", enterprise:"Enterprise", datacenter:"Data Center" };

function matches(m) {
  if (fgState.mode === "simple") {
    if (!fgState.recommended) return false;
    return fgState.recommended.includes(m.id);
  }
  if (fgState.segments.length && !fgState.segments.includes(m.segment)) return false;
  if (fgState.fw && m.fw_gbps < fgState.fw) return false;
  if (fgState.ngfw && m.ngfw_gbps < fgState.ngfw) return false;
  if (fgState.wifi && !m.has_wifi) return false;
  if (fgState.search) {
    const q = fgState.search.toLowerCase();
    if (!(m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q))) return false;
  }
  return true;
}

function sortList(list) {
  return [...list].sort((a, b) => {
    if (fgState.sort === "fw-desc")   return b.fw_gbps - a.fw_gbps;
    if (fgState.sort === "fw-asc")    return a.fw_gbps - b.fw_gbps;
    if (fgState.sort === "ngfw-desc") return b.ngfw_gbps - a.ngfw_gbps;
    if (fgState.sort === "name")      return a.name.localeCompare(b.name);
    return 0;
  });
}

export function renderFg() {
  const grid = $("fg-grid");
  const list = sortList(FG_MODELS.filter(matches));
  $("fg-count").textContent = list.length;

  const reco = $("fg-recoBanner");
  if (fgState.mode === "simple" && fgState.recommended) {
    reco.style.display = "block";
    reco.innerHTML = `<div class="reco">
      <div>
        <span class="reco-tag">Recomendado para você</span>
        <p>Com base nas suas respostas, estes são os modelos FortiGate indicados.</p>
      </div>
      <div class="reco-actions">
        <button id="fg-recoAll">Ver todos os modelos</button>
        <button id="fg-recoRestart">Recomeçar</button>
      </div>
    </div>`;
  } else {
    reco.style.display = "none";
    reco.innerHTML = "";
  }

  if (fgState.mode === "simple" && !fgState.recommended) {
    grid.innerHTML = `<div class="empty wiz-empty">
      <div class="wiz-empty-ico"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
      <h4>Responda às perguntas ao lado</h4>
      <p>O assistente vai recomendar os FortiGates ideais para o seu cenário.</p>
      <button class="ghost-btn" id="fg-seeAll">Ou ver todos os modelos</button>
    </div>`;
    return;
  }

  if (!list.length) {
    grid.innerHTML = `<div class="empty"><h4>Nenhum modelo corresponde aos filtros</h4><p>Ajuste os critérios ou limpe os filtros para ver todos os modelos.</p></div>`;
    return;
  }

  grid.innerHTML = "";
  list.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = (i * 0.04) + "s";
    const checked = fgState.compare.includes(m.id) ? "checked" : "";
    const sslRow = m.ssl_vpn_gbps
      ? `<div class="srow"><span>SSL VPN</span><b>${m.ssl_vpn_gbps.toLocaleString('pt-BR')} Gbps</b></div>`
      : `<div class="srow"><span>SSL VPN</span><b style="color:var(--muted-2)">—</b></div>`;
    card.innerHTML = `
      <div class="card-img">
        <span class="series-badge" data-seg="${m.segment}">${SEGMENT_LABEL[m.segment]}</span>
        <span class="series-badge" style="right:10px;left:auto;background:#1a1e27;border:1px solid #2f343f;color:#9aa1ac">${m.form}</span>
        <div class="ph">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 11h.01M9 11h.01M12 11h.01M15 11h.01M18 11h.01"/><circle cx="12" cy="18" r="1"/></svg>
          <small>Imagem do equipamento</small>
        </div>
      </div>
      <div class="card-body">
        <div class="name">${m.name}</div>
        <div class="sku">${m.sku}</div>
        <div class="ports" style="font-size:11px">${m.interfaces.length > 55 ? m.interfaces.substring(0,55)+'…' : m.interfaces}</div>
        <div class="chips">
          <span class="chip"><b>FW ${fwLabel(m.fw_gbps)}</b></span>
          <span class="chip">NGFW ${fwLabel(m.ngfw_gbps)}</span>
          <span class="chip">${sessLabel(m.sessions_m)} sess.</span>
        </div>
        <div class="spec-rows">
          <div class="srow"><span>IPS</span><b>${fwLabel(m.ips_gbps)}</b></div>
          <div class="srow"><span>Threat Protection</span><b>${fwLabel(m.threat_gbps)}</b></div>
          ${sslRow}
          <div class="srow"><span>FortiSwitches</span><b>${m.fortiswitches}</b></div>
        </div>
        <div class="card-foot">
          <button class="btn-detail" data-fg-detail="${m.id}">Ver detalhes</button>
          <label class="cmp">
            <input type="checkbox" class="fg-cmp-check" data-id="${m.id}" ${checked}>
            <span class="cbox"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4L19 7"/></svg></span>
            Comparar
          </label>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

export function updateFgCounts() {
  $$(".fg-count[data-segment]").forEach(el => {
    el.textContent = FG_MODELS.filter(m => m.segment === el.dataset.segment).length;
  });
}
