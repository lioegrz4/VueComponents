import {modelMerge} from './utils'
import xTags            from '../tags.vue'
export default (h, self) => {
  return h(xTags, modelMerge(self))
}
