<template>
  <div style="display: flex">
    <button @click="handleSwitch">+</button>
    <input v-if="editable" v-model="prop"/>
  </div>
</template>
<script>
  export default {
    name   : 'seie-insert',
    props  : ['path'],
    data () {
      return {
        editable: false,
        prop    : '',
      }
    },
    methods: {
      handleSwitch () {
        if (this.editable) {
          this.$emit('cmd', {
            type   : 'insert',
            payload: {
              path: this.path,
              prop: this.prop,
            },
          })
        }
        this.editable = !this.editable
      },
    },
  }
</script>
