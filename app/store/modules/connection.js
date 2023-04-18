import {getString, setString} from "@nativescript/core/application-settings"
import {axiosgetApi} from '../../axioshttp'
const custom = getString('store')
import Vue from "nativescript-vue";

const initialState = () => {
  return {
      hasConnection: false, // false no conenction, true means naa
      offlineScans: []
  }
}

const state = initialState()

const mutations = {
  SET_HASCONNECTION (state, payload) {
      state.hasConnection = payload
  },
  SET_ADDITIONAL_NO_CONNECTION_QR (state, payload) {
      state.offlineScans.push(payload)
      setString("offlineScans", JSON.stringify(state.offlineScans));
  },
  SET_REMOVE_INDEX_NO_CONNECTION_QR(state, payload) {
      // Vue.delete(state.offlineScans, payload) // delete item in vuex
      state.offlineScans.splice(state.offlineScans.indexOf(payload), 1)
      setString("offlineScans", JSON.stringify(state.offlineScans)); // update the offlineScans stored cache
  },
  REMOVE_OFFLINE_SCANS(state, payload) {
      state.offlineScans = []
  },
  LOAD_NO_CONNECTION_QR (state, payload) {
      const offlineScans = getString('offlineScans') // offlineScans from app settings
      if(offlineScans) {
          const cofflineScans = JSON.parse(offlineScans);
          state.offlineScans = cofflineScans;
      }
  },
  RESET_CONNECTION_STATE (state) {
    Object.assign(state, initialState())
  }
}

const getters = {
    hasConnection: state => state.hasConnection,
    offlineScans: state => state.offlineScans
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
