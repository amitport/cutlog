import module from './base';

module.service('auth.signIn', class {
    static $inject = ['$http'];
    constructor($http) {
        this.$http = $http;
    }
    withEmail(opt) {
        return this.$http.post('/api/auth/signInWithEmail', opt);
    }
    withAuthProvider(authProviderId) {
        console.log('sign in with auth provider = ' + authProviderId);
        return new Promise(() => {})
    }
});
