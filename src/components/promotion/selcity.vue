<template>
  <div style="background-color: #f6f6f6;">
    <div class="tbt-search-bar" :class="{focus: isSearchFocus}">
      <div class="tbt-search">
        <div class="tbt-search-icon"><i class="tbt-icon tbt-icon-search" style="position: relative; top: -7px;"></i></div>
        <input autofocus="autofocus" @focus="isSearchFocus=true" class="tbt-search-input" v-model="searchKeyword" placeholder="输入城市名搜索"></input>
        <div class="tbt-clear-icon" v-show="searchKeyword" @click="searchKeyword=''">
          <i class="tbt-icon tbt-icon-delete"></i>
        </div>
      </div>
      <div class="tbt-search-cannel" @click="isSearchFocus=false">取消</div>
    </div>

    <div v-show="searchKeyword && isSearchFocus" class="tbt-search-result">
      <ul class="tbt-searchlist">
        <li :class="{checked: citiesPicked.city_type===0 && citiesPicked.city_params.indexOf(ci.id) !== -1}" @click="pickCity(0, ci.id)" v-for="ci in searchResults">
          {{ ci.name }}
          <i class="tbt-icon tbt-icon-checked"></i>
          <i class="tbt-icon tbt-icon-uncheck"></i>
        </li>
      </ul>
      <div v-show="!searchResults.length">
        <div class="search-empty"></div>
        <p style="text-align: center; font: 14px/20px PingFangSC-Regular,sans-serif; color: #C1C1C1;">查询不到城市信息</p>
      </div>
    </div>

    <div style="margin-top:56px; background: #fff; padding-bottom: 6px; padding-top: 15px; border-bottom: 1px solid #eee;">
      <div class="tbt-title-cell">
        落地类型
      </div>

      <ul class="tbt-sel-tag-list">
        <li :class="{checked: citiesPicked.city_type === 2 && citiesPicked.city_params.indexOf(1) !== -1}" @click="pickCity(2, 1)">落地</li>
        <li :class="{checked: citiesPicked.city_type === 2 && citiesPicked.city_params.indexOf(0) !== -1}" @click="pickCity(2, 0)">非落地</li>
      </ul>

      <div class="tbt-title-cell">
        落地时间
      </div>

      <ul class="tbt-sel-tag-list">
        <li :class="{checked: citiesPicked.city_type === 3 && citiesPicked.city_params.indexOf(1) !== -1}" @click="pickCity(3, 1)">新落地</li>
        <li :class="{checked: citiesPicked.city_type === 3 && citiesPicked.city_params.indexOf(0) !== -1}" @click="pickCity(3, 0)">老落地</li>
      </ul>
    </div>

    <div class="tbt-selcity" style="padding-top: 0; margin-top: 10px;">
      <ul class="tbt-citylist">
        <li>
          <ul>
            <li :class="{checked: citiesPicked.city_type===1}" @click="pickCity(1, true)" style="border-bottom: 1px solid #eee;">
              全国
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </li>
        <li v-for="cg in cities" :ref="'cg' + cg.letter">
          <h3>{{ cg.letter }}</h3>
          <ul>
            <li :class="{checked: citiesPicked.city_type===0 && citiesPicked.city_params.indexOf(ci.id) !== -1}" @click="pickCity(0, ci.id)" v-for="ci in cg.list">
              {{ ci.name }}
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </li>
      </ul>

      <div class="tbt-letter-navsider minspace" style="padding-top:0; top: 290px;">
        <ul>
          <li @click="backTop">顶部</li>
          <li @click="handleOnClickNavLetter(cg.letter)" v-for="cg in cities">{{ cg.letter }}</li>
        </ul>
      </div>
    </div>

    <div @click="handleOnClickConfirm" style="z-index: 10;background: #06C792;" class="tbt-selind-btn-bot" :class="{active: true}">确认</div>
  </div>
</template>

<script>
import '../common/icon'
import focus from '../../directives/focus'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { goTo, goBack } from '../../utils/utils'

export default {
  data () {
    return {
      isSearchFocus: false,
      searchKeyword: '',
      citiesPicked: {
        pre_city_type: 0,
        city_type: 1,
        city_params: []
      }
    }
  },
  computed: {
    ...mapState('promotion', ['cities', 'isSelectChShow', 'requestParams']),
    ...mapGetters('promotion', ['citiesPool']),
    searchResults () {
      let kw = this.searchKeyword;
      if (!kw) return [];
      let cities = this.citiesPool;
      return cities.filter(item => {
        return item.name.indexOf(kw) !== -1;
      });
    }
  },
  filters: {
  },
  directives: {
    focus
  },
  components: {
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapMutations('promotion', {
      add_opt: 'PUSH_OPT',
      submit_city_sel: 'SUBMIT_CITY_SEL'
    }),
    ...mapActions('promotion', ['getCities', 'getPromotion']),
    init () {
      this.resetCitySel();

      if (this.cities.length) return;
      this.getCities();
    },
    resetCitySel () {
      let { city_type, city_params } = this.requestParams;
      let citiesPicked = this.citiesPicked;

      citiesPicked.city_type = city_type;
      citiesPicked.city_params = [].concat(city_params);
    },
    // 提交城市选择
    submitCitySel () {
      this.submit_city_sel(this.citiesPicked);
    },
    pickCity (type, id) {
      let citiesPicked = this.citiesPicked;
      let { pre_city_type, city_type, city_params } = citiesPicked;

      switch (type) {
        case 0:
        case 2:
        case 3:
          if (city_type !== type) {
            citiesPicked.city_params = [];
            citiesPicked.pre_city_type = city_type;
            citiesPicked.city_type = type;
          }
          let idx = citiesPicked.city_params.indexOf(id);
          if (idx === -1) citiesPicked.city_params.push(id);
          else citiesPicked.city_params.splice(idx, 1);
          break;
        case 1:
          if (city_type === 1) {
            // 取消选择全国
            citiesPicked.city_type = pre_city_type;
          } else {
            citiesPicked.pre_city_type = city_type;
            citiesPicked.city_type = 1;
          }
          break;
      }
    },
    backTop () {
      document.getElementById("vux_view_box_body").scrollTop = 0;
    },
    handleOnClickNavLetter (letter) {
      let citygOffsetTop = this.$refs['cg'+letter][0].offsetTop-56;

      document.getElementById("vux_view_box_body").scrollTop = citygOffsetTop;
    },
    handleOnClickConfirm () {
      if (this.searchKeyword && this.isSearchFocus) {
        this.isSearchFocus = false;
        return;
      }

      this.submitCitySel();
      if (!this.isSelectChShow) {
        this.getPromotion();
      }
      // goBack.call(this);
      goTo.call(this, 'promotion');
    }
  }
}
</script>

<style lang="less">
@import './selcity.less';
</style>
