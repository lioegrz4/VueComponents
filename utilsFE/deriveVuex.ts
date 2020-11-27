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
        let getter = state => state[i]
          , setter = (state, payload) => state[i] = payload
        r.getters['get' + upperFirst[i]] = getter
        r.getters[i] = getter
        r.mutations['set' + upperFirst[i]] = setter
        r.mutations[i] = setter
    }
    return merge(r, config)
}
