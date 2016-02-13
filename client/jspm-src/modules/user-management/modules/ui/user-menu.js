import module from './base';
import './sign-in-dialog.js';

//noinspection JSUnresolvedVariable
module.component('userMenu',
    {
    templateUrl:
        `${__moduleName.replace(/[^\/]*$/, '')}user-menu.html`,
    controller: ['ui.signInDialog', 'auth.user', function(signInDialog, user) {
        return {
            user,
            signIn(targetEvent) {
                return signInDialog.open(targetEvent);
            }
        }
    }]
});