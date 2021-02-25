const crypto = require('crypto')

let HASH = (salt, pwd) => crypto.createHmac('sha256', salt).update(pwd).digest('hex')

const sign = pwd => {
    let salt = Math.random().toString(36).slice(2,10)
    let result = HASH(salt, pwd)
    return `${salt}:${result}`
}
const verify = (password, token) => {
    let [salt, pwd] = token.split(':')
    let result = HASH(salt, password)
    return result === pwd
}

module.exports = {verify, sign}