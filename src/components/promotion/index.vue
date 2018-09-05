<template>
  <div style="background-color: #f6f6f6;">
    <div @click="handleOnClickDate" v-show="!isSelectChShow" style="height: 30px; padding: 0 11px; font: 13px/30px PingFangSC-Regular,sans-serif; color: #666666; position:relative;">
      数据更新至 {{ lastUpdateDate }}
      <div class="tbt-pannel_title-rt">
        <div class="tbt-tooltip-wrapper" style="top: 0; right: 15px; width: 30px; height: 30px; line-height: 30px;">
          <a @click.stop="isTooltipShow=!isTooltipShow" style="position: relative; left: -1px;" class="tbt-icon tbt-icon-info js-fn"></a>
          <div v-show="isTooltipShow" v-click-outside="clickTooltipOutside" class="tbt-tooltip-content" :style="`width: ${winW-30}px; bottom: -10px;`">
            <div class="tbt-tooltip-arrow-up"></div>
            <p>
              选择日期范围内，实际发生的发起线索次数、新增线索数、可售、分派、扣款、签约全流程的漏斗转化数据。其中日、周、月粒度，分别为当日、当周、当月实际发生的统计数
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-cell" style="box-sizing: border-box; padding: 10px 15px; background-color: #fff;">
      <div class="tbt-cell_bd">
        <div class="tbt-sel-tag" style="float: left;" @click.stop="handleOnClickChSelect">选择渠道 <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>

        <div class="tbt-sel-tag" style="float: left;" @click.stop="handleOnClickCitySelect">选择城市 <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>
      </div>
    </div>

    <div v-if="opts.length" style="overflow-y: hidden; overflow-x: auto; border-top: 1px solid #EEEEEE;border-bottom: 1px solid #EEEEEE;">
      <div id="promotionOpts" class="tbt-opts" :style="{width: `${optsWidth}px`}">
        <div class="tbt-opt" v-for="opt in opts">{{ opt.name }}</div>
      </div>
    </div>

    <div class="tbt-pannel" style="padding: 0 0 44px; border-bottom: 1px solid #EEEEEE; margin-bottom: -29px;">
      <table class="tbt-promotion-table">
        <tr>
          <th style="width: 84px;">指标</th>
          <th>9月</th>
          <th>8月</th>
          <th>7月</th>
        </tr>
        <tr v-for="row in tableData" @click="$emit('onClickRow', row)">
          <td>{{ row.class_name }}</td>
          <td>{{ row.this_month_value|filter-number('0,0.00') }}</td>
          <td>{{ row.last_month_value|filter-number('0,0.00') }}</td>
          <td>{{ row.last_two_month_value|filter-number('0,0.00') }}</td>
        </tr>
      </table>
    </div>

    <!-- <transition name="slide"> -->
      <div v-show="isSelectChShow" class="pop-pannel" style="top: 50px; border-top: 1px solid #F6F6F6;">
        <div class="pop-pannel-bd">
          <div class="flex-container" style="height: 315px;">
            <div style="width: 126px;background: #F7F9FD;">
              <ul class="v-menu-lt">
                <li>全部渠道</li>
                <li class="active">搜索类</li>
                <li>信息流</li>
              </ul>
            </div>
            <div class="flex-item" style="overflow-y: auto;">
              <ul class="v-menu-rt">
                <li>全部搜索类</li>
                <li>百度H5</li>
                <li>百度PC</li>
                <li>搜狗</li>
                <li>神马</li>
                <li>神马</li>
                <li>神马</li>
                <li>神马</li>
                <li>神马</li>
                <li>神马</li>
                <li>神马</li>
                <li>神马</li>
              </ul>
            </div>
          </div>
          <div style="padding: 14px 20px 0;">
            <div style="font: 17px/50px PingFangSC-Regular,sans-serif; background: #06C792;border: 1px solid #06C792;border-radius: 2px;color:#fff;text-align:center;">确定</div>
            <div style="font: 17px/50px PingFangSC-Regular,sans-serif; color:#06C792; text-align:center;">取消</div>
          </div>
        </div>
      </div>
    <!-- </transition> -->

    <!-- 指标确认弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="isTrendDialogShow" :hide-on-blur="true" :dialog-style="{maxWidth: dialogWidth + 'px', width: dialogWidth + 'px', height: '255px', borderRadius: '3px'}">
        <div class="tbt-pro-dialog">
          <div class="tbt-pro-dialog-hd">
            {{ currentTrend.class_name }}
            <btn-tab :tabs="trendTabs" v-model="trendTabIndex"></btn-tab>
          </div>
          <div style="margin: 20px -15px 0; background: #f6f6f6; height: 171px; overflow:hidden;">
            <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.day.length" v-show="trendTabIndex==0" :data="currentTrend.day"></chart-line>
            <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.month.length" v-show="trendTabIndex==1" :data="currentTrend.month"></chart-line>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import promotion from './promotion.js'

export default promotion;
</script>

<style lang="less">
@import './promotion.less';
</style>
