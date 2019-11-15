import express from 'express';
import path from 'path';
// import logger from './utils/logger';
import bodyParse from 'body-parser';
import log4js from 'log4js';
import cookieParse from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
// import routes from './routes/index';
// import config from './config/app.config';


const app = express();

// app.use(log4js.connectLogger(logger('normal'), {level:'auto', format: ':method :url :status'}));  //日志
app.get('/getItem/:item', (req, res) => {
  console.log('fddf')
  res.send(req.params.item);
})

app.use(log4js.connectLogger(log4js.getLogger('express')));
app.use(bodyParse.json()); // 解析url信息中的参数
app.use(bodyParse.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParse(config.secret)); //解析签名cookie
app.use(cors());

// 设置session
// app.use(session({
//   // store: store,
//   cookie: {
//     maxAge: 60*1000
//   },
//   resave: false,
//   saveUninitialized: true,
//   secret: config.secret
// }))


// app.use(/\/api/, tools);
// app.use(/\/api/, express.static('public'));

// routes(app);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

export default app;