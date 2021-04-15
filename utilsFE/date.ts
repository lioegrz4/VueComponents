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
 let fields = ['month', 'day', 'hours', 'minute', 'second']
 let f = trunc
       ? fields.slice(0, fields.indexOf(trunc))
       : fields
 let gen = {
         month: () => value.getMonth() + 1,
         day: () => value.getDate(),
         hours: () => value.getHours(),
         minute: () => value.getMinutes(),
         second: () => value.getSeconds(),
     }
 let rx = {}
 for (let i of f) {
     rx[i] = gen[i]()
 }
 return rx
}

Vue.filter('ObjectToDateStr', ObjectToDateStr)

export function ObjectToDateStr({month, day, hours, minute}){
 return `2018-${month}-${day} ${hours}:${minute}:00`
}