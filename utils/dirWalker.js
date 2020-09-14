const fs = require('fs')
const path = require('path')

const walkDirSync = (dir, handler, res = {}) => {
  for (let f of fs.readdirSync(path.resolve(dir))) {
    let pt = path.join(dir, f)
    if (fs.statSync(pt).isDirectory()) {
      res[f] = {}
      walkDirSync(pt, handler, res[f])
    } else {
      let hres = handler(f, pt)
      if (hres instanceof Array) {
        res[hres[0]] = hres[1]
      } else {
        res[f] = hres
      }
    }
  }
  return res
}

module.exports = {
  walkDirSync,
}
