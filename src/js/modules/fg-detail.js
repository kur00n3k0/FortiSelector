import { $, fwLabel } from './fg-state.js';
import { FG_MODELS } from '../data/fg-models.js';

export function openFgDetail(id) {
  const m = FG_MODELS.find(x => x.id === id);
  if (!m) return;
  $("modalTitle").textContent = m.name;

  const sslRows = m.ssl_vpn_gbps ? `
    <div class="st"><span class="k">SSL VPN Throughput</span><span class="v">${m.ssl_vpn_gbps.toLocaleString('pt-BR')} Gbps</span></div>
    <div class="st"><span class="k">Usuários SSL VPN (máx.)</span><span class="v">${m.ssl_vpn_users.toLocaleString('pt-BR')}</span></div>`
    : `<div class="st"><span class="k">SSL VPN</span><span class="v" style="color:var(--muted-2)">Não suportado</span></div>`;

  const variantsRow = m.variants
    ? `<div class="st"><span class="k">Variantes</span><span class="v">${m.variants}</span></div>` : "";

  $("modalBody").innerHTML = `
    <div class="dt-head">
      <div class="dt-img"><small>Imagem — ${m.id}</small></div>
      <div class="dt-meta">
        <div class="sku">${m.sku}</div>
        <div class="desc">${m.desc}</div>
        <div class="lic"><b>Form factor:</b> ${m.form} &nbsp;·&nbsp; <b>PSU:</b> ${m.psu}</div>
      </div>
    </div>

    <div class="specsec"><h4>Throughput de Firewall</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Firewall (1518/512/64 B)</span><span class="v">${m.fw_text}</span></div>
        <div class="st"><span class="k">IPsec VPN (512 B)</span><span class="v">${fwLabel(m.ipsec_gbps)}</span></div>
        <div class="st"><span class="k">IPS (Enterprise Mix)</span><span class="v">${fwLabel(m.ips_gbps)}</span></div>
        <div class="st"><span class="k">NGFW (Enterprise Mix)</span><span class="v">${fwLabel(m.ngfw_gbps)}</span></div>
        <div class="st"><span class="k">Threat Protection (Ent. Mix)</span><span class="v">${fwLabel(m.threat_gbps)}</span></div>
        <div class="st"><span class="k">SSL Inspection (avg. HTTPS)</span><span class="v">${fwLabel(m.ssl_inspect)}</span></div>
        <div class="st"><span class="k">App Control (HTTP 64K)</span><span class="v">${fwLabel(m.appctrl_gbps)}</span></div>
        <div class="st"><span class="k">Latência de Firewall</span><span class="v">${m.latency}</span></div>
        ${sslRows}
      </div>
    </div>

    <div class="specsec"><h4>Capacidade &amp; Sessões</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Sessões simultâneas</span><span class="v">${m.sessions_text}</span></div>
        <div class="st"><span class="k">Novas sessões/s</span><span class="v">${m.new_sessions.toLocaleString('pt-BR')}</span></div>
        <div class="st"><span class="k">Políticas de Firewall</span><span class="v">${m.fw_policies.toLocaleString('pt-BR')}</span></div>
        <div class="st"><span class="k">Túneis IPsec G/W-to-G/W</span><span class="v">${m.gw_ipsec.toLocaleString('pt-BR')}</span></div>
        <div class="st"><span class="k">Túneis IPsec Client-to-G/W</span><span class="v">${m.cli_ipsec.toLocaleString('pt-BR')}</span></div>
        <div class="st"><span class="k">VDOMs (default / máx.)</span><span class="v">${m.vdoms}</span></div>
      </div>
    </div>

    <div class="specsec"><h4>Fabric &amp; Gerenciamento</h4>
      <div class="spec-table">
        <div class="st"><span class="k">FortiAPs (total / tunnel)</span><span class="v">${m.fortiaps}</span></div>
        <div class="st"><span class="k">FortiSwitches gerenciados</span><span class="v">${m.fortiswitches}</span></div>
        <div class="st"><span class="k">FortiTokens</span><span class="v">${m.fortitokens.toLocaleString('pt-BR')}</span></div>
        <div class="st"><span class="k">Wi-Fi integrado</span><span class="v" style="color:${m.has_wifi ? 'var(--ok)' : 'var(--muted-2)'}">${m.has_wifi ? 'Sim (variante FWF)' : '—'}</span></div>
      </div>
    </div>

    <div class="specsec"><h4>Interfaces &amp; Hardware</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Interfaces de rede</span><span class="v">${m.interfaces}</span></div>
        <div class="st"><span class="k">Armazenamento</span><span class="v">${m.storage ?? '—'}</span></div>
        <div class="st"><span class="k">Fontes de alimentação</span><span class="v">${m.psu}</span></div>
        <div class="st"><span class="k">Form factor</span><span class="v">${m.form}</span></div>
        ${variantsRow}
      </div>
    </div>
    <div class="dt-meta" style="margin-top:14px">
      <div class="lic"><b>Performance:</b> Todos os valores são "até" e medidos em condições ideais de lab (Enterprise Mix traffic). IPS, NGFW e Threat Protection medidos com logging ativado. * Requer licença Hyperscale.</div>
    </div>
  `;

  $("overlay").classList.add("show");
}
