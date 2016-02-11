import module from './base';

//noinspection JSUnresolvedVariable
module.component('signIn',
    {
        templateUrl: `${__moduleName.replace(/[^\/]*$/, '')}sign-in.html`,
        controller: class {
            static $inject = ['auth.signIn'];

            constructor(signIn) {
                this.signIn = signIn;
                this.state = 'selection';
            }

            signInWithAuthProvider(authProviderId) {
                this.signIn.withAuthProvider(authProviderId);
            }

            signInWithEmail(email) {
                if (this.passwordlessForm.$invalid) {
                    this.passwordlessForm.email.$setTouched();
                    return;
                }

                this.signIn.withEmail({email, path: '/'})
                    .then(() => {
                        this.state = 'emailSent';
                    })
                    .catch((rejection) => {
                        console.error(rejection);
                        this.passwordlessForm.email.$setValidity('server', false);
                    });
            }
        }
    });
