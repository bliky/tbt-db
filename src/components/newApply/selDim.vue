<template>
  <div class="tbt-apply-seldim">
    <div class="tbt-seldim-pannel">
      <div class="tbt-seldim-pannel_hd">
        <div class="tbt-seldim-indinfo">
          <div class="tbt-seldim-indinfo_hd">
            <div class="tbt-selind">{{ ind.indName }}</div>
          </div>
          <div class="tbt-seldim-indinfo_bd">
            <p>选择关注的维度，组成维度指标，如上海线索数、SEM线索数，如不需要细分则忽略。</p>
          </div>
        </div>
      </div>
      <div class="tbt-seldim-pannel_bd">
        <ul class="tbt-seldim-glist">
          <li class="tbt-seldim-g" v-for="(item, idx) in dimList">
            <div class="tbt-seldim_hd">{{ item.dimName }}
              <div v-if="item.isCity=='true'" @click="handleOnClickCityMore(item)" class="tbt-seldim_hdrt">更多城市</div>
              <div v-else @click="handleOnClickCheckAll(item)" class="tbt-seldim_hdrt">全选</div>
            </div>
            <div class="tbt-seldim_bd">
              <ul class="tbt-seldim-list">
                <li v-for="attritem in item.dimAttrItem"
                    class="tbt-seldim"
                    :class="{active: false, disable: attritem.isAttrApply!='false'}"
                    @click="handleOnClickDimAttr(attritem)">
                  {{ attritem.dim_ind_name }}
                  <i class="tbt-icon tbt-icon-chose"></i></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="tbt-seldim-bot">
      <div class="tbt-seldim-btn" :class="{active: true}">确认</div>
    </div>
  </div>
</template>

<script>
import '../common/icon'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { goTo, goBack } from '../../utils/utils'
import localDb from '../../common/db'

export default {
  data () {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapState('apply', ['dims']),
    ...mapGetters('apply', ['getIndByIndId']),
    ind () {
      return this.getIndByIndId(this.id);
    },
    dimList () {
      return this.dims[this.id];
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapActions('apply', ['getDimList']),
    init () {
      let indId = this.id;

      if (this.dims[String(indId)]) {
        console.log('内存读取指标维度数据', this.dims[String(indId)]);
        return true;
      }

      this.getDimList(indId).then(dimList => {
        console.log('HTTP请求获取指标维度数据', dimList);
      });
    },
    handleOnClickCityMore (dim) {
      let hotCityList = dim.hotCityList;
      let otherCityList = dim.otherCityList;

      localDb.set('hotCityList', hotCityList);
      localDb.set('otherCityList', otherCityList);
      goTo.call(this, 'applySelCity');
    },
    handleOnClickCheckAll (dim) {
      console.log('全选', dim.dimAttrItem);
    },
    handleOnClickDimAttr (dimAttr) {
      console.log('选择维度属性', dimAttr);
    }
  }
};
</script>
