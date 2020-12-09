class UsersRegistry {
    constructor(){
        this.user = new Map()
        this._user = new WeakMap()
        this.guest = new Set()
    }
    addUser(id, data) {
        this.user.set(id, data)
        this._user.set(data, id)
        return this
    }
    addGuest(data) {
        this.guest.add(data)
        return this
    }
    getUser(id) {
        return this.user.get(id)
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

module.exports = new UsersRegistry()