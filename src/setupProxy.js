const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/users',
        {
            target: 'http://202.193.60.172:4000/',
            changeOrigin: true,
            // pathRewrite:{
             
            // },
            ws: true, // 启用websocket
        }
    ));
    app.use(proxy('/add', 
    {
        target: 'http://202.193.60.135:8000/',
        changeOrigin: true,
    }))
};
