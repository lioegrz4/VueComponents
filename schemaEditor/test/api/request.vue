<template>
  <div>
    <button @click="handleClick">测试</button>
    <item :value="result" :schema="schema" :path="[]"></item>
    <!--
    <pre>{{result}}</pre>
    -->
  </div>
</template>
<script>
  import item from '@c/schemaEditor/item.vue'
  export default {
    name   : 'schema_api_request',
    components: {item},
    props  : ['url', 'method'],
    data () {
      return {
        result: null,
        schema:{
          types: {
            'default'       : {
              style    : {
                color: 'grey'
              },
              type     : 'object',
            },
          }
        }
      }
    },
    methods: {
      async handleClick () {
        try {
          this.result = await this.$ax({
                                         method: this.method,
                                         url   : this.url,
                                       })
          console.log(this.result)
        } catch (e) {
          console.log(e, ';error')
        }
      },
    },
  }
</script>
