const defaultLvProbe = (d='error') => () => process.env.NODE_LOG || d

const eq = v => x => x===v

const fsHandler = ({ fs, path, sep = "\t", tagSep = ":", lvProbe }) => async (level, tag, content) => {
    await fs.appendFileSync(path, [new Date().toISOString(), level, tag.join(tagSep), ...content].join(sep) + '\n')
}

const csHandler = typeof window === 'object'
    ? (title, lvProbe, lvFmt) => (level, tag, content) => {
        let LEAD = "color:MediumSlateBlue;font-weight:bold"
        let TAG = "color:Silver"
        if (tag.length > 0) {
            let SEP = ["color:Moccasin", "color:Olive"]
            let SEPS = []
            for (let x = 0; x < tag.length - 1; x++) { SEPS = SEPS.concat(SEP) }
            console.log(`%c<--- %c${title} %c<= %c${tag.join(' %c<= %c')}\n`
                , LEAD, TAG, ...SEP, ...SEPS
                , ...content)
        } else {
            console.log(`%c<--- %c${title}\n`
                , LEAD, TAG
                , ...content)
        }
    }
    : (title, lvProbe, lvFmt) => (level, tag, content) => {
        if (tag.length > 0) {
            console.log(`<--- ${title} <= ${tag.join(' <= ')}\n`
                , ...content)
        } else {
            console.log(`<--- ${title}\n`
                , ...content)
        }
    }

const loggen = ({ level = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'], handler, probe }) => {
    function logger() { }
    let genMethod = (ls, level, handler) => {
        let Ev = ls.findIndex(eq(probe())), Lv = ls.findIndex(eq(level))
        return (tag, ...content) => {
            if (Lv < Ev) return
            handler(level, tag, content)
        }
    }
    for (let l of level) {
        logger.prototype[l] = genMethod(level, l, handler)
    }
    return new logger()
}

const conslog = title => loggen({ handler: csHandler(title), probe: defaultLvProbe() })
const filelog = (fs, path) => loggen({ handler: fsHandler({fs, path}), probe: defaultLvProbe('info')})

module.exports = {
    loggen, fsHandler, csHandler, conslog, filelog
}

/*
let fs = require('fs')
l1 = filelog(fs, './log')

l1.debug([], 123)
l1.info(['a','b','c'], 23)
*/
