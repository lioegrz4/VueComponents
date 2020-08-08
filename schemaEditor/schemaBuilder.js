import { all, pluck, k } from '@u/lambda'
import { genLogger } from '../../../utils/logger'
import camelcase from 'camelcase'
import fields from './widget/manifest.yml'
import available from './widget/available.yml'
const l = genLogger('@c/schemaBuilder.js')

const includeAndInstanceOf = (n, t) => {
  return {
    pred(x){
      if (t) {
        return (n in x) && (typeof x[n] === t)
      } else {
        return n in x
      }
    },
    msg() {
      if (t) {
        return `必须包含 ${n}，且 ${n} 为 ${t}`
      } else {
        return `必须包含 ${n}`
      }
    },
  }
}
const validators           = {
  required(){
    return {
      pred(x){ return !!x },
      msg(){ return '不能为空' },
    }
  },
  isArray(){
    return {
      pred(x){ return Array.isArray(x) },
      msg(){ return '必须是数组' },
    }
  },
  lenGt(n) {
    return {
      pred(x){ return x.length > n },
      msg(){ return `长度必须大于 ${n}`},
    }
  },

  itemType(t) {
    return {
      pred(x) { return all(x, i => typeof i === t, k(true), k(false)) },
      msg() { return `元素类型必须是 ${t}` },
    }
  },
  itemInclude(n, t){
    return {
      pred(x){ return all(x, includeAndInstanceOf(n, t).pred, k(true), k(false)) },
      msg() { return `元素 ${includeAndInstanceOf(n, t).msg()}` },
    }
  },
}

class FieldBuilder {
  constructor (type, orig, upperType) {
    this.orig      = orig
    this._         = {}
    this._.type    = type
    this.upperType = upperType
  }

  prop (p) {
    this._.prop = p
    if (this.orig.props.indexOf(p) < 0) {
      this.orig.props.push(p)
      return this
    } else {
      throw new Error(`${this.toString()}: ${p} 已存在`)
    }
  }

  label (l) {
    this._.label = l
    return this
  }

  value (v) {
    this._.value = v
    return this
  }

  placeholder (p) {
    this._.placeholder = p
    return this
  }

  valid (...vs) {
    for (let v of vs) {
      if (Array.isArray(v)) {
        this._.valid = v
      } else {
        if (!Array.isArray(this._.valid)) {
          this._.valid = []
        }
        this._.valid.push(v)
      }
    }
    return this
  }

  children (r) {
    if (this._.type !== 'row') {
      throw new Error(`${this.toString()}: 只有 row 有 children 属性`)
    }
    this._.children = buildFormSchema('row', r, this.orig).toObj()
    return this
  }

  attrs (x) {
    this._.attrs = x
    return this
  }

  hint (x) {
    this._.hint = x
    return this
  }

  toObj () {
    return this._
  }

  toString () {
    return JSON.stringify(this._)
  }

  col (c) {
    if (this.upperType !== 'row') {
      throw new Error(`${this.toString()}: 只有 row 中可以使用 col 属性`)
    }
    this._.col = c
    return this
  }

  required (b) {
    if (this._.type !== 'row') {
      throw new Error(`${this.toString()}: 只有 row 有 required 属性`)
    }
    this._.required = b
    return this
  }

  format (x) {
    if (this._.type !== 'formatter') {
      throw new Error(`${this.toString()}: 只有 formatter 有 format 属性`)
    }
    this._.format = x
    return this
  }

  payload(x) {
    if (this._.type !== 'formatter') {
      throw new Error(`${this.toString()}: 只有 formatter 有 payload 属性`)
    }
    this._.payload = x
    return this
  }

  target (t) {
    if (this._.type !== 'imgUpload') {
      throw new Error(`${this.toString()}: 只有 imgUpload 有 target 属性`)
    }
    this._.target = t
    return this
  }

  number(n) {
    if (this._.type !== 'input') {
      throw new Error(`${this.toString()}: 只有 input 有 number 属性`)
    }
    this._.number = true
    return this
  }

  columns(x) {
    if (this._.type !== 'dynamic') {
      throw new Error(`${this.toString()}: 只有 dynamic 有 columns 属性`)
    }
    this._.columns = buildFormSchema('row', x).toObj()
    return this
  }

  options (...o) {
    let typ = this._.type

    switch (typ) {
      case 'radio':
        all([validators.required(),
             validators.isArray(),
             validators.lenGt(0),
             validators.itemType('string'),]
          , x => x.pred(o)
          , k(true)
          , i => {throw new Error(`${typ} ${i.msg()}`)},
        )
        this._.options = o
        break
      case 'checkbox':
        all([validators.required(),
             validators.isArray(),
             validators.lenGt(0),
             validators.itemInclude('label', 'string'),
             validators.itemInclude('name', 'string')]
          , x => x.pred(o)
          , k(true)
          , i => {throw new Error(`${typ} ${i.msg()}`)},
        )
        this._.options = o
        break
      case 'select':
        all([validators.required(),
             validators.isArray(),
             validators.lenGt(0),
              //valids.itemInclude('label', 'string'),
              //valids.itemInclude('value', 'string'),
            ]
          , x => x.pred(o)
          , k(true)
          , i => {throw new Error(`${typ} ${i.msg()}`)},
        )
        this._.options = o
        break
      case 'switch':
        let o1 = o[0]
        if (o1 && typeof o1 !== 'object') {
          throw new Error(`${typ} # options 的可选参数必须是对象`)
        }
        this._.options = o1
        break
      case 'rate':
        all([validators.required(),
             validators.isArray(),
             validators.lenGt(0),
             validators.itemType('string'),]
          , x => x.pred(o)
          , k(true)
          , i => {throw new Error(`${typ} ${i.msg()}`)},
        )
        this._.options = o
        break
      default:
        throw new Error(`${this.toString()}: ${typ} 不允许有 options`)
    }
    return this
  }
}

const exclude = ['constructor', 'toString', 'toObj',]
function validMethods (i, f) {
  return function (...x) {
    if (exclude.indexOf(i) < 0
        && available[this.upperType].indexOf(i) < 0) {
      throw new Error(`不允许的属性: ${this.upperType} 中不能使用 ${i}`)
    }
    return f.apply(this, x)
  }
}
for (let i of Object.getOwnPropertyNames(FieldBuilder.prototype)) {
  FieldBuilder.prototype[i] = validMethods(i, FieldBuilder.prototype[i])
}

class SchemaBuilder {
  constructor (type, orig) {
    this.type  = type
    this._     = []
    this.props = []
    this.orig  = orig
  }

  field (t, type) {
    let f = new FieldBuilder(t, this.orig || this, type)
    this._.push(f)
    return f
  }

  toObj () {
    return this._.map(x => x.toObj())
  }

  // table 的无类型列
  column(p) {
    if (this.type !== 'table') {
      throw new Error(`${this.toString()}: 只有 table 中可以使用 column 属性`)
    }
    let f = new FieldBuilder(null, this.orig || this, this.type)
    this._.push(f)
    if (p) { f.prop(p) }
    return f
  }

}

Object.keys(fields).forEach(i => {
  SchemaBuilder.prototype[camelcase(i)] = function (p) {
    if (!this.type in available) throw new Error(`不允许的类型: ${this.type}`)
    let f = this.field(i, this.type)
    if (p) { f.prop(p) }
    return f
  }
})

export const buildFormSchema = (type, schema, orig) => {
  let s = new SchemaBuilder(type, orig)
  schema(s)
  return s
}

export const formSchema = (...x) => {
  return buildFormSchema('form', ...x).toObj()
}

class TableSchemaBuilder {
  constructor (type, orig) {
    this._     = {}
    this.type  = type
    this.props = []
    this.orig  = orig
  }

  header (x) {
    this._.header = x
    return this
  }

  columns (r) {
    if (this.type !== 'table') {
      throw new Error(`${this.toString()}: 只有 table 有 columns 属性`)
    }
    this._.columns = buildFormSchema('table', r, this.orig).toObj()
    return this
  }

  toObj () {
    return this._
  }

  toString() {
    return JSON.stringify(this._)
  }
}

export const buildTableSchema = (type, schema, orig) => {
  let s = new TableSchemaBuilder(type, orig)
  schema(s)
  return s
}

export const tableSchema = (...x) => {
  return buildTableSchema('table', ...x).toObj()
}
