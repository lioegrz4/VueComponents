const exec = typeof window === 'object'
  ? (tag, label, item) => {
    let LEAD = "color:MediumSlateBlue;font-weight:bold"
    let TAG = "color:Silver"
    if (label.length > 0) {
      let SEP = ["color:Moccasin", "color:Olive"]
      let SEPS = []
      for (let x = 0; x < label.length - 1; x++) {SEPS = SEPS.concat(SEP)}
      console.log(`%c<--- %c${tag} %c<= %c${label.join(' %c<= %c')}\n`
        , LEAD, TAG, ...SEP, ...SEPS
        , ...item)
    } else {
      console.log(`%c<--- %c${tag}\n`
        , LEAD, TAG
        , ...item)
    }
  }
  : (tag, label, item) => {
    if (label.length > 0) {
      console.log(`<--- ${tag} <= ${label.join(' <= ')}\n`
        , ...item)
    } else {
      console.log(`<--- ${tag}\n`
        , ...item)
    }
  }

const genLogger = tag => {
  return (...args) => {
    let label = [], item = []
    for (let i of args) {
      if (typeof i === 'string' && i.startsWith(';')) {
        label.push(i.slice(1))
      } else {
        item.push(i)
      }
    }
    exec(tag, label, item)
  }
}

module.exports = {
  genLogger
}

