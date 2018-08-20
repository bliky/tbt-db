<template>
  <div style="background-color: #f6f6f6;">
    <!-- 指标分类主面板 -->
    <div class="tbt-apply-main-pannel" :class="{active: applyActive}">
      <div class="tbt-apply-main-pannel_tilte">
        指标申请
        <div class="tbt-apply-main-pannel_reset">清空重置</div>
      </div>
      <div class="tbt-apply-cells" style="margin: 20px 0 56px;">
        <div class="tbt-apply-cell" :class="{ active: getIndContentByClassId(item.classId) }" v-for="(item, idx) in intClassList" @click="handleOnClickIndClass(item.classId, item.classCode)">
          <div class="tbt-apply-cell_head">{{ item.className }}
            <div class="tbt-apply-cell_head-rt">
              <span class="tbt-apply-cell_arrow-left"></span>
              <div class="tbt-apply-cell_checked"><i class="tbt-icon tbt-icon-checked"></i></div>
            </div>
          </div>
          <div class="tbt-apply-cell_content">{{ getIndContentByClassId(item.classId) }}</div>
        </div>
      </div>
      <div class="tbt-apply-main-pannel_submit">
        <div class="tbt-apply-main-pannel_submit-btn" @click="handleOnClickSubmit">提交申请</div>
      </div>
    </div>

    <!-- 指标确认弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="applyDialogShow" :hide-on-blur="true" :dialog-style="{overflowY: 'auto', maxWidth: dialogMaxWidth + 'px',  maxHeight: dialogMaxHeight + 'px', width: dialogMaxWidth + 'px', borderRadius: 0}">
        <div class="tbt-apply-dialog" :style="{maxHeight: parseInt(dialogMaxHeight)-32 + 'px'}">
          <div class="tbt-apply-dialog_title">指标确认</div>
          <p class="tbt-apply-dialog_desc">您共选择34项指标，请确认及填写原因后提交</p>
          <div class="tbt-apply-dialog_textarea">
            <x-textarea title="" v-model="applyFormData.reason" placeholder="请输入申请原因（30字内）" :show-counter="false" :max="30" :rows="2"></x-textarea>
          </div>
          <div class="tbt-apply-dialog_content" :style="{maxHeight: parseInt(dialogMaxHeight)-32-214 + 'px'}">
            <ul>
              <li v-for="item in applyContentList">
                <h3>{{ item.className }}</h3>
                <p>{{ item.attrNameList }}</p>
              </li>
            </ul>
          </div>
          <div class="tbt-apply-main-pannel_submit-btn" :class="{active: applyValid}" @click="handleOnClickConfirm">确认提交</div>
          <div class="tbt-apply-dialog_close" @click="handleOnClickClose"><i class="tbt-icon tbt-icon-close"></i></div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import apply from './apply.js'
import '../common/icon'

export default apply;
</script>

<style lang="less">
@import "./apply.less";
</style>
