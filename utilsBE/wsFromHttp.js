let { regUser } = require('./wsRegistry')

module.exports = d => {
    let offline = new Set()
    d.forEach(({aud, event, data}) => {
        aud.forEach(x => {
            let u = regUser.getUser(x)
            if (u) {
                u.socket.emit(event, data, ok=>{
                })
            } else {
                offline.add(x)
            }
        })
    })
    return [...offline]
}
