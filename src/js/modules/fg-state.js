export const fgState = {
  mode: "simple",
  recommended: null,
  segments: [],
  fw: 0,
  ngfw: 0,
  search: "",
  sort: "fw-desc",
  wifi: false,
  compare: [],
};

export const $ = id => document.getElementById(id);
export const $$ = sel => [...document.querySelectorAll(sel)];

export function fwLabel(gbps) {
  if (gbps >= 1000) return (gbps / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' Tbps';
  return gbps.toLocaleString('pt-BR') + ' Gbps';
}

export function sessLabel(m) {
  if (m >= 1000) return (m / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' B';
  if (m >= 1) return m.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' M';
  return (m * 1000).toLocaleString('pt-BR') + ' K';
}
