<script>
  import internTypes from './types'

  const l = $ll('@c/schemaEditor/itemEditor.vue')
  export default {
    name    : 'SchemaEditorItemEditor',
    props   : ['value', 'schema', 'title', 'path', 'types'],
    computed: {
      payload () {
        return this.value
      },
    },
    render (h) {
      let self  = this
      let sType = self.schema && self.schema.type
      let r     = internTypes[sType] && internTypes[sType].editor
      if (r) {
        let title = self.schema.title || self.title
        return h('div', {
                   'class': ['schema-editor-item-editor'],
                 },
                 [
                   title && h('span', [title]),
                   r(h, self),
                 ])
      } else if (self.types[sType]) {
        // 自定义类型在类型列表中查找，替换为内置类型的定义
        return h('schema-editor-item-editor', {
          props: {
            schema: self.types[sType],
            value : self.value,
            title : self.title,
            path  : self.path,
            types : self.types,
          },
          on   : {
            change (v) {
              self.$emit('change', v)
            },
          },
        })
      }
    },
  }
</script>
<style>
  .schema-editor-item-editor {
    display: flex;
    justify-content: space-between;
  }

  .schema-editor-item-editor-list {
    display: flex;
    flex-flow: column nowrap;
    margin-top: 1em;
  }

  .schema-editor-item-editor > input {
    border-bottom: solid 1px #b3b4ff;
    border-left: none;
    border-right: none;
    border-top: none;
    background-color: transparent;
    text-align: right;
    /* TODO */
    width: 300px;
  }

  .schema-editor-item-editor > select {
    background-color: transparent;
    border: none;
    text-align: right;
  }
</style>
