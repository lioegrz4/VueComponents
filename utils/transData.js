const { getIn } = require('./lambda')
const { objWalker } = require('./tree')
/*
不定长列表有两种匹配模式：有限模式和无限模式
 - 有限模式 [a, b, c] =:= [1,2,3,4...]
 - 无限模式 a =!= [1,2,3...]
          {a:'x', b:'y'} = [{a:1, b:2}, {a:1, b:2}, {a:1, b:2}...]
   使用非列表匹配列表时，使用无限模式
 - 路径 [a,b, c]
解析模式时，遇到列表声明中止解析，存储后续模式。匹配时，遇到列表递归调用解析函数
 - 如何安全的声明列表
   - 靠谱的方法
 - 不中止解析，如果在解析结果中找到列表的定义
   - smartGetIn ，遇到列表，返回当前路径。主调方收到后，回退到列表处重新解析
     - 返回和类型 Result，分多种情况
       - 获取到值
       - 遇到列表
       - 没获取到值
     - 重新解析后，用解析到的模式 Map 列表
   - 遇到列表时可知，然而无限模式的其它声明可能散落在多个模式定义中
     - objWalker 无法预知遇到的结构是列表还是字典
   - 使用某种数据结构解决这个问题
 */
const transData = (pattern, target)  => value => {
  // 解析模式独立出来
  let varMap = {}
  objWalker(pattern, (k, v, p) => {
    if (v) {
      varMap[v] = p.concat([k])
    }
    return v
  })
  // 匹配模式拆分开来
  if (target){
    objWalker(target, (k, v, p) => {
      if (isNaN(parseInt(k))) {
        let r = getIn(value, varMap[k])
        return r
      } else {
        // 如果键是数字字符串，说明在列表中且没有键，则把当前值作为键
        let realK = getIn(target, p.concat([k]))
        let r = getIn(value, varMap[realK])
        return r
      }
    })
    return target
  } else {
    let r = {}
    Object.keys(varMap).forEach(x => r[x] = getIn(value, varMap[x]))
    return r
  }
}

module.exports = {
  transData
}
