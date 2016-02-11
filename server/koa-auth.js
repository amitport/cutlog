import {decodeUser} from './token';

export async function ensureUser(ctx, next) {
    if (!ctx.headers['x-access-token']) {
        ctx.throw(401);
    }

    let decodedToken;
    try {
        decodedToken = decodeUser(ctx.headers['x-access-token']);
    } catch (e) {
        ctx.throw(401);
    }
    ctx.state.user = decodedToken.user;
    await next();
}

export function ensureRole(role) {
    return async function(ctx, next) {
        await ensureUser(ctx, async function() {
            if (ctx.state.user.role !== role) {
                ctx.throw(403);
            } else {
                await next();
            }
        });
    }
}

export const ensureAdmin = ensureRole('admin');