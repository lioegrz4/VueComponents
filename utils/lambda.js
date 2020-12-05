const log    = (...args) => console.log('<-----', ...args)
const flip   = fun => (a, b, ...rest) => fun(b, a, ...rest)
const id     = x => x
const ids    = (...args) => args
const apply  = fn => x => fn(...x)
const unapply= fn => (...x) => fn(x)
const nth    = n => (...args) => args[n]
const k      = x => y => x
const not    = pred => (...x) => !pred(...x)
const forFun = method => (o, ...a) => o[method](...a)
const map    = fn => l => l.map(fn)
const ctx    = x => i => [i, x]
const tap    = fn => x => { fn(x); return x }
const get    = (...path) => obj => path.reduce((cur, idx) => cur && cur[idx], obj)
const pipe   = (fst, ...rest) => (...args) =>
                    rest.reduce((acc, x) => x(acc, ...args), fst(...args))

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
  return await wrapper(fn)(...args)
}

const wraps  = (...wrapper) => fn => {
  return wrapper.reduce((acc, w) => wrap(w)(acc), fn)
}

/*
let W = x => next => async (...args) => {
  console.log(`<${x}|`)
  let r = await next(...args)
  console.log(`|${x}>`)
  return r
}
console.log('ret: ', wraps(W(3), W(2), W(1))((...x)=>x)(1,2,3,4))
*/

const rangeArgsT = fn => (...args) => args.length === 1
                                ? fn(0, args[0], 1)
                                : fn(...args)

const range = rangeArgsT((begin, end, step=1) => {
  let rv = []
  for ( let i = begin; i <= end; i += step) {
    rv.push(i)
  }
  return rv
})

const random = rangeArgsT((begin, end, step=1) => {
  return Math.floor(Math.random() * (end - begin + 1) + begin)
})

// console.log(apply(pipe)(map(ctx)(range(1,3)))(0)) // [ [ [ 0, 1 ], 2 ], 3 ]


const wrapCtx = wrapper => (fn, ctx) => async (...args) => {
  return await wrapper(fn, ctx)(...args)
}

const wrapx = (...wrapper) => fn => ctx =>  {
  return wrapper.reduce((acc, w) => wrapCtx(w)(acc, ctx), fn)
}
// for koa
// const wrapk = (...w) => apply(wrapx)(map(flip)(w))
// const wrapk = (...w) => pipe(map(flip), apply(wrapx))(w)
// const wrapk = unapply(pipe(map(flip), apply(wrapx)))

const compose = (...fns) => (...args) => pipe(...fns.reverse())(...args)
const wrapk = unapply(compose(apply(wrapx), map(flip)))

/*
let W = x => (ctx, next) => async (...args) => {
  ctx.v +=1
  let ctxj = JSON.stringify(ctx)
  console.log(`<${x}| ${ctxj}`)
  let r = await next(...args)
  console.log(`|${x}> ${ctxj}`)
  return r
}
console.log('ret: ', wrapk(W(3), W(2), W(1))(id)({v: 0})(...range(1,4)))
*/

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
const setInV = pipe(setIn, nth(3))

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
// mkLens( ({ obj, args, path, orig }) => { })(obj)

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

module.exports = { log
                 , flip
                 , id
                 , ids
                 , nth
                 , k
                 , map
                 , ctx
                 , apply
                 , unapply
                 , not
                 , forFun
                 , curryN
                 , curry
                 , range
                 , random
                 , tap
                 , compose
                 , wrap
                 , wraps
                 , wrapx
                 , wrapk
                 , pipe
                 , Flow
                 , get
                 , all
                 , any
                 , pluck
                 , getIn
                 , setIn
                 , setInV
                 , mkLens
                 , wrapTip
                 , muteGet
                 }
