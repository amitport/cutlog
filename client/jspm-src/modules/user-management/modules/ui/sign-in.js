import module from './base';

//noinspection JSUnresolvedVariable
module.component('signIn',
    {
        templateUrl: `${__moduleName.replace(/[^\/]*$/, '')}sign-in.html`,
        controller: ['$scope', 'auth.user', function ($scope, user) {
            this.state = 'selection';

            this.signInWithAuthProvider = user.signInWithAuthProvider.bind(user);

            this.signInWithEmail = function () {
                if (this.passwordlessForm.$invalid) {
                    this.passwordlessForm.email.$setTouched();
                    return;
                }

                user.signInWithEmail({email: this.email, path: '/'})
                    .then(() => {
                        this.state = 'emailSent';
                    })
                    .catch(() => {
                        this.passwordlessForm.email.$setValidity('server', false);

                        const formFieldWatcher = $scope.$watch(() => this.passwordlessForm.email.$viewValue, (newValue, oldValue) => {
                            if (newValue === oldValue) {
                                return;
                            }

                            // clean up the server error
                            this.passwordlessForm.email.$setValidity('server', true);

                            // clean up form field watcher
                            formFieldWatcher();
                        });
                    });
            }
        }]
    });
