import Vue from "nativescript-vue"
import Vuex from 'vuex'

import user from './modules/user'

// import NSVuexPersist from 'ns-vuex-persist'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user
    },
    // plugins: [NSVuexPersist]
});
