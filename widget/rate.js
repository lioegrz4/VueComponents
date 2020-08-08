import {modelMerge} from './utils'
export default (h, self) => {
  return h('el-rate', modelMerge(self, {
    props : {
      'show-text': !!self.def.options,
      texts: self.def.options
    }
  }))
}
