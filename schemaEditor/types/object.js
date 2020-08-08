const l = $ll('@c/schemaEditor/types/object.js')
export default (h, self) => {
  let properties = self.schema.properties
  let children   = []
  Object.keys(properties).forEach(x => {
    children.push(h('schema-editor-item-editor', {
      props: {
        value : self.value[x],
        schema: properties[x],
        title : x,
        path  : [...self.path, x],
        types: self.types,
      },
      on   : {
        change (v) {
          self.$emit('change', v)
        }
      }
    }))
  })
  return h('div', {
    'class': ['schema-editor-item-editor-list']
  }, children)
}
