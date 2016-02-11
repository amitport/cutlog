import angular from 'angular';

import authModule from './modules/auth/index';
import userModule from './modules/user/index';
import uiModule from './modules/ui/index';

export default angular.module('clUserManagement',
    [authModule, userModule, uiModule]).name;