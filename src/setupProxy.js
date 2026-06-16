const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/grants',
    createProxyMiddleware({
      target: 'https://api.grants.gov',
      changeOrigin: true,
      pathRewrite: { '^/api/grants': '/v1/api' }
    })
  );
};