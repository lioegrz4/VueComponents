import Vue from 'vue'
import { includes } from 'lodash/fp'

const BuiltinComponents = ['transition-group', 'router-link', 'transition']
const colorList = [
  '#00CCFF', '#6699FF', '#99CCFF', '#3399FF', '#CC99FF', '#9966FF', '#CC99FF'
]
const idToColor = id => colorList[parseInt(id, 36) % colorList.length]+'88'

function drawAux(self) {
  let aux = self.$store.getters['config/aux']
  if (aux) {
    let el = self.$el
    let id = self.$options._componentTag || `{ ${self.$el.className} }`
    if (includes(id)(BuiltinComponents)) return

    let color = idToColor(id)

    el.style.border = `2px solid ${color}`

    let tag = document.createElement('div')
    tag.style = 'position:absolute;padding:3px;font-size:5px'
    tag.style.backgroundColor = color
    tag.innerText = id
    el.append(tag)
  }
}

Vue.mixin({
  updated() {
    drawAux(this)
  },
  mounted() {
    drawAux(this)
  }
})
