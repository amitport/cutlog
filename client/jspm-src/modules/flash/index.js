import angular from 'angular';

const module = angular.module('amitport.flash', []);

module.factory('flash', ['$window', function ($window) {
    return ($window.hasOwnProperty('__flash')) ? $window.__flash : {};
}]);

export default module.name;