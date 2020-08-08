import {modelMerge} from './utils'
const l = $ll('switch')
export default (h, self) => {
  return h('el-switch',
    modelMerge(self, {props: self.def.options})
  )
}
