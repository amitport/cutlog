import module from './base';

import './sign-in.js';

module.factory('ui.signInDialog', ['$mdDialog', function ($mdDialog) {
    return {
        open(targetEvent) {
            //noinspection JSUnresolvedVariable
            return $mdDialog.show(
                {
                    targetEvent: targetEvent,
                    clickOutsideToClose: true,
                    templateUrl: `${__moduleName.replace(/[^\/]*$/, '')}sign-in-dialog.html`,
                    controllerAs: '$ctrl',
                    controller: ['$mdDialog', function ($mdDialog) {
                        this.cancel = () => {
                            $mdDialog.cancel();
                        }
                    }]
                });
        }
    }
}]);
