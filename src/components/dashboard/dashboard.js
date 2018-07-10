import { fetchDashboard } from '../../services/api';
import appHeader from '../common/Header';
import { Tab,TabItem } from 'vux'
import statistical from './subcoms/statistical'
import trace from './subcoms/trace'

export default {
  data () {
    return {
      index: 0
    }
  },
  components: {
    appHeader,
    Tab,
    TabItem,
    statistical,
    trace
  },
  mounted () {
    fetchDashboard({}).then(res => {
      console.log('获取业绩总况', res);
    })
  },
  methods: {
    
  }
}
