import { merge, upperFirst, isArray, isPlainObject, reduce } from 'lodash/fp'
import Vue from 'vue'

export class Pagination {
    page: number
    noMore: Function
    action: Function
    value: any
    completed: boolean
    constructor({noMore, action, page=0, value={}, completed=false}){
        this.page = page
        this.noMore = noMore
        this.completed = completed
        this.action = action
        this.value = value
    }
}
export const mkPagination = arg => new Pagination(arg)
export const mkActionP = (fn, i, pn) => async(ctx, payload) => {
    if (pn.completed) return
    let page = pn.page
    pn.page += 1
    let value = fn && await fn(ctx, Object.assign({page}, payload))
    if (pn.noMore && pn.noMore(value)) pn.completed = true
    ctx.commit(i, {value, page})
}
export const mkSetterP  = i => (state, {value, page}) => Vue.set(state[i].value, page, value)
export const mkGetterP = i => state => Object.keys(state[i].value).map(x => state[i].value[x])
/*
    test: mkLazyGetter({
        value: mkPagination({
            async action(ctx, {page}) {
                return(page)
            },
            noMore: pred?
        }),
        init(state, prop, config) {
            //debugger
        },
        update(state, prop, config) {
            //debugger
        }
    }),

    actions:: __test
*/

export class LazyGetter {
    init : Function
    value: any
    initialed: boolean
    update: Function
    constructor({init, value, update}) {
        this.init = init
        this.value = value
        this.update = update
        this.initialed = false
    }
}

export const mkLazyGetter = arg => new LazyGetter(arg)

const mkGetter  = i => state => state[i]
const mkGetterL = (i, lg, getter) => state => {
    if ( !lg.initialed && !lg.initialed ) {
        lg.init(state, i, lg)
        lg.initialed = true
    }
    if ( lg.initialed && lg.update ) {
        lg.update(state, i, lg)
    }
    return getter ? getter(state) : state[i]
}
const mkSetter  = i => (state, payload) => state[i] = payload
const mkSetterA = i => (state, payload) => isArray(payload) ? state[i] = state[i].concat(payload) : state[i].push(payload)
const mkSetterM = i => (state, payload) => {
    if (!isArray(payload) || payload.length < 2) throw `setter#commit('${i}', payload) payload require [key, value]`
    Vue.set(state[i], payload[0], payload[1])
}

const getSetter = (obj, i) => {
    if (isArray(obj)) return mkSetterA(i)
    if (isPlainObject(obj)) return mkSetterM(i)
    return mkSetter(i)
}

export function deriveActions(...config) {
    return function (actions) {
        let rv = {}, __init = new Array()
        for (let i in actions) {
            let act = actions[i]
            // ?????? action ?????????
            if (isPlainObject(act)) {
                for (let c of config) {
                    if (c.type === act.type) {
                        // ?????? action ???????????? mutations ??????????????? setter, ???????????? setter
                        if (act.mutations && !act.setter) {
                            act.setter = async ({commit}, payload) => {
                                act.mutations.forEach(x => {
                                    commit(x, payload)
                                })
                            }
                        }
                        let rt = c.handler(act, i)
                        // ???????????????????????????
                        rv[i] = typeof rt === 'function'
                              ? rt
                              : rt.action
                              || (async (ctx, ...args) => {
                                    let v = await act.getter(ctx, ...args)
                                    if (v===null) return
                                    await act.setter(ctx, v)
                                  })
                        // ?????????????????????
                        if (typeof rt.init === 'function') { __init.push(rt.init) }
                        // ?????? trigger
                        if (typeof rt.trigger === 'function') rv[`_${i}`] = rt.trigger
                    } else {
                        // ?????????????????? handler ??????,???????????????
                        rv[i] = rv[i] || act
                    }
                }
            } else {
                // ?????? action ???????????????, ????????????
                rv[i] = act
            }
        }
        rv['__init__'] = async ctx => {
            __init.forEach(x => x(ctx))
        }
        return rv
    }
}

export function deriveModule (dfts, ...config) {
    let fields = Object.keys(dfts)
      , r = {
        namespaced: true,
        state: {},
        getters: {},
        mutations: {},
        actions: {}
    }
    let withActions = config.length > 1 && isArray(config[0])
    for (let i of fields) {
        let isLazy = dfts[i] instanceof LazyGetter
        r.state[i] = isLazy ? dfts[i].value : dfts[i]
        let isPagination = r.state[i] instanceof Pagination
        let getter = isLazy
                   ? mkGetterL(i, dfts[i] as LazyGetter, isPagination && mkGetterP(i))
                   : isPagination
                   ? mkGetterP(i)
                   : mkGetter(i)
        let setter = isPagination ? mkSetterP(i) : getSetter(dfts[i],i)
        r.getters['get' + upperFirst(i)] = getter
        r.getters[i] = getter
        r.mutations['set' + upperFirst(i)] = setter
        r.mutations[i] = setter
        if (isPagination) r.actions[`__${i}`] = mkActionP(r.state[i].action, i, r.state[i])
    }
    return withActions
        ? [r, config[1], { actions: deriveActions(...config[0])(config[1].actions) }].reduce(merge)
        : merge(r, config[0])
}
