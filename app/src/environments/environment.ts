const env = (import.meta as any).env ?? {};

const apiBase = env.NG_APP_API_BASE ?? '/api/v1';
const imageBase = '/image-proxy';

export const environment = {
  apiBase,
  imageBase,
};
