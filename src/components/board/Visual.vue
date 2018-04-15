<template>
<div id="visual">
    <val-select></val-select>
    <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
    </div>
</div>
</template>
<script>
import ValSelect from './valSelect'
import F2 from "@antv/f2";

// const chart = new F2.Chart({
//       id: 'mountNode',
//       width: 500,
//       height: 500,
//       padding: 'auto'
//     });

export default {
  components: {
    F2,
    ValSelect
  },
  mounted() {
    // 使用 html5 canvas api 创建渐变色对象
    

    const canvas = document.getElementById("mountNode");
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
    gradient.addColorStop(0, "#09C767");
    gradient.addColorStop(0.5, "#09C767");
    gradient.addColorStop(1, "#09C767");

    const data = [
      { statis_dt: "1日", age: 27.2 },
      { statis_dt: "2日", age: 27.5 },
      { statis_dt: "3日", age: 27.8 },
      { statis_dt: "4日", age: 28 },
      { statis_dt: "5日", age: 28.2 },
      { statis_dt: "6日", age: 28.4 },
      { statis_dt: "7日", age: 28.8 },
      { statis_dt: "8日", age: 28.8 },
      { statis_dt: "9日", age: 28.8 },
      { statis_dt: "10日", age: 28.8 },
      { statis_dt: "11日", age: 28.9 },
      { statis_dt: "12日", age: 29 },
      { statis_dt: "13日", age: 29.3 },
      { statis_dt: "14日", age: 29.4 },
      { statis_dt: "15日", age: 29.5 },
      { statis_dt: "16日", age: 29.7 },
      { statis_dt: "17日", age: 30 },
      { statis_dt: "18日", age: 30.12 }
    ];
    const chart = new F2.Chart({
      id: "mountNode",
      width: window.innerWidth,
      height:
        window.innerWidth > window.innerHeight
          ? window.innerHeight - 54
          : window.innerWidth * 0.707,
      pixelRatio: window.devicePixelRatio
    });
    const defs = {
      statis_dt: {
        mask: 'DD日',
        range: [0, 1],
        max: 2020
      },
      age: {
        tickCount: 5
      }
    };
    chart.axis("statis_dt", {
      label(text, index, total) {
        const cfg = {
          textAlign: "center"
        };
        if (index === 0) {
          cfg.textAlign = "start";
        }
        if (index > 0 && index === total - 1) {
          cfg.textAlign = "end";
        }
        return cfg;
      }
    });
    chart.source(data, defs);
    chart.tooltip({
      showCrosshairs: true
    });
    chart.guide().tag({
      position: [2017, 30.12],
      content: "30.12",
      direct: "tl",
      offsetY: -5,
      background: {
        fill: "#09C767"
      },
      pointStyle: {
        fill: "#09C767"
      }
    });
    chart
      .line()
      .position("statis_dt*age")
      .shape("smooth")
      .color(gradient);
    chart
      .area()
      .position("statis_dt*age")
      .shape("smooth")
      .color(gradient);
    chart.render();
  }
};
</script>
<style scoped>

</style>
