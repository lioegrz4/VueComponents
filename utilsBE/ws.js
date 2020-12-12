const jwt = require('jsonwebtoken')
const { dist: secret } = require('./secret')
const { regUser, regTopic } = require('./wsRegistry')
const { get } = require('./lambda')

module.exports = socket => {
    let token = get('handshake', 'query', 'auth_token')(socket)
    try {
        let {admin_id : id, admin_role_id : role, admin_name : name} = jwt.verify(token, secret)
        regUser.addUser(id, socket, token, {role, name})
    } catch ({ message }) {
        regUser.addGuest(socket)
    }

    socket.on('echo', msg => {
        socket.send({
            topic: 'echo',
            msg,
            id: regUser.getId(socket),
        })
    })

    socket.on('close', () => {
        regUser.delelte(socket)
    })

    socket.on('error', err => {
        console.log(err)
    })
}