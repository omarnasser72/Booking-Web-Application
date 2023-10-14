import createProxyMiddleware from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: "https://booking-fwaz.onrender.com",
      changeOrigin: true,
    })
  );
};
