import { format, parse } from 'date-fns'

export function fmtDateRange(b, e, f=fmtYMD) {
    return `${f(b)} - ${f(e)}`
}

export function fmtYMDhms(d){
    return format(d, "YYYY-MM-DD HH:mm:ss")
}

export function fmtYMD(d){
    return format(d, "YYYY-MM-DD")
}

export function unixEpochToDate(ue){
    let n = parseFloat(ue)
    let b = Math.floor(Math.log10(n))
    return parse(n * Math.pow(10, 12-b))
}