import module from './base';

module.service('tbs.user', class {

    static $inject = ['$http', '$rootScope', '$timeout', '$log', '$window'];
    constructor($http, $rootScope, $timeout, $log, $window) {
        // in order to prevent flicker, cache and load user to local storage,
        // but clear it if we could not refresh user after 2 seconds
        let initialRefreshOk = false;
        if ($window.localStorage.hasOwnProperty('user')) {
            Object.assign(this, JSON.parse($window.localStorage.user));
            $timeout(() => {if (!initialRefreshOk) this.clear();}, 2000);
        }

        $rootScope.$on('auth.set', () => {
            $http.get('/api/users/me', {requireAuth: true}).then(({data}) => {
                initialRefreshOk = true;

                //noinspection JSUnusedGlobalSymbols
                this.isSignedIn = true;
                Object.assign(this, data);

                $window.localStorage.user = JSON.stringify(this);

                $log.info('signed in as ' + this.displayName);
            }).catch(console.error.bind(console))
        });

        $rootScope.$on('auth.cleared', () => {
            this.clear();
        });

        // use 'defineProperty' in order to avoid serializing this.storage
        Reflect.defineProperty(this, '$window', {value: $window});
        Reflect.defineProperty(this, '$log', {value: $log});
    }

    clear() {
        Object.keys(this).forEach((key) => {
            delete this[key];
        });
        delete this.$window.localStorage.user;

        this.$log.info('logged out');
        // todo show "you've been logout toast"
    }
});

module.component('signInForm', {
    bindings: {
        onSubmit: '&'
    },
  template: `\
<form name="signInForm" style="border: 1px solid black; padding: 3px;">
    <div>(try user:pass)</div>
    <input type="text" name="loginName" ng-model="loginName" required>
    <input type="password"  name="password" ng-model="password" required>

    <button
    ng-disabled="signInForm.$invalid"
    ng-click="$ctrl.onSubmit({credentials: {loginName: loginName, password: password}})">
      sign in
    </button>
</form>
`
});

module.component('userBox', {
    template: `\
<div>
<div>isSignedIn: {{!!$ctrl.user.isSignedIn}}</div>
<div ng-show="$ctrl.user.isSignedIn">
    <div>displayName: {{$ctrl.user.displayName}}</div>
    <button ng-click="$ctrl.auth.clear()">sign out</button>
</div>

<sign-in-form
    ng-if="!$ctrl.user.isSignedIn"
    on-submit="$ctrl.signIn(credentials)">
</sign-in-form>
</div>
`,
    controller: class {
        static $inject = ['$log', 'tbs.user', 'auth.tokens'];
        constructor($log, user, auth) {
            this.$log = $log;
            this.user = user;
            this.auth = auth;
        }

        signIn(credentials) {
            this.auth.authenticate(credentials).catch(({data}) => {
                this.$log.warn(data);

                // TODO propagate errors to the form
            });
        }
    }
});