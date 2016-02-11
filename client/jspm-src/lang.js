import {module} from './module';
import './lang.he.css!';

module.config(['$translateProvider', function ($translateProvider) {
    $translateProvider
        .translations('en', {
            SIGN_IN: 'Sign In',
            LANGUAGE: 'Language',
            EMAIL: 'Email',
            EMAIL_LONG: 'Email address',
            CONTINUE: 'Next',
            AUTHENTICATE_REQUEST_PREFIX: 'Sign in using',
            GOOGLE: 'Google',
            FACEBOOK: 'Facebook',
            NOT_SUPPORTED: 'not supported',
            REQUIRED_FIELD: 'required field',
            INVALID_EMAIL_FIELD: 'invalid email format',
            SERVER_ERR_EMAIL_FIELD: 'Submission failed, please try again later',
            EMAIL_SENT_TITLE: 'You\'re almost there!',
            EMAIL_SENT_SUB: 'A confirmation link should arrive in your email shortly',
            PASSWORDLESS_REQUEST_ACCEPTED: 'Request accepted! Log-in details should arrive at your email shortly',
            USER_ACCOUNT: 'User Account',
            CANCEL: 'cancel',
            SAVE: 'save',
            NEW_USER_ACCOUNT: 'New User Account',
            OPEN_USER_MENU: 'Open user menu',
            EDIT_USER_PROFILE: 'Edit profile',
            SIGN_OUT: 'Sign out'
        })
        .translations('he', {
            SIGN_IN: 'כניסה',
            LANGUAGE: 'שפה',
            EMAIL: 'דוא"ל',
            EMAIL_LONG: 'כתובת אימייל',
            CONTINUE: 'המשך',
            AUTHENTICATE_REQUEST_PREFIX: 'אמת זהות באמצעות',
            GOOGLE: 'גוגל',
            FACEBOOK: 'פייסבוק',
            NOT_SUPPORTED: 'לא נתמך',
            REQUIRED_FIELD: 'שדה נדרש',
            INVALID_EMAIL_FIELD: 'הכתובת אינה תקינה',
            SERVER_ERR_EMAIL_FIELD: 'השליחה נכשלה, נא נסה מאוחר יותר',
            EMAIL_SENT_TITLE: 'כמעט סיימנו!',
            EMAIL_SENT_SUB: 'לינק אישור נשלח לכתובת המייל שלך',
            PASSWORDLESS_REQUEST_ACCEPTED: 'בקשתך התקבלה! פרטי כניסה יגיעו לתיבת הדואר בדקות הקרובות',
            USER_ACCOUNT: 'חשבון משתמש',
            CANCEL: 'בטל',
            SAVE: 'שמור',
            NEW_USER_ACCOUNT: 'חשבון משתמש חדש',
            OPEN_USER_MENU: 'פתיחת תפריט משתמש',
            EDIT_USER_PROFILE: 'עריכת פרופיל',
            SIGN_OUT: 'יציאה'
        })
        .registerAvailableLanguageKeys(['en', 'he'])
        .determinePreferredLanguage()
        .useSanitizeValueStrategy(null)
        .useLocalStorage();
}]);

module.component('langSwitch', {
    template: `
    <md-menu>
          <md-button aria-label="change language" class="md-icon-button" ng-click="$mdOpenMenu($event)">
            <md-tooltip>{{'LANGUAGE' | translate}}</md-tooltip>
            <md-icon md-menu-origin>language</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item ng-repeat="(code, lang) in $ctrl.languages">
              <md-button ng-click="$ctrl.useLang(code)" ng-disabled="lang === $ctrl.currentLang">
                {{lang.name}}
              </md-button>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
    `,
    controller: class {
        static $inject = ['$translate', '$window'];

        constructor($translate, $window) {
            this.$translate = $translate;
            this.$window = $window;

            this.languages = {
                'en': {name: 'English', dir: 'ltr'},
                'he': {name: 'עברית', dir: 'rtl'}
            };

            this.onUseLangSuccess($translate.use());
        }
        onUseLangSuccess(langCode) {
            this.currentLang = this.languages[langCode];
            this.$window.document.dir = this.currentLang.dir;
            this.$window.document.documentElement.lang = langCode;
        }
        useLang(langCode) {
            this.$translate.use(langCode).then(this.onUseLangSuccess.bind(this))
        }

    }
});
