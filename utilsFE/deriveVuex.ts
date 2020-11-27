import { merge, upperFirst } from 'lodash/fp'

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
        r.getters[i] = state => state[i]
        r.mutations['set' + upperFirst[i]] = (state, payload) => state[i] = payload
    }
    return merge(r, config)
}
