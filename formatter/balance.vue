<template>
  <span :style="s">
    {{prefix}}{{v}}
  </span>
</template>
<script>
  import {getIn } from '@u/lambda'
  export default {
    name: 'formatterBlcIn',
    props: ['value', 'prefix', 'type'],
    data(){
      return {
        v : this.value || getIn(this, ['$slots', 'default', 0, 'text'])
      }
    },
    computed: {
      s(){
        let m = {
          'in': {
            color: 'green'
          },
          'out': {
            color: 'red'
          }
        }
        return Object.assign({
          display: 'flex',
          justifyContent: 'flex-end',
        }, m[this.type])
      }
    }
  }
</script>
