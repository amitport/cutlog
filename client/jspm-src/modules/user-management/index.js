import angular from 'angular';

import authModule from './modules/auth/index';
import uiModule from './modules/ui/index';

export default angular.module('clUserManagement',
    [authModule, uiModule]).name;