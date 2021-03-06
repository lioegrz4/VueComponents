import { format
    , differenceInDays
    , getHours
    , addDays
    } from 'date-fns/esm'
import { zh } from 'date-fns/esm/locale'
import Vue from 'vue'

const daysName = { '-2': "后天"
              , '-1': '明天'
              , '0': "今天"
              , '1': "昨天"
              , '2': "前天"
              }
const dayForName = date => {
 return daysName[differenceInDays(new Date(), date)] || format(date, 'MM月DD日')
}

const hoursName = {'凌晨': 5, '上午': 10, '中午': 15, '下午': 18, '晚上': 23}
const hourForName = date => {
 let h = getHours(date)
 let n = Object.keys(hoursName).find(x => hoursName[x] > h)
 return `${n}${h%12}`
}

Vue.filter('timeBrief', function(value){
 return `${dayForName(value)} ${hourForName(value)}点`
})

export function isoTime(value){
 return format(value, 'YYYY-MM-DDTHH:mm:ss')
}

Vue.filter('isoTime', isoTime)
Vue.filter('orderTime', function (value){
 return format(value, 'YYYY-MM-DD HH:mm:ss')
})

export function dateToObject(value, trunc) {
 let gen = {
     year: () => value.getUTCFullYear(),
     month: () => value.getMonth() + 1,
     day: () => value.getDate(),
     hour: () => value.getHours(),
     minute: () => value.getMinutes(),
     second: () => value.getSeconds(),
 }
 let fields = Object.keys(gen)
 let ix = trunc ? fields.indexOf(trunc) : fields.length
 let rx = {}
 for (let i=0; i<fields.length; i++) {
     let n = fields[i]
     rx[n] = i < ix ? gen[n]() : 0
 }
 return rx
}

Vue.filter('ObjectToDateStr', ObjectToDateStr)

export function ObjectToDateStr(d){
 return `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}:${d.second}`
}