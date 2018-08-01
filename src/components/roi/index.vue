<template>
  <div style="background-color: #f6f6f6;">
    <!-- 日期选择 -->
    <div class="tbt-cell" style="box-sizing: border-box; padding: 10px 15px 0px; background-color: #fff;">
      <div class="tbt-cell_bd">
        <div style="display:inline-block; font: 15px/21px PingFangSC-Regular; color: #333;" @click.stop="handleOnClickDateSelect">
          {{ currentDate }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i>
        </div>
      </div>

      <div style="position: absolute; right: 15px; top: 7px;">
        <div class="tbt-tooltip-wrapper">
          <a @click.stop="roiTooltipShow=!roiTooltipShow" class="tbt-icon tbt-icon-info js-roi"></a>
          <div v-show="roiTooltipShow" v-click-outside="clickRoiTooltipOutside" class="tbt-tooltip-content" :style="`width: ${winW-30}px;`">
            <div class="tbt-tooltip-arrow-up"></div>
            <table class="tbt-tooltip-table">
              <tr><td valign="top" style="width: 65px; text-align: right;">现金消费：</td><td>线上推广花费的实际金额</td></tr>
              <tr><td valign="top" style="text-align: right;">收入：</td><td>扣款金额+人工服务费（2017年3月之前派单取的是旧版人工服务费的实缴金额，2017年3月之后派单取的是新版人工服务费的应缴金额）</td></tr>
              <tr><td valign="top" style="text-align: right;">ROI：</td><td>收入/现金消费</td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 总况 -->
    <div class="roi-g" style="margin-bottom: 10px; background-color: #fff;">
      <div class="roi-gi">
        <div class="roi-gin" style="margin-right: 8px;">
          <p>现金消费</p>
          <p><b>{{roi.all.input/10000|filter-number('0,0.00', '', '万')}}</b></p>
          <!-- <p>
            <span class="rh">环比</span>
            <span class="ld" :class="{increase: roi.all.input_m_ratio>0, decrease: roi.all.input_m_ratio<0}">{{roi.all.input_m_ratio|filter-number('0,0', '+', '%')}}</span>
          </p>
          <p>
            <span class="rh">同比</span>
            <span class="ld" :class="{increase: roi.all.input_y_ratio>0, decrease: roi.all.input_y_ratio<0}">{{roi.all.input_y_ratio|filter-number('0,0', '+', '%')}}</span>
          </p> -->
        </div>
      </div>
      <div class="roi-gi">
        <div class="roi-gin" style="margin: 0 4px;">
          <p>收入</p>
          <p><b>{{roi.all.income/10000|filter-number('0,0.00', '', '万')}}</b></p>
<!--           <p>
            <span class="rh">环比</span>
            <span class="ld" :class="{increase: roi.all.income_m_ratio>0, decrease: roi.all.income_m_ratio<0}">{{roi.all.income_m_ratio|filter-number('0,0', '+', '%')}}</span>
          </p>
          <p>
            <span class="rh">同比</span>
            <span class="ld" :class="{increase: roi.all.income_y_ratio>0, decrease: roi.all.income_y_ratio<0}">{{roi.all.income_y_ratio|filter-number('0,0', '+', '%')}}</span>
          </p> -->
        </div>
      </div>
      <div class="roi-gi">
        <div class="roi-gin" style="margin-left: 8px;">
          <p>ROI</p>
          <p><b>{{roi.all.roi|filter-number('0,0.00')}}</b></p>
          <!-- <p>
            <span class="rh">环比</span>
            <span class="ld" :class="{increase: roi.all.roi_m_ratio>0, decrease: roi.all.roi_m_ratio<0}">{{roi.all.roi_m_ratio|filter-number('0,0', '+', '%')}}</span>
          </p>
          <p>
            <span class="rh">同比</span>
            <span class="ld" :class="{increase: roi.all.roi_y_ratio>0, decrease: roi.all.roi_y_ratio<0}">{{roi.all.roi_y_ratio|filter-number('0,0', '+', '%')}}</span>
          </p> -->
        </div>
      </div>
    </div>

    <!-- 城市分析与渠道分析 -->
    <div style="background-color: #fff;">
      <tab :tabs="['城市分析', '渠道分析']"  v-model="index" style="margin-bottom: 3px;"></tab>
      <keep-alive>
        <city v-if="index === 0"></city>
        <ch10 v-else></ch10>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import roi from './roi.js'

export default roi;
</script>

<style lang="less">
@import "./roi.less";
</style>
