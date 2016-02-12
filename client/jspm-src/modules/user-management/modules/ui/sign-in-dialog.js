import module from './base';

import './sign-in.js';

module.factory('signInDialog', ['$mdDialog', function ($mdDialog) {
    return {
        open(targetEvent) {
            //noinspection JSUnresolvedVariable
            $mdDialog.show(
                {
                    targetEvent: targetEvent,
                    clickOutsideToClose: true,
                    templateUrl: `${__moduleName.replace(/[^\/]*$/, '')}sign-in-dialog.html`,
                    controller: 'signInDialogController',
                    controllerAs: '$ctrl'
                });
        }
    }
}]);

module.controller('signInDialogController', ['$mdDialog', function ($mdDialog) {
    this.cancel = () => {
        $mdDialog.cancel();
    }
}]);