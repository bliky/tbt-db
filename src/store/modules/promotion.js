import Vue from 'vue'
import storage from '../../common/storage'
import localDb from '../../common/db'
import { buildQuery } from '../../common/stringify'
import moment from 'moment'
import { fetchPromotionCh, fetchPromotionCity, fetchPromotion, fetchPromotionTrend } from '../../services/api'

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

    // 强制转换数值格式
    let { day, month } = data.result;
    let fday = day.map(d => {
      return { dt:d.dt, val: parseFloat(d.val) };
    })
    let fmonth = month.map(d => {
      return { dt:d.dt, val: parseFloat(d.val) };
    })
    let fdata = { day: fday, month: fmonth };
    localCache(skey, fdata);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return fdata;
  })
}

const buildParams = (state, istrend=false, class_id) => {
  let common = state.requestParams;
  let { city_type, ch_type } = common;
  let params = { city_type, ch_type };

  //if (city_type != 1) {
    params.city_params = common.city_params;
  //}
  //if (ch_type != 1) {
    params.ch_params = common.ch_params;
  //}

  if (istrend) {
    params.class_id = class_id;
    params.dt = state.today;
  } else {
    params.dt = state.months[0];
  }

  return params;
}

const getOpts = (state, getters) => {
  let { city_type, ch_type, city_params, ch_params } = state.requestParams;
  let opts = [];

  switch (ch_type) {
    case 0:
      if ( ch_params.all_search ) {
        opts.push({name: '全部搜索类'});
      } else {
        ch_params.search.forEach(id => {
          let ch = state.chs.search.find(ch => {
            return ch.id == id;
          });
          opts.push(ch);
        });
      }
      if ( ch_params.all_feed ) {
        opts.push({name: '全部信息流类'});
      } else {
        ch_params.feed.forEach(id => {
          let ch = state.chs.feed.find(ch => {
            return ch.id == id;
          });
          opts.push(ch);
        });
      }
      break;
    case 1:
      opts.push({name: '全部渠道'});
      break;
  }

  let citiesPool = getters.citiesPool;
  switch (city_type) {
    case 0:
      city_params.forEach(id => {
        let city = citiesPool.find(city => {
          return city.id == id;
        });
        opts.push(city);
      });
      break;
    case 1:
      opts.push({name: '全国'});
      break;
    case 2:
      city_params.forEach(id => {
        if (id == 1) opts.push({name: '落地城市'});
        else opts.push({name: '非落地城市'});
      });
      break;
    case 3:
      city_params.forEach(id => {
        if (id == 1) opts.push({name: '新落地城市'});
        else opts.push({name: '老落地城市'});
      });
      break;
  }

  return opts;
}

const getOptsWidth = () => {
  let opts = document.getElementById('promotionOpts');
  if (!opts) return 600;

  let optsLens = [];

  for (let i=0,len=opts.childNodes.length; i<len; i++) {
    optsLens.push(opts.childNodes[i].offsetWidth + 10);
  }

  //let sum = opts.childNode.reduce((sum, item, idx, arr)=>{
  //   console.log({sum, item, idx, arr});
  //   return sum+item.offsetWidth;
  // }, 0);
  // console.log({sum});

  let sum = optsLens.reduce((sum, item)=>{
    return sum+item;
  });

  return sum + 26;
}

export default {
  namespaced: true,
  state: {
    today: moment().format('YYYY-MM-DD'),
    months: [moment().format('YYYY-MM'), moment().subtract(1, 'month').format('YYYY-MM'),  moment().subtract(2, 'month').format('YYYY-MM')],
    requestParams: {
      city_type: 1,
      city_params: [],
      ch_type: 1,
      ch_params: {
        search: [],
        feed: [],
        all_search: false,
        all_feed: false
      }
    },
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
    opts: [],
    optsWidth: winW
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
      let kk = String(data.class_id);
      if (!state.trends[kk]) {
        state.trends[String(data.class_id)] = data.data;
      }
    },
    ['PUSH_OPT'] (state, opt) {
      state.opts.push(opt);
    },
    ['PUT_OPTS'] (state, opts) {
      state.opts = opts;
    },
    ['MOD_CH_CATE'] (state, c) {
      state.chCate = c;
    },
    ['TOG_SEL_CH'] (state) {
      state.isSelectChShow = !state.isSelectChShow;
    },
    ['SUBMIT_CH_SEL'] (state, chsPicked) {
      let requestParams = state.requestParams;
      let ch_params = requestParams.ch_params;
      let { all, all_search, all_feed,  search, feed } = chsPicked;

      requestParams.ch_type = all ? 1 : 0;
      ch_params.all_search = all_search;
      ch_params.all_feed = all_feed;
      ch_params.search = [].concat(search);
      ch_params.feed = [].concat(feed);
    },
    ['SUBMIT_CITY_SEL'] (state, citiesPicked) {
      let requestParams = state.requestParams;
      let { city_type, city_params } = citiesPicked;

      requestParams.city_type = city_type;
      requestParams.city_params = [].concat(city_params);
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
    getPromotion ({ commit, state, getters }) {
      let params = buildParams(state);
      // 更新选择标签
      state.optsWidth = 10000;
      commit('PUT_OPTS', getOpts(state, getters));
      setTimeout(()=>{
        state.optsWidth = getOptsWidth();
      }, 500);
      return new Promise((resolve, reject) => {
        fetchPromotionList(commit, params).then(data => {
          commit('PUT_TABLE_DATA', data.rows);
          commit('PUT_UPDATE_DATE', data.update_time);
          resolve(data);
        });
      });
    },
    getPromotionTrend ({ commit, state }, class_id) {
      let params = buildParams(state, true, class_id);
      return new Promise((resolve, reject) => {
        fetchPromotionTrendList(commit, params).then(data => {
          commit('PUT_TREND_DATA', { class_id: params.class_id, data });
          resolve(data);
        })
      });
    }
  }
}
