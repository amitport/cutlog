import module from './base';

module.factory('ap.eventualUser', ['$window', 'ap.user', 'ap.signInDialog', 'ap.registerDialog',
    function ($window, user, signInDialog, registerDialog) {

        let registrationDialogPromise = false;
        const eventualUser = {
            set(tokens) {
                if (tokens.hasOwnProperty('auth')) {
                    return registrationDialogPromise = registerDialog.open(tokens.auth).finally(() => {registrationDialogPromise = false});
                }
                return user.signIn(tokens);
            },
            get() {
                return registrationDialogPromise || user.signInPromise.catch(() => {
                    return signInDialog.open().then(() => {
                        if (!user.isSignedIn && registrationDialogPromise) {
                            return registrationDialogPromise;
                        } else {
                            return user;
                        }
                    });
                });
            }
        };

        // listen to response from auth provider pop-up
        $window.addEventListener('message', (event) => {
            if ((event.origin || event.originalEvent.origin) !== $window.location.origin) return;

            eventualUser.set(event.data.tokens);
        });

        return eventualUser;
    }]);