const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://jimcarry.onrender.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('🚀 프록시 요청:', req.method, req.url);
        console.log('📤 타겟:', 'https://jimcarry.onrender.com' + req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ 프록시 응답:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('❌ 프록시 오류:', err.message);
      }
    })
  );
}; 