const STORAGE_KEY = 'fortiselector_tour_done';

const STEPS = [
  {
    type: 'modal',
  },
  {
    type: 'spotlight',
    targetSelector: '.product-switch',
    tooltipPosition: 'below',
    borderRadius: '999px',
    title: 'Selecione o produto',
    body: 'Alterne entre <b>FortiSwitch</b> (switches de campus e data center) e <b>FortiGate</b> (firewalls e UTM). Cada produto tem filtros e modelos independentes.',
  },
  {
    type: 'spotlight',
    targetSelector: '#view-fortiswitch .mode-switch',
    tooltipPosition: 'right',
    borderRadius: '0',
    title: 'Modo simplificado ou avançado',
    body: '<b>Modo simplificado</b> ativa o Assistente guiado: responda 4 perguntas e receba recomendações. <b>Modo avançado</b> libera todos os filtros técnicos para controle total.',
  },
  {
    type: 'spotlight',
    targetSelector: '#simplePanel',
    tooltipPosition: 'right',
    borderRadius: '14px',
    title: 'Assistente de seleção',
    body: 'Responda às perguntas sobre tipo de implantação e conectividade. O assistente identifica os modelos mais adequados ao seu cenário e os destaca automaticamente.',
  },
  {
    type: 'spotlight',
    targetSelector: '#grid .card',
    tooltipPosition: 'above',
    borderRadius: '14px',
    title: 'Cards de produto',
    body: 'Cada card exibe as especificações principais. Clique em <b>Ver detalhes</b> para a ficha técnica completa. Use o checkbox <b>Comparar</b> para adicionar até 4 modelos à comparação.',
  },
  {
    type: 'spotlight',
    targetSelector: '#cmpbar',
    tooltipPosition: 'above',
    borderRadius: '16px',
    title: 'Comparação lado a lado',
    body: 'Quando você marca 2 ou mais modelos, esta barra aparece. Clique em <b>Comparar selecionados</b> para abrir uma tabela técnica completa com diferenças destacadas automaticamente.',
    forceShow: true,
  },
];

let currentStep = 0;
let hole = null;
let tooltip = null;
let backdrop = null;
let toastTimeout = null;
let keyHandler = null;
let cmpbarForced = false;

export function initOnboarding() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  currentStep = 0;
  keyHandler = handleKeydown.bind(null);
  document.addEventListener('keydown', keyHandler);
  showStep(0);
}

function destroyOnboarding() {
  document.removeEventListener('keydown', keyHandler);
  keyHandler = null;

  if (cmpbarForced) {
    document.getElementById('cmpbar')?.classList.remove('ob-force-show');
    cmpbarForced = false;
  }

  hole?.remove();
  tooltip?.remove();
  backdrop?.remove();
  hole = null;
  tooltip = null;
  backdrop = null;
}

function showStep(i) {
  const step = STEPS[i];
  if (!step) { complete(true); return; }

  // restore cmpbar if we're leaving step 5
  if (cmpbarForced && (!step.forceShow)) {
    document.getElementById('cmpbar')?.classList.remove('ob-force-show');
    cmpbarForced = false;
  }

  if (step.type === 'modal') {
    showModal();
  } else {
    showSpotlight(i);
  }
}

function showModal() {
  // remove spotlight elements if present
  hole?.remove(); hole = null;
  tooltip?.remove(); tooltip = null;

  backdrop = document.createElement('div');
  backdrop.id = 'ob-modal-backdrop';

  const modal = document.createElement('div');
  modal.id = 'ob-modal';
  modal.innerHTML = `
    <div class="ob-logo">FortiSelector</div>
    <h3>Bem-vindo ao FortiSelector</h3>
    <p>Selecione o switch ou firewall Fortinet ideal para o seu projeto em minutos. Este tour rápido apresenta as principais funcionalidades — você pode pular a qualquer momento.</p>
    <div class="ob-actions" style="margin-top:24px">
      <button class="ob-btn-skip" id="ob-skip">Pular tour</button>
      <button class="ob-btn-next" id="ob-next">Começar tour →</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  document.getElementById('ob-skip').addEventListener('click', skip);
  document.getElementById('ob-next').addEventListener('click', next);
}

function showSpotlight(i) {
  const step = STEPS[i];

  // remove backdrop/modal if coming from step 0
  backdrop?.remove(); backdrop = null;

  // force cmpbar visible if needed
  if (step.forceShow) {
    document.getElementById('cmpbar')?.classList.add('ob-force-show');
    cmpbarForced = true;
  }

  let target = document.querySelector(step.targetSelector);
  if (!target) {
    // fallback for card step
    target = document.getElementById('grid') || document.getElementById('fg-grid');
  }
  if (!target) { next(); return; }

  // scroll into view, then position after animation settles
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      positionSpotlight(step, target, i);
    });
  });
}

function positionSpotlight(step, target, i) {
  const pad = 8;
  const r = target.getBoundingClientRect();
  const rect = {
    top: r.top - pad,
    left: r.left - pad,
    width: r.width + pad * 2,
    height: r.height + pad * 2,
  };

  // create hole if not yet present
  if (!hole) {
    hole = document.createElement('div');
    hole.id = 'ob-spotlight-hole';
    document.body.appendChild(hole);
  }
  hole.style.top    = rect.top + 'px';
  hole.style.left   = rect.left + 'px';
  hole.style.width  = rect.width + 'px';
  hole.style.height = rect.height + 'px';
  hole.style.borderRadius = step.borderRadius ?? '14px';

  // create tooltip if not yet present
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'ob-tooltip';
    document.body.appendChild(tooltip);
  }

  const isLast = i === STEPS.length - 1;
  const stepLabel = `${i} de ${STEPS.length - 1}`;
  tooltip.innerHTML = `
    <div class="ob-step-label">${stepLabel}</div>
    <h4>${step.title}</h4>
    <p>${step.body}</p>
    <div class="ob-actions">
      <button class="ob-btn-skip" id="ob-skip">Pular tour</button>
      <button class="ob-btn-next" id="ob-next">${isLast ? 'Concluir tour ✓' : 'Próximo →'}</button>
    </div>
  `;

  document.getElementById('ob-skip').addEventListener('click', skip);
  document.getElementById('ob-next').addEventListener('click', next);

  placeTooltip(rect, step.tooltipPosition);
}

function placeTooltip(rect, position) {
  // temporarily make visible off-screen to measure size
  tooltip.style.visibility = 'hidden';
  tooltip.style.top = '0px';
  tooltip.style.left = '0px';

  requestAnimationFrame(() => {
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 16;

    let top, left;

    if (position === 'below') {
      top  = rect.top + rect.height + gap;
      left = rect.left + rect.width / 2 - tw / 2;
    } else if (position === 'above') {
      top  = rect.top - th - gap;
      left = rect.left + rect.width / 2 - tw / 2;
    } else { // right
      top  = rect.top + rect.height / 2 - th / 2;
      left = rect.left + rect.width + gap;
    }

    // clamp to viewport
    left = Math.max(12, Math.min(left, vw - tw - 12));
    top  = Math.max(12, Math.min(top,  vh - th - 12));

    tooltip.style.top  = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.visibility = 'visible';
  });
}

function next() {
  currentStep += 1;
  if (currentStep >= STEPS.length) {
    complete(true);
  } else {
    showStep(currentStep);
  }
}

function skip() {
  complete(false);
}

function complete(showToastMsg) {
  localStorage.setItem(STORAGE_KEY, '1');
  destroyOnboarding();
  if (showToastMsg) showToast('Tour concluído! Explore os produtos à vontade.');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.id = 'ob-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.remove(), 3500);
}

function handleKeydown(e) {
  if (e.key === 'Escape') { skip(); return; }
  const step = STEPS[currentStep];
  if (step?.type === 'spotlight' && (e.key === 'ArrowRight' || e.key === 'Enter')) {
    next();
  }
}
