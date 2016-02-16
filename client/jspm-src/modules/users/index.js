import angular from 'angular';

import authModule from './modules/auth/index';
import uiPreSignInModule from './modules/ui-pre-sign-in/index';
import uiModule from './modules/ui/index';

export default angular.module('amitport.users',
    [authModule, uiPreSignInModule, uiModule]).name;