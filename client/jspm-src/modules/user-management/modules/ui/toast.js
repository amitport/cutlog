import module from './base';

module.factory('ui.toast', ['$mdToast', '$window', function ($mdToast, $window) {
    return {
        show(content) {
            return $mdToast.show({
                autoWrap: false,
                template: `
                                <md-toast>
                                    <div class="md-toast-content">
                                        <span flex role="alert" aria-relevant="all" aria-atomic="true">
                                            ${content}
                                        </span>
                                    </div>
                                </md-toast>
                            `,
                position: ($window.document.dir == 'ltr') ? 'bottom left' : 'bottom right',
                hideDelay: 5000
            });
        }
    }
}]);