<template>
  <div style="background-color: #f6f6f6; position:fixed; top:0; bottom: 0; left: 0; right: 0;">
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
        <li class="checked">
          全国
          <i class="tbt-icon tbt-icon-checked"></i>
          <i class="tbt-icon tbt-icon-uncheck"></i>
        </li>
        <li>
          全国
          <i class="tbt-icon tbt-icon-checked"></i>
          <i class="tbt-icon tbt-icon-uncheck"></i>
        </li>
        <li>
          全国
          <i class="tbt-icon tbt-icon-checked"></i>
          <i class="tbt-icon tbt-icon-uncheck"></i>
        </li>
      </ul>
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
        <li>
          <h3>asdf</h3>
          <ul>
            <li class="checked">
              广州
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
            <li class="disable">
              广州
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </li>
        <li>
          <h3>asdf</h3>
          <ul>
            <li>
              广州
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </li>
      </ul>

      <div class="tbt-seldim-bot">
        <div class="tbt-seldim-btn">确认</div>
      </div>

      <div class="tbt-letter-navsider minspace" style="padding-top:0; top: 260px;">
        <ul>
          <li>A</li><li>B</li><li>C</li><li>D</li><li>E</li>
          <li>F</li><li>G</li><li>H</li><li>I</li><li>J</li>
          <li>K</li><li>L</li><li>M</li><li>N</li><li>O</li>
          <li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li>
          <li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import '../common/icon'
import focus from '../../directives/focus'

export default {
  data () {
    return {
      isSearchFocus: false,
      searchKeyword: ''
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
  },
  methods: {
  }
}
</script>

<style lang="less">
@import './selcity.less';
</style>
