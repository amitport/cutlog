import {module} from './module';

module
.config(($routeProvider) => {
    $routeProvider.when('/passwordless', {
        template: '',
        controller: 'PasswordlessCtrl'
    });
})
.controller('PasswordlessCtrl',
    class PasswordlessCtrl {
        constructor($location, $mdToast, $mdDialog, $window, $timeout) {
            if ($window.hasOwnProperty('passwordless')) {
                if ($window.passwordless.hasOwnProperty('error')) {
                    $location.url(`errors/${$window.passwordless.error}`).replace();
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
                                    cancel() {$mdDialog.cancel();}
                                }
                            }
                        )
                    });
                } else {
                    // TODO this
                    $mdToast.showSimple('welcome back ' + $window.passwordless.user.email);
                }
            } else {
                $location.url('errors/500').replace();
            }
        }
    }
);