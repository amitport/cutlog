import module from './base';
import './sign-in-dialog.js';

//noinspection JSUnresolvedVariable
module.component('userMenu',
    {
    templateUrl:
        `${__moduleName.replace(/[^\/]*$/, '')}user-menu.html`,
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