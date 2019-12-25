const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/add', 
    {
        target: 'http://202.193.60.135:8000/',
        changeOrigin: true,
    }));
    app.use(proxy('/api', {
          target: 'http://202.193.60.172:4000/',
          changeOrigin: true,
          pathRewrite: {
            '/api': ''
          }   
       }
    ))
  
};
