const { regUser, regTopic } = require('./wsRegistry')
const { get } = require('./lambda')

const handler = socket => {
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

module.exports = {
    userHandler (socket) {
        let token = get('handshake', 'query', 'auth_token')(socket)
        let { decoded_token: { admin_id : id, admin_role_id : role, admin_name : name } } = socket
        regUser.addUser(id, socket, token, {role, name})

        handler(socket)
    },
    guestHandler (socket) {
        regUser.addGuest(socket)

        handler(socket)
    }
}

/*
const socketioJwt = require('socketio-jwt')
let { userHandler, guestHandler } = require('./libs/ws')
io.on('connection', socketioJwt.authorize({
    secret: require('./libs/secret').dist,
    timeout: 15000,
  }))
  .on('authenticated', userHandler)
  .on('unauthorized', guestHandler)
*/