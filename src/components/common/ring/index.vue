<template>
  <div class="tbt-ring">
    <svg viewBox="0 0 360 360">
      <circle fill="none" style="opacity: .4" stroke="#0CC894" stroke-width="2" cx="180" cy="180" r="106">
        <animate attributeType="XML" attributeName="r" from="106" to="140"
        dur="10s" repeatCount="indefinite"/>
        <animate attributeType="CSS" attributeName="opacity" from=".4" to=".3"
        dur="10s" repeatCount="indefinite"/>
      </circle>
      <circle fill="none" style="opacity: .3" stroke="#0CC894" stroke-width="2" cx="180" cy="180" r="123">
        <animate attributeType="XML" attributeName="r" from="123" to="157"
        dur="10s" repeatCount="indefinite"/>
        <animate attributeType="CSS" attributeName="opacity" from=".3" to=".2"
        dur="10s" repeatCount="indefinite"/>
      </circle>
      <circle fill="none" style="opacity: .2" stroke="#0CC894" stroke-width="2" cx="180" cy="180" r="140">
        <animate attributeType="XML" attributeName="r" from="140" to="174"
        dur="10s" repeatCount="indefinite"/>
        <animate attributeType="CSS" attributeName="opacity" from=".2" to=".1"
        dur="10s" repeatCount="indefinite"/>
      </circle>
      
      <!-- <circle fill="none" style="opacity: .4" stroke="#0CC894" stroke-width="2" cx="180" cy="180" r="120">
        <animate attributeType="XML" attributeName="r" from="120" to="154"
        dur="10s" repeatCount="indefinite"/>
        <animate attributeType="CSS" attributeName="opacity" from=".4" to=".3"
        dur="10s" repeatCount="indefinite"/>
      </circle>
      <circle fill="none" style="opacity: .3" stroke="#0CC894" stroke-width="2" cx="180" cy="180" r="137">
        <animate attributeType="XML" attributeName="r" from="137" to="171"
        dur="10s" repeatCount="indefinite"/>
        <animate attributeType="CSS" attributeName="opacity" from=".3" to=".2"
        dur="10s" repeatCount="indefinite"/>
      </circle>
      <circle fill="none" style="opacity: .2" stroke="#0CC894" stroke-width="2" cx="180" cy="180" r="154">
        <animate attributeType="XML" attributeName="r" from="154" to="188"
        dur="10s" repeatCount="indefinite"/>
        <animate attributeType="CSS" attributeName="opacity" from=".2" to=".1"
        dur="10s" repeatCount="indefinite"/>
      </circle> -->
      <image xlink:href="../../../assets/image/ring_bg.png" x="60" y="60" width="240" height="240"></image>
      <image xlink:href="../../../assets/image/ring.png" x="60" y="60" width="240" height="240">
        <animateTransform attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="360 180 180"
          to="0 180 180"
          dur="10s"
          repeatCount="indefinite"/>
      </image>
    </svg>
  </div>
</template>

<style lang="less">
.tbt-ring {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
