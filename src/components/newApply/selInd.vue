<template>
  <div class="tbt-apply-selind">
    <div class="tbt-selind-pannel">
      <h2 class="tbt-selind-title">{{ indClass && indClass.className }}
        <div style="position: absolute; height: 24px; width: 26px; right: 0; top: 0;">
          <i class="tbt-icon tbt-icon-collect"></i>
          <span style="position: absolute; right: -8px; top: -8px; background: #09C767; width: 20px; height: 20px; border-radius: 10px; color: #fff; text-align: center; font:12px/20px PingFangSC-Regular,sans-serif;">1</span>
        </div>
      </h2>

      <ul class="tbt-selind-list">
        <li @click="handleOnClickInd(item.indId)" class="tbt-selind" :class="{seled: true}" v-for="(item, index) in indList">{{ index + '' + item.indName }}</li>
      </ul>
    </div>

    <div class="tbt-selind-btn-bot" :class="{active: true}">确认</div>
  </div>
</template>

<script>
import '../common/icon'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { goToId } from '../../utils/utils'

export default {
  data () {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapState('apply', ['inds']),
    ...mapGetters('apply', [
      'getClassByClassId'
    ]),
    indClass () {
      return this.getClassByClassId(this.id);
    },
    indList () {
      return this.inds[this.id];
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapActions('apply', ['getIndList']),
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
    handleOnClickInd (indId) {
      goToId.call(this, 'applySelDim', indId);
    }
  }
};
</script>
