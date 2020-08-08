import {modelMerge} from './utils'

export default (h, self) => {
  return h('el-checkbox-group',
    modelMerge(self),
    self.def.options.map(x => {
      return h('el-checkbox', {props: x})
    })
  )
}
