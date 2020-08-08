import {modelMerge} from './utils'
export default (h, self) => {
  return h('el-select',
    modelMerge(self, {
      props: {
        placeholder: self.def.placeholder,
      }
    }),
    self.def.options.map(({label, value}) => {
      return h('el-option', {
        props: {
          label, value
        }
      })
    })
  )
}
