/*
此模块应为 `path`，但是容易与内置同名模块混淆，所以临时起了不相关的名字
 */

function scanExpand(list) {
  return list.reduce(([acc, res], i) => {
    acc.push(i)
    res.push(acc.slice(0))
    return [acc, res]
  }, [[], []])[1]
}

function isPrefix(prefix, list) {
  let res = true
  for (let i in prefix) {
    if (prefix[i] !== list[i]) {
      res = false
      break;
    }
  }
  return res
}

module.exports = {
  scanExpand, isPrefix
}
