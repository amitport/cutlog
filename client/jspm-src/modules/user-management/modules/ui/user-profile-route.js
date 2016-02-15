import module from './base';
import template from './user-profile-route.html!text';

module.config(['$routeProvider', ($routeProvider) => {
    $routeProvider.when('/users/me', {
        template,
        controllerAs: '$ctrl',
        controller: ['auth.user', 'ui.signInDialog', '$rootScope', '$location',
            function (user, signInDialog, $rootScope, $location) {
            user.signInPromise.catch(() =>  {
                signInDialog.open()
                    .catch(() => {$location.url('/');});
            });

            $rootScope.$on('auth.sign-out', () => {$location.url('/');});

            this.user = user;
        }]
    });
}]);