const apiBase =
  (import.meta as any).env?.NG_APP_API_BASE ?? 'https://www.wiewarm.ch/api/v1';

export const environment = {
  apiBase,
};
