import angular from 'angular';
import 'angular-material';
import 'angular-route';
import 'satellizer';

const module = angular.module('clPasswordLess', ['ngMaterial', 'ngRoute', 'satellizer' /*, 'pascalprecht.translate'*/]);

module
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider.when('/passwordless', {
            template: '',
            controller: 'clPasswordlessCtrl'
        });
    }])
    .controller('clPasswordlessCtrl',
        class {
            static $inject = ['$location', '$mdToast', '$auth', '$window', '$timeout', 'clLog'];

            constructor($location, $mdToast, $auth, $window, $timeout, clLog) {
                if (!$window.hasOwnProperty('passwordless')) {
                    $location.url('errors/500').replace();
                    return;
                }

                if ($window.passwordless.hasOwnProperty('error')) {
                    $location.url(`errors/${$window.passwordless.error}`).replace();
                    return;
                }

                $auth.setToken($window.passwordless.sessionToken)
                if ($window.passwordless.user.isNew) {
                    $location.url($window.passwordless.requestedPath).replace();
                    $timeout(() => {
                        clLog.openUserDetailsDialog(undefined, $window.passwordless.user);
                    });
                } else {
                    // TODO this
                    $mdToast.showSimple('welcome back ' + $window.passwordless.user.email);
                }

            }
        }
    );


export default module.name;