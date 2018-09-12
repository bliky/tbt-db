<template>
  <div style="
  background-color: #f6f6f6;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;">
    <div v-show="!isSelectChShow" style="height: 30px; padding: 0 11px; font: 13px/30px PingFangSC-Regular,sans-serif; color: #666666; position:relative;">
      {{ lastUpdateDate }} 更新
      <div class="tbt-pannel_title-rt">
        <div class="tbt-tooltip-wrapper" style="top: 0; right: 15px; width: 30px; height: 30px; line-height: 30px;">
          <a @click.stop="isTooltipShow=!isTooltipShow" style="position: relative; left: -1px;" class="tbt-icon tbt-icon-info js-fn"></a>
          <div v-show="isTooltipShow" v-click-outside="clickTooltipOutside" class="tbt-tooltip-content" :style="`width: ${winW-30}px; bottom: -10px;`">
            <div class="tbt-tooltip-arrow-up"></div>
            <p>
              1、每日14点左右更新数据的指标：消费现金、点击成本、新增成本、跟踪可售成本、发布可售成本、ROI、收入；<br>
              2、其他指标于每日上午10点左右更新数据
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

    <div class="tbt-pannel" style="padding: 0 0 44px; border-bottom: 1px solid #EEEEEE; margin-bottom: 21px;">
      <table class="tbt-promotion-table">
        <tr>
          <th style="width: 84px;">指标</th>
          <th>{{ months[0] }}</th>
          <th>{{ months[1] }}</th>
          <th>{{ months[2] }}</th>
        </tr>
        <tr v-for="row in tableData" @click="handleOnClickRow(row)">
          <td>{{ row.class_name }}</td>
          <td>{{ formatRow(row.data_type, row.this_month_value) }}</td>
          <td>{{ formatRow(row.data_type, row.last_month_value) }}</td>
          <td>{{ formatRow(row.data_type, row.last_two_month_value) }}</td>
        </tr>
      </table>
    </div>

    <!-- <transition name="slide"> -->
      <div v-show="isSelectChShow" class="pop-pannel" style="top: 50px; border-top: 1px solid #F6F6F6;">
        <div class="pop-pannel-bd">
          <div class="flex-container" style="height: 315px;">
            <div style="width: 126px;background: #F7F9FD;">
              <ul class="v-menu-lt">
                <li :class="{active: chCate==0}" @click="ch_cate(0)">全部渠道</li>
                <li :class="{active: chCate==1}" @click="ch_cate(1)">搜索类</li>
                <li :class="{active: chCate==2}" @click="ch_cate(2)">信息流</li>
              </ul>
            </div>
            <div class="flex-item tbt-chlist" style="overflow-y: auto;">
              <ul v-show="chCate==0" class="v-menu-rt">
                <li :class="{checked: chsPicked.all}" @click="pickCh('all', true)">
                  全部渠道
                  <i class="tbt-icon tbt-icon-checked"></i>
                  <i class="tbt-icon tbt-icon-uncheck"></i>
                </li>
              </ul>
              <ul v-show="chCate==1" class="v-menu-rt">
                <li :class="{checked: chsPicked.all_search}" @click="pickCh('all_search', true)">
                  全部搜索类
                  <i class="tbt-icon tbt-icon-checked"></i>
                  <i class="tbt-icon tbt-icon-uncheck"></i>
                </li>
                <li :class="{checked: chsPicked.search.indexOf(ch.id)!==-1}" @click="pickCh('search', ch.id)" v-for="ch in chs.search">
                  {{ ch.name }}
                  <i class="tbt-icon tbt-icon-checked"></i>
                  <i class="tbt-icon tbt-icon-uncheck"></i>
                </li>
              </ul>
              <ul v-show="chCate==2" class="v-menu-rt">
                <li :class="{checked: chsPicked.all_feed}" @click="pickCh('all_feed', true)">全部信息流类
                  <i class="tbt-icon tbt-icon-checked"></i>
                  <i class="tbt-icon tbt-icon-uncheck"></i>
                </li>
                <li :class="{checked: chsPicked.feed.indexOf(ch.id)!==-1}" @click="pickCh('feed', ch.id)" v-for="ch in chs.feed">
                  {{ ch.name }}
                  <i class="tbt-icon tbt-icon-checked"></i>
                  <i class="tbt-icon tbt-icon-uncheck"></i>
                </li>
              </ul>
            </div>
          </div>
          <div style="padding: 14px 20px 0;">
            <div @click="handleOnChConfirm" style="font: 17px/50px PingFangSC-Regular,sans-serif; background: #06C792;border: 1px solid #06C792;border-radius: 2px;color:#fff;text-align:center;">确定</div>

            <div @click="handleOnChCancel" style="font: 17px/50px PingFangSC-Regular,sans-serif; color:#06C792; text-align:center;">取消</div>
          </div>
        </div>
      </div>
    <!-- </transition> -->

    <!-- 查看趋势图弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="isTrendDialogShow" :hide-on-blur="true" :dialog-style="{maxWidth: dialogWidth + 'px', width: dialogWidth + 'px', height: '255px', borderRadius: '3px'}">
        <div class="tbt-pro-dialog">
          <div class="tbt-pro-dialog-hd">
            {{ currentTrend.class_name }}
            <btn-tab :tabs="trendTabs" v-model="trendTabIndex" :hidden="trendTabHidden"></btn-tab>
          </div>
          <div style="margin: 20px -15px 0; background: #f6f6f6; height: 171px; overflow:hidden;">
            <div v-show="trendTabIndex==0" >
              <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.day.length" :data="currentTrend.day" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
            <div v-show="trendTabIndex==1" >
              <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.month.length" :data="currentTrend.month" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
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

.empty-trend {
  text-align: center;
  font-size: 14px;
  color: #888;
  height: 170px;
  line-height: 170px;
}
</style>
