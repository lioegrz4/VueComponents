<script>
  import Vue              from 'vue'
  import { mapActions }   from 'vuex'
  import _                from 'lodash'
  import inputHint        from './hint.vue'
  import { getIn }        from '@u/lambda'
  import { renderWidget } from './widget'
  const l = $ll('@c/formItem.vue')

  export default Vue.component('xFormItem', {
    props     : ['def', 'idx', 'value', 'bare', 'info', 'inline'],
    components: {inputHint},
    methods   : {
      ...mapActions('ContentRender',
                    ['newStyle'])
    },
    render(h) {
      let self = this
      if (self.bare) {
        return renderWidget(self.def.type)(h, self)
      } else if (self.inline) {
        return h('el-form-item', {
                   props: {
                     label   : self.def.label,
                     prop    : self.def.prop,
                     required: self.def.required,
                   }
                 },
                 [
                   renderWidget(self.def.type)(h, self),
                 ]
        )
      } else {
        return h('div', [
          h('el-form-item', {
              style: {
                display: 'flex',
              },
              props: {
                label   : self.def.label,
                prop    : self.def.prop,
                required: self.def.required,
              }
            },
            [
              renderWidget(self.def.type)(h, self),
            ]
          ),
          self.def.hint && h('el-form-item', [h('inputHint', {props: {value: self.def.hint}})])
        ])
      }
    },
  })
</script>
