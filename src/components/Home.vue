<template>
<div class="tbt-page">
  <div class="tbt-nav-g" v-if="isSubjectGroupShow">
    <div class="tbt-nav-t">专题分析</div>
    <div class="tbt-nav-grid">
      <div v-if="accessGroup[0].group.funnel" @click="navTo('funnel')" class="tbt-nav-grid-item"><img src="../assets/image/funnel@2x.png"><p>转化漏斗</p></div>

      <div v-if="accessGroup[0].group.roi" @click="navTo('roi')" class="tbt-nav-grid-item"><img src="../assets/image/roi@2x.png"><p>ROI分析</p></div>
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

   <div class="tbt-nav-g">
    <div class="tbt-nav-t">测试</div>
    <div class="tbt-nav-grid">
      <div @click="navTo('download')" class="tbt-nav-grid-item"><img src="../assets/image/indDescGreen@2x.png"><p>下载</p></div>
    </div>
  </div>

  <div style="position: absolute; bottom: 30px; left: 0; width: 100%; z-index: 600;">
    <div style="font: 13px/18px PingFangSC-Regular; color: #C1C1C1; letter-spacing: 0; text-align: center; width: 160px; margin: 0 auto;"><divider >土巴兔大数据</divider></div>
  </div>
</div>
</template>

<script>
import Cookie from 'js-cookie';
import { urlIsAccess } from '../services/api';
import { Divider } from 'vux';

const is_dev = process.env.NODE_ENV !== 'production';
const baseUrl = is_dev ? '' : 'https://dbdbigdata.to8to.com';
const routData = {
  funnel: { url: baseUrl + '/bdc-prd-dbd/dashboard', title:'转化漏斗' },
  roi: { url: baseUrl + '/bdc-prd-dbd/roi', title:'ROI分析' },
  indView: { url: baseUrl + '/bdc-prd-dbd/dataBoard', title:'指标看板' },
  indApply: { url: baseUrl + '/bdc-prd-dbd/apply', title:'指标申请' },
  indAnnotation: { url: baseUrl + '/bdc-prd-dbd/MyInds', title:'指标释义' },
  download: { url: baseUrl + '/static/doc.docx', title:'下载资料' },
};
function callNative (typeId, data) {
  let jsonData = {}; // 初始化
  if (data) {
    jsonData = {'type': typeId, 'data': data};
  } else {
    jsonData = {'type': typeId};
  }
  if (Cookie.get('t8t-it-appType') == 1) { // android
    rabbitcircle.invoke(JSON.stringify(jsonData));
  } else { // ios
    window.location.href = 'to8to://www.oa.com/app/approve?json=' + JSON.stringify(jsonData);
  }
};

const navTo = is_dev ?
  function (name) { this.$router.push({ path: routData[name].url }) } :
  function (name) { callNative(1007, routData[name]) };

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
            roi: false
          }
        }
      ]
    }
  },
  computed: {
    isSubjectGroupShow () {
      let g = this.accessGroup[0].group;
      return g.funnel || g.roi;
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
        console.log('funnel is access', res);

        g['funnel'] = res.data.result.isAccess.toString() === 'true';
        url = '/bdc-prd-dbd/roi';

        return urlIsAccess({ url });
      }).then(res => {
        console.log('roi is access', res);

        g['roi'] = res.data.result.isAccess.toString() === 'true';
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
