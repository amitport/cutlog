import module from './base';

module.config(['$routeProvider', ($routeProvider) => {
    $routeProvider.when('/users/me', {
        template: '<table><tr><th>user | json</th></tr><tr><td>{{$ctrl.user | json}}</td></tr></table>',
        controllerAs: '$ctrl',
        controller: ['auth.user', function (user) {
            this.user = user;
        }]
    });
}]);