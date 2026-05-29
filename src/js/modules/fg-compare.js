import { fgState } from './fg-state.js';
import { FG_MODELS } from '../data/fg-models.js';
import { fwLabel } from './fg-state.js';

const $ = id => document.getElementById(id);

export function renderFgCmpBar() {
  const bar  = $("cmpbar");
  const tags = $("cmpTags");
  if (!fgState.compare.length) { bar.classList.remove("show"); return; }
  bar.classList.add("show");
  tags.innerHTML = "";
  fgState.compare.forEach(id => {
    const m = FG_MODELS.find(x => x.id === id);
    if (!m) return;
    const t = document.createElement("div");
    t.className = "cmp-tag";
    t.innerHTML = `${m.name}<button data-fg-rm="${id}">✕</button>`;
    tags.appendChild(t);
  });
}

export function openFgCompare() {
  const items = fgState.compare.map(id => FG_MODELS.find(m => m.id === id)).filter(Boolean);
  if (items.length < 2) { alert("Selecione pelo menos 2 modelos para comparar."); return; }

  $("modalTitle").textContent = "Comparação técnica — FortiGate";

  const yn  = v => v ? '<span class="yes">Sim</span>' : '<span class="no">—</span>';
  const gbps = v => v != null ? fwLabel(v) : '<span class="no">—</span>';

  const rows = [
    ["sec", "Geral"],
    ["SKU",                    m => m.sku],
    ["Segmento",               m => ({ entry:"Entry/SOHO", smb:"SMB", enterprise:"Enterprise", datacenter:"Data Center" }[m.segment])],
    ["Form factor",            m => m.form],
    ["Interfaces",             m => m.interfaces],
    ["Armazenamento",          m => m.storage ?? "—"],
    ["PSU",                    m => m.psu],
    ["sec", "Throughput"],
    ["Firewall (1518/512/64B)",m => m.fw_text],
    ["IPsec VPN (512B)",       m => gbps(m.ipsec_gbps)],
    ["IPS (Ent. Mix)",         m => gbps(m.ips_gbps)],
    ["NGFW (Ent. Mix)",        m => gbps(m.ngfw_gbps)],
    ["Threat Protection",      m => gbps(m.threat_gbps)],
    ["SSL Inspection",         m => gbps(m.ssl_inspect)],
    ["App Control (HTTP 64K)", m => gbps(m.appctrl_gbps)],
    ["Latência FW",            m => m.latency],
    ["sec", "Capacidade"],
    ["Sessões simultâneas",    m => m.sessions_text],
    ["Novas sessões/s",        m => m.new_sessions.toLocaleString('pt-BR')],
    ["Políticas de Firewall",  m => m.fw_policies.toLocaleString('pt-BR')],
    ["Túneis IPsec G/W-G/W",  m => m.gw_ipsec.toLocaleString('pt-BR')],
    ["Túneis IPsec Client",    m => m.cli_ipsec.toLocaleString('pt-BR')],
    ["SSL VPN Throughput",     m => m.ssl_vpn_gbps ? gbps(m.ssl_vpn_gbps) : '<span class="no">—</span>'],
    ["Usuários SSL VPN",       m => m.ssl_vpn_users ? m.ssl_vpn_users.toLocaleString('pt-BR') : '<span class="no">—</span>'],
    ["sec", "Fabric & Recursos"],
    ["FortiAPs (total/tunnel)",m => m.fortiaps],
    ["FortiSwitches",          m => m.fortiswitches],
    ["FortiTokens",            m => m.fortitokens.toLocaleString('pt-BR')],
    ["VDOMs (def/máx)",        m => m.vdoms],
    ["Wi-Fi integrado",        m => yn(m.has_wifi)],
  ];

  const strip = s => String(s).replace(/<[^>]*>/g, '').trim();
  let html = `<div class="cmp-table-wrap"><table class="cmp-table">
    <thead><tr><th>Especificação</th>${items.map(m => `<th>${m.name}</th>`).join("")}</tr></thead>
    <tbody>`;
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

  $("modalBody").innerHTML = html;
  $("overlay").classList.add("show");
}
