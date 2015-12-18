import {module} from './module';

module.component('counter', {
    bindings: {
        count: '='
    },
    controller: function () {
        function increment() {
            this.count++;
        }

        function decrement() {
            this.count--;
        }

        this.increment = increment;
        this.decrement = decrement;
    },
    template: `
        <div class="todo">
            <input type="text" ng-model="counter.count">
            <button type="button" ng-click="counter.decrement();">-</button>
            <button type="button" ng-click="counter.increment();">+</button>
        </div>`
});


angular.element(document).ready(function () {
    angular.bootstrap(document, ['cutlog'], {strictDi: true});
});

