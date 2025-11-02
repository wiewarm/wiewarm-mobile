const apiBase = new URL(
  process.env.NG_APP_API_BASE ?? "https://beta.wiewarm.ch/api/v1"
);
const imageBase = new URL("https://www.wiewarm.ch/");

module.exports = {
  "/api": {
    target: apiBase.origin,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/image-proxy": {
    target: imageBase.origin,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {
      "^/image-proxy": "",
    },
  },
};
