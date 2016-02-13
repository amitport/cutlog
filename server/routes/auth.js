import Router from 'koa-router';
import NodeCache from 'node-cache';
import validator from 'validator';
import crypto from 'crypto';
import base58 from 'bs58';
import SparkPost from 'sparkpost';

const sparkPost = new SparkPost();

import {encodeUser, encodeAuth} from '../tokens';
import {ensureAuth} from '../koa-auth';

import renderView from '../renderView'
import bodyParser from '../bodyParser';
import User from '../models/user';

// use in-memory cache for random tokens (TODO move to DB when moving to cluster)
// keep email tokens for an hour check every 10 minutes for deleting expired tokens
const emailTokenCache = new NodeCache({stdTTL: 3600, checkperiod: 600});

const auth = Router();

auth.post('/api/auth/signInWithEmail', bodyParser, async (ctx) => {
    const {email, path} = ctx.request.body;
    if (!validator.isIn(path, ['/']) // hard-code white-list redirect paths
        || !validator.isEmail(email)) {
        ctx.throw(400);
    }

    const emailToken = base58.encode(crypto.randomBytes(16));
    if (!emailTokenCache.set(emailToken, {email: validator.normalizeEmail(email), path})) {
        ctx.throw(500);
    }

    const cbUrl = `${process.env.HOST_URL}/et/${emailToken}`;
    sparkPost.transmissions.send({
        transmissionBody: {
            content: {
                from: {
                    name: "cutlog",
                    email: "sandbox@sparkpostbox.com"
                },
                subject: 'e-mail sign-in',
                reply_to: 'Amit Portnoy <amit.portnoy@gmail.com>',
                text: `
Sign-in to cutlog with the following link:

${cbUrl}
`,
                html: `
<div>Sign-in to cutlog with the following link:
<br><br>
<a href="${cbUrl}">${cbUrl}</a>
</div>
`
            },
            recipients: [{address: {email}}]
        }
    }, function (err, res) {
        if (err) {
            console.log('Whoops! Something went wrong');
            console.error(err);
        } else {
            console.log(res.body);
        }
    });

    // next if anyone calls /et/<emailToken> before exp it will be redirected to path
    console.log('passwordless sent: ' + emailToken);
    ctx.status = 202; //(Accepted)
});

auth.get('/et/:et', async (ctx) => {
    const emailToken = ctx.params.et;
    console.log('passwordless got: ' + emailToken);
    const storedValue = emailTokenCache.get(emailToken);
    let passwordless;
    if (storedValue == null) {
        ctx.throw(401);
    }

    emailTokenCache.del(emailToken);


    const user = await User.findOne({email: storedValue.email}).select('role').lean().exec();

    const emailAuth = {originalPath: storedValue.path};
    if (user != null) {
        emailAuth.isRegistered = true;
        emailAuth.accessToken = encodeUser(user);
    } else {
        emailAuth.isRegistered = false;
        emailAuth.authToken = encodeAuth({method: 'email', email: storedValue.email})
    }

    ctx.body = await renderView('index.html.ejs', {
            __flash: JSON.stringify({emailAuth}),
            env: process.env.NODE_ENV
        }
    );
    ctx.type = 'text/html';
});

export default auth;