import module from './base';

module.config(['$routeProvider', ($routeProvider) => {
    $routeProvider.when('/et/:et', {
        template: '',
        controller: ['$rootScope', '$location', '$timeout', 'flash', 'auth.user',
                    function ($rootScope, $location, $timeout, flash, user) {
            // the token was verified by the server which added auth info on flash.emailAuth
            $location.url(flash.emailAuth.originalPath).replace();

            if (flash.emailAuth.isRegistered) {
                user.signIn({access: flash.emailAuth.accessToken});
            } else {
                $rootScope.$broadcast('auth.new', flash.emailAuth.authToken);
            }
        }]
    });
}]);
