import './log-switch';

import {module} from './module';

module.run(['$rootScope', '$window', 'SatellizerConfig',
    function($rootScope, $window, SatellizerConfig) {
        const authTokenName = SatellizerConfig.tokenPrefix ? SatellizerConfig.tokenPrefix + '_' + SatellizerConfig.tokenName : SatellizerConfig.tokenName;

        $window.addEventListener('storage', function(event) {
            if (event.key === authTokenName) {
                $rootScope.$evalAsync();
            }
        });
    }]);

export default module.name;
