import {module} from './module';

module
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/errors/:errorId', {
        template: 'ERROR: {{ctrl.errorId}}',
        controller: 'ErrorsCtrl',
        controllerAs: 'ctrl'
    });
}])
.controller('ErrorsCtrl',
  class {
    static $inject = ['$routeParams'];

    constructor($routeParams) {
        this.errorId = $routeParams.errorId;
    }
  }
);