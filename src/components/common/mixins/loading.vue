<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'updateLoadingStatus'
    ]),
    openLoading (loadingText) {
      var loadingText = loadingText || '';
      this.updateLoadingStatus({isLoading: true, loadingText})
    },
    closeLoading () {
      this.updateLoadingStatus({isLoading: false})
    }
  }
}
</script>
