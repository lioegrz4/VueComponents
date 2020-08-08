
const defaults = (h, def, idx) => {
  return h('div', [def.type, idx])
}

const template = (h, self) => {
  return h('template', {props: {slot: self.def.slot}}, [self.def.inner])
}

const separator = (h, self) => {
  return h('div', ['-'])
}

import manifest from './manifest.yml'

Object.keys(manifest).forEach(i => {
  if (manifest[i].endsWith('.js')) {
    manifest[i] = require(`./${manifest[i]}`).default
  } else {
    let x = eval(manifest[i])
    manifest[i] = x
  }
})

export const renderWidget = type => {
  if (type in manifest) {
    return manifest[type]
  } else {
    return h => h('div', [`not found ${type}`])
  }
}
