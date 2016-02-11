import module from './base';

module.config(['$routeProvider', ($routeProvider) => {
    $routeProvider.when('/et/:et', {
        template: '',
        controller: ['$rootScope', '$location', '$timeout', 'flash', 'auth.tokens',
                    function ($rootScope, $location, $timeout, flash, tokens) {
            // the token was verified by the server which added auth info on flash.emailAuth
            $location.url(flash.emailAuth.originalPath).replace();
            $timeout(() => { // give time to the new route to "sink in"
                if (flash.emailAuth.isRegistered) {
                    tokens.set({access: flash.emailAuth.accessToken});
                } else {
                    $rootScope.$broadcast('user.register', flash.emailAuth.registrationToken);
                }
            });
        }]
    });
}]);
