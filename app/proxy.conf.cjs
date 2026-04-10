// Default local proxy targets for development against the Docker backend.
const apiBase = new URL(
  process.env.NG_APP_API_BASE ?? "http://localhost:3770/api/v1",
);
const imageBase = new URL(
  process.env.NG_APP_IMAGE_BASE ?? "http://localhost:3770/",
);

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
