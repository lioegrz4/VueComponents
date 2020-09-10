const _ = require('lodash')

function treeMap (node, callback, child = 'children', parent = null, path = []) {
  if (!node) return
  let res = callback(_.cloneDeep(node), parent, path)
  if (!res) return
  if (typeof node[child] === 'object') {
    for (let i in node[child]) {
      if (node[child].hasOwnProperty(i)) {
        res[child][i] = treeMap(node[child][i], callback, child, parent = res, path.concat([i]))
      }
    }
  }
  return res
}

function treeEach (node, callback, child = 'children', parent = null, path = []) {
  if (!node) return
  callback(node, parent, path)
  if (typeof node[child] === 'object') {
    for (let i in node[child]) {
      if (node[child].hasOwnProperty(i)) {
        treeEach(node[child][i], callback, child, parent = node, path.concat([i]))
      }
    }
  }
}

const notIn = (k, obj, cb) => !(k in obj) && cb()
/*
 为了适应多树及递归定义等场景，将待构建的树(对象列表)视为具有收敛趋势的 DAG，按拓朴排序构建树
 扫描出 id 和 pid 列表：ids pds
 则 ids 中存在而 pds 中不存在的，等价于入度为 0 的
 遍历 ids，将入度为 0 的移到其父节点下，此操作等价于删边
 删边后整理 ids 为参数形式，进行下一次迭代。同时传递本次迭代参数的(列表)容量
 下一次迭代扫描出 ids 后，如果容量等于上一次的，则说明上一次迭代并没有将 ids 中的节点移入其它节点，构建完成

 记录迭代次数为最高的树的高度
 */
const buildTree = (list, { id = 'id', pid = 'pid', prop = 'children', breadcrumb } = {}, plen = 0, height = 0) => {
  /*
   使用 HashTable 模式的对象
   */
  let ids = {}, pds = {}
  for (let i of list) {
    notIn(i[pid], pds, () => pds[i[pid]] = true)
    notIn(i[id], ids, () => ids[i[id]] = i)
  }
  if (plen === list.length) return {payload: list, height}
  Object.keys(ids).forEach(k => {
    notIn(k, pds, () => {
      // 当前 k 所在的 item 的 pid 所在的 item
      let pk = ids[k] && ids[k][pid]
      let p  = pk && ids[pk]
      if (p) {
        if (!p[prop]) p[prop] = []
        // 加入父元素的 cn 列表 并且删除自身
        if (breadcrumb) { // 生成面包屑
          if (!ids[k][breadcrumb]) ids[k][breadcrumb] = []
          treeEach(ids[k], (n) => n[breadcrumb].push(pk), prop)
        }
        p[prop].push(ids[k])
        delete ids[k]
      }
    })
  })
  let res = Object.keys(ids).map(x => ids[x])
  return buildTree(res, { id, pid, prop, breadcrumb }, list.length, height + 1)
}

const safeEntryPred = (o, i) => o.hasOwnProperty(i) && typeof o[i] === 'object'
function objWalker (obj, cb, { branch, entry = safeEntryPred } = {}, path = []) {
  for (let i in obj) {
    if (entry(obj, i)) {
      // 枝干模式(默认只遍历叶)
      if (branch) obj[i] = cb(i, obj[i], path)
      objWalker(obj[i], cb, { branch, entry }, path.concat([i]))
    } else {
      // cb(k, v, path)
      obj[i] = cb(i, obj[i], path)
    }
  }
}

const sumAcc          = (acc, x) => acc + x
const insCnt          = ({ctx, key}) => 1

function treeduce (ctx,
                   {
                     entry   = () => true,
                     init    = 0,
                     handler = insCnt,
                     reducer = sumAcc,
                     branch,
                     prop
                   }    = {},
                   path = []) {
  let acc    = init
  let config = {entry, init, handler, reducer, branch, prop}
  Object.keys(ctx).forEach(key => {
    let it = ctx[key], context = {ctx, key, path, it}
    if (typeof it === 'object' && entry(context)) {
      if (branch) acc = reducer(acc, handler(context))
      acc = reducer(acc, treeduce(it, config, [...path, key]))
    } else {
      acc = reducer(acc, handler(Object.assign(context, {end: true})))
    }
  })
  if (prop) ctx[prop] = acc
  return acc
}

const treedux = config => tree => treeduce(tree, config)

function pathToArray (arr, path, payload, children = 'children') {
  path.reduce((acc, i) => {
    let p = _.find(acc, (x) => {
      return x.path === i
    })
    if (!p) {
      let res = {
        path    : i,
        children: [],
      }
      if (payload) {
        res = _.merge(res, payload)
      }
      acc.push(res)
      return res[children]
    } else {
      return p[children]
    }
  }, arr)
}

function objToTree (obj, callback, children = 'children') {
  let res = []
  objWalker(obj, (k, v, path) => {
    pathToArray(res, path, callback ? callback(k, v, path) : {payload: v}, children)
    return v
  })
  return res
}

function constString (conf) {
  objWalker(conf, (k, v, p) => {
    return k
  })
  return conf
}

module.exports = {
  pathToArray
  , buildTree
  , treeEach
  , treeMap
  , treeduce
  , treedux
  , objWalker
  , objToTree
  , constString
}
