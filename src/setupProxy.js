const proxy = require('http-proxy-middleware');
module.exports = app => {
    app.use(proxy('/api', {target: 'https://content.webapi-services.net', changeOrigin: true, secure: false}));
    app.use(proxy('/fihservices', {target: 'https://www.iforex.in', changeOrigin: true, secure: false}));
}