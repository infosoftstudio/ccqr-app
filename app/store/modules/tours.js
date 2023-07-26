import { axiosgetApi, axiospostApi } from "../../axioshttp";

import { getString, setString } from "@nativescript/core/application-settings";

const initialState = () => {
  return {
    tourReservations: {},
  };
};

const state = initialState();

const getters = {
  tourReservations: (state) => state.tourReservations,
};

const actions = {
  PENDING_BOOKINGS({ commit }, payload) {
    // login user
    return axiosgetApi("/mobile-app/tours/pending-bookings", payload);
  },
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  strict: true
}
