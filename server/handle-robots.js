import assert from 'assert';
import Router from 'koa-router';

import {ensureUser} from './middleware';

export default function handleRobots(app, opt = {disallow: ''}) {
    const robotsTxt = `
User-agent: *
Disallow: ${opt.disallow}
`;
    const router = Router();
    router.get('/robots.txt', ensureUser, (ctx) => {
        ctx.set('Content-Type', 'text/plain');
        ctx.body = robotsTxt;
    });

    app.use(router.routes());
}
