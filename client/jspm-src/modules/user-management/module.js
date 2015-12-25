import angular from 'angular';
import 'angular-material';
import 'angular-route';
import 'angular-translate';
import passwordLessModule from './modules/passwordless/index';

export const module = angular.module('clUserManagement', ['ngMaterial', 'ngRoute', 'pascalprecht.translate', passwordLessModule]);