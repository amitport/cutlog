import {module} from './module';
import './lang';
import './passwordless';

module.config(($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        template: 'main'
    });
});
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
                    clickOutsideToClose: true,
                    templateUrl: 'partials/authProviderDialog.html',
                    controller: ['$scope', '$mdDialog', '$mdToast', '$http', '$window',
                            ($scope, $mdDialog, $mdToast, $http, $window) => {
                        $scope.closeDialog = () => {$mdDialog.cancel();};

                        $scope.ctrl = {
                            //authenticate: () => this.authenticate()
                            //    .then(() => {$mdDialog.hide();})
                            //    .catch(() => {$mdDialog.cancel(); return Promise.reject()}),
                            passwordlessAuth: () => {
                                if (!$scope.passwordlessForm.$invalid) {
                                    let email = $scope.ctrl.email;
                                    let path = '/';
                                    $mdDialog.hide().then(() => {
                                        $http.post('/api/auth/passwordless/request', {email, path})
                                        .then(() => {
                                            $mdToast.show({
                                                autoWrap: false,
                                                template:`
                                                    <md-toast>
                                                        <div class="md-toast-content">
                                                            <span flex role="alert" aria-relevant="all" aria-atomic="true">
                                                                {{'PASSWORDLESS_REQUEST_ACCEPTED' | translate}}
                                                            </span>
                                                        </div>
                                                    </md-toast>
                                                `,
                                                position:
                                                    ($window.document.dir == 'ltr') ? 'bottom left' : 'bottom right',
                                                hideDelay: 5000
                                            });
                                        });
                                    });
                                } else {
                                    $scope.passwordlessForm.email.$setTouched();
                                }

                            }
                        };
                    }]
                });
        }
    }

});


//angular.element(document).ready(function () {
//    angular.bootstrap(document, ['cutlog'], {strictDi: true});
//});

