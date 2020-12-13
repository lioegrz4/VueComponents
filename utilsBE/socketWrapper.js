const { regUser } = require('../libs/wsRegistry')

const buildinRole = {
    async '广播' ({fn, role, topic}, {user, token, socket}, ...args) {
        let rv = await fn({user, token, socket}, ...args)
        regUser.broadcast(s => {
            s.emit(topic, rv)
        })
    }
}

module.exports = function(role, topic) {
    return async function(fn, {user, token, socket}, ...args) {
        if (role in buildinRole) {
            buildinRole[role]({fn, role, topic}, {user, token, socket}, ...args)
        } else if (user.info.role === role) {
            let rv = await fn({user, token, socket}, ...args)
            if (topic) socket.emit(topic, rv)
        } else {
            for (let i of regUser.listGroup(role)){
                let u = regUser.getUser(i)
                let rv = await fn({user:u, token:u.token, socket: u.socket}, ...args)
                if (topic) u.socket.emit(topic, rv)
            }
        }
    }
}