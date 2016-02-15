import 'angular-material/angular-material.css!';
import './material-icons.css!';
import './rtl-fix.css!';

import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'angular-messages';
import 'angular-route';

import 'angular-translate';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';

import userManagementModule from './modules/user-management/index';

export default angular.module('cutlog', [
    'ngMaterial', 'ngCookies', 'ngMessages', 'ngRoute', 'pascalprecht.translate', userManagementModule]);