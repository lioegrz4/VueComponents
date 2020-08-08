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
  const l = $ll('sandbox/schema/api/request.vue')
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
          l(this.result)
        } catch (e) {
          l(e, ';error')
        }
      },
    },
  }
</script>
