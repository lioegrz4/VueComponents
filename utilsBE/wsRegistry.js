const { get } = require('./lambda')

class TopicRegistry {
    constructor(){
        this.topic = new Map()
    }
    use(topic, handler) {
        this.topic.set(topic, handler)
        return this
    }
    get(topic){
        return this.topic.get(topic)
    }
    setup(socket, id){
        let token = get('handshake', 'query', 'auth_token')(socket)
        for (let [t, h] of this.topic) {
            socket.on(t, (...args) => this.get(t)({id, token, socket}, ...args))
        }
        return this
    }
}

let regTopic = new TopicRegistry()

class UsersRegistry {
    constructor(){
        this.user = new Map()
        this._user = new WeakMap()
        this.guest = new Set()
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
    broadcast(fn){
        for (let [k,v] of this.user){
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