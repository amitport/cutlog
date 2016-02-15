import module from './base';
import './toast';
import template from './register-dialog.html!text';

module.factory('ui.registerDialog', ['$mdDialog', function ($mdDialog) {
    return {
        open(authToken) {
            //noinspection JSUnresolvedVariable
            $mdDialog.show(
                {
                    template,
                    controllerAs: '$ctrl',
                    locals: {authToken},
                    controller: ['$scope', '$mdDialog', 'auth.user', 'authToken',
                        function ($scope, $mdDialog, user, authToken) {
                            this.register = (username) => {
                                if (this.registrationForm.$invalid) {
                                    this.registrationForm.username.$setTouched();
                                    return;
                                }

                                user.register(authToken, {username})
                                    .then(() => {
                                        $mdDialog.hide();
                                    })
                                    .catch((rejection) => {
                                        const validationError = (rejection.status === 409) ? 'conflict' : 'server';

                                        this.registrationForm.username.$setValidity(validationError, false);

                                        const formFieldWatcher = $scope.$watch(() => this.registrationForm.username.$viewValue, (newValue, oldValue) => {
                                            if (newValue === oldValue) {
                                                return;
                                            }

                                            // clean up the server error
                                            this.registrationForm.username.$setValidity(validationError, true);

                                            // clean up form field watcher
                                            formFieldWatcher();
                                        });
                                    });
                            };
                            this.cancel = () => {
                                $mdDialog.cancel();
                            }
                        }]
                });
        }
    }
}]);

module.run(['$rootScope', 'ui.registerDialog', function ($rootScope, registerDialog) {
    $rootScope.$on('auth.new', (event, authToken) => {
        registerDialog.open(authToken);
    })
}]);
