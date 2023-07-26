import Vue from "nativescript-vue"
import Vuex from 'vuex'

import connection from './modules/connection'
import login from './modules/login'
import scanned from './modules/scanned'
import tours from './modules/tours'
import user from './modules/user'

// import NSVuexPersist from 'ns-vuex-persist'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        connection,
        login,
        scanned,
        tours,
        user,
    },
    // plugins: [NSVuexPersist]
});
