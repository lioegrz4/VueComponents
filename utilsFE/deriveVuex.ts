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
        let rv = {}
        for (let i in actions) {
            if (isPlainObject(actions[i])) {
                for (let c of config) {
                    if (c.type === actions[i].type) {
                        rv[i] = c.handler(actions[i])
                    } else {
                        rv[i] = actions[i]
                    }
                }
            } else {
                rv[i] = actions[i]
            }
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
