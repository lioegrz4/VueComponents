import {modelMerge} from './utils'
import {getIn} from '@u/lambda'
const l = $ll('@c/widget/row.js')
export default (h, self) => {
  return self.def.children.map((x, idx) => {
    return h('el-col', {
        props: x.col
      },
      [h('xFormItem', {
        props: {
          bare: true,
          def: x,
          key: idx,
          idx: idx,
          value: self.value,
          info: self.info,
        },
        on: {
          input(v) {
            self.$emit('input', v)
          }
        }
      })]
    )
  })
}
