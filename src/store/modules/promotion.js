import Vue from 'vue'
import storage from '../../common/storage'
import localDb from '../../common/db'
import { buildQuery } from '../../common/stringify'
import moment from 'moment'
import { fetchPromotionCh, fetchPromotionCity, fetchPromotion, fetchPromotionTrend } from '../../services/api'

const JSON = window.JSON;

const localCache = (param, data) => {
  let qs = buildQuery(param);
  if (!data) {
    return storage.get(qs);
  }

  return storage.set(qs, data);
}

const check = (data) => {
  return data.result;
}

const fetchChList = (commit) => {
  let skey = {app: 'promotion', type: 'chs'};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return fetchPromotionCh().then(data => {
    if (!check(data)) { throw '渠道数据无效'; }

    localCache(skey, data.result);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return data.result;
  })
}

const fetchCityList = (commit) => {
  let skey = {app: 'promotion', type: 'cities'};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return fetchPromotionCity().then(data => {
    if (!check(data)) { throw '城市数据无效'; }

    localCache(skey, data.result.rows);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return data.result.rows;
  })
}

const fetchPromotionList = (commit, params) => {
  let skey = {app: 'promotion', type: 'data', params:JSON.stringify(params)};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  console.log('fetchPromotionList', params);
  return fetchPromotion(params).then(data => {
    if (!check(data)) { throw '城市数据无效'; }

    localCache(skey, data.result);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return data.result;
  })
}

const fetchPromotionTrendList = (commit, params) => {
  let skey = {app: 'promotion', type: 'trend', params:JSON.stringify(params)};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return fetchPromotionTrend(params).then(data => {
    if (!check(data)) { throw '城市数据无效'; }

    localCache(skey, data.result);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return data.result;
  })
}

export default {
  namespaced: true,
  state: {
    months: [moment().format('YYYY-MM'), moment().subtract(1, 'month').format('YYYY-MM'),  moment().subtract(2, 'month').format('YYYY-MM')],
    lastUpdateDate: '',
    tableData: [],
    trends: {},
    isSelectChShow: false,
    chCate: 0,
    chs: {
      search: [],
      feed: []
    },
    cities: [],
    opts: []
  },
  getters: {
    citiesPool (state) {
      let pool = [];
      let cities = state.cities;
      if (!cities.length) return pool;

      cities.forEach(item => {
        pool = pool.concat(item.list);
      });
      return pool;
    }
  },
  mutations: {
    ['PUT_CHS_LIST'] (state, chs) {
      state.chs = chs;
    },
    ['PUT_CITIES_LIST'] (state, cities) {
      state.cities = cities;
    },
    ['PUT_TABLE_DATA'] (state, data) {
      state.tableData = data;
    },
    ['PUT_UPDATE_DATE'] (state, date) {
      state.lastUpdateDate = date;
    },
    ['PUT_TREND_DATA'] (state, data) {
      state.trends[String(data.class_id)] = data.data;
    },
    ['PUSH_OPT'] (state, opt) {
      state.opts.push(opt);
    },
    ['MOD_CH_CATE'] (state, c) {
      state.chCate = c;
    },
    ['TOG_SEL_CH'] (state) {
      state.isSelectChShow = !state.isSelectChShow;
    }
  },
  actions: {
    getChs ({ commit }) {
      return new Promise((resolve, reject) => {
        fetchChList(commit).then(chs => {
          commit('PUT_CHS_LIST', chs);
          resolve(chs);
        })
      });
    },
    getCities ({ commit }) {
      return new Promise((resolve, reject) => {
        fetchCityList(commit).then(cities => {
          commit('PUT_CITIES_LIST', cities);
          resolve(cities);
        })
      });
    },
    getPromotion ({ commit }, params) {
      return new Promise((resolve, reject) => {
        fetchPromotionList(commit, params).then(data => {
          commit('PUT_TABLE_DATA', data.rows);
          commit('PUT_UPDATE_DATE', data.update_time);
          resolve(data);
        });
      });
    },
    getPromotionTrend ({ commit }, params) {
      return new Promise((resolve, reject) => {
        fetchPromotionTrendList(commit, params).then(data => {
          commit('PUT_TREND_DATA', { class_id: params.class_id, data });
          resolve(data);
        })
      });
    }
  }
}
