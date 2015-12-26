import jwt from 'jwt-simple';
import moment from 'moment';


//import config from 'config';
//const log = config.get('log');
//
//var tokenSecret = config.get('auth.tokenSecret');

export function encodeUser(user) {
    return jwt.encode({
            sub: user._id,
            iat: moment().unix(),
            role: user.role
        },
        '32312');
        //tokenSecret);
}

export function decodeUser(token) {
    var payload = jwt.decode(token, '32312' /*tokenSecret */);

    return {
        user: {
            _id: 	payload.sub,
            role: payload.role
        }
    };
}
export function encodePasswordlessRequest({email, path}) {
    return jwt.encode({
            email,
            path,
            exp: moment().add(1, 'hours').unix()
        },
        '32312');
    //todo tokenSecret);
}

export function decodePasswordlessRequest(token) {
    const decoded = jwt.decode(token, '32312' /* todo tokenSecret */);
    if (decoded.exp < moment().unix()) {
        throw Error('Token expired');
    }
    return decoded;
}