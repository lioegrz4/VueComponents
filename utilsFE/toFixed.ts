import Vue from 'vue'

Vue.filter('toFixed', function(value, bit){
    return value ? value.toFixed(bit || 2) : '0'
})