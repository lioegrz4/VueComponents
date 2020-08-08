const setInFunc  = (obj, path, value) => {
  let tg = obj, end = path.length - 1
  for (let idx in path) {
    if (idx != end) {
      // 非终结路径
      let cur = tg[path[idx]]
      if ( typeof cur === 'undefined'
           // 强行覆写
           || typeof cur !== 'function') {
        tg[path[idx]] = value || new Function()
      }
      tg = tg[path[idx]]
    } else {
      // 终结路径
      tg[path[idx]] = value
    }
  }
  return obj // fluent api
}

const {objWalker} = require('./tree')
const fakeLens    = over => obj => {
  let r = new Function()
  // TODO: objWalker 只能遍历子节点
  // 实现新的 objWalker
  objWalker(obj, (k, v, p) => {
    let path = p.concat([k])
    setInFunc(r, path, (...x) => over({obj: v, args: x, path:path, orig: obj}))
    return v
  })
  return r
}

module.exports = {
  fakeLens
}
