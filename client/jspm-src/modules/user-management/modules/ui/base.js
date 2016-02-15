import angular from 'angular';
import 'angular-route';

import 'angular-material';
import 'angular-material/angular-material.css!';
import 'material-design-icons/iconfont/material-icons.css!';

import 'angular-translate';

import authModule from '../auth/index';

export default angular.module('ui',
    ['ngRoute',
     'ngMaterial',
     'pascalprecht.translate',
     authModule]);