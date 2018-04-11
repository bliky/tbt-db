'use strict'
/***
 * mixin for input only
 */

export default {
  methods: {
    // focus input in the end
    // compact for <x-input /> event handler
    focusInEnd(value, e) {
      let target = e.target
      target.selectionStart = target.selectionEnd = target.length
    },
  },
}
