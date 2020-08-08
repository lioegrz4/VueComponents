import {modelMerge} from './utils'
export default (h, self) => {
  return h('el-date-picker', modelMerge(self, {props: self.def.attrs}))
}

