export let FG_MODELS = [];

export async function loadFgModels() {
  const res = await fetch('/api/fortigate');
  if (!res.ok) throw new Error(`Falha ao carregar FortiGate: ${res.status}`);
  FG_MODELS = await res.json();
}
