import {module} from './module';

module
.config(($routeProvider) => {
    $routeProvider.when('/errors/:errorId', {
        template: 'ERROR: {{ctrl.errorId}}',
        controller: 'ErrorsCtrl',
        controllerAs: 'ctrl'
    });
})
.controller('ErrorsCtrl',
  class {
    constructor($routeParams) {
        this.errorId = $routeParams.errorId;
    }
  }
);