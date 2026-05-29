import { $, capLabel } from './state.js';
import { MODELS } from '../data/models.js';

export function openDetail(id) {
  const m = MODELS.find(x => x.id === id);
  $("#modalTitle").textContent = m.name;
  const poeRows = m.poe ? `
        <div class="st"><span class="k">Portas PoE</span><span class="v">24</span></div>
        <div class="st"><span class="k">Padrão PoE</span><span class="v">${m.poetype}</span></div>
        <div class="st"><span class="k">Budget PoE</span><span class="v">${m.poebudget}</span></div>` : "";

  $("#modalBody").innerHTML = `
    <div class="dt-head">
      <div class="dt-img" data-model="${m.id}"><small>Imagem — ${m.id}</small></div>
      <div class="dt-meta">
        <div class="sku">${m.sku}</div>
        <div class="desc">${m.desc}</div>
        <div class="lic"><b>Licença Advanced Features:</b> ${m.lic} &nbsp;·&nbsp; necessária para roteamento dinâmico, protocolos multicast, policy-based routing e VRF.</div>
      </div>
    </div>

    <div class="specsec"><h4>Interfaces &amp; Hardware</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Interfaces de rede</span><span class="v">${m.ports}</span></div>
        <div class="st"><span class="k">Form factor</span><span class="v">${m.form}</span></div>
        <div class="st"><span class="k">Porta de serviço</span><span class="v">1x 10/100/1000</span></div>
        <div class="st"><span class="k">Console serial</span><span class="v">1x RJ-45</span></div>
        ${poeRows}
      </div>
    </div>

    <div class="specsec"><h4>Desempenho do sistema</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Capacidade (duplex)</span><span class="v">${capLabel(m.cap)}</span></div>
        <div class="st"><span class="k">Pacotes/s (64 bytes)</span><span class="v">${m.mpps.toLocaleString('pt-BR')} Mpps</span></div>
        <div class="st"><span class="k">Armazenamento MAC</span><span class="v">${m.mac}</span></div>
        <div class="st"><span class="k">Latência</span><span class="v">${m.latency}</span></div>
        <div class="st"><span class="k">VLANs suportadas</span><span class="v">${m.vlans}</span></div>
        <div class="st"><span class="k">Buffers de pacote</span><span class="v">${m.buffers}</span></div>
        <div class="st"><span class="k">Tamanho do LAG</span><span class="v">${m.lag}</span></div>
        <div class="st"><span class="k">Filas / porta</span><span class="v">${m.queues}</span></div>
        <div class="st"><span class="k">Instâncias STP</span><span class="v">${m.stp}</span></div>
        <div class="st"><span class="k">Memória</span><span class="v">${m.mem}</span></div>
        <div class="st"><span class="k">Flash</span><span class="v">${m.flash}</span></div>
        <div class="st"><span class="k">Drive</span><span class="v">${m.drive}</span></div>
      </div>
    </div>

    <div class="specsec"><h4>Camada 3 &amp; escala</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Roteamento IPv4/IPv6</span><span class="v" style="color:var(--ok)">Sim</span></div>
        <div class="st"><span class="k">Protocolos dinâmicos*</span><span class="v">${m.routing}</span></div>
        <div class="st"><span class="k">L3 Host (IPv4/IPv6)</span><span class="v">${m.l3host}</span></div>
        <div class="st"><span class="k">Rotas (IPv4/IPv6)</span><span class="v">${m.routes}</span></div>
        <div class="st"><span class="k">Multicast Route Entries*</span><span class="v">${m.multicast}</span></div>
        <div class="st"><span class="k">ACL</span><span class="v">${m.acl}</span></div>
      </div>
    </div>

    <div class="specsec"><h4>Segurança &amp; recursos diferenciais</h4>
      <div class="spec-table">
        <div class="st"><span class="k">MACsec (802.1ae)</span><span class="v" style="color:${m.macsec ? 'var(--ok)' : 'var(--muted-2)'}">${m.macsec ? 'Sim' : '—'}</span></div>
        <div class="st"><span class="k">PoE</span><span class="v" style="color:${m.poe ? 'var(--ok)' : 'var(--muted-2)'}">${m.poe ? 'Sim' : '—'}</span></div>
        <div class="st"><span class="k">Multigig 802.3bz</span><span class="v" style="color:${m.multigig ? 'var(--ok)' : 'var(--muted-2)'}">${m.multigig ? 'Sim' : '—'}</span></div>
        <div class="st"><span class="k">Split Port</span><span class="v" style="color:${m.splitport ? 'var(--ok)' : 'var(--muted-2)'}">${m.splitport ? 'Sim' : '—'}</span></div>
      </div>
    </div>

    <div class="specsec"><h4>Energia &amp; ambiente</h4>
      <div class="spec-table">
        <div class="st"><span class="k">Alimentação</span><span class="v">100–240V AC, 50–60 Hz</span></div>
        <div class="st"><span class="k">Consumo máx.</span><span class="v">${m.power}</span></div>
        <div class="st"><span class="k">Fonte</span><span class="v">${m.psu}</span></div>
        <div class="st"><span class="k">Dissipação térmica</span><span class="v">${m.heat}</span></div>
        <div class="st"><span class="k">Temp. operação</span><span class="v">${m.optemp}</span></div>
        <div class="st"><span class="k">Temp. armazenamento</span><span class="v">${m.sttemp}</span></div>
        <div class="st"><span class="k">Umidade</span><span class="v">${m.humidity}</span></div>
        <div class="st"><span class="k">Fluxo de ar</span><span class="v">${m.airflow}</span></div>
        <div class="st"><span class="k">Ruído</span><span class="v">${m.noise}</span></div>
        <div class="st"><span class="k">MTBF</span><span class="v">${m.mtbf}</span></div>
        <div class="st"><span class="k">Peso</span><span class="v">${m.weight}</span></div>
        <div class="st"><span class="k">Dimensões (AxPxL)</span><span class="v">${m.dims}</span></div>
      </div>
    </div>
    ${m.linerate ? `<div class="dt-meta"><div class="lic" style="border-left-color:var(--ink)"><b>Nota:</b> ${m.linerate}.</div></div>` : ""}
    <div class="dt-meta" style="margin-top:14px"><div class="lic"><b>Garantia:</b> Lifetime limitada · <b>Certificações:</b> FCC, CE, RCM, VCCI, BSMI, UL, CB, RoHS2 · Compatível com FortiGate switch controller (FortiLink).</div></div>
  `;

  $("#overlay").classList.add("show");
}
