import {module} from './module';
import './lang';

module.component('clLogSwitch', {
    template: `
      <md-button ng-if="clLogSwitch.shouldDisplayLabel" ng-click="clLogSwitch.signIn($event)">
        <md-icon>person</md-icon>
        {{ 'SIGN_IN' | translate }}
      </md-button>
      <md-button class="md-icon-button" ng-if="!clLogSwitch.shouldDisplayLabel" ng-click="clLogSwitch.signIn($event)">
        <md-tooltip>
        {{ 'SIGN_IN' | translate }}
        </md-tooltip>
        <md-icon>person</md-icon>
      </md-button>
        `,
    controller: class {
        constructor($scope, $mdConstant, $window, $mdDialog) {
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
            return this.$mdDialog.show(
                {
                    targetEvent: targetEvent,
                    templateUrl: 'partials/authProviderDialog.html',
                    controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                        $scope.closeDialog = () => {$mdDialog.cancel();};

                        $scope.ctrl = {
                            authenticate: () => this.authenticate()
                                .then(() => {$mdDialog.hide();})
                                .catch(() => {$mdDialog.cancel(); return Promise.reject()})
                        };
                    }]
                });
        }
    }

});


//angular.element(document).ready(function () {
//    angular.bootstrap(document, ['cutlog'], {strictDi: true});
//});

