<template>
  <div style="background-color: #f6f6f6;">
    <div class="tbt-search-bar" :class="{focus: isSearchFocus}">
      <div class="tbt-search">
        <div class="tbt-search-icon"><i class="tbt-icon tbt-icon-search" style="position: relative; top: -7px;"></i></div>
        <input v-focus @focus="isSearchFocus=true" class="tbt-search-input" v-model="searchKeyword" placeholder="输入城市名搜索"></input>
        <div class="tbt-clear-icon" v-show="searchKeyword" @click="searchKeyword=''">
          <i class="tbt-icon tbt-icon-delete"></i>
        </div>
      </div>
      <div class="tbt-search-cannel" @click="isSearchFocus=false">取消</div>
    </div>

    <div v-show="isSearchFocus" class="tbt-search-result">
      <ul class="tbt-searchlist">
        <li v-for="ci in searchResults">
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

    <div style="background: #fff; padding-bottom: 6px; padding-top: 15px; border-bottom: 1px solid #eee;">
      <div class="tbt-title-cell">
        落地类型
      </div>

      <ul class="tbt-sel-tag-list">
        <li>落地</li>
        <li>非落地</li>
      </ul>

      <div class="tbt-title-cell">
        落地时间
      </div>

      <ul class="tbt-sel-tag-list">
        <li>新落地</li>
        <li>老落地</li>
      </ul>
    </div>

    <div class="tbt-selcity" style="padding-top: 0; margin-top: 10px;">
      <ul class="tbt-citylist">
        <li>
          <ul>
            <li class="checked" style="border-bottom: 1px solid #eee;">
              全国
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </li>
        <li v-for="cg in cities">
          <h3>{{ cg.letter }}</h3>
          <ul>
            <li v-for="ci in cg.list">
              {{ ci.name }}
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </li>
      </ul>

      <div class="tbt-letter-navsider minspace" style="padding-top:0; top: 260px;">
        <ul>
          <li v-for="cg in cities">{{ cg.letter }}</li>
        </ul>
      </div>
    </div>

    <div class="tbt-seldim-bot" style="z-index: 11;">
      <div class="tbt-seldim-btn">确认</div>
    </div>
  </div>
</template>

<script>
import '../common/icon'
import focus from '../../directives/focus'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSearchFocus: false,
      searchKeyword: ''
    }
  },
  computed: {
    ...mapState('promotion', ['cities']),
    ...mapGetters('promotion', ['citiesPool']),
    searchResults () {
      let kw = this.searchKeyword;
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
    if (this.cities.length) return;
    this.getCities();
  },
  methods: {
    ...mapActions('promotion', ['getCities']),
  }
}
</script>

<style lang="less">
@import './selcity.less';
</style>
