/* client
const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host)
ws.onmessage = msg => console.log(msg.data)

ws.send('WebSockets are awesome!')
*/

const jwt = require('jsonwebtoken')
const { dist: secret } = require('./secret')
const registry = require('./wsRegistry')
const { get } = require('./lambda')

module.exports = socket => {
    let token = get('handshake', 'query', 'auth_token')(socket)
    try {
        let { admin_id: id } = jwt.verify(token, secret)
        registry.addUser(id, socket)
    } catch ({ message }) {
        registry.addGuest(socket)
    }

    socket.on('echo', msg => {
        socket.send({
            topic: 'echo',
            msg,
            id: registry.getId(socket),
        })
    })

    socket.on('close', () => {
        registry.delelte(socket)
    })

    socket.on('error', err => {
        console.log(err)
    })
}