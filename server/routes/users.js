import Router from 'koa-router';
import {ensureUser} from '../koa-auth';
import User from '../models/user';

const users = Router();

users.get('/api/users/me', ensureUser, async (ctx) => {
    const user = await User.findById(ctx.state.user._id, '_id displayName avatarImageUrl', {lean: true}).exec();
    if (user == null) {
        ctx.throw(404);
    }
    ctx.body = user;
});

export default users;