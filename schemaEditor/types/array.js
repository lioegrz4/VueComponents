const l = $ll('@c/schemaEditor/types/array.js')
export default (h, self) => {
  let items    = self.schema.items
  return h('schema-editor-item-editor', {
    props: {
      //value : self.value['items'],
      schema: items,
      title : 'items',
      path  : [...self.path, 'items'],
      types: self.types,
    },
    on   : {
      change (v) {
        self.$emit('change', v)
      }
    }
  })
}
