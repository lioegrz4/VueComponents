const intersection = (lhs, rhs, compare, hasSorted) => {
  // lhs, rhs 中的元素有相同的顺序
  let currL   = 0,
      currR   = 0,
      sortedL = hasSorted ? lhs : lhs.sort(compare),
      lenL    = sortedL.length,
      sortedR = hasSorted ? rhs : rhs.sort(compare),
      lenR    = sortedR.length,
      result  = []
  while (currL < lenL && currR < lenR) {
    let comp = compare(sortedL[currL], sortedR[currR])
    switch (true) {
      case  comp > 0:
        currR += 1
        break
      case comp < 0:
        currL += 1
        break
      default:
        result.push(sortedL[currL])
        currL += 1
        currR += 1
    }
  }
  return result
}

module.exports = {
  intersection,
}
