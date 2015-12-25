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


//angular.element(document).ready(function () {
//    angular.bootstrap(document, ['cutlog'], {strictDi: true});
//});

