const isn = v => {
    let n = parseInt(v)
    if (isNaN(n)) {
        return { n: false, v }
    } else {
        return { n: true, v: n }
    }
}

const fillObject = (obj, path, val) => {
    let kind = path.map(x => isn(x))
    let curr = obj, end = path.length-1
    for (let i=0; i < path.length; i++){
        if (i===end) {
            curr[path[i]] = val
        } else {
            if (!curr[path[i]])  {
                // 根据下一节点是否数字决定当前节点类型
                curr[path[i]] = kind[i+1].n ? [] : {}
            }
            // 当前节点根据前一步的结果选择使用数字或字符串取值
            curr = curr[kind[i].v]
        }
    }
    return obj
}

module.exports = fillObject