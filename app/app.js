import Vue from 'nativescript-vue'
import App from './components/App'

// ==================================================================================
// import store from './store'

// Plugins ==========================================================================
import CardViewPlugin from '@nativescript-community/ui-material-cardview/vue'
Vue.use(CardViewPlugin);

// Router ===========================================================================
import Navigator from 'nativescript-vue-navigator'
import {routes} from './routes'
Vue.use(Navigator, { routes })
import {getString, setString} from "@nativescript/core/application-settings"
const user = getString('user')

// Vue.config.silent = false;
new Vue({
  // store,
  render: h => h(App),
}).$start()
