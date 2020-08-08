import {modelMerge} from './utils'
export default (h, self) => {
  return h('el-radio-group',
    modelMerge(self),
    self.def.options.map(x => {
      return h('el-radio', {props: {label: x}})
    })
  )
}
