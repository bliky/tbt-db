<template>
  <div class="tbt-selcity">
    <div class="tbt-title-cell">
      热门城市
      <div class="tbt-title-cell_rt">全选</div>
    </div>

    <ul class="tbt-hotcity">
      <li v-for="city in hotCityList">
        {{ city.dim_ind_name }}
      </li>
    </ul>

    <div class="tbt-title-cell">
      其他城市
      <div class="tbt-title-cell_rt">全选</div>
    </div>

    <ul class="tbt-citylist">
      <li v-for="cityg in otherCityList" :ref="'cityg' + cityg.letter">
        <h3>{{ cityg.letter }}</h3>
        <ul>
          <li v-for="city in cityg.list">{{ city.dim_ind_name }}</li>
        </ul>
      </li>
    </ul>

    <div class="tbt-seldim-bot">
      <div @click="handleOnClickConfirm" class="tbt-seldim-btn" :class="{active: true}">确认</div>
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { goBack } from '../../utils/utils'
import localDb from '../../common/db'

export default {
  data () {
    return {
      hotCityList: localDb.get('hotCityList'),
      otherCityList: localDb.get('otherCityList')
    }
  },
  computed: {
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
    },
    backTop () {
      document.getElementById("vux_view_box_body").scrollTop = 0;
    },
    handleOnClickNavLetter (letter) {
      let citygOffsetTop = this.$refs['cityg'+letter][0].offsetTop;

      document.getElementById("vux_view_box_body").scrollTop = citygOffsetTop;
    },
    handleOnClickConfirm () {
      goBack.call(this);
    }
  }
};
</script>
