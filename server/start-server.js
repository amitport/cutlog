import Koa from 'koa';
import serve from './static/index';

const app = new Koa();

import handleRobots from './handle-robots';

app.use(serve('test'));
// logger
app.use(async (ctx, next) => {
    const start = new Date;
    await next();
    const ms = new Date - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

handleRobots(app);

// response
app.use(ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000, function () {
    console.log("opened server on %j", this.address().port);
});