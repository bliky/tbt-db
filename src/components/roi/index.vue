<template>
  <div style="background-color: #f6f6f6;">
    <!-- 日期选择 -->
    <div class="tbt-cell" style="box-sizing: border-box; padding: 10px 15px 0px; background-color: #fff;">
      <div class="tbt-cell_bd">
        <div style="font: 15px/21px PingFangSC-Regular; color: #333;" @click.stop="handleOnClickDateSelect">
          {{ currentDate }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i>
        </div>
      </div>
    </div>

    <!-- 总况 -->
    <div class="roi-g" style="margin-bottom: 10px; background-color: #fff;">
      <div class="roi-gi">
        <div class="roi-gin" style="margin-right: 8px;">
          <p>现金消费</p>
          <p><b>{{roi.all.input/10000|filter-number('0,0.0', '', '万')}}</b></p>
          <p>
            <span class="rh">环比</span>
            <span class="ld" :class="{increase: roi.all.input_m_ratio>0, decrease: roi.all.input_m_ratio<0}">{{roi.all.input_m_ratio|filter-number('0,0', '', '%')}}</span>
          </p>
          <p>
            <span class="rh">同比</span>
            <span class="ld" :class="{increase: roi.all.input_y_ratio>0, decrease: roi.all.input_y_ratio<0}">{{roi.all.input_y_ratio|filter-number('0,0', '', '%')}}</span>
          </p>
        </div>
      </div>
      <div class="roi-gi">
        <div class="roi-gin" style="margin: 0 4px;">
          <p>收入</p>
          <p><b>{{roi.all.income/10000|filter-number('0,0.0', '', '万')}}</b></p>
          <p>
            <span class="rh">环比</span>
            <span class="ld" :class="{increase: roi.all.income_m_ratio>0, decrease: roi.all.income_m_ratio<0}">{{roi.all.income_m_ratio|filter-number('0,0', '', '%')}}</span>
          </p>
          <p>
            <span class="rh">同比</span>
            <span class="ld" :class="{increase: roi.all.income_y_ratio>0, decrease: roi.all.income_y_ratio<0}">{{roi.all.income_y_ratio|filter-number('0,0', '', '%')}}</span>
          </p>
        </div>
      </div>
      <div class="roi-gi">
        <div class="roi-gin" style="margin-left: 8px;">
          <p>ROI</p>
          <p><b>{{roi.all.roi}}</b></p>
          <p>
            <span class="rh">环比</span>
            <span class="ld" :class="{increase: roi.all.roi_m_ratio>0, decrease: roi.all.roi_m_ratio<0}">{{roi.all.roi_m_ratio|filter-number('0,0', '', '%')}}</span>
          </p>
          <p>
            <span class="rh">同比</span>
            <span class="ld" :class="{increase: roi.all.roi_y_ratio>0, decrease: roi.all.roi_y_ratio<0}">{{roi.all.roi_y_ratio|filter-number('0,0', '', '%')}}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 城市分析与渠道分析 -->
    <tab :line-width="2"  v-model="index" active-color="#06C792">
      <tab-item :selected="index === 0" @click="index = 0">城市分析</tab-item>
      <tab-item :selected="index === 1" @click="index = 1">渠道分析</tab-item>
    </tab>
    <keep-alive>
      <city v-if="index === 0"></city>
      <ch10 v-else></ch10>
    </keep-alive>
  </div>
</template>

<script>
import roi from './roi.js'

export default roi;
</script>

<style lang="less">
@import "./roi.less";
</style>
