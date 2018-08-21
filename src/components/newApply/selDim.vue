<template>
  <div class="tbt-apply-seldim">
    <div class="tbt-seldim-pannel">
      <h2 class="tbt-seldim-title">
        <div style="position: absolute; height: 24px; width: 26px; right: 0; top: 0;">
          <i class="tbt-icon tbt-icon-collect"></i>
          <span style="position: absolute; right: -8px; top: -8px; background: #09C767; width: 20px; height: 20px; border-radius: 10px; color: #fff; text-align: center; font:12px/20px PingFangSC-Regular,sans-serif;">1</span>
        </div>
      </h2>

      <ul class="tbt-seldim-list">
      </ul>
    </div>

    <div class="tbt-seldim-btn-bot" :class="{active: true}">确认</div>
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
    ...mapState('apply', []),
    ...mapGetters('apply', []),
    dimList () {
      return this.inds[this.id];
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapActions('apply', []),
    init () {
    },
    handleOnClickDim (dim) {
    }
  }
};
</script>
