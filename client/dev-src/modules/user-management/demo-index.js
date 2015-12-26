import angular from 'angular';

import userManagementModule from './index';
import 'satellizer';
const module = angular.module('userManagementDemo', [userManagementModule, 'satellizer']);

module.run(function ($rootScope, $auth) {
    $rootScope.isAuthenticated = () => $auth.isAuthenticated();
    $rootScope.setToken = () => $auth.setToken("token");
});
module.filter('translate',  () => (translateKey) => `<${translateKey}>`);