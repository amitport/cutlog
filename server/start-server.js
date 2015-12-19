import Koa from 'koa';
import serve from './koa-static/index';

const app = new Koa();

app.use(serve('../client/jspm-src'));

import Router from 'koa-router';
import send from 'koa-send';
import path from 'path';

const angularIdx = Router();
angularIdx.get(/\/passwordless\/[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, async (ctx) => {
    await send(ctx, 'index.html', {root: path.resolve('../client/jspm-src')});
});
app.use(angularIdx.routes());

import BodyParser from 'koa-bodyparser';
const bodyParser = BodyParser();
const passwordless = Router();
import {encodePasswordlessRequest, decodePasswordlessRequest, encodeUser} from './token';
import validator from 'validator';

passwordless.post('/api/auth/passwordless/request', bodyParser, (ctx) => {
    const {email, path} = ctx.request.body;
    if (!validator.isIn(path, ['/']) || !validator.isEmail(email)) {
        ctx.throw(400);
    }

    const token = encodePasswordlessRequest({email: validator.normalizeEmail(email), path});

    // TODO send token via the email instead of
    console.log(token);

    // next if anyone calls /passwordless/<token> before exp it will be redirected to path

    ctx.status = 202; //(Accepted)
});
passwordless.post('/api/auth/passwordless/accept', bodyParser, (ctx) => {
    let decoded;
    try {
        decoded = decodePasswordlessRequest(ctx.request.body.token);
    } catch (e) {
        console.error(e);
        ctx.throw(401);
    }

    // TODO:
    // find user with that validated email
    //    if not found - create a new user with defaults and set isNewUser=true (used to open registration dialog on client)
    ctx.body = {
        token: encodeUser({_id: 'xxx', role: 'user'}),
        requestedPath: decoded.path,
        user: {
          email: decoded.email,
          isNew: true
        }
    };

});
app.use(passwordless.routes());

app.listen(3000, function () {
    console.log("opened server on %j", this.address().port);
});