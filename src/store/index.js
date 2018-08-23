import Vue from 'vue';
import Vuex from 'vuex';
import apply from './modules/apply';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoading: false,
    loadingText: '数据加载中...'
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading;
      state.loadingText = payload.loadingText || '数据加载中...';
    }
  },
  modules: {
    apply
  }
});

export default store;
