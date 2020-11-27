const isArray = x => x instanceof Array
const isObject = x => typeof x === 'object' && !(x instanceof Array)
const parsePath = x => x.split('.')
const get = (s, path) => path.reduce((curr, x) => curr && curr[x], s)

let mock = {
    a: 123,
    b: 123,
    c: {
        d: [{
                e: 1,
                f: [{x: [{y: 1}]}],
                g: {
                    a: 1
                }
            },
            {
                e: 2,
                f: [{x: [{y: 2}]}],
                g: {
                    a: 5
                }
            }
        ]
    }
}

let schema = {
    a: 'b',
    c: {
        d: {
            f: {
                x: {
                    y: 'z'
                }
            },
            g: {
                a: "b.c"
            }
        }
    }
}


const mergeArray = ([first, ...rest]) => {
    for (let i in first) {
        first[i] = [first[i]]
    }
    for (let i of rest) {
        for (let j in first) {
            first[j].push(i[j])
        }
    }
    return first
}
const transData = (schema, src) => {
    if (isArray(src)) {
        return src.map(x => {
            let r = transData(schema, x)
            return r
            /*
            if (isArray(r) && r.length===1) {
                return r[0]
            } else {
                return r
            }
            */
        })
    } else {
        let ret = {}
        for (let i in schema) {
            if (isObject(schema[i])) {
                let r = transData(schema[i], src[i])
                if (isArray(r)) {
                    if (r.length === 1) {
                        Object.assign(ret, r[0])
                    } else {
                        Object.assign(ret, {[i]: r})
                    }
                } else {
                    Object.assign(ret,  r)
                }
            } else {
                ret[schema[i]] = src[i]
            }
        }
        return ret
    }
}

//let r = transData(schema, mock)

module.exports = {
    transData
}