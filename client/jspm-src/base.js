import 'angular-material/angular-material.css!';
import './rtl-fix.css!';

import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'angular-messages';
import 'angular-route';

import 'angular-translate';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';

import usersModule from './modules/users/index';

export default angular.module('cutlog', [
    'ngMaterial', 'ngCookies', 'ngMessages', 'ngRoute', 'pascalprecht.translate', usersModule]);