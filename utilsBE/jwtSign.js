module.exports = app => {
    app.post('/jwt/sign', async (req, reply) => {
        let jwt = await new Promise(function (resolve, reject) {
            req.jwtVerify((err, decoded) => {
                resolve(decoded)
            })
        })
        if (!jwt || jwt.user !== "api.enongchao.com") {
            reply.code(403)
            return ""
        }
        return await new Promise(function (resolve, reject) {
            reply.jwtSign(req.body, {
                algorithm: 'HS512',
            }, (err, token) => {
                if (err) {
                    reject(err)
                }
                resolve(token)
            })
        })


    })
}