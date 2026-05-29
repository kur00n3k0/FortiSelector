import { state, $, capLabel } from './state.js';
import { MODELS } from '../data/models.js';

export function renderCmpBar() {
  const bar = $("#cmpbar");
  const tags = $("#cmpTags");
  if (!state.compare.length) { bar.classList.remove("show"); return; }
  bar.classList.add("show");
  tags.innerHTML = "";
  state.compare.forEach(id => {
    const m = MODELS.find(x => x.id === id);
    const t = document.createElement("div");
    t.className = "cmp-tag";
    t.innerHTML = `${m.name}<button data-rm="${id}">✕</button>`;
    tags.appendChild(t);
  });
}

export function openCompare() {
  const items = state.compare.map(id => MODELS.find(m => m.id === id));
  if (items.length < 2) { alert("Selecione pelo menos 2 modelos para comparar."); return; }
  $("#modalTitle").textContent = "Comparação técnica";
  const yn = v => v ? '<span class="yes">Sim</span>' : '<span class="no">—</span>';
  const rows = [
    ["sec", "Geral"],
    ["SKU", m => m.sku],
    ["Série", m => "Série " + m.series],
    ["Interfaces", m => m.ports],
    ["Form factor", m => m.form],
    ["sec", "Desempenho"],
    ["Capacidade (duplex)", m => capLabel(m.cap)],
    ["Pacotes/s (64B)", m => m.mpps.toLocaleString('pt-BR') + " Mpps"],
    ["Tabela MAC", m => m.mac],
    ["Latência", m => m.latency],
    ["VLANs", m => m.vlans],
    ["Buffers", m => m.buffers],
    ["LAG", m => m.lag],
    ["Filas/porta", m => m.queues],
    ["Memória", m => m.mem],
    ["Flash", m => m.flash],
    ["Drive", m => m.drive],
    ["sec", "Camada 3"],
    ["L3 Host (v4/v6)", m => m.l3host],
    ["Rotas (v4/v6)", m => m.routes],
    ["Multicast*", m => m.multicast],
    ["ACL", m => m.acl],
    ["sec", "Recursos"],
    ["PoE", m => m.poe ? yn(true) + ` <span style="color:var(--muted)">(${m.poebudget})</span>` : yn(false)],
    ["MACsec", m => yn(m.macsec)],
    ["Multigig 802.3bz", m => yn(m.multigig)],
    ["Split Port", m => yn(m.splitport)],
    ["Lic. Advanced", m => m.lic],
    ["sec", "Energia & ambiente"],
    ["Consumo máx.", m => m.power],
    ["Dissipação", m => m.heat],
    ["Temp. operação", m => m.optemp],
    ["Fluxo de ar", m => m.airflow],
    ["Ruído", m => m.noise],
    ["Peso", m => m.weight],
    ["Dimensões", m => m.dims],
  ];
  const strip = s => s.replace(/<[^>]*>/g, '').trim();
  let html = `<div class="cmp-table-wrap"><table class="cmp-table"><thead><tr><th>Especificação</th>${items.map(m => `<th>${m.name}</th>`).join("")}</tr></thead><tbody>`;
  rows.forEach(r => {
    if (r[0] === "sec") {
      html += `<tr class="row-section"><td colspan="${items.length + 1}">${r[1]}</td></tr>`;
    } else {
      const vals = items.map(m => r[1](m));
      const allSame = vals.map(strip).every(v => v === strip(vals[0]));
      html += `<tr${allSame ? '' : ' class="row-diff"'}><th>${r[0]}</th>${vals.map(v => `<td>${v}</td>`).join("")}</tr>`;
    }
  });
  html += "</tbody></table></div>";
  $("#modalBody").innerHTML = html;
  $("#overlay").classList.add("show");
}
