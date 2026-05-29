export const state = {
  mode: "simple",
  recommended: null,
  series: [],
  media: [],
  cap: 0,
  poe: false,
  macsec: false,
  search: "",
  sort: "cap-desc",
  compare: []
};

export const $ = s => document.querySelector(s);
export const $$ = s => document.querySelectorAll(s);

export function capLabel(c) {
  if (c >= 1000) return (c / 1000).toLocaleString('pt-BR', { minimumFractionDigits: c % 1000 ? 2 : 0, maximumFractionDigits: 2 }) + " Tbps";
  return c + " Gbps";
}
