import {module} from './module';
import './lang';
import './errors';
//
//import './components/log-switch';
//import './components/passwordlessRoute';

module.config(($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        template: 'main'
    });
});

module.run(function($rootScope, $http, $window, SatellizerConfig) {
    const authTokenName = SatellizerConfig.tokenPrefix ? SatellizerConfig.tokenPrefix + '_' + SatellizerConfig.tokenName : SatellizerConfig.tokenName;

    $rootScope.getTemp = () =>
        $http.get('/temp').then(({data}) => {
            $rootScope.tempData = data;
        }).catch((rejection) => {$rootScope.rejection = rejection;});

    $window.addEventListener('storage', function(event) {
        if (event.key === authTokenName) {
            $rootScope.$evalAsync();
        }
    });
});
//angular.element(document).ready(function () {
//    angular.bootstrap(document, ['cutlog'], {strictDi: true});
//});

