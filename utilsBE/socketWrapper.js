const { regUser } = require('../libs/wsRegistry')

const buildinRole = {
    async '广播' ({fn, role, topic}, {user, socket}, ...args) {
        let rv = await fn({user, socket}, ...args)
        regUser.broadcast(s => {
            s.emit(topic, rv)
        })
    },
    async '单播' ({fn, role, topic}, {user, socket}, ...args) {
        let rv = await fn({user, socket}, ...args)
        if (topic) socket.emit(topic, rv)
    },
    async '联播' ({fn, role, topic}, {user, socket}, ...args) {
        regUser.broadcast(async s => {
            let user = regUser.getUser(s)
            let rv = await fn({user, socket: user.socket}, ...args)
            s.emit(topic, rv)
        })
    },
}

module.exports = function(role, topic) {
    return async function(fn, {user, socket}, ...args) {
        if (role in buildinRole) {
            await buildinRole[role]({fn, role, topic}, {user, socket}, ...args)
        } else if (user.info.role === role) {
            let rv = await fn({user, socket}, ...args)
            if (topic) socket.emit(topic, rv)
        } else {
            for (let i of regUser.listGroup(role)){
                let u = regUser.getUserByID(i)
                let rv = await fn({user:u, token:u.token, socket: u.socket}, ...args)
                if (topic) u.socket.emit(topic, rv)
            }
        }
    }
}