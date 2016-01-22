import {module} from './module';
import './log-service';

module.component('clLogSwitch', {
    templateUrl: 'modules/user-management/log-switch.html',
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