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

const fetchDimList = (commit, indId) => {
  let skey = {app: 'indApply', type: 'dim', indId};

  let localCacheData = localCache(skey);
  if (localCacheData) {
    return new Promise((resolve, reject) => {
      resolve(localCacheData);
    });
  }

  commit('updateLoadingStatus', {isLoading: true}, { root: true });

  return fetchDimAndAttr({
    indId
  }).then(data => {
    if (!check(data)) { throw '指标维度数据为空或无效'; }

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
    // 指标维度列表对象 键:指标ID indId 值:指标维度列表 数组
    dims: {},
    // 指标对象哈希表 键:指标ID indId 值:指标对象
    indMap: {},
    applyFormData: {
      reason: '',       // 申请原因
      applyContent: ''  // 申请内容
    },
    applyContentList: [],
    indDimAttrCheckMap: {} // 指标ID获取 用户选择的维度属性数组
  },
  getters: {
    getIndContentByClassId: state => classId => {
      let indContent = state.applyContentList.find(item => item.classId == classId);

      return indContent && indContent.indList.map(item => item.name).join('；');
    },
    getClassByClassId: state => classId => {
      let indClass = state.indClassList.find(item => item.classId == classId);

      return indClass;
    },
    getIndByIndId: state => indId => {
      let ind = state.indMap[String(indId)];

      return ind;
    },
    indDimIsActive: (state, getters) => (classId, id) => {
      let applyContentList = state.applyContentList;
      let idx = applyContentList.findIndex(applyItem => applyItem.classId == classId);

      console.log('indDimIsActive', classId, id, idx);

      if (idx === -1) return false;

      let indList = applyContentList[idx].indList;
      let idx2 = indList.findIndex(ind => ind.id == id);
      if (idx2 === -1) return false;

      return true;
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
      state.applyFormData.reason = '';
    },
    ['PUSH_DIM_LIST'] (state, {indId, dimList}) {
      Vue.set(state.dims, indId, dimList);
    },
    ['PUSH_IND_MAP'] (state, {indId, ind}) {
      if (!state.indMap[String(indId)]) {
        Vue.set(state.indMap, indId, ind);
      }
    },
    ['PUSH_IND_DIM_ATTR'] (state, {indId, id}) {
      let indDimAttrCheckMap = state.indDimAttrCheckMap;
      let attrList = indDimAttrCheckMap[String(indId)];
      if (attrList) {
        let idx = attrList.indexOf(id);
        if (idx === -1) attrList.push(id);
      } else {
        indDimAttrCheckMap[String(indId)] = [id];
      }
    },
    ['DROP_IND_DIM_ATTR'] (state, {indId, id}) {
      let indDimAttrCheckMap = state.indDimAttrCheckMap;
      let attrList = indDimAttrCheckMap[String(indId)];
      if (attrList) {
        let idx = attrList.indexOf(id);
        if (idx !== -1) attrList.splice(idx, 1);
      }
    },
    ['ADD_APPLY_CONTENT'] (state, { classId, className, id, name }) {
      let applyContentList = state.applyContentList;
      let idx = applyContentList.findIndex(applyItem => applyItem.classId == classId);

      if (idx !== -1) {
        let indList = applyContentList[idx].indList;
        let idx2 = indList.findIndex(ind => ind.id == id);
        if (idx2 === -1) {
          indList.push({ id, name });
        }
      } else {
        applyContentList.push({
          classId,
          className,
          indList: [{ id, name }]
        });
      }
    },
    ['DEL_APPLY_CONTENT'] (state, { classId, id }) {
      let applyContentList = state.applyContentList;
      let idx = applyContentList.findIndex(applyItem => applyItem.classId == classId);

      if (idx === -1)  return true;

      let indList = applyContentList[idx].indList;
      let idx2 = indList.findIndex(ind => ind.id == id);

      if (idx2 === -1) return true;

      indList.splice(idx2, 1);
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
    },
    getDimList ({ commit }, indId) {
      return new Promise((resolve, reject) => {
        fetchDimList(commit, indId).then(dimList => {
          commit('PUSH_DIM_LIST', {indId, dimList});
          resolve(dimList);
        })
      });
    },
    submitApply ({ state, commit }) {
      state.applyFormData.applyContent = state.applyContentList;
      // 确认提交申请
      commit('updateLoadingStatus', {isLoading: true, loadingText: '提交申请...'}, { root: true });

      return new Promise((resolve, reject) => {
        submitApply(state.applyFormData).then(data => {
          resolve(data);
          setTimeout(() => {
            commit('updateLoadingStatus', {isLoading: false}, { root: true });
            commit('RESET_APPLY');
          }, 800);
        })
      });
    }
  }
}
