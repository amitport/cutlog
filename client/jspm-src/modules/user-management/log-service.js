import {module} from './module';

module.controller('clAuthProviderDialogController', class {
    constructor($mdDialog, $mdToast, $http, $window) {
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
        this.$http = $http;
        this.$window = $window;
    }

    closeDialog() {
        this.$mdDialog.cancel();
    };

    passwordlessAuth() {
        if (!this.passwordlessForm.$invalid) {
            let email = this.email;
            let path = '/';
            this.$mdDialog.hide()
                .then(() => {
                    this.$http.post('/api/auth/passwordless/request', {email, path})
                    .then(() => {
                        this.$mdToast.show({
                            autoWrap: false,
                            template: `
                                <md-toast>
                                    <div class="md-toast-content">
                                        <span flex role="alert" aria-relevant="all" aria-atomic="true">
                                            {{'PASSWORDLESS_REQUEST_ACCEPTED' | translate}}
                                        </span>
                                    </div>
                                </md-toast>
                            `,
                            position: (this.$window.document.dir == 'ltr') ? 'bottom left' : 'bottom right', // TODO: make this part of the lang component
                            hideDelay: 5000
                        });
                    });
                });
        } else {
            this.passwordlessForm.email.$setTouched();
        }

    }
});

module.service('clLog', class {

    constructor($mdDialog) {
        this.$mdDialog = $mdDialog;
    }

    openAuthProviderDialog(targetEvent) {
        this.$mdDialog.show(
            {
                targetEvent: targetEvent,
                clickOutsideToClose: true,
                templateUrl: 'partials/authProviderDialog.html',
                controller: 'clAuthProviderDialogController',
                controllerAs: 'ctrl'
            });
    }

    openUserDetailsDialog(targetEvent, user) {
        this.$mdDialog.show(
            {
                targetEvent: targetEvent,
                clickOutsideToClose: true,
                templateUrl: 'partials/userDetailsDialog.html',
                controllerAs: 'ctrl',
                locals: {
                    user
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
    }
});