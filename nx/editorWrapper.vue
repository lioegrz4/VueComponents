<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode } from "vue/types";
import _ from "lodash";

@Component
export default class NxEditorWrapper extends Vue {
  @Prop() path: Array<string | number>
  render(h): VNode {
      return h('div', {
          on: {
              mouseenter: () => this.$emit('change', 'hover', <Element>this.$refs.w)
          },
          ref: 'w'
      }, [this.$slots.default])
  }
}
</script>