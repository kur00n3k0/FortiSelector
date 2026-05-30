const bomItems = []; // { product, id, name, sku, desc, qty }

export function isInBom(product, sku) {
  return bomItems.some(x => x.product === product && x.sku === sku);
}

export function toggleBom(product, model) {
  const idx = bomItems.findIndex(x => x.product === product && x.sku === model.sku);
  if (idx >= 0) {
    bomItems.splice(idx, 1);
  } else {
    bomItems.push({ product, sku: model.sku, name: model.name, desc: model.desc, qty: 1 });
  }
  syncHeaderBtn();
}

function syncHeaderBtn() {
  const btn = document.getElementById('bom-btn');
  if (!btn) return;
  btn.disabled = bomItems.length === 0;
  const badge = document.getElementById('bom-count');
  if (badge) badge.textContent = bomItems.length;
}

export function openBomModal() {
  if (!bomItems.length) return;

  const overlay = document.createElement('div');
  overlay.id = 'bom-overlay';
  overlay.innerHTML = `
    <div class="bom-modal">
      <div class="bom-modal-head">
        <div>
          <h3>Montar BoM</h3>
          <p id="bom-subtitle">${subtitleText()}</p>
        </div>
        <button class="x" id="bom-close">✕</button>
      </div>
      <div class="bom-modal-body">
        <table class="bom-table">
          <thead>
            <tr>
              <th style="width:110px">Quantidade</th>
              <th style="width:140px">SKU</th>
              <th>Descrição</th>
              <th style="width:40px"></th>
            </tr>
          </thead>
          <tbody id="bom-tbody"></tbody>
        </table>
      </div>
      <div class="bom-modal-foot">
        <button class="bom-cancel" id="bom-cancel">Cancelar</button>
        <button class="bom-export" id="bom-export">
          <i class="fa-solid fa-file-excel"></i> Gerar BoM
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  renderBomTable();

  overlay.addEventListener('click', e => { if (e.target === overlay) closeBomModal(); });
  document.getElementById('bom-close').addEventListener('click', closeBomModal);
  document.getElementById('bom-cancel').addEventListener('click', closeBomModal);
  document.getElementById('bom-export').addEventListener('click', exportExcel);

  const keyHandler = e => { if (e.key === 'Escape') { closeBomModal(); document.removeEventListener('keydown', keyHandler); } };
  document.addEventListener('keydown', keyHandler);
}

function subtitleText() {
  const n = bomItems.length;
  return `${n} ${n === 1 ? 'item selecionado' : 'itens selecionados'}`;
}

function renderBomTable() {
  const tbody = document.getElementById('bom-tbody');
  if (!tbody) return;

  tbody.innerHTML = bomItems.map((item, i) => `
    <tr>
      <td><input type="number" class="bom-qty" data-idx="${i}" value="${item.qty}" min="1" max="9999"></td>
      <td class="bom-sku-cell">${item.sku}</td>
      <td class="bom-desc-cell">${item.desc}</td>
      <td><button class="bom-rm" data-idx="${i}" title="Remover">✕</button></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.bom-qty').forEach(input => {
    input.addEventListener('change', e => {
      const idx = +e.target.dataset.idx;
      bomItems[idx].qty = Math.max(1, parseInt(e.target.value) || 1);
      e.target.value = bomItems[idx].qty;
    });
  });

  tbody.querySelectorAll('.bom-rm').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = +e.target.closest('.bom-rm').dataset.idx;
      bomItems.splice(idx, 1);
      syncHeaderBtn();
      if (!bomItems.length) {
        closeBomModal();
        return;
      }
      document.getElementById('bom-subtitle').textContent = subtitleText();
      renderBomTable();
    });
  });
}

function closeBomModal() {
  document.getElementById('bom-overlay')?.remove();
}

function exportExcel() {
  const XLSX = window.XLSX;
  if (!XLSX) { alert('Erro: biblioteca de exportação não carregada.'); return; }

  const rows = [
    ['Quantidade', 'SKU', 'Descrição'],
    ...bomItems.map(item => [item.qty, item.sku, item.desc]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 90 }];

  // Bold header row
  const headerStyle = { font: { bold: true } };
  ['A1', 'B1', 'C1'].forEach(cell => {
    if (ws[cell]) ws[cell].s = headerStyle;
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'BoM');
  XLSX.writeFile(wb, 'bom-fortinet.xlsx');

  closeBomModal();
}
