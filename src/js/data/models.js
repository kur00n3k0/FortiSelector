export let MODELS = [];

export async function loadModels() {
  const res = await fetch('/api/models');
  if (!res.ok) throw new Error(`Falha ao carregar modelos: ${res.status}`);
  MODELS = await res.json();
}
