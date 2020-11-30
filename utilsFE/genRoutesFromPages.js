const fs = require('fs')
const ph = require('path')
const yml = require('js-yaml')
const yLoad = x => yml.load(fs.readFileSync(x, 'utf-8'))
const { pipe } = require('./lambda')
const PAGES_PATH = ph.resolve(__dirname, '../pages')
const routeStr = (cfg, imp) => `
import VueRouter from 'vue-router'
import { scrollBehavior } from './scrollBehavior'

${imp}
/*****
此文件内容由 ${ph.relative(ph.resolve('.'), __filename)} 生成
*/
export default new VueRouter({
    routes : ${cfg},
    scrollBehavior
})`
const imps = {}

const genImport = imps => {
    let r = ""
    Object.keys(imps).forEach(x => {
        r += `import ${x} from '${imps[x]}'\n`
    })
    return r
}
const deQuoteImport = s => s.replace(/"<--!(.*)!-->"/gm, "$1")

const walkDir = (src, p=[]) => {
    let ret = fs.readdirSync(src)
        .map(x => ({ name: x, path: ph.join(src, x)}))
        .filter(({path}) => fs.statSync(path).isDirectory())
        .map(({name, path}) => {
            let cf = ph.join(path, 'info.yml')
            let { arg, meta, path: cPath } = (fs.existsSync(cf)) ? yLoad(cf) : {}
            let currPath = [...p, name]
            imps[currPath.join('_')] = `../pages/${currPath.join('/')}/index.vue`
            return {
                path: cPath || `${p.length ? '' : '/'}${name}${arg ? '/:'+arg : ''}`,
                props: !!arg,
                component: `<--!${currPath.join('_')}!-->`,
                name: currPath.join('/'),
                meta,
                children: walkDir(path, currPath)
            }
        })
    return ret.length ? ret : undefined
}


fs.writeFileSync(ph.resolve(__dirname,'..', 'router', 'index.ts'),
    pipe(routeStr, deQuoteImport)(JSON.stringify(walkDir(PAGES_PATH), null, 4), genImport(imps))
)
