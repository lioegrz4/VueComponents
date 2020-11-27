const fs = require('fs')
const ph = require('path')
const INDEX_PATH = ph.resolve(__dirname, '..', 'store')
const { pipe } = require('./lambda')
const vuexStr = ([imps, modules]) => `
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

${imps}

/*****
此文件内容由 ${ph.relative(ph.resolve('..'), __filename)} 生成
*/
const store = new Vuex.Store({
    modules: { ${modules}
             }
})

store.dispatch('ws/listen')

export default store`
const genImport = imps => {
    let r = ""
    let m = []
    imps.forEach(x => {
        let {name} = ph.parse(x)
        r += `import ${name} from './modules/${x}'\n`
        m.push(name)
    })
    return [r, m.join('\n             , ')]
}

fs.writeFileSync(ph.resolve(INDEX_PATH, 'index.js'),
    pipe(fs.readdirSync, genImport, vuexStr)(ph.resolve(INDEX_PATH, 'modules'))
)