let types = {
  type     : {}
  , self   : {}
  , symbol : {}
  , enum   : {}
  , object : {}
//  , array  : {}
  , null   : {}
  , string : {}
  , number : {}
  , boolean: {}
}

Object.keys(types).forEach(x => {
  types[x].editor = require(`./${x}.js`).default
})

export default types
