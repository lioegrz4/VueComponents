module.exports = (app, config) => {
    app.register(require('fastify-jwt'), {
        secret: function (request, reply, callback) {
            // do something
            callback(null, require('./secret').jwt)
        }
    })

    app.addHook('preHandler', async (req, res) => {
        let jwt = await new Promise(function (resolve, reject) {
            req.jwtVerify((err, decoded) => {
                resolve(decoded)
            })
        })
        req.jwt = jwt
        return
    })


    app.post('/jwt/sign', async (req, reply) => {
        let jwt = await new Promise(function (resolve, reject) {
            req.jwtVerify((err, decoded) => {
                resolve(decoded)
            })
        })
        if (!jwt || jwt.user !== "dist") {
            reply.code(403)
            return ""
        }
        let token = await new Promise(function (resolve, reject) {
            reply.jwtSign(req.body, {
                algorithm: 'HS512',
            }, (err, token) => {
                if (err) {
                    reject(err)
                }
                resolve(token)
            })
        })
        return "bearer " + token
    })
}