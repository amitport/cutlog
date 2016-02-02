//export default class AuthTokens {
//
//    static $inject = ['storage'];
//    constructor(storage) {
//        if (storage.hasOwnProperty('authTokens')) {
//            Object.assign(this, JSON.parse(storage.authTokens));
//        }
//    }
//}
import {module} from './module';
module.constant('storage', localStorage);
module.service('authTokens', class AuthTokens {
    static $inject = ['storage'];

    constructor(storage) {
        if (storage.hasOwnProperty('authTokens')) {
            this.set(JSON.parse(storage.authTokens));
        }
        this._storage = storage;
    }

    set(authTokensDto) {
        this.access = authTokensDto.access;
        if (authTokensDto.hasOwnProperty('refresh')) {
            this.refresh = authTokensDto.refresh;
        }
    }

    setAndStore(authTokensDto) {
        this.set(authTokensDto);
        this.store();
    }

    store() {
        this._storage.authTokens = JSON.stringify({access: this.access, refresh: this.refresh});
    }
});
module.service('currentUser', class CurrentUser {
   static $inject = ['$http', 'authTokens', '$timeout'];
   constructor($http, authTokens, $timeout) {
       this._$http = $http;
       this._authTokens = authTokens;
       this._$timeout = $timeout;


       this.isSignedIn = false;
       this.refreshCycle();

   }
    refreshCycle() {
        this.refreshAccessToken().then(this.getProfile.bind(this)).then(() => {
            this.isSignedIn = true;
            this._$timeout(this.refreshCycle.bind(this), 3600000 /* 1 hour */)
        }).catch(() => {
            this.isSignedIn = false;
            this._authTokens.clear();
        });
    }

    refreshAccessToken() {
        return this._$http.post('/auth/refresh', {refreshToken: this._authTokens.refresh}).then(function ({data}) {
            this._authTokens.setAndStore(data);
        });
    }

    getProfile() {
        return this._$http.get('/profiles/me', {includeAccessToken: true}).then(function ({data}) {
            this.profile = data;
        });
    }

});
module.run(['$interval', function ($interval) {
    $interval(function () {
        console.log('yeah!')
    }, 10000);
    //$timeout(function () {
    //    $http.post('/auth/refresh', {refreshToken: authTokens.refresh}).then(function ({data}) {
    //        authTokens.setAndStore(data);
    //    });
    //}, 3000 /* time until session timeout */);
}]);
module.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['authTokens', (authTokens) => {
        return {
            request: (config) => {
                if (config.includeAccessToken && authTokens.hasOwnProperty('access')) {
                    config.headers['X-ACCESS-TOKEN'] = authTokens.access;
                }
                return config;
            }
        };
    }]);
}]);