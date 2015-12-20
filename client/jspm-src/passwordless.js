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
        constructor($http, $location, $mdToast, $mdDialog) {
            const emailToken = $location.search().et;
            if (emailToken == null) {
                $mdToast.showSimple('missing expected email token');
                $location.search({}).path('').replace();
                return;
            }
            $http
            .post('/api/auth/passwordless/accept', {emailToken})
            .then(({data}) => {
              console.log(data);
              $location.search({}).path(data.requestedPath).replace();
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
                    $mdToast.showSimple('welcome back ' + data.user.email);
                }
            })
            .catch(({data}) => {
                //TODO this
                console.error(data);
            });
        }
    }
);