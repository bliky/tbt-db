import VueRouter from 'vue-router';
import Cookie from 'js-cookie';
import localDb from '../common/db';
import localStorage from '../common/storage';
import { buildQuery } from '../common/stringify';

// APP入口页面
import Home from '../components/Home';           // 首页
import Dashboard from '../components/dashboard'; // 转化漏斗
import Roi from '../components/roi';             // ROI分析
import RoiCity from '../components/roi/city';    // ROI城市分析
import RoiCh from '../components/roi/ch';        // ROI渠道分析
import Promotion from '../components/promotion'; // 推广分析
import PromotionSelcity from '../components/promotion/selcity'; // 推广分析 选择城市
import PromotionTracking from '../components/promotion/tracking.vue'; // 推广分析 推广效果跟踪
import PromotionCompare from '../components/promotion/compare.vue'; // 推广分析 现金消费对比
import PromotionCompareFilter from '../components/promotion/filter.vue'; // 推广分析 现金消费对比
import BranchCore from '../components/branch/core'; // 分公司专题 核心指标
import BranchCommon from '../components/branch/common'; // 分公司专题 常用指标
import BranchGmv from '../components/branch/gmv'; // 分公司专题 实时GMV

// 控制路由
const routes = [
  // 重定向到首页
  {
    path: '/',
    redirect: '/bdc-prd-dbd/board',
    meta: {
      title: '数据看板'
    }
  },
  // 一级入口：数据看板首页
  {
    path: '/bdc-prd-dbd/board',
    component: Home,
    meta: {
      title: '数据看板'
    }
  },
  // 1.1 二级入口：转化漏斗
  {
    path: '/bdc-prd-dbd/dashboard',
    component: Dashboard,
    meta: {
      title: '转化漏斗'
    }
  },
  // 1.2 二级入口：ROI分析
  {
    path: '/bdc-prd-dbd/roi',
    component: Roi,
    meta: {
      title: 'ROI分析'
    }
  },
  // 1.2.1 三级入口：ROI城市分析详情
  {
    path: '/bdc-prd-dbd/roi-city/:id',
    component: RoiCity,
    meta: {
      title: 'ROI城市分析'
    }
  },
  // 1.2.2 三级入口：ROI渠道分析详情
  {
    path: '/bdc-prd-dbd/roi-ch/:id',
    component: RoiCh,
    meta: {
      title: 'ROI渠道分析'
    }
  },
  // 1.3 二级入口：推广分析
  {
    path: '/bdc-prd-dbd/promotion',
    component: Promotion,
    meta: {
      title: '推广分析'
    }
  },
  // 1.3.1 三级入口：推广分析 选择城市
  {
    path: '/bdc-prd-dbd/promotion-selcity',
    component: PromotionSelcity,
    meta: {
      title: '选择城市'
    }
  },
  // 1.4 二级入口：推广效果跟踪
  {
    path: '/bdc-prd-dbd/promotion-tracking',
    component: PromotionTracking,
    meta: {
      title: '推广效果跟踪'
    }
  },
  // 1.4.1 三级入口：推广效果 现金消费对比
  {
    path: '/bdc-prd-dbd/promotion-compare',
    component: PromotionCompare,
    meta: {
      title: '消费现金对比'
    }
  },
  // 1.4.2 三级入口：推广效果 选择对比筛选条件
  {
    path: '/bdc-prd-dbd/compare-filter',
    component: PromotionCompareFilter,
    meta: {
      title: '修改筛选条件'
    }
  },
  // 1.5 二级入口：分公司专题-核心指标
  {
    path: '/bdc-prd-dbd/branch-core',
    component: BranchCore,
    meta: {
      title: '核心指标'
    }
  },
  // 1.6 二级入口：分公司专题-常用指标
  {
    path: '/bdc-prd-dbd/branch-common',
    component: BranchCommon,
    meta: {
      title: '常用指标'
    }
  },
  // 1.7 二级入口：分公司专题-实时GMV
  {
    path: '/bdc-prd-dbd/branch-gmv',
    component: BranchGmv,
    meta: {
      title: '实时GMV'
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

let rel = router.beforeEach((to, from, next) => {
  // console.log('beforeEach location.href', location.href);
  // console.log('URL查询对象', to.query);

  to.query.appVersion && Cookie.set('t8t-it-appVersion', to.query.appVersion);
  to.query.appType && Cookie.set('t8t-it-appType', to.query.appType);
  to.query.deviceId && Cookie.set('t8t-it-deviceId', to.query.deviceId);
  to.query.version && Cookie.set('t8t-it-version', to.query.version);
  to.query.accountId && Cookie.set('t8t-it-accountId', to.query.accountId);
  to.query.tickets && Cookie.set('t8t-it-ticket', to.query.tickets);
  to.query.token && Cookie.set('t8t-it-token', to.query.token);
  to.query.uid && Cookie.set('t8t-it-uid', to.query.uid);
  to.query.uName && Cookie.set('t8t-it-uname', to.query.uName);

  // 保存完整的URL查询字符串
  //if (to.query.appVersion && to.query.appType && to.query.deviceId && to.query.version && to.query.tickets && to.query.token && to.query.uid && to.query.uName) {
  if (to.query.uName) {
    localDb.set('urlQuery', buildQuery({uName: to.query.uName}));
  }

  // rel();

  try {
    if (router.app.$el) {
      const _to = to.path
      const _from = from.path
      const scrollTop = router.app.$el.querySelector('#vux_view_box_body').scrollTop
      const h = localStorage.get(_to)
      if ((h && h.history) || (_from && _from.indexOf(_to) === 0)) {
        router.app.$el.className = 'transition-reverse'
        h.history = false
        localStorage.set(_to, h)
      } else {
        localStorage.set(_from, {
          scrollTop: scrollTop,
          history: true
        })
        if (router.app.$el) router.app.$el.className = ''
      }
    }
  } catch (e) {
    // swallo error
    console.log(e)
  }

  next();
  /* if (!to.query.uName) {
    setTimeout(()=>{
      VueApp.$vux.toast.show({
        type: 'warn',
        text: 'URL中的uName参数为空,这将导致后台查看接口调用的用户名为"-", 请与OA开发者协商, 在数据查看页面的URL中携带uName参数。',
        width: '80%',
        time: 10000
      })
    }, 3000);
  } else {
    setTimeout(()=>{
      VueApp.$vux.toast.show({
        text: 'uName: ' + to.query.uName,
        width: '80%',
        time: 2000
      });
    }, 3000);
  } */
});

router.afterEach((to, from) => {
  // console.log('afterEach location.href', location.href);
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
