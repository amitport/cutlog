import module from './base';
import './sign-in-dialog.js';
import template from './user-menu.html!text';

//noinspection JSUnresolvedVariable
module.component('userMenu',
    {
    template,
    controller: ['$location', 'ui.signInDialog', 'auth.user', function($location, signInDialog, user) {
        return {
            user,
            gotoUserProfile() {
              $location.path('/users/me');
            },
            signIn(targetEvent) {
                return signInDialog.open(targetEvent);
            }
        }
    }]
});