const builtinRule = require('./mockRule')
const _ = require('lodash')
const g = require('graphql')

const typs = {
    list  : g.GraphQLList,
    obj   : g.GraphQLObjectType,
    non   : g.GraphQLNonNull,
    enum  : g.GraphQLEnumType,
    scalar: g.GraphQLScalarType
}
function typ(x) {
    for (let i in typs) {
        if (x instanceof typs[i]) return i
    }
    return undefined
}

function lenFactor(n) {
    return _.random(n, n * n)
}
/*  obj  取 _fields
    list  生成列表
    scalar 取 name
    ignore 其它类型忽略：non enum
    */
const MAX_DEPTH = 9
const opt = {
    scalar: (x, lf, rules, depth) => {
        if (depth > MAX_DEPTH) return null
        let op = rules[x.name] || builtinRule[x.name] || _.identity
        return op()
    },
    list  : (x, lf, rules, depth) => {
        if (depth > MAX_DEPTH) return []
        let res = []
        for (let i = 0; i < lenFactor(lf.get()); i++) {
            res.push(mockData(x.ofType, lf, rules, depth))
        }
        return res
    },
    obj   : (x, lf, rules, depth) => {
        if (depth > MAX_DEPTH) return {}
        let fs = x._fields, res = {}
        Object.keys(fs).forEach(k => {
            res[k] = mockData(fs[k]['type'], lf, rules, depth)
        })
        return res
    },
    ignore: (x, lf, rules, depth) => mockData(x.ofType, lf, rules, depth)
}
function mockData(x, lf = mock(10), rules, depth=0) {
    if (!typeof x === 'object') return
    let o = opt[typ(x)] || opt['ignore']
    return o(x, lf, rules, depth + 1)
}

class MockDataCapacityType {
    constructor(n) {
        this._v = n
    }
    get() {
        return this._v
    }
}
function mock(n=10) {
    return new MockDataCapacityType(n)
}


const mkIdentityScalarResolver = (...name) => {
    return name.map(x => ({
      [x]: new g.GraphQLScalarType({
        name: x,
        serialize: _.identity,
        parseValue: _.identity,
        parseLiteral: _.identity
      })
    })).reduce((acc, x) => _.merge(acc, x))
  }

const mkScalarResolver = (...config) => {
    return config.map(cf => ({
        [cf.name]: new g.GraphQLScalarType(_.merge({
            serialize: _.identity,
            parseValue: _.identity,
            parseLiteral: _.identity
        }, cf))
      })).reduce((acc, x) => _.merge(acc, x))
}

const regToVal = str => x => new RegExp(str).test(x) ? x : undefined

module.exports = { mockData
                 , mock
                 , MockDataCapacityType
                 , mkIdentityScalarResolver
                 , mkScalarResolver
                 , regToVal
                 , typ
                 }