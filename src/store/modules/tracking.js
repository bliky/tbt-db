import storage from '../../common/storage'
import { buildQuery } from '../../common/stringify'
import moment from 'moment'
import { fetchTrackingBudget, fetchTrackingClue, fetchTrackingSale, fetchTrackingCashCompare } from '../../services/api'

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

const fetchData = (commit, params, type) => {
  let skey = {app: 'promotion-tracking', type, params:JSON.stringify(params)};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  let fetch = {
    budget: fetchTrackingBudget,
    clue: fetchTrackingClue,
    sale: fetchTrackingSale,
    compare: fetchTrackingCashCompare
  }[type]

  return fetch(params).then(data => {
    if (!check(data)) { throw '数据无效'; }

    localCache(skey, data.result.dataList);

    commit('updateLoadingStatus', {isLoading: false}, { root: true });

    return data.result.dataList;
  })
}

const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
const getProgess = dt => {
  let curDay = parseFloat(moment(dt).format('DD'))
  let days = parseFloat(moment(dt).endOf('month').format('DD'))
  return curDay/days
}

export default {
  namespaced: true,
  state: {
    budgetData: [],
    clueData: [],
    saleData: [],
    compareData: [],
    curType: 'budget',
    curDt: yesterday,
    updateDate: yesterday,
    progress: getProgess(yesterday),
    comPramas: {
      type: [],
      dt1: [],
      dt2: []
    }
  },
  mutations: {
    ['CH_DATE'] (state, dt) {
      state.curDt = dt
      state.progress = getProgess(dt)
    },
    ['CH_UPDATE'] (state, dt) {
      state.updateDate = dt
    },
    ['CH_TYPE'] (state, type) {
      state.curType = type
    },
    ['CH_COM'] (state, com) {
      state.comPramas = com
    }
  },
  actions: {
    async fetch ({ commit, state }, { params, type }) {
      let data = await fetchData(commit, params, type)
      switch (type) {
        case 'budget':
          state.budgetData = data
          break
        case 'clue':
          state.clueData = data
          break
        case 'sale':
          state.saleData = data
          break
        case 'compare':
          state.compareData = data
          break
      }
      return data
    }
  }
}
