import NodeCache from 'node-cache';
import crypto from 'crypto';
import base58 from 'bs58';
import BodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import validator from 'validator';

import {encodeUser} from './token';

// use in-memory cache for random tokens (TODO move to DB when moving to cluster)
// keep tokens for an hour check every 10 minutes for deleting expired tokens
const emailTokenCache = new NodeCache({stdTTL: 3600, checkperiod: 600});
const bodyParser = BodyParser();
const passwordless = Router();

passwordless.post('/api/auth/passwordless/request', bodyParser, (ctx) => {
    const {email, path} = ctx.request.body;
    if (!validator.isIn(path, ['/']) || !validator.isEmail(email)) {
        ctx.throw(400);
    }

    const emailToken = base58.encode(crypto.randomBytes(16));
    if (!emailTokenCache.set(emailToken, {email: validator.normalizeEmail(email), path})) {
        ctx.throw(500);
    }

    // TODO send emailToken via the email instead of
    console.log('passwordless sent: ' + emailToken);

    // next if anyone calls /passwordless?et=<emailToken> before exp it will be redirected to path

    ctx.status = 202; //(Accepted)
});

import cons from 'co-views';
const renderView = cons('../client/server-views');
passwordless.get(['/', '/index.html'], async (ctx) => {
    ctx.body = await renderView('index.html.ejs');
    ctx.type = 'text/html';
});
passwordless.get('/passwordless', async (ctx) => {
    const emailToken = ctx.query.et;
    console.log('passwordless got: ' + emailToken);
    const storedValue = emailTokenCache.get(emailToken);
    let passwordless;
    if (storedValue != null) {
        emailTokenCache.del(emailToken);


        // TODO:
        // find user with that validated email
        //    if not found - create a new user with defaults and set isNewUser=true (used to open registration dialog on client)


        passwordless = {
            sessionToken: encodeUser({_id: 'xxx', role: 'user'}),
            requestedPath: storedValue.path,
            user: {
                email: storedValue.email,
                isNew: true
            }
        };
    } else {
        passwordless = {error: 401};
    }
    ctx.body = await renderView('index.html.ejs', {passwordless: JSON.stringify(
        passwordless
    )});
    ctx.type = 'text/html';
});

export default passwordless;