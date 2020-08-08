const path    = require('path')
const fs      = require('fs')
const jsYaml  = require('js-yaml')
const loadYml = p => {
  let pt = path.resolve(p)
  console.log(`load yaml from ${pt}`)
  return jsYaml.safeLoad(fs.readFileSync(pt, 'utf-8'))
}
const saveYml = (p, obj) => fs.writeFileSync(path.resolve(p), jsYaml.safeDump(obj))

const lazy = (path, ext='yml', loader=loadYml, saver=saveYml) => {
  let re = new RegExp(`.*\.${ext}$`)
  let files = fs.readdirSync(path)
    .filter(x=> re.test(x))
    .map(x => path.parse(x).name)
  let collection = {}
  let getRealPath = (ident) => path.resolve(path, `${ident}.${ext}`)
  return {
    load(ident){
      if (files.indexOf(ident)>0 && ! collection[ident]){
        collection[ident] = loader(getRealPath(ident))
      }
      return collection[ident]
    },
    refresh(){
      collection = {}
    },
    dump(ident, obj) {
      saveYml(getRealPath(ident), obj)
    }
  }
}

module.exports = {
  loadYml, saveYml
}
