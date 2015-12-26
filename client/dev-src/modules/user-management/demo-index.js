import angular from 'angular';

import userManagementModule from './index';

const module = angular.module('userManagementDemo', [userManagementModule]);

module.filter('translate',  () => (translateKey) => `<${translateKey}>`);