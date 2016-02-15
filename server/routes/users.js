import Router from 'koa-router';
import {ensureUser, ensureAuth} from '../koa-auth';
import {encodeUser} from '../tokens';
import User from '../models/user';
import bodyParser from '../bodyParser';

const users = Router();

users.get('/api/users/me', ensureUser, async (ctx) => {
    const user = await User.findById(ctx.state.user._id, '-_id username avatarImageUrl', {lean: true}).exec();
    if (user == null) {
        ctx.throw(404);
    }
    ctx.body = user;
});

users.post('/api/users/actions/register', ensureAuth, bodyParser, async (ctx) => {
    const user = new User();
    user.username = ctx.request.body.username;
    const auth = ctx.state.auth;
    user[auth.method] = ctx.state.auth[auth.method];

    try {
        ctx.body = {access: encodeUser(await user.trySave())};
    } catch(err) {
        if (err.name === 'ValidationError'
            &&
            err.errors.hasOwnProperty('username')
            &&
            err.errors.username.kind === 'Duplicate value') {
            ctx.throw(409);
        }
        throw err;
    }
});
export default users;