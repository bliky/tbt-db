<template>
  <div class="promotion-page">
    <div class="top-hint-text">
    {{ updateDate }} 更新
    </div>
    <div class="tracking-header">
      <div class="tracking-header_top">
        <div style="display: inline-block" @click="onSelDt">
          <span class="tracking-dt">{{ curDt }}</span>
          <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i>
        </div>
        <div class="cash-compare-btn" @click="onClickCompare"><i class="tbt-icon tbt-icon-money"></i>消费现金对比</div>
      </div>
      <div class="tracking-header_bot">
        <span>当月进度：</span>
        <span class="tracking-progress-percent">{{ progressPercent }}</span>
        <span class="tracking-pogress-bar">
          <span class="tracking-pogress-bar_inner" :style="`width: ${progressPercent}`"></span>
        </span>
      </div>
    </div>
    <div class="tracking-body">
      <tab :line-width="2"  v-model="index" active-color="#06C792">
        <tab-item :selected="curType === 'budget'" @click.native="chType('budget')">预算进度</tab-item>
        <tab-item :selected="curType === 'clue'" @click.native="chType('clue')">新增线索</tab-item>
        <tab-item :selected="curType === 'sale'" @click.native="chType('sale')">精准可售</tab-item>
      </tab>
      <table class="tbt-promotion-table">
        <tr>
          <th style="width: 84px;">渠道</th>
          <th v-for="ind in showInd[curType]" :key="ind.prop" v-if="curType === 'budget' || (curType !== 'budget' && ind.prop !== 'roi')">{{ ind.label }}</th>
          <th class="set-showind" @click="onSetShowind"><i class="tbt-icon tbt-icon-plus"></i></th>
        </tr>
        <tr v-for="row in tableData" :key="row.displayNameId">
          <td>{{ row.displayName }}</td>
          <td v-for="ind in showInd[curType]" :key="ind.prop" v-if="curType === 'budget' || (curType !== 'budget' && ind.prop !== 'roi')">
            <span v-if="ind.type == 3 && ((curType === 'budget' && row[ind.prop] > progress) || (curType !== 'budget' && row[ind.prop] < progress))" style="color:#FC3142">
              {{ formatRow(ind.type, row[ind.prop]) }}
            </span>
            <span v-else>
              {{ formatRow(ind.type, row[ind.prop]) }}
            </span>
          </td>
          <td></td>
        </tr>
      </table>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSetInd">
        <div class="popup-pannel">
          <div class="popup-pannel-header">
            <div class="popup-pannel-header_left" @click="showSetInd=false">取消</div>
            <div class="popup-pannel-header_center">更多指标</div>
            <div class="popup-pannel-header_right" @click="onConfirmSetInd">确定</div>
          </div>
          <div class="popup-pannel-body">
            <ul class="tracking-indlist">
              <li v-for="ind in allInd" v-show="curType === 'budget' || (curType !== 'budget' && ind.prop !== 'roi')" :key="ind.prop" :class="{ checked: hasCheckInd(ind.prop) }" @click="selInd(ind.prop)">
                {{ typeof ind.label === 'object' ? ind.label[curType] : ind.label }}</li>
            </ul>
          </div>
          <p class="popup-pannel-footer"><i class="tbt-icon tbt-icon-info"></i> 最多选择三个指标</p>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import tracking from './tracking.js'

export default tracking;
</script>

<style lang="less">
@import './promotion.less';
@import './tracking.less';

.tracking-header {
  background: #fff;
  padding: 15px;
}

.tracking-header_top {
  line-height: 25px;
  position: relative;
}

.tracking-dt {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
}

.tracking-header_bot {
  margin-top: 10px;
  line-height: 17px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  overflow: hidden;
  span {
    float: left;
  }
  .tracking-pogress-bar {
    margin: 5px 0 0 5px;
  }
}

.tracking-body {
  margin-top: 10px;
  background: #fff;
}

.cash-compare-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: #FFFAF1;
  border: 1px solid #FFEED2;
  border-radius: 15px;
  height: 30px;
  box-sizing: border-box;
  line-height: 28px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #6A4C17;
  letter-spacing: 0;
  padding: 0 10px;
  .tbt-icon {
    position: relative;
    top: 2px;
    margin-right: 5px;
  }
}

.tracking-progress-percent {
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  color: #333333;
  letter-spacing: 0;
}

.tracking-pogress-bar {
  display: inline-block;
  background: #E3E3E3;
  border-radius: 4px;
  height: 6px;
  width: 80px;
  overflow: hidden;
  .tracking-pogress-bar_inner {
    border-radius: 4px;
    display: inline-block;
    height: 100%;
    background: #06C792;
  }
}

th.set-showind {
  text-align: center !important;
  width: 30px;
  padding: 0;
  position: relative;
  .tbt-icon {
    top: 2px;
    margin-left: 0;
  }
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    width: 5px;
    height: 100%;
    left: 0;
    top: 0;
    background-image: linear-gradient(-90deg, rgba(255,255,255,0.00) 2%, rgba(0,0,0,0.10) 100%);
  }
}

.popup-pannel {
  background: #fff;
}
.popup-pannel-header {
  display: flex;
  height: 50px;
  padding: 0 20px;
  line-height: 50px;
}
.popup-pannel-header_left, .popup-pannel-header_right {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #06C792;
  text-align: center;
}
.popup-pannel-header_center {
  flex: 1;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #999999;
  letter-spacing: -0.31px;
  text-align: center;
}
.popup-pannel-body {
  border-top: 1px solid #EEEEEE;
  padding: 20px 20px 0;
}
ul.tracking-indlist {
  overflow: hidden;
  li {
    border: 1px solid #EEEEEE;
    border-radius: 22px;
    height: 40px;
    line-height: 38px;
    text-align: center;
    padding: 0 20px;
    float: left;
    margin-right: 15px;
    margin-bottom: 15px;
    font-size: 15px;
    color: #666666;
    box-sizing: border-box;
    &.checked {
      color: #06C792;
      border-color: #06C792;
    }
  }
}
.popup-pannel-footer {
  font-family: PingFangSC-Regular;
  font-size: 10px;
  color: #999999;
  text-align: center;
  padding: 15px 0;
  margin-top: 6px;
}
</style>
