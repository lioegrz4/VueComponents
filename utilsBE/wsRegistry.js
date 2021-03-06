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
    linearization(event) {
        let curr = this.getCascade(event)
          , seq = new Set(curr)
          , rv = [curr], tmp = []
        while (curr.length > 0) {
            for (let i of curr) {
                for (let j of this.getCascade(i)){
                    if (seq.has(j)) continue
                    seq.add(j)
                    tmp.push(j)
                }
            }
            curr = tmp
            tmp = []
            if (curr.length > 0) rv.push(curr)
        }
        return rv
    }
    setup(socket, user) {
        for (let [t, h] of this.topic) {
            socket.on(t, async (...args) => {
                let cascade = this.linearization(t)
                let r = [await this.get(t)({ user, socket, cascade }, ...args)]
                // 返回值合并到 ctx
                let prevR = Object.assign({}, ...r.filter(x => x))
                for (let i of cascade) {
                    let tasks = i.map(async j => {
                        let hd = this.get(j)
                        if (!hd) {
                            console.log(`handler ${j} not exists`)
                            return
                        }
                        return await hd(
                            { user, socket, trigger: t },
                            {...args[0], ...prevR})
                    })
                    r = await Promise.all(tasks)
                }
            })
        }
        return this
    }
}

let regTopic = new TopicRegistry()

class User {
    constructor({socket, info, id, token}) {
        this.socket = socket
        this.token = token
        this.info = info
        this.id = id
    }
}

class UsersRegistry {
    constructor() {
        this.user = new Map()
        this._user = new WeakMap()
        this.group = new Map()
        this.guest = new WeakSet()
    }
    addUser(id, socket, token, info) {
        let user = new User({socket, info, id, token})
        this.user.set(id, user)
        this.addGroup(info.role, id)
        this._user.set(socket, user)
        regTopic.setup(socket, user)
        return this
    }
    addGroup(g, id) {
        if (!this.group.has(g)) this.group.set(g, new Set())
        this.group.get(g).add(id)
        return this
    }
    listGroup(g){
        return this.group.get(g) || new Set()
    }
    addGuest(data) {
        this.guest.add(data)
        return this
    }
    getUserByID(id) {
        return this.user.get(id)
    }
    broadcast(fn) {
        for (let [k, v] of this.user) {
            fn(v.socket)
        }
        return this
    }
    getUserBySocket(socket) {
        return this._user.get(socket)
    }
    delelte(data) {
        if (this.guest.has(data)) {
            this.guest.delete(data)
        }
        if (this.user.has(data)) {
            let user = this._user.get(data)
            this.user.delete(user.id)
            this._user.delete(data)
        }
        return this
    }
}

module.exports = {
    regUser: new UsersRegistry(),
    regTopic
}