import {module} from './module';
import './lang.he.css!';

module.config(function ($translateProvider) {
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
            PASSWORDLESS_REQUEST_ACCEPTED: 'Request accepted! Log-in details should arrive at your email shortly',
            USER_ACCOUNT: 'User Account',
            CANCEL: 'cancel',
            SAVE: 'save',
            NEW_USER_ACCOUNT: 'New User Account'
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
            PASSWORDLESS_REQUEST_ACCEPTED: 'בקשתך התקבלה! פרטי כניסה יגיעו לתיבת הדואר בדקות הקרובות',
            USER_ACCOUNT: 'חשבון משתמש',
            CANCEL: 'בטל',
            SAVE: 'שמור',
            NEW_USER_ACCOUNT: 'חשבון משתמש חדש'
        })
        .registerAvailableLanguageKeys(['en', 'he'])
        .determinePreferredLanguage()
        .useSanitizeValueStrategy(null)
        .useLocalStorage();
});

module.component('langSwitch', {
    template: `
    <md-menu>
          <md-button aria-label="change language" class="md-icon-button" ng-click="$mdOpenMenu($event)">
            <md-tooltip>{{'LANGUAGE' | translate}}</md-tooltip>
            <md-icon md-menu-origin>language</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item ng-repeat="(code, lang) in langSwitch.languages">
              <md-button ng-click="langSwitch.useLang(code)" ng-disabled="lang === langSwitch.currentLang">
                {{lang.name}}
              </md-button>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
    `,
    controller: class {
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
