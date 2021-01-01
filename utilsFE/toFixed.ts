import Vue from 'vue'

export const floatRound = (value, bit=2) => {
    let u = Math.pow(10, bit)
    return Math.round(value * u) / u
}

Vue.filter('toFixed', (value, bit=2) => {
    return value ? floatRound(value, bit).toFixed(bit) : '0'
})

Vue.filter('toInt', function(value, bit){
    return value ? Math.round(value) : bit
})