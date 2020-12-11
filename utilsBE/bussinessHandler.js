const http2ws = require('../libs/wsFromHttp')
const { regTopic } = require('../libs/wsRegistry')

const g = {}

const loadHanders = () => {
    const fs = require('fs')
    const path = require('path')
    const DIR = path.resolve(__dirname, '..', 'handlers')
    let files = fs.readdirSync(DIR)
    let handlers = {}
    for (let i of files) {
        let clz = require(path.resolve(DIR, i))
        handlers[path.parse(i).name] = new clz(g)
    }
    return handlers
}
const handlers = loadHanders()

for (let i in handlers){
    let h = handlers[i]
    if (typeof h.socket === 'function') {
        regTopic.use(i, h.socket.bind(h))
    }
}


module.exports = async app => {
    for (let i in handlers){
        let h = handlers[i]
        if (typeof h.post === 'function') {
            app.post('/bussiness/'+i, h.post.bind(h))
        }
        if (typeof h.get === 'function') {
            app.get('/bussiness/'+i, h.get.bind(h))
        }
    }
    app.post('/wshub', async (req, reply) => {
        if (!req.jwt || req.jwt.aud !== 'ioHub' || req.jwt.sub !== 'distribution') {
            reply.code(403)
            return ""
        } else {
            let d = req.body
            let offline = http2ws(d)
            reply.code(200)
            return offline
        }
    })
}
