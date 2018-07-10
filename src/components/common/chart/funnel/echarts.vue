<template>
  <div style="width: 100%; height: 340px;">
    <e-charts :options="funnel"></e-charts>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/chart/funnel';

export default {
  components: {
    ECharts
  },
  data () {
    return {
      funnel: {
        title: {
          text: '漏斗图',
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['发起', '新增', '可售', '分派', '扣款', '签约']
        },
        calculable: false,
        series: [
        {
          name: '实际',
          type: 'funnel',
          left: '0%',
          width: '60%',
          maxSize: '80%',
          label: {
            normal: {
              position: 'inside',
              formatter: '{b}{c}%',
              textStyle: {
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.5,
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          data: [
            {value: 100, name: '发起'},
            {value: 82, name: '新增'},
            {value: 54, name: '可售'},
            {value: 32, name: '分派'},
            {value: 24, name: '扣款'},
            {value: 25, name: '签约'}
          ]
        } ]
      }
    };
  },
  mounted () {
    this.createFunnel();
  },
  updated () {
  },
  methods: {
    createFunnel () {
    }
  }
};
</script>
