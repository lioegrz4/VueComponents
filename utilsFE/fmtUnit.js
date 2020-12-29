const fmtUnit = scm => n => {
    if (n === 0) return [0, '']
    let bit = Math.floor(Math.log10(n))
    let unit = Object.keys(scm).find(x => scm[x] <= bit)
    let value = n / Math.pow(10, scm[unit])
    return [value, unit, bit]
}

const fixed = n => ([x, u = '']) => {
    let v = Math.floor(x) === x ? x.toString() : x.toFixed(n)
    return v + u
}

export const fmtU = Flow()
    .then(fmtUnit({ 亿: 8, 万: 4, 千: 3, 百: 2, 个: 0, 千分: -3, 万分: -4, 亿分: -8 }))
    .then(fixed(2))
/*
[0.000001235, 0.0001123, 0.001, 0.014, 0.1, 1, 12, 123, 1234, 12345, 123456, 1234567, 12345678, 123456789, 1234567890, 0].forEach(x => {
    console.log(fmtU(x))
})
123.50亿分
1.12万分
1千分
14千分
100千分
1个
12个
1.23百
12.34百
1.23万
12.35万
123.46万
1234.57万
1.23亿
12.35亿
0
*/