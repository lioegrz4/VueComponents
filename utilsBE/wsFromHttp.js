let reg = require('./wsRegistry')

module.exports = d => {
    let offline = new Set()
    d.forEach(({aud, event, data}) => {
        aud.forEach(x => {
            let u = reg.getUser(x)
            if (u) {
                u.emit(event, data)
            } else {
                offline.add(x)
            }
        })
    })
    return [...offline]
}
