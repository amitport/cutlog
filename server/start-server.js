import Koa from 'koa';
import serve from './koa-static/index';

const app = new Koa();

app.use(serve('../client/jspm-src'));
// logger
app.use(async (ctx, next) => {
    const start = new Date;
    await next();
    const ms = new Date - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


// response
app.use(ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000, function () {
    console.log("opened server on %j", this.address().port);
});