const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api', {
          target: 'http://202.193.60.134:4000/',
          changeOrigin: true,
          pathRewrite: {
            '/api': ''
          }   
       }
    ))
  
};
