import {modelMerge} from './utils'
export default (h, self) => {
  if (self.def.number) {
    return h('el-input', {
      props: {
        value: parseFloat(self.value[self.def.prop])
      },
      on: {
        input(v) {
          self.$emit('input', {
            prop: self.def.prop, value: parseFloat(v)
          })
        }
      }
    })
  } else {
    return h('el-input',
      modelMerge(self)
    )
  }

}
