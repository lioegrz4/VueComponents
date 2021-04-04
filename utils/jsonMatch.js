const get = (object, path) => path.reduce((acc, x) => acc && acc[x], object)

const walker = (object, cb, path = []) => {
    if (object instanceof Array
      ||object instanceof RegExp) {
        return cb(object, path)
    } else if (typeof object === 'object') {
        for (let x of Object.keys(object)) {
            let r = walker(object[x], cb, [...path, x])
            if (r instanceof Array) return r
        }
        return true
    } else {
        return cb(object, path)
    }
}

module.exports = schema => object => {
    return walker(schema, (v, p) => {
        schema
        let t = get(object, p)
        if (!t) return ['!', v, p]
        if (v instanceof Array) {
            if (t instanceof Array) {
                for (let i of t) {
                    if (!v.includes(i)) return ['@@', v, t, p]
                }
                return true
            } else {
                return v.includes(t) || ['@', v, t, p]
            }
        }
        if (v instanceof RegExp) {
            return v.test(t) || ['~', v.toString(), t, p]
        }
        return t === v || ['=', v, t, p]
    })
}