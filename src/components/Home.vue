<template>
<div class="tbt-page">
  <div class="tbt-nav-g" v-if="isSubjectGroupShow">
    <div class="tbt-nav-t">专题分析</div>
    <div class="tbt-nav-grid">
      <div v-if="url_ids.indexOf(1) !== -1" @click="navTo('funnel')" class="tbt-nav-grid-item"><img src="../assets/image/funnel@2x.png"><p>转化漏斗</p></div>
      <div v-if="url_ids.indexOf(2) !== -1" @click="navTo('roi')" class="tbt-nav-grid-item"><img src="../assets/image/roi@2x.png"><p>ROI分析</p></div>
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

  <div class="tbt-nav-g" v-if="isPromotionGroupShow">
    <div class="tbt-nav-t">推广专题</div>
    <div class="tbt-nav-grid">
      <div v-if="url_ids.indexOf(3) !== -1" @click="navTo('promotion')" class="tbt-nav-grid-item"><img src="../assets/image/promotion@2x.png"><p>推广分析</p></div>
      <div v-if="url_ids.indexOf(4) !== -1" @click="navTo('promotionTracking')" class="tbt-nav-grid-item"><img src="../assets/image/rate@2x.png"><p>进度跟踪</p></div>
    </div>
  </div>

  <div class="tbt-nav-g" v-if="isBranchGroupShow">
    <div class="tbt-nav-t">分公司专题</div>
    <div class="tbt-nav-grid">
      <div v-if="url_ids.indexOf(5) !== -1" @click="navTo('branchCore')" class="tbt-nav-grid-item"><img src="../assets/image/data2@2x.png"><p>核心指标</p></div>
      <div v-if="url_ids.indexOf(12) !== -1" @click="navTo('branchCommon')" class="tbt-nav-grid-item"><img src="../assets/image/data_like@2x.png"><p>常用指标</p></div>
      <div v-if="url_ids.indexOf(13) !== -1" @click="navTo('branchGmv')" class="tbt-nav-grid-item"><img src="../assets/image/GMV@3x.png"><p>实时GMV</p></div>
    </div>
  </div>
<!--   <div class="tbt-nav-g">
    <div class="tbt-nav-t">指标看板(重构模块)</div>
    <div class="tbt-nav-grid">
      <div @click="navTo('indApplyNew')" class="tbt-nav-grid-item"><img src="../assets/image/apply@2x.png"><p>指标申请</p></div>
    </div>
  </div> -->

  <div style="position: absolute; bottom: 10px; left: 0; width: 100%; z-index: 600;">
    <div style="font: 13px/18px PingFangSC-Regular; color: #C1C1C1; letter-spacing: 0; text-align: center; width: 160px; margin: 0 auto;"><divider style="color: #c1c1c1;">土巴兔大数据</divider></div>
  </div>
</div>
</template>

<script>
import Cookie from 'js-cookie';
import { urlIsAccess, branchOfficeUrlIsAccessErp } from '../services/api';
import { Divider } from 'vux';
import { navTo } from '../utils/utils'

export default {
  components: {
    Divider
  },
  data() {
    return {
      url_ids: [],
      privs: null,
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
      let privs = this.privs
      return privs && privs[0] && privs[0].child.length
    },
    isPromotionGroupShow () {
      let privs = this.privs
      return privs && privs[1] && privs[1].child.length
    },
    isBranchGroupShow () {
      let privs = this.privs
      return privs && privs[2] && privs[2].child.length
    }
  },
  created () {
    this.checkAccessErp();
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
        g['promotion'] = res.result.isAccess.toString() === 'true';
      });
    },
    checkAccessErp () {
      let url_ids = this.url_ids
      branchOfficeUrlIsAccessErp({
        pid: 0
      }).then(res => {
        res.result.urlList.forEach(item => {
          item.child.forEach(item => {
            url_ids.push(item.url_id)
          })
        })
        this.privs = res.result.urlList
        console.log(res.result.urlList, url_ids)
      })
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
  margin: 15px;
  border-radius: 10px;
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
