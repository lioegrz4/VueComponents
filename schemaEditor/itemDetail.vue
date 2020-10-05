<template>
  <div class="schema-editor-item-detail">
    <div>
      <div class="i-breadcrumb">
        {{path.join('.')}}
      </div>

      <div>
        <label>类型</label>
        <select :value="value.type || 'default'"
                @input.prevent="changeType">
          <option v-for="(i, ix) in candidateType">{{i}}</option>
        </select>
      </div>

      <item-editor v-if="value && safeSchema"
                   :value="value"
                   :schema="safeSchema"
                   :types="schema.types"
                   :path="path"
                   @change="handleChange"
                   class="schema-editor-item-editor">
      </item-editor>

      <slot :value="value"
            :schema="safeSchema"
            :path="path"
            @change="handleChange"
            :types="schema.types">
      </slot>
    </div>
  </div>
</template>
<script>
  import itemEditor from './itemEditor.vue'

  export default {
    name      : 'SchemaEditorItemDetail',
    props     : ['value', 'path', 'schema'],
    components: {itemEditor},
    data () {
      return {
        show: false
      }
    },
    computed  : {
      candidateType () {
        return Object.keys(this.schema.types).filter(x => this.schema.types[x].candidate)
      },
      safeSchema () {
        return this.schema &&
               this.schema.types &&
               this.schema.types[
                 this.value && this.value.type
                 || 'default'
                 ]
      }
    },
    methods   : {
      handleChange (obj) {
        this.$emit('change', obj)
      },
      changeType (ev) {
        let t = ev.target.value
        if (t === 'default') {
          this.$emit('change', {path: [...this.path, 'type'], value: undefined})
        } else {
          this.$emit('change', {path: [...this.path, 'type'], value: t})
        }
      }
    }
  }
</script>
<style>
  .schema-editor-item-detail {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
  }

  .schema-editor-item-detail > div {
    position: fixed;
  }

  .schema-editor-item-detail .i-breadcrumb {
    font-size: .5em;
    color: grey;
  }

</style>
