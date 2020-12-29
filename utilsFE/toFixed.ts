import Vue from 'vue'

export const toFixed = (value, bit=2) => {
    let u = Math.pow(10, bit)
    return Math.round(value * u) / u
}

Vue.filter('toFixed', toFixed)

Vue.filter('toInt', function(value, bit){
    return value ? value.toFixed(bit || 0) : '0'
})