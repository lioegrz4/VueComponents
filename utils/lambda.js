const log    = (...args) => console.log('<-----', ...args)
const flip   = fun => (a, b, ...rest) => fun(b, a, ...rest)
const id     = x => x
const nth    = n => (...args) => args[n]
const k      = x => y => x
const not    = pred => (...x) => !pred(...x)
const forFun = method => (o, ...a) => o[method](...a)
const toList = (...args) => args

const curryN = (fn, consume, produce = []) => {
  return (...args) => {
    if (consume <= args.length) {
      return fn.apply(fn, [...produce, ...args])
    } else {
      return curryN(fn, consume - args.length, [...produce, ...args])
    }
  }
}
const curry  = fn => curryN(fn, fn.length)

const wrap   = wrapper => fn => async (...args) => {
  return await wrapper(fn, ...args)
}

const seq    = (fst, ...rest) => (...args) => rest.reduce((acc, x) => x(acc, ...args),
                                                          fst(...args))

const Flow = (...f) => {
  let self = function () { throw 'oops' }
  let handler = {
      apply(target, ctx, args) {
          let [fst, ...rest] = self._seq
          return rest.reduce((acc, x) => x(acc), fst(...args))
      }
  }
  self._seq = f
  self.then = f => {
      self._seq.push(f)
      return new Proxy(self, handler)
  }
  return new Proxy(self, handler)
}

const all    = (list, pred, succ, fail) => {
  for (let i of list) {
    if (!pred(i)) {
      return fail(i)
    }
  }
  return succ(list)
}
const any    = (list, pred, succ, fail) => all(list, not(pred), fail, succ)
const pluck  = field => x => x[field]
const getIn  = (obj, path, alt) => path.reduce((cur, idx) => cur && cur[idx], obj) || alt
const setIn  = (obj, path, value) => {
  let tg = obj, end = path.length - 1
  for (let idx in path) {
    if (! path.hasOwnProperty(idx)) continue
    if (idx != end) {
      // 非终结路径
      let cur = tg[path[idx]]
      if (typeof cur === 'undefined'
          // 强行覆写
          || typeof cur !== 'object') {
        tg[path[idx]] = {}
      }
      tg = tg[path[idx]]
    } else {
      // 终结路径
      tg[path[idx]] = value
    }
  }
  return obj // fluent api
}
const setInV = seq(setIn, nth(3))

const getterToPath = {
  apply (target, ctx, args) {
    let path    = target.path
    let obj     = getIn(target.payload, path)
    target.path = []
    return target.over({obj, args, path, orig: target.payload})
  },
  get (target, prop) {
    target.path = [...target.path || [], prop]
    return new Proxy(target, getterToPath)
  },
}
const mkLens       = over => obj => {
  let r     = new Function()
  r.payload = obj
  r.path    = []
  r.over    = over
  return new Proxy(r, getterToPath)
}
const wrapTip      = tip => {
  return mkLens(({obj}) => {
    if (obj) {
      return obj
    } else {
      throw Error(tip)
    }
  })
}
const muteGet      = mkLens(({obj}) => obj)

module.exports = { wrapTip
                 , flip
                 , id
                 , nth
                 , k
                 , forFun
                 , toList
                 , seq
                 , curryN
                 , curry
                 , all
                 , any
                 , pluck
                 , getIn
                 , setIn
                 , setInV
                 , mkLens
                 , log
                 , muteGet
                 }
