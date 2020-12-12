const { get } = require('./lambda')

class TopicRegistry {
    constructor() {
        this.topic = new Map()
        this.cascade = new Map()
    }
    use(topic, handler) {
        this.topic.set(topic, handler)
        return this
    }
    get(topic) {
        return this.topic.get(topic)
    }
    join(topic, event) {
        let l = this.cascade.get(event)
        if (!l) {
            l = new Set()
            this.cascade.set(event, l)
        }
        l.add(topic)
        return this
    }
    getCascade(event) {
        let es = this.cascade.get(event)
        return es ? [...es] : []
    }
    setup(socket, id) {
        let token = get('handshake', 'query', 'auth_token')(socket)
        for (let [t, h] of this.topic) {
            socket.on(t, async (...args) => {
                let cascade = this.getCascade(t)
                let r = await this.get(t)({ id, token, socket, cascade }, ...args)
                for (let i of cascade) {
                    this.get(i)({ id, token, socket, trigger: t }, r)
                }
            })
        }
        return this
    }
}

let regTopic = new TopicRegistry()

class UsersRegistry {
    constructor() {
        this.user = new Map()
        this._user = new WeakMap()
        this.guest = new WeakSet()
    }
    addUser(id, socket) {
        this.user.set(id, socket)
        this._user.set(socket, id)
        regTopic.setup(socket, id)
        return this
    }
    addGuest(data) {
        this.guest.add(data)
        return this
    }
    getUser(id) {
        return this.user.get(id)
    }
    broadcast(fn) {
        for (let [k, v] of this.user) {
            fn(v)
        }
        return this
    }
    getId(data) {
        return this._user.get(data)
    }
    delelte(data) {
        if (this.guest.has(data)) {
            this.guest.delete(data)
        }
        if (this.user.has(data)) {
            let id = this._user.get(data)
            this.user.delete(id)
            this._user.delete(data)
        }
        return this
    }
}

module.exports = {
    regUser: new UsersRegistry(),
    regTopic
}