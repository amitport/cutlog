import {module} from './module';

module
.config(($routeProvider) => {
    $routeProvider.when('/passwordless/:token', {
        template: '',
        controller: 'PasswordlessCtrl'
    });
})
.controller('PasswordlessCtrl',
    class PasswordlessCtrl {
        constructor($http, $routeParams, $location, $mdToast, $mdDialog) {
            $http
            .post('/api/auth/passwordless/accept', {token: $routeParams.token})
            .then(({data}) => {
              console.log(data);
              $location.path(data.requestedPath);
                if (data.user.isNew) {
                    $mdDialog.show(
                        {
                            clickOutsideToClose: true,
                            templateUrl: 'partials/userDetailsDialog.html',
                            controllerAs: 'ctrl',
                            locals: {
                                user: data.user
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
                } else {
                    // TODO this
                    $mdToast.showSimple('welcome ' + data.user.email);
                }
            })
            .catch(({data}) => {
                //TODO this
                console.error(data);
            });
        }
    }
);