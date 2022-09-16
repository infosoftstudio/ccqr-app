import { axiospostApi } from '../../axioshttp'

// for application settings same like vuex localstorage in web apps
import {getString, setString} from "@nativescript/core/application-settings"
const custom = getString('store')

const initialState = () => {
  return {
      user: {}
  }
}

const state = initialState()

const mutations = {
  LOAD_USER () {
    const user = getString('user') // user from app settings
    if(user) {
      const cuser = JSON.parse(user);
      state.user = cuser;
    }
  },
  SET_USER (state, payload) {
      state.user = payload
      setString("user", JSON.stringify(payload));
  },
  RESET_LOGIN_STATE (state) {
    Object.assign(state, initialState())
  }
}

const getters = {
    user: state => state.user,
    test: state => state.test
}

const actions = {
  LOGIN_USER ({ commit }, payload) { // login user
      return axiospostApi('loginMobile', payload)
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
