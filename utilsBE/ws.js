/* client
const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host)
ws.onmessage = msg => console.log(msg.data)

ws.send('WebSockets are awesome!')
*/

const jwt = require('jsonwebtoken')
const { jwt: secret } = require('./secret')
const registry = require('./wsRegistry')

module.exports = socket => {
    try {
        let { id } = jwt.verify(socket.protocol, secret)
        registry.user.set(id, socket)
        socket.__id__ = id
    } catch ({ message }) {
        registry.guest.add(socket)
    }

    socket.on('message', msg => {
        let [topic, payload] = JSON.parse(msg)
        socket.send(JSON.stringify([
            topic,
            {
                ...payload,
                id: socket.__id__,
            }
        ]))
    }) // Creates an echo server

    socket.on('close', () => {
        if (registry.guest.has(socket)) {
            registry.guest.delete(socket)
        }
        if (registry.user.has(socket)){
            registry.user.delete(socket)
        }
    })

    socket.on('error', err => {
        console.log(err)
    })
}