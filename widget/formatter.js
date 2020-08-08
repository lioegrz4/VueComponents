const l = $ll('@c/widget/formatter.js')
import formatter from '../formatter'
export default (h, self) => {
  let prop = self.def.prop
  return h(formatter, {
    props: {
      format: self.def.format,
      value: self.info[prop],
    }
  })
}
