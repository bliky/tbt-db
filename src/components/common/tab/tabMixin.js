export default {
  props: {
    value: [String, Number, Array, Object],
    tabs: Array,
    hidden: {
      type: Array,
      default () {
        return [0, 0];
      }
    }
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
    },
    currentValue (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    hidden (h) {
      this.isHidden = h
    }
  },
  data () {
    return {
      currentValue: this.value,
      isHidden: this.hidden
    }
  },
  methods: {
    handleOnClick (val) {
      this.currentValue = val;
    }
  }
}
