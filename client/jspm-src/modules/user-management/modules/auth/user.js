import module from './base';

const USER_FIELDS = ['username'];

module.provider('auth.user',
    ['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['auth.user', function (user) {
            return {
                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        // user is does not really have the correct credentials
                        // make sure the authentication is clear
                        user.signOut();
                    }
                    return Promise.reject(rejection);
                }
            };
        }]);

        return {
            $get: ['$injector', '$log', '$rootScope', '$window', 'auth.tokens',
                function ($injector, $log, $rootScope, $window, tokens) {
                    // delay $http load in order to resolve circular dependency ($http uses user.signOut in our interceptor)
                    let _$http; function get$http() {return _$http || (_$http = $injector.get('$http'));}

                    return {
                        isSignedIn: false,
                        register(authToken, registration) {
                            return get$http()
                                .post('/api/users/actions/register',
                                    registration,
                                    {headers: {'x-auth-token': authToken}})
                                .then(({data}) => {
                                    this.signIn(data);
                                });
                        },
                        signIn(_tokens, skipAuthTokensStorage = false) {
                            tokens.set(_tokens);

                            return get$http().get('/api/users/me', {requireAuth: true}).then(({data}) => {
                                this.isSignedIn = true;

                                USER_FIELDS.forEach((userField) => {
                                    this[userField] = data[userField];
                                });

                                if (!skipAuthTokensStorage) {
                                    $window.localStorage['authTokens'] = JSON.stringify(_tokens);
                                }

                                $rootScope.$broadcast('auth.sign-in');
                                $log.info('signed in as ' + this.username);
                            });
                        },
                        signOut() {
                            tokens.clear();

                            this.isSignedIn = false;

                            USER_FIELDS.forEach((userField) => {
                                delete this[userField];
                            });

                            delete $window.localStorage.authTokens;

                            $rootScope.$broadcast('auth.sign-out');
                            $log.info('signed out');
                        },
                        attemptImmediateSignIn() {
                            // currently this only checks for valid authTokens are on localStorage
                            if ($window.localStorage.hasOwnProperty('authTokens')) {
                                this.signIn(JSON.parse($window.localStorage.authTokens), true);
                            }
                        },
                        signInWithEmail(opt) {
                            return get$http().post('/api/auth/signInWithEmail', opt);
                        },
                        signInWithAuthProvider() {
                            $log.info(arguments);
                            // todo this
                        }
                    };
                }]
        }
    }]);

module.run(['auth.user', function (user) {
    // try and sign in immediately
    user.attemptImmediateSignIn();
}]);