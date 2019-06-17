<template>
  <div>
    <div style="height: 34px; line-height: 34px; background: #F6F6F6; text-align: center; color: #999999; font-size: 12px; font-family: PingFangSC-Regular;">
      <span style="cursor: pointer">
        选择区/城市
        <i class="tbt-icon-triangle_low" style="position: relative; top: 3px; margin-left: 2px; opacity: .3"></i>
      </span>
    </div>
    <div style="text-align: center; margin: 14px 0 6px;">
      <btn-tab :tabs="tabs" v-model="tabIndex" :hidden="tabHidden"></btn-tab>
    </div>
    <div style="display: flex">
      <div style="width: 38px; height: 58px; background: #F6F6F6; border-radius: 0 12px 12px 0; display: flex; align-items:center">
        <i class="tbt-icon tbt-icon-left"/>
        <span style="width: 19px; line-height: 13px; font-size: 12px;color: #666666;text-align: center;">上一日</span>
      </div>
      <div style="flex: 1; text-align: center; margin: auto 0;">
        <h2 style="font-size: 17px; color: #333333;">5月28日</h2>
        <p style="font-size: 12px; color: #999999;">更新时间：19/03/04 09:24:23</p>
      </div>
      <div style="width: 38px; height: 58px; background: #F6F6F6; border-radius: 12px 0 0 12px; display: flex; align-items:center">
        <span style="width: 19px; line-height: 13px; font-size: 12px;color: #666666;text-align: center;">下一日</span>
        <i class="tbt-icon tbt-icon-right"/></div>
    </div>
    <div class="index-board">
      <div class="index-board-grid" v-for="item in indexList" :key="item.name">
        <div class="index-card">
          <div class=index-name>{{ item.name }}</div>
          <div class="index-value">{{ item.value }}</div>
          <div class="index-stat">
            <p>环比 <span :class="{positive: item.mom > 0, negtive: item.mom < 0}">{{ item.mom|stat-formater }}</span></p>
            <p>同比 <span :class="{positive: item.yoy > 0, negtive: item.yoy < 0}">{{ item.yoy|stat-formater }}</span></p>
          </div>
        </div>
      </div>
      <div class="index-board-grid full">
        <div class="index-card">
          <div class=index-name>总收入</div>
          <div class="index-value">1,372.3万</div>
          <div class="index-stat">
            <p>环比 <span :class="{positive: -0.13 > 0, negtive: -0.13 < 0}">{{ -0.13|stat-formater }}</span></p>
            <p>同比 <span :class="{positive: 0.25 > 0, negtive: 0.25 < 0}">{{ 0.25|stat-formater }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'

export default {
  components: {
    btnTab
  },
  filters: {
    statFormater (val) {
      if (val > 0) {
        return '+' + parseInt(val * 100) + '%'
      }
      return '-' + parseInt(-val * 100) + '%'
    }
  },
  data () {
    return {
      tabIndex: 0,
      tabHidden: [0, 0, 0, 0],
      tabs: ['日', '周', '月', '年'],
      indexList: [
        {
          name: '土巴兔APP的DAU',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '浪费率',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '量房数',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '线上装修成交GMV',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '材料成交GMV',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '转介绍激活量',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        }
      ]
    }
  }
}
</script>

<style lang="less">
.index-board {
  overflow: hidden;
  margin: 30px 5px 30px 20px;
}
.index-board-grid {
  width: 50%;
  float: left;
  box-sizing: border-box;
  padding: 0 15px 15px 0;
  &.full {
    width: 100%;
    .index-card {
      height: 112px;
    }
    .index-name {
      position: absolute;
      left: 40px;
      top: 42px;
      font-size: 20px;
      color: #999999;
    }
    .index-value {
      position: absolute;
      font-size: 24px;
      top: 28px;
      right: 34px;
    }
    .index-stat {
      position: absolute;
      bottom: 29px;
      right: 34px;
      width: 160px;
      overflow: hidden;
      p {
        float: right;
        & + p {
          margin-right: 21px;
        }
      }
    }
  }
}
.index-card {
  text-align: center;
  border: 1px solid #F6F6F6;
  border-radius: 10px;
  padding: 5px 0 10px;
  position: relative;
}
.index-name {
  font-size: 12px;
  color: #999999;
}
.index-value {
  margin-top: 8px;
  font-size: 20px;
  color: #000000;
}
.index-stat {
  font-size: 12px;
  color: #999999;
  width: 70px;
  margin: 5px auto 0;
  p {
    text-align: left;
  }
  .positive, .negtive {
    margin-left: 8px;
  }
  .positive {
    color: #06C792;
  }
  .negtive {
    color: #FC3142;
  }
}
</style>

