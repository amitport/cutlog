import angular from 'angular';

import 'angular-material';
import 'angular-material/angular-material.css!';

import 'angular-translate';

import 'angular-route';
import flashModule from 'modules/flash/index';
import authModule from '../auth/index';

export default angular.module('amitport.users.ui-pre-sign-in',
    ['ngMaterial', 'pascalprecht.translate', 'ngRoute', flashModule, authModule]);