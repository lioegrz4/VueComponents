const keymap = {
    "c-f": 'forward',
    "ArrowRight": 'forward',
    "c-b": 'backward',
    "ArrowLeft": 'backward',
    "c-n": 'next',
    "ArrowDown": 'next',
    "c-p": 'preview',
    "ArrowUp": 'preview',
    "c-c": 'copy',
    "c-v": 'paste',
    "c-x": 'cut',
    "Backspace": 'delete-backward',
    "c-d": 'delete-forward',
    "c-x c-v": 'save',
    "c-x c-x x": 'test-prefix',
}

const prefixKeys = Object.keys(keymap)
                    .map(x => x.split(/\s+/).slice(0, -1))
                    .filter(x => x.length > 0)
                    .map(x => x.join(' '))

const fmtKeyName = (ev) => {
    let kn = ['ctrlKey', 'altKey', 'shiftKey', 'metaKey']
    let keys = new Array
    kn.forEach(k => {
        if (ev[k]) keys.push(k[0])
    })
    keys.push(ev.key)
    return keys.join('-')
}

const getInstruction = (name, key) => {
    let f = keymap[name]
    if (f) return [f, key]
    let charCode = key.charCodeAt(0)
    if (!f && charCode >= 32 && charCode <= 122) return ['insert', key]
    return ['cancel', key]
}

export default function(evs) {
    let k = evs.map(fmtKeyName).join(' ')
    // 如果是前缀
    if (prefixKeys.indexOf(k)>=0) return ['waiting', null]
    return getInstruction(k, evs.slice(-1)[0].key)
}
