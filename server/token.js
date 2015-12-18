import jwt from 'jwt-simple';
import moment from 'moment';

//import config from 'config';
//const log = config.get('log');
//
//var tokenSecret = config.get('auth.tokenSecret');

export function encode(user) {
    return jwt.encode({
            sub: user._id,
            iat: moment().unix(),
            role: user.role
        },
        '32312');
        //tokenSecret);
}

export function decode(token) {
    var payload = jwt.decode(token, tokenSecret);

    return {
        user: {
            _id: 	payload.sub,
            role: payload.role
        }
    };
}
