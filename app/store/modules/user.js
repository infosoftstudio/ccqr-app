import { axiosgetApi, axiospostApi } from '../../axioshttp'

import {getString, setString} from "@nativescript/core/application-settings"

const initialState = () => {
  return {
    user: {},
    appVersion: '---',
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
  SET_APP_VERSION (state, payload) {
    state.appVersion = payload
    console.log(state.appVersion)
  },
  RESET_LOGIN_STATE (state) {
    Object.assign(state, initialState())
  }
}

const getters = {
  user: state => state.user,
  appVersion: state => state.appVersion,
}

const actions = {
  CREATE_USER ({ commit }, payload) {
    return axiosgetApi(`/create-user/`, payload)
  },
  LOGIN_USER ({ commit }, payload) {
    return axiospostApi('/app/login/', payload)
  },
  async GET_QUERY ({ commit }) {
    const response = await axiosgetApi(`/app/fetch/`)
    commit('SET_MUTATION', response)
  },
}

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
  strict: true
}
