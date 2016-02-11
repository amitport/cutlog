import module from './base';

/*import './log-service'; */

import './sign-in-dialog.js';

//noinspection JSUnresolvedVariable
module.component('clLogSwitch',
    {
    templateUrl:
        `${__moduleName.replace(/[^\/]*$/, '')}user-menu.html`,
    controller: ['signInDialog', 'tbs.user', function(signInDialog, user) {
        return {
            user,
            signIn(targetEvent) {
                return signInDialog.open(targetEvent);
            }
        }
    }]
});
    /*
    controller: class {
        static $inject = ['$scope', '$mdConstant', '$window', '$mdDialog', 'clLog'];

        constructor($scope, $mdConstant, $window, $mdDialog, clLog) {
            this.clLog = clLog;
            this.$mdDialog = $mdDialog;
            const query = $window.matchMedia($mdConstant.MEDIA['gt-xs']);
            this.shouldDisplayLabel = !!query.matches;
            const onQueryChange = () => {
                $scope.$evalAsync(() => {
                    this.shouldDisplayLabel = !!query.matches;
                });
            };
            query.addListener(onQueryChange);
            $scope.$on("$destroy", () => {
                query.removeListener(onQueryChange);
            });
        }

        signIn(targetEvent) {
            return this.clLog.openAuthProviderDialog(targetEvent);
        }
    }

});
*/