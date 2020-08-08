import {modelMerge} from './utils'
export default (h, self) => {
  return h('el-input', modelMerge(self, {props: {type: 'textarea'}}))
}
