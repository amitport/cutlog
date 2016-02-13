import module from './base';

module.config(['$routeProvider', ($routeProvider) => {
    $routeProvider.when('/users/me', {
        template: '<table><tr><th>user | json</th></tr><tr><td>{{$ctrl.user | json}}</td></tr></table>',
        controllerAs: '$ctrl',
        controller: ['auth.user', 'ui.signInDialog', '$rootScope', '$location', function (user, signInDialog, $rootScope, $location) {
            if (!user.isSignedIn) {
                signInDialog.open()
                    .catch(() => {$location.url('/');});
                return;
            }

            $rootScope.$on('auth.sign-out', () => {$location.url('/');});

            this.user = user;
        }]
    });
}]);