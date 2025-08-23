const apiBase = process.env.NG_APP_API_BASE || 'https://beta.wiewarm.ch/api/v1';
const target = new URL(apiBase).origin;

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
