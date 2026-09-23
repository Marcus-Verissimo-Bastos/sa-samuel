export const CREATURES = ['Pé Grande', 'Lobisomem', 'Criatura aquática', 'Luzes misteriosas', 'Chupa-cabra', 'Outro'];

export const STATUS_LABEL = { PENDENTE: 'Em análise', CONFIRMADO: 'Confirmado', DESCARTADO: 'Descartado' };

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Converte ISO -> valor do <input type="datetime-local"> no fuso local
export function toInputValue(iso) {
  const d = iso ? new Date(iso) : new Date();
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}
