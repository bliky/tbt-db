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
                    :class="{active: isActive(attritem.attrId), disable: attritem.isAttrApply!='false'}"
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
      <div @click="handleOnClickConfirm" class="tbt-seldim-btn" :class="{active: checkedNum}">确认</div>
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
      id: this.$route.params.id,
      indClass: localDb.get('indClass'),
      classId: localDb.get('indClass').classId || '',
      activeIds: []
    }
  },
  computed: {
    ...mapState('apply', ['dims']),
    ...mapGetters('apply', ['getIndByIndId', 'indDimIsActive']),
    ind () {
      return this.getIndByIndId(this.id);
    },
    dimList () {
      return this.dims[this.id];
    },
    // 选择的指标数目
    checkedNum () {
      return this.activeIds.length;
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapActions('apply', ['getDimList']),
    ...mapMutations('apply', {
      addApply: 'ADD_APPLY_CONTENT',
      delApply: 'DEL_APPLY_CONTENT',
      addAttrToIndMap: 'PUSH_IND_DIM_ATTR',
      dropAttrFromIndMap: 'DROP_IND_DIM_ATTR'
    }),
    init () {
      let indId = this.id;

      if (this.dims[String(indId)]) {
        // console.log('内存读取指标维度数据', this.dims[String(indId)]);
        return true;
      }

      this.getDimList(indId).then(dimList => {
        // console.log('HTTP请求获取指标维度数据', dimList);
      });
    },
    isActive (id) {
      let active = this.indDimIsActive(this.classId, id);
      let idx = this.activeIds.indexOf(id);
      if (active) {
        idx === -1 && this.activeIds.push(id);
      } else {
        idx === -1 || this.activeIds.splice(idx, 1);
      }

      return active;
    },
    handleOnClickCityMore (dim) {
      let hotCityList = dim.hotCityList;
      let otherCityList = dim.otherCityList;

      localDb.set('hotCityList', hotCityList);
      localDb.set('otherCityList', otherCityList);
      goTo.call(this, 'applySelCity');
    },
    handleOnClickCheckAll (dim) {
      dim.dimAttrItem.forEach(attr => {
        if (attr.isAttrApply == 'false' && !this.isActive(attr.attrId)) {
          this.addApply({
            ...this.indClass,
            id: attr.attrId,
            name: attr.dim_ind_name
          });
          this.addAttrToIndMap({ indId: attr.indId, id: attr.attrId });
        }
      });
    },
    handleOnClickDimAttr (dimAttr) {
      if (dimAttr.isAttrApply != 'false') return false;

      let { indId, dimId, dimName, attrId, dim_ind_name } = dimAttr;
      let indItem = { indId, dimId, dimName, attrId, dim_ind_name };

      if (this.isActive(dimAttr.attrId)) {
        // 已经选择：删除维度
        this.delApply({ classId: this.classId, id: dimAttr.attrId });
        this.dropAttrFromIndMap({ indId: dimAttr.indId, id: dimAttr.attrId });
      } else {
        // 未选择：增加维度
        this.addApply({
          ...this.indClass,
          id: dimAttr.attrId,
          name: dimAttr.dim_ind_name,
          indItem
        });
        this.addAttrToIndMap({ indId: dimAttr.indId, id: dimAttr.attrId });
      }
    },
    handleOnClickConfirm () {
      if (!this.checkedNum) return false;

      goBack.call(this);
    }
  }
};
</script>
