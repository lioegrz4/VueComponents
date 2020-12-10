import { merge, upperFirst } from 'lodash/fp'
import Vue from 'vue'
import {isArray, isPlainObject} from 'lodash/fp'

const mkGetter  = i => state => state[i]
const mkSetter  = i => (state, payload) => state[i] = payload
const mkSetterA = i => (state, payload) => state[i].push(payload)
const mkSetterM = i => (state, payload) => {
    if (!isArray(payload) || payload.length!==2) throw `setter#commit('${i}', payload) payload require [key, value]`
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
            // 如果 action 是对象
            if (isPlainObject(act)) {
                for (let c of config) {
                    if (c.type === act.type) {
                        // 如果 action 对象中有 mutations 数组且没有 setter, 生成默认 setter
                        if (act.mutations && !act.setter) {
                            act.setter = async ({commit}, payload) => {
                                act.mutations.forEach(x => {
                                    commit(x, payload)
                                })
                            }
                        }
                        let rt = c.handler(act, i)
                        // 返回函数或返回对象
                        rv[i] = typeof rt === 'function'
                              ? rt
                              : rt.action
                              || (async (ctx, ...args) => {
                                    let v = await act.getter(ctx, ...args)
                                    typeof v !== 'undefined' && await act.setter(ctx, v)
                                  })
                        // 收集初始化函数
                        if (typeof rt.init === 'function') { __init.push(rt.init) }
                    } else {
                        rv[i] = act
                    }
                }
            } else {
                // 如果 action 是其它类型, 不做处理
                rv[i] = act
            }
        }
        rv['__init__'] = async ctx => {
            __init.forEach(x => x(ctx))
        }
        return rv
    }
}

export function deriveModule (dfts, config) {
    let fields = Object.keys(dfts)
      , r = {
        namespaced: true,
        state: {},
        getters: {},
        mutations: {},
        actions: {}
    }
    for (let i of fields) {
        r.state[i] = dfts[i]
        let getter = mkGetter(i), setter = getSetter(dfts[i],i)
        r.getters['get' + upperFirst(i)] = getter
        r.getters[i] = getter
        r.mutations['set' + upperFirst(i)] = setter
        r.mutations[i] = setter
    }
    return merge(r, config)
}
