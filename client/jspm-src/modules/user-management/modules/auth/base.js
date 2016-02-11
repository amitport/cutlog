import angular from 'angular';
import 'angular-route';
import flashModule from 'modules/flash/index';

export default angular.module('auth', ['ngRoute', flashModule]);