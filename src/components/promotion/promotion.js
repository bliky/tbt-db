import { filterNumber } from '../../common/filter'
import clickOutside from '../../directives/clickOutside'
import '../common/icon'
import { goTo } from '../../utils/utils'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import { btnTab } from '../common/tab'
import { Line4 as ChartLine } from '../common/chart'

const winW = window.innerWidth;

export default {
  data () {
    return {
      currentCh: '全部渠道',
      currentCity: '全国',
      lastUpdateDate: '2018-09-04 15:26',
      isSelectChShow: false,
      isTooltipShow: false,
      isTrendDialogShow: false,
      currentTrend: {
        class_name: '',
        day: [
          { dt: '2018-09', val: 200 }
        ],
        month: [
          { dt: '2018-09', val: 100 }
        ]
      },
      trendTabIndex: 0,
      trendTabs: ['日报', '月报'],
      chartWidth: winW - 26,
      chartHeight: 171,
      winW: winW,
      opts: [
      ],
      optsWidth: winW,
      dialogWidth: winW - 26,
      tableData: [
        {
          class_id: 1,
          class_name: '费用',
          this_month_value: '1.21',
          last_month_value: '1.32',
          last_two_month_value: '1.47'
        }
      ]
    }
  },
  watch: {
    opts () {
      this.$nextTick(() => {
        this.getOptsWidth();
      });
    }
  },
  computed: {
  },
  filters: {
    filterNumber
  },
  directives: {
    clickOutside,
    TransferDom
  },
  components: {
    XDialog,
    btnTab,
    ChartLine
  },
  mounted () {
    this.$on('onClickRow', row => {
      console.log(row);
      this.currentTrend.class_name = row.class_name;
      this.isTrendDialogShow = true;
    })
    this.getOptsWidth();
  },
  methods: {
    getOptsWidth () {
      let opts = document.getElementById('promotionOpts');
      if (!opts) return 600;

      let optsLens = [];

      for (let i=0,len=opts.childNodes.length; i<len; i++) {
        optsLens.push(opts.childNodes[i].offsetWidth + 10);
      }

      //let sum = opts.childNode.reduce((sum, item, idx, arr)=>{
      //   console.log({sum, item, idx, arr});
      //   return sum+item.offsetWidth;
      // }, 0);
      // console.log({sum});

      let sum = optsLens.reduce((sum, item)=>{
        return sum+item;
      });

      this.optsWidth = sum + 26;
      return sum;
    },
    handleOnClickChSelect () {
      console.log('选择渠道');
      this.isSelectChShow = !this.isSelectChShow;
    },
    handleOnClickCitySelect () {
      goTo.call(this, 'promotionSelcity');
    },
    handleOnClickDate () {
      this.opts.push({name: '乌鲁木齐'});
    },
    clickTooltipOutside (e) {
      let _class = e.target._prevClass;
      if (_class !== 'tbt-icon tbt-icon-info js-fn' && this.isTooltipShow) {
        this.isTooltipShow = false; 
      }
    }
  }
}
