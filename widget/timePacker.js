import {modelMerge} from './utils'
export default (h, self) => {
  return h('el-time-picker', modelMerge(self, {props: self.def.attrs}))
}
