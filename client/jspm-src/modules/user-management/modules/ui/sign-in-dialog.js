import module from './base';
import template from './sign-in-dialog.html!text';

import './sign-in.js';

module.factory('ui.signInDialog', ['$mdDialog', function ($mdDialog) {
    return {
        open(targetEvent) {
            //noinspection JSUnresolvedVariable
            return $mdDialog.show(
                {
                    targetEvent: targetEvent,
                    clickOutsideToClose: true,
                    template,
                    controllerAs: '$ctrl',
                    controller: ['$mdDialog', '$scope',
                                function ($mdDialog, $scope) {
                        this.cancel = () => {
                            $mdDialog.cancel();
                        };

                        $scope.$on('auth.sign-in', () => {
                            $mdDialog.hide();
                        });
                    }]
                });
        }
    }
}]);
