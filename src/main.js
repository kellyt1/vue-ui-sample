import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import VuelidateErrorExtractor from "vuelidate-error-extractor";
import FormGroup from '@/components/templates/FormGroup';
import MultiError from '@/components/templates/MultiError';
import VueLogger from 'vuejs-logger';
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import VueTheMask from 'vue-the-mask'

import VueKeyCloak from '@/plugins/keycloak-plugin';
import Axios from '@/plugins/axios-plugin';
import { store } from './store/store'
import vSelect from 'vue-select'
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import VueBrowserUpdate from '@sum.cumo/vue-browserupdate';
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

Vue.use(VueBrowserUpdate, {
 options: {
 required:{
   e:16,
   i:12,
   f:58,
   o:51,
   o_a:45,
   s:-1,
   c:"67.0.3396.12",
   y:18.1,
   v:"1.10",
   uc:11.5,
   samsung:7.0
}}
});

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueFormWizard)

Vue.component('v-select', vSelect)

Vue.use(VuelidateErrorExtractor, {
  i18n: false,
  template: FormGroup,
  messages: {
    required: "{attribute} is required.",
    email: "{attribute} is not a valid Email Address.",
    numeric: "{attribute} must be a numeric value.",
    checked: "{attribute}",
    requiredIf: "{attribute} is required.",
    reqAttch: 'One or more required attachments are missing',
    url: "{attribute} is not a valid URL.",
    minLength: "{attribute} has not met required minimum length",
    maxLength: "{attribute} is too long"
  },
});

Vue.component('form-summary', MultiError)

const options = {
  isEnabled: true,
  logLevel : Vue.config.productionTip  ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(Axios);
Vue.use(VueTheMask);

Vue.use(VueKeyCloak, {
  init: {
    onLoad: 'check-sso',
    checkLoginIframe: false
  },
  config: {
    url: `${process.env.VUE_APP_KEYCLOAK_URL}`,
    clientId: `${process.env.VUE_APP_KEYCLOAK_CLIENT}`,
    realm: `${process.env.VUE_APP_KEYCLOAK_REALM}`,
    logoutRedirectUri: `${process.env.VUE_APP_KEYCLOAK_LOGOUT_REDIRECT_URI}`

  },
  onReady: kc => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

const requireComponent = require.context(
  './components/templates/input',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
}) 