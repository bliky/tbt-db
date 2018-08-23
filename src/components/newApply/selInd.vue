<template>
  <div class="tbt-apply-selind">
    <div class="tbt-selind-pannel">
      <h2 class="tbt-selind-title">{{ indClass && indClass.className }}
        <div style="position: absolute; height: 24px; width: 26px; right: 0; top: 0;">
          <i class="tbt-icon tbt-icon-collect"></i>
          <span v-show="checkedIndNum" style="position: absolute; right: -8px; top: -8px; background: #09C767; width: 20px; height: 20px; border-radius: 10px; color: #fff; text-align: center; font:12px/20px PingFangSC-Regular,sans-serif;">{{ checkedIndNum }}</span>
        </div>
      </h2>

      <ul class="tbt-selind-list">
        <li @click="handleOnClickInd(item)" class="tbt-selind" :class="{active: indActive(item), disable: item.isummapply=='true'}" v-for="(item, index) in indList">{{ item.indName }}
          <i class="tbt-icon tbt-icon-chose"></i>
        </li>
      </ul>
    </div>

    <div @click="handleOnClickConfirm" class="tbt-selind-btn-bot" :class="{active: checkedIndNum}">确认</div>
  </div>
</template>

<script>
import '../common/icon'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { goToId, goBack } from '../../utils/utils'

export default {
  data () {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapState('apply', ['inds', 'applyContentList', 'indDimAttrCheckMap']),
    ...mapGetters('apply', [
      'getClassByClassId'
    ]),
    indClass () {
      return this.getClassByClassId(this.id);
    },
    indList () {
      return this.inds[this.id];
    },
    // 选择的指标数目
    checkedIndNum () {
      let applyItem = this.applyContentList.find(item => item.classId == this.id);
      if (!applyItem) return 0;
      return applyItem.indList.length;
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapMutations('apply', {
      pushIndMap: 'PUSH_IND_MAP'
    }),
    ...mapActions('apply', ['getIndList']),
    indActive (ind) {
      if (ind.isummapply=='true') return false;

      let attrMap = this.indDimAttrCheckMap[String(ind.indId)];

      return attrMap && attrMap.length;
    },
    init () {
      let classId = this.id;
      if (this.inds[String(classId)]) {
        console.log('内存读取指标数据', this.inds[String(classId)]);
        return true;
      }

      this.getIndList(classId).then(indList => {
        console.log('HTTP请求获取指标数据', indList);
      });
    },
    handleOnClickInd (ind) {
      if (ind.isummapply=='true') return false;

      this.pushIndMap({indId: ind.indId, ind});
      goToId.call(this, 'applySelDim', ind.indId);
    },
    handleOnClickConfirm () {
      if (!this.checkedIndNum) return false;

      goBack.call(this);
    }
  }
};
</script>
