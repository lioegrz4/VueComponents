import { findIndex } from 'lodash/fp'
function getBreadcrumb(tree, pred, path){
    if (!tree.children) return
    let r = findIndex(pred)(tree.children)
    if (r>=0) {
        return [...path, r]
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            let s = getBreadcrumb(tree.children[i], pred, [...path, i])
            if (s) return s
        }
    }
    return
}
export const getBreadcrumbFromTree = pred => tree => {
    return getBreadcrumb(tree, pred, [])
}


function scanExpand(breadcrumb) {
  return breadcrumb.reduce(([acc, res], i) => {
    acc.push(i)
    res.push(acc.slice(0))
    return [acc, res]
  }, [[], []])[1]
}

function isPrefix(prefix, breadcrumb) {
  let res = true
  for (let i in prefix) {
    if (prefix[i] !== breadcrumb[i]) {
      res = false
      break;
    }
  }
  return res
}

module.exports = {
  scanExpand, isPrefix
}
