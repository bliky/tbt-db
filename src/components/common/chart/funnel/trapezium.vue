<template>
<div style="height: 240px;" :style="{width: width + 'px'}">
  <svg viewBox="0 0 750 600">
<!--     <path :d="trackPath" stroke="#e5e9f2" :stroke-width="relativeStrokeWidth" fill="none"></path>
    <path :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path>
 -->
    <polygon v-for="shape in shapes" :points="shape.points"
      :fill="shape.fill"
      stroke="none"
      stroke-width="0"/>
  </svg>
</div>
</template>

<script>
  export default {
    name: 'trapezium',
    props: {
      data: {
        type: Array,
        default: function () {
          return [100, 73, 54, 32, 24, 3];
        }
        //required: true
      },
      width: {
        type: Number,
        default: 300,
        //required: true,
        validator: val => val >= 0
      },
      fill: {
        type: Array,
        default: function () {
          return ['#D1FFF2', '#9CFFE4', '#5DFACF', '#3AF0BE', '#1DD9A5', '#00C690'];
        }
      }
    },
    data () {
      return {

      }
    },
    watch: {

    },
    computed: {
      shapes () {
        let max = 750;
        let min = 5;
        let height = 100;
        let data = this.data;
        let len = data.length;
        let shapes = [];
        let bot = max;
        let top;
        let y = 0;

        let fill = this.fill;
        let fillLen = fill.length;

        let x;
        let dx;
        let i = 0;

        let percent;
        let percent2;
        for (; i<len-1; i++) {
          percent = parseFloat(data[i])/100;
          percent2 = parseFloat(data[i+1])/100;
          top = bot * percent;
          bot = top * percent2;
          top = top < min ? min : top;
          bot = bot < min ? min : bot;
          x = (max - top)/2;
          dx = (top - bot)/2;
          shapes.push({
            points: `${x},${y} ${x+top},${y} ${x+top-dx},${y+height} ${x+dx},${y+height}`,
            fill: fill[i%fillLen]
          });
          y += height;
          if (i<len-2) bot = top;
        }
        x = (max - bot)/2;
        shapes.push({
          points: `${x},${y} ${x+bot},${y} ${x+bot},${y+height} ${x},${y+height}`,
          fill: fill[i%fillLen]
        });
        return shapes;
      }
    }
  };
</script>
