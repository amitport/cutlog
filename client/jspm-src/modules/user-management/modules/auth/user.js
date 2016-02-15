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
            $get: ['$injector', '$log', '$q', '$rootScope', '$window', '$location', 'auth.tokens',
                function ($injector, $log, $q, $rootScope, $window, $location, tokens) {
                    // delay $http load in order to resolve circular dependency ($http uses user.signOut in our interceptor)
                    let _$http; function get$http() {return _$http || (_$http = $injector.get('$http'));}


                    const user = {
                        isSignedIn: false,
                        signInPromise: $q.reject(),
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

                            return this.signInPromise = get$http().get('/api/users/me', {requireAuth: true}).then(({data}) => {
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
                            const wasSignedIn = this.isSignedIn;
                            tokens.clear();

                            this.signInPromise = $q.reject();
                            this.isSignedIn = false;

                            USER_FIELDS.forEach((userField) => {
                                delete this[userField];
                            });

                            delete $window.localStorage.authTokens;

                            if (wasSignedIn) {
                                $rootScope.$broadcast('auth.sign-out');
                            }
                            $log.info('signed out');
                        },
                        attemptImmediateSignIn() {
                            // currently this only checks for valid authTokens are on localStorage
                            if ($window.localStorage.hasOwnProperty('authTokens')) {
                                this.signIn(JSON.parse($window.localStorage.authTokens), true);
                            }
                        },
                        signInWithEmail(email) {
                            return get$http().post('/api/auth/signInWithEmail', {email, path: $location.path()});
                        },
                        signInWithAuthProvider() {
                            const width = 452;
                            const height = 633;
                            $window.open(
`https://accounts.google.com/o/oauth2/v2/auth?\
client_id=162817514604-3flbnsg9cali5j0mrnqjmgi2h6keo7uk.apps.googleusercontent.com&\
response_type=code&\
scope=openid&\
redirect_uri=${$window.location.origin}/api/auth/google`,

'google_oauth2_login_popup',

`width=${width},\
height=${height},\
left=${($window.screenX + (($window.outerWidth - width) / 2))},\
top=${($window.screenY + (($window.outerHeight - height) / 2.5))}`);
                        }
                    };

                    // listen for popup post-message new auth details
                    $window.addEventListener('message', (event) =>{
                        if ((event.origin || event.originalEvent.origin) !== $window.location.origin) return;

                        const auth = event.data.auth;
                        if (auth.isRegistered) {
                            user.signIn({access: auth.accessToken});
                        } else {
                            $rootScope.$broadcast('auth.new', auth.authToken);
                        }
                    });

                    return user;
                }]
        }
    }]);

module.run(['auth.user', function (user) {
    // try and sign in immediately
    user.attemptImmediateSignIn();
}]);