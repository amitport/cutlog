import module from './base';
import './toast';

module.factory('registerDialog', ['$mdDialog', function ($mdDialog) {
    return {
        open(authToken) {
            //noinspection JSUnresolvedVariable
            $mdDialog.show(
                {
                    templateUrl: `${__moduleName.replace(/[^\/]*$/, '')}register-dialog.html`,
                    controller: 'registerDialogController',
                    controllerAs: '$ctrl',
                    locals: {authToken}
                });
        }
    }
}]);

module.controller('registerDialogController', ['$scope', '$mdDialog', 'auth.register', 'ui.toast', 'authToken',
    function ($scope, $mdDialog, register, toast, authToken) {
        this.register = (username) => {
            if (this.registrationForm.$invalid) {
                this.registrationForm.username.$setTouched();
                return;
            }

            register.sendRequest(authToken, {username})
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
    }]);