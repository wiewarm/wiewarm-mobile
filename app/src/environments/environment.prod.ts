const env = (import.meta as any).env ?? {};

const apiBase = env.NG_APP_API_BASE ?? 'https://beta.wiewarm.ch/api/v1';
const imageBase = 'https://www.wiewarm.ch/';

export const environment = {
  apiBase,
  imageBase,
};
