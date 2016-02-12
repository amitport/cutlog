import './user-menu';
import './register-dialog';



import module from './base';

//module.run(['$rootScope', '$window', 'SatellizerConfig',
//    function($rootScope, $window, SatellizerConfig) {
//        const authTokenName = SatellizerConfig.tokenPrefix ? SatellizerConfig.tokenPrefix + '_' + SatellizerConfig.tokenName : SatellizerConfig.tokenName;
//
//        $window.addEventListener('storage', function(event) {
//            if (event.key === authTokenName) {
//                $rootScope.$evalAsync();
//            }
//        });
//    }]);

module.run(['$rootScope', 'registerDialog', function ($rootScope, registerDialog) {
    $rootScope.$on('user.register', (event, authToken) => {
        registerDialog.open(authToken);
    })
}]);

export default module.name;
