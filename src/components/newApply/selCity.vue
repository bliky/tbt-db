<template>
  <div class="tbt-selcity">
    <div class="tbt-title-cell">
      热门城市
      <div @click="handleOnClickCheckAll(hotCityList)" class="tbt-title-cell_rt">全选</div>
    </div>

    <ul class="tbt-hotcity">
      <li @click="handleOnClickCity(city)" v-for="city in hotCityList" :class="{checked: isActive(city.attrId), disable: city.isAttrApply=='true'}">
        {{ city.dim_ind_name }}
        <i class="tbt-icon tbt-icon-chose"></i>
      </li>
    </ul>

    <div class="tbt-title-cell">
      其他城市
      <div @click="handleOnClickCheckAll(otherCityList)" class="tbt-title-cell_rt">全选</div>
    </div>

    <ul class="tbt-citylist">
      <li v-for="cityg in otherCityList" :ref="'cityg' + cityg.letter">
        <h3>{{ cityg.letter }}</h3>
        <ul>
          <li @click="handleOnClickCity(city)" v-for="city in cityg.list" :class="{checked: isActive(city.attrId), disable: city.isAttrApply=='true'}">
            {{ city.dim_ind_name }}
            <i class="tbt-icon tbt-icon-checked"></i>
            <i class="tbt-icon tbt-icon-checkeded"></i>
          </li>
        </ul>
      </li>
    </ul>

    <div class="tbt-seldim-bot">
      <div @click="handleOnClickConfirm" class="tbt-seldim-btn" :class="{active: checkedNum}">确认</div>
    </div>

    <div class="tbt-letter-navsider">
      <ul>
        <li @click="backTop">热门</li>
        <li @click="handleOnClickNavLetter(cityg.letter)" v-for="cityg in otherCityList">{{ cityg.letter }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import '../common/icon'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { goBack } from '../../utils/utils'
import localDb from '../../common/db'

export default {
  data () {
    return {
      hotCityList: localDb.get('hotCityList'),
      otherCityList: localDb.get('otherCityList'),
      indClass: localDb.get('indClass'),
      classId: localDb.get('indClass').classId || '',
      activeIds: []
    }
  },
  computed: {
    ...mapGetters('apply', ['indDimIsActive']),
    // 选择的指标数目
    checkedNum () {
      return this.activeIds.length;
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapMutations('apply', {
      addApply: 'ADD_APPLY_CONTENT',
      delApply: 'DEL_APPLY_CONTENT'
    }),
    init () {
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
    backTop () {
      document.getElementById("vux_view_box_body").scrollTop = 0;
    },
    checkAllCities (cities) {
      cities.forEach(cityAttr => {
        if (cityAttr.isAttrApply == 'false' && !this.isActive(cityAttr.attrId)) {
          this.addApply({
            ...this.indClass,
            id: cityAttr.attrId,
            name: cityAttr.dim_ind_name
          });
        }
      });
    },
    handleOnClickNavLetter (letter) {
      let citygOffsetTop = this.$refs['cityg'+letter][0].offsetTop;

      document.getElementById("vux_view_box_body").scrollTop = citygOffsetTop;
    },
    handleOnClickCheckAll (cities) {
      if (cities[0].letter) {
        cities.forEach(cityg => {
          this.checkAllCities(cityg.list);
        });
      } else {
        this.checkAllCities(cities);
      }
    },
    handleOnClickCity (city) {
      if (city.isAttrApply == 'true') return false;

      if (this.isActive(city.attrId)) {
        // 已经选择：删除维度
        this.delApply({ classId: this.classId, id: city.attrId });
      } else {
        // 未选择：增加维度
        this.addApply({
          ...this.indClass,
          id: city.attrId,
          name: city.dim_ind_name
        });
      }
    },
    handleOnClickConfirm () {
      if (!this.checkedNum) return false;

      goBack.call(this);
    }
  }
};
</script>
