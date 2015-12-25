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
            constructor($location, $mdToast, $mdDialog, $window, $timeout) {
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
                        $mdDialog.show(
                            {
                                clickOutsideToClose: true,
                                templateUrl: 'partials/userDetailsDialog.html',
                                controllerAs: 'ctrl',
                                locals: {
                                    user: $window.passwordless.user
                                },
                                bindToController: true,
                                controller: class {
                                    constructor($mdDialog) {
                                        this.$mdDialog = $mdDialog;
                                    }

                                    cancel() {
                                        $mdDialog.cancel();
                                    }
                                }
                            }
                        )
                    });
                } else {
                    // TODO this
                    $mdToast.showSimple('welcome back ' + $window.passwordless.user.email);
                }

            }
        }
    );


export default module.name;