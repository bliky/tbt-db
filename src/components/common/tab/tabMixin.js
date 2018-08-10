export default {
  props: {
    value: [String, Number, Array, Object],
    tabs: Array
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  methods: {
    handleOnClick (val) {
      this.currentValue = val;
    }
  }
}
