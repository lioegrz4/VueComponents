<script>
  import Vue              from 'vue'
  import { mapActions }   from 'vuex'
  import { renderWidget } from './widget'
  const l = $ll('@c/tableItem.vue')
  export default Vue.component('xTableItem', {
    props     : ['def', 'idx', 'value', 'info'],
    methods   : {
      ...mapActions('ContentRender',
                    ['newStyle'])
    },
    render(h) {
      let self = this
      return renderWidget(self.def.type)(h, self)
    }
  })
</script>
