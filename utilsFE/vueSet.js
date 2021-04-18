export const vSet = (Vue, keyAsStr) => (...path) => (state, v) => {
    let curr = state, end = path.length - 1
    for (let i=0; i < path.length; i++) {
        let p = path[i]
        if (i===end) Vue.set(curr, p, v)
        if (!curr[p]) {
            if (!keyAsStr && typeof p === 'number') {
                Vue.set(curr, p, [])
            } else {
                Vue.set(curr, p, {})
            }
        }
        curr = curr[p]
    }
}