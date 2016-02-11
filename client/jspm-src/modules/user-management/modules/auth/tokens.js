import module from './base';
import moment from 'moment';

module.provider(`${module.name}.tokens`,
    ['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push([`${module.name}.tokens`, function (tokens) {
            return {
                request: function (config) {
                    //noinspection JSUnresolvedVariable
                    if (!config.requireAuth) {
                        return config;
                    }

                    return tokens.refresh().then(() => {
                        config.headers['X-Access-Token'] = tokens.access;
                        return config;
                    });
                },
                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        // user is does not really have the correct credentials
                        // make sure the authentication is clear
                        tokens.clear();
                    }
                    return Promise.reject(rejection);
                }
            };
        }]);

        return {
            $get: ['$injector', '$window', '$rootScope', '$timeout', '$log',
                function ($injector, $window, $rootScope, $timeout, $log) {
                    let ongoingAuthentication;
                    let authenticateCanceler;
                    let tokens;
                    let accessExpiry;
                    function calcAccessExpiry() {
                        // * decoding assumes no base64 padding which assumes it is generated from byte number that is divisible by 3
                        const decodedAccessToken = JSON.parse($window.atob(tokens.access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                        accessExpiry = (decodedAccessToken.hasOwnProperty('exp')) ?
                            moment.unix(decodedAccessToken.exp) : false;
                    }

                    let $http;
                    $timeout(function () {
                        // delay $http load in order to resolve circular dependency ($http uses auth.refresh in our interceptor)
                        $http = $injector.get('$http');

                        // delay local storage load in order to give a chance to others to register to setTokenEvent
                        if ($window.localStorage.hasOwnProperty('authTokens')) {
                            tokens = JSON.parse($window.localStorage.authTokens);
                            calcAccessExpiry(); // TODO maybe just save the expiry in local storage
                            $rootScope.$broadcast('auth.set', tokens);
                        }
                    });


                    return {
                        get access() {
                            if (tokens != null)
                                return tokens.access;
                        },
                        set(data) {
                            if (!tokens) {
                                // we are not currently authenticated
                                tokens = data;
                            } else {
                                // this is just an access refresh
                                //noinspection JSUnusedAssignment
                                tokens.access = data.access;
                            }

                            calcAccessExpiry();
                            $window.localStorage.authTokens = JSON.stringify(tokens);
                            $rootScope.$broadcast('auth.set', tokens);
                        },
                        authenticate(credentials = {refresh: tokens.refresh}) {
                            //noinspection JSUnusedAssignment
                            return ongoingAuthentication = $http.post('/auth/request', credentials,
                                {
                                    timeout: new Promise((resolve) => {
                                        authenticateCanceler = resolve;
                                    })
                                }
                            ).then(({data}) => {
                                $log.info('authentication succeeded');
                                this.set(data);
                            }).catch((rejection) => {
                                $log.warn('authentication failed');
                                return Promise.reject(rejection);
                            }).finally(() => {
                                ongoingAuthentication = false;
                                authenticateCanceler = false;
                            });
                        },
                        clear() {
                            if (authenticateCanceler) authenticateCanceler();
                            if (tokens) {
                                if (tokens.hasOwnProperty('refresh')) {
                                    //noinspection JSUnusedAssignment
                                    $http.post('/auth/revoke', {refresh: tokens.refresh});
                                }
                                tokens = false;
                                delete $window.localStorage.authTokens;
                                $rootScope.$broadcast('auth.cleared');
                            }
                        },
                        refresh() {
                            if (ongoingAuthentication) {
                                return ongoingAuthentication;
                            } else if (!tokens) {
                                // we don't have tokens - fail
                                return Promise.reject({status: 401});
                            } else if (!accessExpiry || accessExpiry.isAfter(moment().add(20, 'minutes'))) {
                                // access token does not have an expiry or we still have more than 20 minutes before expiry
                                // -> this is fresh enough
                                return Promise.resolve();
                            } else {
                                return this.authenticate();
                            }
                        }
                    };
                }]
        }
    }]);