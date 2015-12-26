import angular from 'angular';
import 'angular-material';
import 'angular-route';

const module = angular.module('clPasswordLess', ['ngMaterial', 'ngRoute' /*, 'pascalprecht.translate'*/]);

module
    .config(($routeProvider) => {
        $routeProvider.when('/passwordless', {
            template: '',
            controller: 'clPasswordlessCtrl'
        });
    })
    .controller('clPasswordlessCtrl',
        class {
            constructor($location, $mdToast, $mdDialog, $window, $timeout, clLog) {
                if (!$window.hasOwnProperty('passwordless')) {
                    $location.url('errors/500').replace();
                    return;
                }

                if ($window.passwordless.hasOwnProperty('error')) {
                    $location.url(`errors/${$window.passwordless.error}`).replace();
                    return;
                }

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