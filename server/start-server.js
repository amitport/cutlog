import Koa from 'koa';
import serve from './koa-static/index';

const app = new Koa();

app.use(serve('../client/jspm-src'));  //TODO enable this only in development and inlude sfx version in production
app.use(serve('../client/dev-src')); //TODO enable this only in development

import Router from 'koa-router';
import send from 'koa-send';
import path from 'path';

//const angularIdx = Router();
//angularIdx.get(/\/passwordless/, async (ctx) => {
//    await send(ctx, 'index.html', {root: path.resolve('../client/jspm-src')});
//});
//app.use(angularIdx.routes());

import passwordless from './passwordless';
app.use(passwordless.routes());

app.listen(3000, function () {
    console.log("opened server on %j", this.address().port);
});