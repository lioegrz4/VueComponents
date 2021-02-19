const REV = typeof window === 'object' ? 'B' : 'N'

const fsHandler = ({ fs, path, sep = "\t", tagSep = ":" }) => (level, tag, content) => {
    fs.appendFileSync(path, [new Date().toISOString(), level, tag.join(tagSep), ...content].join(sep) + '\n')
}


const csHandler = typeof window === 'object'
    ? (title, lvFmt) => (level, tag, content) => {
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
    : (title, lvFmt) => (level, tag, content) => {
        if (tag.length > 0) {
            console.log(`<--- ${title} <= ${tag.join(' <= ')}\n`
                , ...content)
        } else {
            console.log(`<--- ${title}\n`
                , ...content)
        }
    }

const loggen = ({ level = ['info', 'debug', 'error', 'log'], handler }) => {
    function logger() { }
    let genMethod = (level, handler) => (tag, ...content) => handler(level, tag, content)
    for (let l of level) {
        logger.prototype[l] = genMethod(l, handler)
    }
    return new logger()
}

const conslog = title => loggen({ handler: csHandler(title) })
const filelog = (fs, path) => loggen({ handler: fsHandler({fs, path})})

module.exports = {
    loggen, fsHandler, csHandler, conslog, filelog
}

