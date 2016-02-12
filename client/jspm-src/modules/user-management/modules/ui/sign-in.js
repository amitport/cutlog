import module from './base';

//noinspection JSUnresolvedVariable
module.component('signIn',
    {
        templateUrl: `${__moduleName.replace(/[^\/]*$/, '')}sign-in.html`,
        controller: class {
            static $inject = ['$scope', 'auth.signIn'];

            constructor($scope, signIn) {
                Reflect.defineProperty(this, '$scope', {value: $scope});

                this.signIn = signIn;
                this.state = 'selection';
            }

            signInWithAuthProvider(authProviderId) {
                this.signIn.withAuthProvider(authProviderId);
            }

            signInWithEmail() {
                if (this.passwordlessForm.$invalid) {
                    this.passwordlessForm.email.$setTouched();
                    return;
                }

                this.signIn.withEmail({email: this.email, path: '/'})
                    .then(() => {
                        this.state = 'emailSent';
                    })
                    .catch(() => {
                        this.passwordlessForm.email.$setValidity('server', false);

                        const formFieldWatcher = this.$scope.$watch(() => this.passwordlessForm.email.$viewValue, (newValue, oldValue) => {
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
        }
    });
