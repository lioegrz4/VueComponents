import { merge } from 'lodash'
const l = $ll('@c/widget/__utils.js')
export const modelMerge = (self, target) => {
  let prop = self.def.prop
  return merge({
    props: {
      /*
        涉及跨组件(如row)传递，一个 row 里可能有多个组件，但 row 本身只能绑定一次
        所以将 model 和 info 整个传过来自取
      */
      value: self.value[prop],
      placeholder: self.def.placeholder,
      /*
      info 为 formatter 所需
        value 是必需的，而其它参数(info)却不是
        所以应先进行空值检测
      */
      info: self.info && self.info[prop],
    },
    on: {
      input(v){
        // 深层子组件，如嵌套在 row 中的组件，需以 prop 传递标识
        self.$emit('input', {prop, value: v})
      }
    },
  }, target)
}
