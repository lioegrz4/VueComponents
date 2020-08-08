import { modelMerge } from './utils'
const l = $ll('@c/widget/dynamic.js')
export default (h, self) => {
  self.newStyle({
                  '.x-form-item-dyn > *': {
                    display       : 'flex',
                    justifyContent: 'space-between',
                  },
                })
  return self.def.value.map((x, ix) => {
    return h('el-form-item', {
               props  : x.col,
               'class': ['x-form-item-dyn'],
             },
             [...self.def.columns.map((y, iy) => {
               return h('el-col', {
                 props: y.col,
               }, [h('xFormItem', {
                 props: {
                   bare  : true,
                   def   : y,
                   key   : iy,
                   idx   : iy,
                   value : self.value[self.def.prop][ix],
                   inline: true,
                 },
                 on   : {
                   input(v) {
                     self.value[self.def.prop][ix][v.prop] = v.value
                     self.$emit('input', self.value)
                   },
                 },
               })])
             }),
              h('el-button', {props: {type: 'text'}}, ['+']),
             ])
  })
}
