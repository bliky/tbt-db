import { confirm } from '../../common/notify'
import { goToId } from '../../utils/utils'
import mLoading from '../common/mixins/loading'
import { XDialog, Group, XTextarea, TransferDomDirective as TransferDom } from 'vux'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import localDb from '../../common/db'

const winW = window.innerWidth;
const winH = window.innerHeight;

export default {
  mixins: [mLoading],
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    Group,
    XTextarea
  },
  data () {
    return {
      applyDialogShow: false,
      dialogMaxWidth: winW - 30,
      dialogMaxHeight: winH - 30
    }
  },
  computed: {
    ...mapState('apply', ['indClassList', 'applyFormData', 'applyContentList']),
    ...mapGetters('apply', [
      'getIndContentByClassId',
      'applyActive',
      'applyValid'
    ])
  },
  methods: {
    ...mapMutations('apply', {
      resetApply: 'RESET_APPLY'
    }),
    ...mapActions('apply', ['getIndClassList', 'submitApply']),
    handleOnClickReset () {
      confirm.call(this, '清空重置', '确定要清空所有指标吗?')
      .then(() => {
        this.resetApply();
      });
    },
    handleOnClickIndClass ({classId, className}) {
      localDb.set('indClass', {classId, className});
      goToId.call(this, 'applySelInd', classId);
    },
    handleOnClickSubmit () {
      if (!this.applyActive) return false;
      this.applyDialogShow = true;
    },
    handleOnClickClose () {
      this.applyDialogShow = false;
    },
    handleOnClickConfirm () {
      if (!this.applyValid) return false;

      this.submitApply().then(data => {
        this.$vux.toast.show({
          type: 'success',
          text: '申请成功',
          width: '80%',
          time: 2000
        });

        this.applyDialogShow = false;
      }).catch(err => {
        this.$vux.toast.show({
          type: 'warn',
          text: '提交OA申请失败' + '[' + (err.status || '') + ']' + (err.message || ''),
          width: '80%',
          time: 3000
        });
      });
    }
  },
  mounted () {
    this.getIndClassList();
  }
}
