<template>
  <div style="width: 100%; height: 100px;">
    <div id="chartFunnelDiv" ref="chartFunnel" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<script>
import 'amcharts3';
import 'amcharts3/amcharts/funnel.js';

export default {
  components: {

  },
  data () {
    return {

    }
  },
  mounted () {
    this.createFunnel();
  },
  updated () {
  },
  methods: {
    createFunnel () {
      var AmCharts = window.AmCharts;
      var chart = AmCharts.makeChart( "chartFunnelDiv", {
        "type": "funnel",
        "theme": "light",
        "dataProvider": [ {
          "title": "发起",
          "value": 100
        }, {
          "title": "新增",
          "value": 82
        }, {
          "title": "可售",
          "value": 54
        }, {
          "title": "分派",
          "value": 32
        }, {
          "title": "扣款",
          "value": 24
        }, {
          "title": "签约",
          "value": 25
        } ],
        "titleField": "title",
        "valueField": "value",
        "marginRight": 160,
        "marginLeft": 15,
        "labelPosition": "right",
        "funnelAlpha": 0.9,
        "startX": 0,
        "neckWidth": "20",
        "startAlpha": 0,
        "outlineThickness": 1,
        "neckHeight": "0",
        "valueRepresents": "height",
        "balloonText": "[[title]]:<b>[[value]]</b>",
        "export": {
          "enabled": true
        }
      } );

      setTimeout(()=>{
        console.log('漏斗图', this.$refs.chartFunnel.querySelector('a'));
        this.$refs.chartFunnel.querySelector('a').style.display = 'none';
      }, 50)
    }
  }
};
</script>
