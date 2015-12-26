import angular from 'angular';

import 'angular-material';
import 'angular-material/angular-material.css!';
import '../../material-icons.css!';

import 'angular-route';
import 'angular-translate';
import 'satellizer';

import passwordLessModule from './modules/passwordless/index';

export const module = angular.module('clUserManagement', ['ngMaterial',
                                                            'ngRoute',
                                                            'pascalprecht.translate',
                                                            'satellizer',
                                                            passwordLessModule]);