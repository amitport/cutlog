import {module} from './module';
import './lang';
import './errors';
//
//import './components/log-switch';
//import './components/passwordlessRoute';

module.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        template: 'main <br><user-box></user-box>'
    });
}]);

module.run(['$rootScope', '$http',
            function($rootScope, $http) {
    $rootScope.getTemp = () =>
        $http.get('/temp').then(({data}) => {
            $rootScope.tempData = data;
        }).catch((rejection) => {$rootScope.rejection = rejection;});
}]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['cutlog'], {strictDi: true});
});

