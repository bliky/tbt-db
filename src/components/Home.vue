<template>
<div class="tbt-page">
  <div class="tbt-nav-g" v-if="isSubjectGroupShow">
    <div class="tbt-nav-t">专题分析</div>
    <div class="tbt-nav-grid">
      <div v-if="accessGroup[0].group.funnel" @click="navTo('funnel')" class="tbt-nav-grid-item"><img src="../assets/image/funnel@2x.png"><p>转化漏斗</p></div>

      <div v-if="accessGroup[0].group.roi" @click="navTo('roi')" class="tbt-nav-grid-item"><img src="../assets/image/roi@2x.png"><p>ROI分析</p></div>

      <div v-if="accessGroup[0].group.promotion" @click="navTo('promotion')" class="tbt-nav-grid-item"><img src="../assets/image/promotion@2x.png"><p>推广分析</p></div>
    </div>
  </div>

  <div class="tbt-nav-g">
    <div class="tbt-nav-t">指标看板</div>
    <div class="tbt-nav-grid">
      <div @click="navTo('indView')" class="tbt-nav-grid-item"><img src="../assets/image/data@2x.png"><p>指标看板</p></div>
      <div @click="navTo('indApply')" class="tbt-nav-grid-item"><img src="../assets/image/apply@2x.png"><p>指标申请</p></div>
      <div @click="navTo('indAnnotation')" class="tbt-nav-grid-item"><img src="../assets/image/explain@2x.png"><p>指标释义</p></div>
    </div>
  </div>

<!--   <div class="tbt-nav-g">
    <div class="tbt-nav-t">指标看板(重构模块)</div>
    <div class="tbt-nav-grid">
      <div @click="navTo('indApplyNew')" class="tbt-nav-grid-item"><img src="../assets/image/apply@2x.png"><p>指标申请</p></div>
    </div>
  </div> -->

  <div style="position: absolute; bottom: 30px; left: 0; width: 100%; z-index: 600;">
    <div style="font: 13px/18px PingFangSC-Regular; color: #C1C1C1; letter-spacing: 0; text-align: center; width: 160px; margin: 0 auto;"><divider style="color: #c1c1c1;">土巴兔大数据</divider></div>
  </div>
</div>
</template>

<script>
import Cookie from 'js-cookie';
import { urlIsAccess } from '../services/api';
import { Divider } from 'vux';
import { navTo } from '../utils/utils'

export default {
  components: {
    Divider
  },
  data() {
    return {
      accessGroup: [
        {
          title: '专题分析',
          group: {
            funnel: false,
            roi: false,
            promotion: false
          }
        }
      ]
    }
  },
  computed: {
    isSubjectGroupShow () {
      let g = this.accessGroup[0].group;
      return g.funnel || g.roi || g.promotion;
    }
  },
  created () {
    this.checkAccess();
  },
  methods: {
    checkAccess () {
      let url = '/bdc-prd-dbd/dashboard';
      let g = this.accessGroup[0].group;

      urlIsAccess({ url }).then(res => {
        g['funnel'] = res.result.isAccess.toString() === 'true';

        url = '/bdc-prd-dbd/roi';

        return urlIsAccess({ url });
      }).then(res => {
        g['roi'] = res.result.isAccess.toString() === 'true';

        url = '/bdc-prd-dbd/promotion';

        return urlIsAccess({ url });
      }).then(res => {
        console.log('promotion', res);
        g['promotion'] = res.result.isAccess.toString() === 'true';
        console.log(this.accessGroup[0].group);
      });
    },
    navTo(name) {
      navTo.call(this, name);
    }
  }
}
</script>

<style lang="less">
.tbt-page {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #F6F6F6;
}

.tbt-nav-g {
  overflow: hidden;
  background: #ffffff;
  margin-top: 10px;
}

.tbt-nav-t {
  padding: 10px 15px;
  color: #333333;
  font: bold 17px/24px PingFangSC-Medium;
}

.tbt-nav-grid {
  overflow: hidden;
  padding: 10px 0;
}

.tbt-nav-grid-item {
  float: left;
  padding: 8px 0 15px;
  text-align: center;
  box-sizing: border-box;
  width: 25%;
  img {
    height: 30px;
    width: auto;
  }
  p {
    color: #999999;
    font: 13px/18px PingFangSC-Regular;
  }
}
</style>
