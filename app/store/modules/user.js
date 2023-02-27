import { axiosgetApi, axiospostApi, axiosdeleteApi } from '../../axioshttp'

import {getString, setString} from "@nativescript/core/application-settings"
const custom = getString('store')

const initialState = () => {
  return {
    user: {},
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
