import 'angular-material/angular-material.css!';
import './material-icons.css!';

import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'angular-messages';

import 'angular-translate';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';

export const module = angular.module('cutlog', ['ngMaterial', 'ngCookies', 'ngMessages', 'pascalprecht.translate']);