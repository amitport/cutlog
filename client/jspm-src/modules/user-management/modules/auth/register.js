import module from './base';

module.factory('auth.register', ['$http', 'auth.tokens', function ($http, tokens) {
    return {
        sendRequest(authToken, body) {
            return $http.post('/api/users/actions/register', body, {headers: {'X-Auth-Token': authToken}})
                .then(({data}) => {
                    tokens.set(data);
                });
        }
    };
}]);
