import {modelMerge} from './utils'

export default (h, self) => {
  if (self.def.inner.length > 2) throw Error('最多容纳两个组件')
  let inner = self.def.inner.map((x, idx) => {
    if (x.type === 'select') {
      return h('xFormItem', {
        props: {
          bare: true,
          def: x,
          key: idx,
          idx,
          value: self.payload.select,
          slot: x.slot,
        },
        on: {
          input(v) {
            self.payload.select = v
            self.$emit('input', self.payload)
          }
        }
      })
    } else {
      return h('xFormItem', {
        props: {
          bare: true,
          def: x,
          key: idx,
          idx,
        }
      })
    }
  })
  return h('el-input', {
      props: {
        value: self.payload.input
      },
      on: {
        input(v) {
          self.payload.input = v
          self.$emit('input', self.payload)
        }
      }
    },
    inner
  )
}
