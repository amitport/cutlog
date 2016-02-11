import './user-menu';
//import './modules/auth/index';


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

module.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('user.register', (event, registrationToken) => {
        console.log(registrationToken);
    })
}]);

export default module.name;
