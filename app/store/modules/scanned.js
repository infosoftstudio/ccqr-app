import { axiospostApi } from '../../axioshttp'

// for application settings same like vuex localstorage in web apps
import {getString, setString} from "@nativescript/core/application-settings"
const custom = getString('store')

const initialState = () => {
    return {
        code: '',
        scannedperson: {},
        tap: {
            front: '',
            flip: '',
            params: ''
        },
        close: false,
        countItem: 0,
        maxItem: 0
    }
}

const state = initialState()

const mutations = {
    SET_SCANNED_PERSON (state, payload) {
        state.scannedperson = payload
    },
    SET_CODE (state, payload) {
        state.code = payload
    },
    SET_COUNT_ITEM (state, payload) {
        state.countItem = payload
    },
    SET_MAX_ITEM (state, payload) {
        state.maxItem = payload
    },
    SET_CLOSE (state, payload) {
      state.close = payload
    },
    SET_TAP (state, payload) {
        state.tap = Object.assign({}, state.tap, payload)
    },
    RESET_SCANNED_STATE (state) {
        Object.assign(state, initialState())
    }
}

const getters = {
    scannedperson: state => state.scannedperson,
    code: state => state.code,
    tap: state => state.tap,
    close: state => state.close,
    countItem: state => state.countItem,
    maxItem: state => state.maxItem
}

const actions = {
    /* LOGIN_USER ({ commit }, payload) { // login user
        return postApi('login', payload)
        } */
    LOG_SCANNED({commit}, payload) {
        return axiospostApi('/test-scan', payload)
    },
    BULK_LOG_OFFLINE_SCANS({commit}, payload) {
      return axiospostApi('/offline-scans', payload)
    },
    CREATE_ADD_LOG({commit}, payload) {
        return postApi('add-log', payload)
    },
    VERIFY_HDF({commit}, payload) {
        return axiospostApi('/hdf-verify', payload)
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
