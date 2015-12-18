import {encode, decode} from './token';

export function ensureUser(ctx, next) {
    if (!ctx.headers.authorization) {
        ctx.throw(401);
    }

    let decodedToken;
    try {
        decodedToken = decode(ctx.headers.authorization.slice(7));
    } catch (e) {
        ctx.throw(401);
    }
    ctx.state.user = decodedToken.user;
    next();
}

export function ensureRole(role) {
    return function(ctx, next) {
        ensureUser(ctx, function() {
            if (ctx.state.user.role === role) {
                next();
            } else {
                ctx.throw(403);
            }
        });
    }
}

export const ensureAdmin = ensureRole('admin');