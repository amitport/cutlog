import angular from 'angular';

import 'angular-material';
import 'angular-material/angular-material.css!';
import '../../../../material-icons.css!';

import 'angular-route';
import 'angular-translate';

import userModule from '../user/index';

export default angular.module('ui',
    ['ngMaterial',
        'ngRoute',
        'pascalprecht.translate',
        userModule]);