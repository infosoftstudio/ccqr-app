import {getString, setString} from "@nativescript/core/application-settings"
import {axiosgetApi} from '../../axioshttp'
const custom = getString('store')
import Vue from "nativescript-vue";

const initialState = () => {
  return {
      hasConnection: false, // false no conenction, true means naa
      noConnectionQR: []
  }
}

const state = initialState()

const mutations = {
  SET_HASCONNECTION (state, payload) {
      state.hasConnection = payload
  },
  SET_ADDITIONAL_NO_CONNECTION_QR (state, payload) {
      state.noConnectionQR.push(payload)
      setString("noConnectionQR", JSON.stringify(state.noConnectionQR));
  },
  SET_REMOVE_INDEX_NO_CONNECTION_QR(state, payload) {
      // Vue.delete(state.noConnectionQR, payload) // delete item in vuex
      state.noConnectionQR.splice(state.noConnectionQR.indexOf(payload), 1)
      setString("noConnectionQR", JSON.stringify(state.noConnectionQR)); // update the noConnectionQR stored cache
  },
  LOAD_NO_CONNECTION_QR (state, payload) {
      const noConnectionQR = getString('noConnectionQR') // noConnectionQR from app settings
      if(noConnectionQR) {
          const cnoConnectionQR = JSON.parse(noConnectionQR);
          state.noConnectionQR = cnoConnectionQR;
      }
  },
  RESET_CONNECTION_STATE (state) {
    Object.assign(state, initialState())
  }
}

const getters = {
    hasConnection: state => state.hasConnection,
    noConnectionQR: state => state.noConnectionQR
}

const actions = {
  FETCH_VERSION ({ commit }, payload) { // login user
    return axiosgetApi('version', payload)
  }

}

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
  strict: true
}
