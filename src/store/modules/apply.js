import Vue from 'vue'
import storage from '../../common/storage'
import localDb from '../../common/db'
import { buildQuery } from '../../common/stringify'
import { fetchIndClass, fetchInd, fetchDimAndAttr, submitApply, insertApply } from '../../services/api'

const localCache = (param, data) => {
  let qs = buildQuery(param);
  if (!data) {
    return storage.get(qs);
  }

  return storage.set(qs, data);
}

const check = (data) => {
  return data.result && data.result.rows && data.result.rows.length;
}

const fetchIndClassList = (commit) => {
  let skey = {app: 'indApply', type: 'indClass'};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return fetchIndClass().then(data => {
    if (!check(data)) { throw '指标分类数据为空或无效'; }

    localCache(skey, data.result.rows);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return data.result.rows;
  })
}

const fetchIndList = (commit, indClassId) => {
  let skey = {app: 'indApply', type: 'ind', indClassId};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return fetchInd({
    indClassId
  }).then(data => {
    if (!check(data)) { throw '指标数据为空或无效'; }

    localCache(skey, data.result.rows);

    setTimeout(commit('updateLoadingStatus', {isLoading: false}, { root: true }), 800);

    return data.result.rows;
  })
}

export default {
  namespaced: true,
  state: {
    // 指标分类
    indClassList: [{
      classCode: '',
      classId: '',
      className: ''
    }],
    // 指标列表对象 键:指标分类ID classId 值:指标列表 数组
    inds: {},
    applyFormData: {
      reason: '',       // 申请原因
      applyContent: ''  // 申请内容
    },
    applyContentList: [
      {
        classId: 1,
        className: '流量指标',
        attrNameList: '北京外呼可售转化率，北京外呼可售转化率北京外呼可售转化率，北京外呼可售转化率，深圳登记，南京SEM，北京登记'
      },
      {
        classId: 3,
        className: '流量指标',
        attrNameList: 'adf asdf'
      }
    ]
  },
  getters: {
    getIndContentByClassId: state => classId => {
      let indContent = state.applyContentList.find(item => item.classId == classId);

      return indContent && indContent.attrNameList;
    },
    getClassByClassId: state => classId => {
      let indClass = state.indClassList.find(item => item.classId == classId);

      return indClass;
    },
    applyActive (state) {
      return state.applyContentList.length;
    },
    applyValid (state) {
      let reason = state.applyFormData.reason;
      reason = reason.replace(/(^\s+|\s+$)/, '');
      Vue.set(state.applyFormData, 'reason', reason);

      return reason;
    }
  },
  mutations: {
    ['PUT_IND_CLASS_LIST'] (state, classList) {
      state.indClassList = classList
    },
    ['PUSH_IND_LIST'] (state, {indClassId, indList}) {
      Vue.set(state.inds, indClassId, indList);
    },
    ['RESET_APPLY'] (state) {
      state.applyContentList = [];
    }
  },
  actions: {
    getIndClassList ({ commit }) {
      fetchIndClassList(commit).then(classList => {
        commit('PUT_IND_CLASS_LIST', classList);
      })
    },
    getIndList ({ commit }, indClassId) {
      return new Promise((resolve, reject) => {
        fetchIndList(commit, indClassId).then(indList => {
          commit('PUSH_IND_LIST', {indClassId, indList});
          resolve(indList);
        })
      });
    }
  }
}
