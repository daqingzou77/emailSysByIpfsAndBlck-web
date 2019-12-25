const proxy = require('http-proxy-middleware');
const mapList = ['/users', '/chain', '/mail', '/contact', '/chaincodes', 'channels'];
module.exports = function (app) {
    mapList.map(item => {
        app.use(proxy(item,
        {
            target: 'http://202.193.60.172:4000/',
            changeOrigin: true,
            ws: true, // 启用websocket
        }
        ));
    });
    app.use(proxy('/add', 
    {
        target: 'http://202.193.60.135:8000/',
        changeOrigin: true,
    })); 
};
