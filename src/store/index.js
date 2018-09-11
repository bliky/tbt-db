import Vue from 'vue';
import Vuex from 'vuex';
import apply from './modules/apply';
import promotion from './modules/promotion';

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
    apply,
    promotion
  }
});

export default store;
