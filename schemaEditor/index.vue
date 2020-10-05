<template>
  <div class="schema-editor-wrapper">
    <schema-item v-for="(v, k) in payload"
                 :schema="schema"
                 :path="[k]"
                 :value="v"
                 :expand="true"
                 :expandDefault="true"
                 @cmd="exec"
                 :key="k">
    </schema-item>
    <item-detail :value="currPayload"
                 :path="current"
                 :schema="schema"
                 @change="handleChange">
      <template slot-scope="props">
        <slot v-bind="props"></slot>
      </template>
    </item-detail>
  </div>
</template>
<script>
  import schemaItem from './item.vue'
  import itemDetail from './itemDetail.vue'
  import { get } from 'lodash/fp'

  export default {
    name      : 'SchemaEditor',
    components: {schemaItem, itemDetail},
    props     : ['schema', 'value'],
    data () {
      return {
        payload: {root: this.value},
        current: []
      }
    },
    methods   : {
      getCurr(ph){
        let cur = this.payload
        let init = ph.slice(0, -1)
        let end = ph.slice(-1)[0]
        init.forEach(x => {
          if (!cur[x]) {
            this.$set(cur, x, {})
          }
          cur = cur[x]
        })
        return {cur, end}
      },
      handleChange ({path, value}) {
        let {cur, end} = this.getCurr(path)
        if (typeof cur === 'object') {
          this.$set(cur, end, value)
          this.$emit('input', this.payload.root)
          //setIn(this.payload, path, value)
        } else {
          console.log(cur, end, path, ';error on handleChange')
        }
      },
      exec ({type, payload}) {
        this[`cmd_${type}`](payload)
      },
      cmd_focus(v) {
        this.current = v
      },
      cmd_insert(v) {
        let {cur, end} = this.getCurr(v.path)
        this.$set(cur[end], v.prop, {})
      },
      cmd_delete(ph){
        let {cur, end} = this.getCurr(ph)
        this.$delete(cur, end)
      }
    },
    computed  : {
      currPayload () {
        return get(this.current)(this.payload)
      }
    },
    created () {
    }
  }
</script>
<style>
  .schema-editor-wrapper {
    display: flex;
  }
</style>
