import Vue from 'vue';
import Vuex from 'vuex';
import apply from './modules/apply';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  },
  modules: {
    apply
  }
});

export default store;
