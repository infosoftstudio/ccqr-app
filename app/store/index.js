import Vue from "nativescript-vue"
import Vuex from 'vuex'

import login from './modules/login'
import scanned from './modules/scanned'
import connection from './modules/connection'

// import NSVuexPersist from 'ns-vuex-persist'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        login,
        scanned,
        connection
    },
    // plugins: [NSVuexPersist]
});
