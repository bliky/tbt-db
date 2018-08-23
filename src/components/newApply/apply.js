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
        console.log('submitApply', data);
        this.applyDialogShow = false;
      });
    }
  },
  mounted () {
    this.getIndClassList();

    // insertApply({
    //   oapplyStatus: 200,
    //   applyId: '',
    //   reason: '',      // 提交OA返回状态
    //   applyContent: '' // 申请内容
    // }).then(data => {
    //   console.log('insertApply', data);
    // })
  }
}
