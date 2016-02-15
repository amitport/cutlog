import module from './base';

module.config(['$routeProvider', ($routeProvider) => {
    $routeProvider.when('/users/me', {
        template: '<table ng-show="$ctrl.user.isSignedIn"><tr><th>user | json</th></tr><tr><td>{{$ctrl.user | json}}</td></tr></table>',
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