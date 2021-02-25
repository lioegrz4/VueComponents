const vm = require('vm')
const lsc = require('livescript')
const prelude = require('prelude-ls')

function eval (code, context, file, cb){
    try {
        code = lsc.compile(code, {filename: file, bare: true})
        let script = new vm.Script(code)
        cb(null, script.runInContext(vm.createContext(context)))
    } catch (err) {
        cb(err)
    }
}

module.exports = ({repl, prompt, context}) => {
    let i = repl || require('repl')
    const r = i.start({
        prompt, eval, useGlobal: true
    })
    Object.assign(r.context, prelude, context)
    return r
}