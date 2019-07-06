import storage from '../../common/storage'
import { buildQuery } from '../../common/stringify'
import { branchOfficeGetCityList, branchOfficeGetCoreIndicator, branchOfficeGetIndicatorTendency, branchOfficeGetOftenIndicator } from '../../services/api'

const JSON = window.JSON;
const winW = window.innerWidth;

const localCache = (param, data) => {
  let qs = buildQuery(param);
  if (!data) {
    return storage.get(qs);
  }

  return storage.set(qs, data);
}

const check = (data) => {
  return data.status && data.status === 200 && data.result;
}

const fetchCityList = (commit) => {
  let skey = {app: 'branch', type: 'cities'};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return branchOfficeGetCityList({
    isArea: true
  }).then(data => {
    if (!check(data)) { throw '城市数据无效'; }

    localCache(skey, data.result);

    setTimeout(() => commit('updateLoadingStatus', {isLoading: false}, { root: true }), 0);

    return data.result;
  })
}

const fetchCoreInd = (commit, params) => {
  let skey = {app: 'branch', type: 'core', params:JSON.stringify(params)};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return branchOfficeGetCoreIndicator(params).then(data => {
    if (!check(data)) { return Promise.reject('数据无效') }

    localCache(skey, data.result.data);

    commit('updateLoadingStatus', {isLoading: false}, { root: true });

    return data.result.data;
  }).catch(err => {
    commit('updateLoadingStatus', {isLoading: false}, { root: true });
  })
}

const fetchCommonInd = (commit, params) => {
  let skey = {app: 'branch', type: 'common', params:JSON.stringify(params)};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return branchOfficeGetOftenIndicator(params).then(data => {
    if (!check(data)) { return Promise.reject('数据无效') }

    localCache(skey, data.result.data);

    commit('updateLoadingStatus', {isLoading: false}, { root: true });

    return data.result.data;
  }).catch(err => {
    commit('updateLoadingStatus', {isLoading: false}, { root: true });
  })
}

const fetchIndTrend = (commit, params) => {
  let skey = {app: 'branch', type: 'trend', params:JSON.stringify(params)};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return branchOfficeGetIndicatorTendency(params).then(data => {
    if (!check(data)) { return Promise.reject('数据无效') }

    localCache(skey, data.result);

    commit('updateLoadingStatus', {isLoading: false}, { root: true });

    return data.result;
  }).catch(err => {
    commit('updateLoadingStatus', {isLoading: false}, { root: true });
  })
}

export default {
  namespaced: true,
  state: {
    requestParams: {
    }
  },
  getters: {
  },
  mutations: {
    ['PUT_CITIES_LIST'] (state, cities) {
      state.cities = cities;
    },
    ['SUBMIT_CITY_SEL'] (state, citiesPicked) {
      let requestParams = state.requestParams;
      let { city_type, city_params } = citiesPicked;

      requestParams.city_type = city_type;
      requestParams.city_params = [].concat(city_params);
    }
  },
  actions: {
    getCities ({ commit }) {
      return new Promise((resolve, reject) => {
        fetchCityList(commit).then(cities => {
          commit('PUT_CITIES_LIST', cities);
          resolve(cities);
        })
      });
    },
    getCoreInd ({ commit, state }, params) {
      return fetchCoreInd(commit, params)
    },
    getCommonInd ({ commit, state }, params) {
      return fetchCommonInd(commit, params)
    },
    getIndTrend ({ commit, state }, params) {
      return fetchIndTrend(commit, params)
    }
    // getCoreInd ({ commit, state, getters }) {
    //   let params = buildParams(state);

    //   return new Promise((resolve, reject) => {
    //     fetchCoreIndList(commit, params).then(data => {
    //       commit('PUT_TABLE_DATA', data.rows);
    //       commit('PUT_UPDATE_DATE', data.update_time);
    //       resolve(data);
    //     });
    //   });
    // },
    // getCoreTrend ({ commit, state }, {class_id, row}) {
    //   let params = buildParams(state, true, class_id);
    //   return new Promise((resolve, reject) => {
    //     fetchCoreTrendList(commit, params, row).then(data => {
    //       commit('PUT_TREND_DATA', { class_id: params.class_id, data });
    //       resolve(data);
    //     })
    //   });
    // }
  }
}
