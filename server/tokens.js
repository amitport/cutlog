import jwt from 'jwt-simple';
import moment from 'moment';


//import config from 'config';
//const log = config.get('log');
//
//var tokenSecret = config.get('auth.tokenSecret');

export function encodeUser(user) {
    return jwt.encode({
            sub: user._id,
            role: user.role
        },
        '32312');
    //tokenSecret);
}

export function decodeUser(token) {
    var payload = jwt.decode(token, '32312' /*tokenSecret */);

    return {
        _id: payload.sub,
        role: payload.role
    };
}
export function encodeAuth(auth) {
    return jwt.encode({
            auth,
            exp: moment().add(1, 'hours').unix()
        },
        '32312');
    //todo tokenSecret);
}

export function decodeAuth(token) {
    const payload = jwt.decode(token, '32312' /* todo tokenSecret */);
    if (payload.exp < moment().unix()) {
        throw Error('Token expired');
    }
    return payload.auth;
}