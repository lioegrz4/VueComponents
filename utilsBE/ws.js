const { regUser, regTopic } = require('./wsRegistry')
const { get } = require('./lambda')

const handler = socket => {
    socket.on('echo', msg => {
        socket.send({
            topic: 'echo',
            msg,
            id: regUser.getUserBySocket(socket).id,
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