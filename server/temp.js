import Router from 'koa-router';
import {ensureUser} from './koa-auth';

const temp = Router();

temp.get('/temp', ensureUser, (ctx) => {
    ctx.body = 'temp';
});

export default temp;