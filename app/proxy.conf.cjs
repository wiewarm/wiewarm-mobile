const base = new URL(process.env.NG_APP_API_BASE ?? 'https://beta.wiewarm.ch/api/v1');

module.exports = {
  '/api': {
    target: base.origin,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};