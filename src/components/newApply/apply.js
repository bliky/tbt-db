import storage from '../../common/storage'
import localDb from '../../common/db'
import { buildQuery } from '../../common/stringify'
import mLoading from '../common/mixins/loading'
import { fetchIndClass, fetchInd, fetchDimAndAttr, submitApply, insertApply } from '../../services/api';
import { XDialog, Group, XTextarea, TransferDomDirective as TransferDom } from 'vux';

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
      intClassList: [{
        classCode: '',
        classId: '',
        className: ''
      }],
      applyFormData: {
        reason: '',       // 申请原因
        applyContent: ''  // 申请内容
      },
      applyContentList: [
        {
          classId: 1,
          className: '流量指标',
          attrNameList: '北京外呼可售转化率，北京外呼可售转化率北京外呼可售转化率，北京外呼可售转化率，深圳登记，南京SEM，北京登记'
        },
        {
          classId: 3,
          className: '流量指标',
          attrNameList: 'adf asdf'
        }
      ],
      applyDialogShow: false,
      dialogMaxWidth: winW - 30,
      dialogMaxHeight: winH - 30
    }
  },
  computed: {
    applyActive () {
      return true;
    },
    applyValid () {
      let reason = this.applyFormData.reason;
      reason = reason.replace(/(^\s+|\s+$)/, '');
      this.$set(this.applyFormData, 'reason', reason);

      return reason;
    }
  },
  methods: {
    getIndContentByClassId (classId) {
      let indContent = this.applyContentList.find(item => item.classId == classId);

      return indContent && indContent.attrNameList;
    },
    check (data) {
      return data.result && data.result.rows && data.result.rows.length;
    },
    localCache (param, data) {
      let qs = buildQuery(param);
      if (!data) {
        return storage.get(qs);
      }

      return storage.set(qs, data);
    },
    fetchData () {
      let skey = {app: 'indApply', type: 'indClass'};

      let localCacheData = this.localCache(skey);
      if (localCacheData) {
        this.intClassList = localCacheData;
        return;
      }

      this.openLoading();

      fetchIndClass().then(data => {
        if (!this.check(data)) { return console.error('指标分类数据为空或无效'); }

        this.intClassList = data.result.rows;
        this.localCache(skey, data.result.rows);
        this.$nextTick(() => {
          setTimeout(this.closeLoading(), 800);
        });
      })
    },
    handleOnClickIndClass (classId, classCode) {
      console.log(classId, classCode);
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
      this.applyDialogShow = false;
    }
  },
  mounted () {
    this.fetchData();
    // fetchInd({
    //   indClassId: '',
    // }).then(data => {
    //   console.log('fetchInd', data);
    // })

    // fetchDimAndAttr({
    //   indId: ''
    // }).then(data => {
    //   console.log('fetchDimAndAttr', data);
    // })

    // submitApply({
    //   reason: '',       // 申请原因
    //   applyContent: ''  // 申请内容
    // }).then(data => {
    //   console.log('submitApply', data);
    // })

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
