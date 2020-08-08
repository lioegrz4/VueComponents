let fs   = require('fs')
let path = require('path')

let walkDirSync = (dir, handler, res = {}) => {
  for (let f of fs.readdirSync(path.resolve(dir))) {
    let pt = path.join(dir, f)
    if (fs.statSync(pt).isDirectory()) {
      res[f] = {}
      walkDirSync(pt, handler, res[f])
    } else {
      let {key, value} = handler(f, pt) || {}
      res[key]         = value
    }
  }
  return res
}

module.exports = {
  walkDirSync,
}
