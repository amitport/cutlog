import Koa from 'koa';
import convert from 'koa-convert';
import serve from 'koa-static';

const app = new Koa();

app.use(convert(serve('../client/jspm-src')));  //TODO enable this only in development and include sfx version in production
if (process.env.NODE_ENV === 'production') {
    app.use(convert(serve('../client/jspm-sfx')));
}
app.use(convert(serve('../client/dev-src'))); //TODO enable this only in development

import initializeDbConnection from './models/initializeDbConnection';
initializeDbConnection();

import renderView from './renderView';
import Router from 'koa-router';
const indexRouter = Router();
indexRouter.get(['/', '/index.html', '/users/me'], async (ctx) => {
    ctx.body = await renderView('index.html.ejs', {env: process.env.NODE_ENV});
    ctx.type = 'text/html';
});
app.use(indexRouter.routes());
import auth from './routes/auth';
app.use(auth.routes());
import users from './routes/users';
app.use(users.routes());

app.listen(process.env.PORT || 3000, function () {
    console.log("opened server on %j", this.address().port);
});