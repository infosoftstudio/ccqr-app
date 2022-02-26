import Vue from 'nativescript-vue'
import Home from './components/Home'

// ==================================================================================
import store from './store'

// Router ===========================================================================
import Navigator from 'nativescript-vue-navigator'
import {routes} from './routes'
Vue.use(Navigator, { routes })

// Vue.config.silent = false;
new Vue({
  store,
  render: (h) => h('frame', [h(Home)]),
}).$start()
