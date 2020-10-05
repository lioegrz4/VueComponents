export default (h, self) => {
  let enu = self.schema.enum
  let ops = {
    domProps: {
      value: self.value,
    },
    on      : {
      input (v) {
        self.$emit('change', {path: self.path, value: v.target.value})
      },
    },
  }
  if (enu) {
    return h('select',
             ops,
             [
               enu.map(x => h('option', [x])),
             ])
  } else {
    return h('input', ops)
  }
}

