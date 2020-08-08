const l = $ll('@c/schemaEditor/types/string.js')
export default (h, self) => {
  return h('input', {
    domProps: {
      type: 'checkbox',
      value: self.value,
    },
    props: {

    },
    on: {
      click (v) {
        v.preventDefault()
        self.$emit('change', {path: self.path, value: !self.value})
      }
    }
  })
}
