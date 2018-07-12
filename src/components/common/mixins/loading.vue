<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'updateLoadingStatus'
    ]),
    openLoading () {
      this.updateLoadingStatus({isLoading: true})
    },
    closeLoading () {
      this.updateLoadingStatus({isLoading: false})
    }
  }
}
</script>
