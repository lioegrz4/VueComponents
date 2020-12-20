const jwt = require('jsonwebtoken')
const secrets = require('./secret')

module.exports = (app, config) => {
    app.register(require('fastify-jwt'), {
        secret: function (request, reply, callback) {
            // do something
            callback(null, secrets.iohub)
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


/*
iss: 该JWT的签发者
sub: 该JWT所面向的用户
aud: 接收该JWT的一方
exp(expires): 什么时候过期，这里是一个Unix时间戳
iat(issued at): 在什么时候签发的
*/
    app.post('/jwt/sign', async (req, reply) => {
        let { secret, ...props } = req.body
        let token = await new Promise(function (resolve, reject) {
            jwt.sign({ ...props, iss : "iohub" }
                    , secret
                    , { algorithm: 'HS512', }
                    , (err, token) => {
                                          if (err) { reject(err) }
                                          resolve(token)
                                      }
                    )
        })
        return token
    })

    app.post('/jwt/token-sign', async (req, reply) => {
        let { token, aud, ...props } = req.body
        let reqInfo = jwt.verify(token, secrets.root)
        if (!reqInfo
           || reqInfo.iss !== "iohub"
           || reqInfo.aud !== "iohub"
           || reqInfo.sub !== "jwt"
           ) {
            reply.code(403)
            return ""
        }
        let replyToken = await new Promise(function (resolve, reject) {
            jwt.sign({ ...props, iss : "iohub", aud }
                    , secrets[aud]
                    , { algorithm: 'HS512', }
                    , (err, token) => {
                                          if (err) { reject(err) }
                                          resolve(token)
                                      }
                    )
        })
        return replyToken
    })
}