<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { manifest, Manifest, Content } from "../manifest";
import { HandlerArg, Path, Status } from "../types";
Vue.component('fakeSlot', {
  //functional: true,
  render (h) {
    return h('div', {}, [
      this.$slots.default
    ])
  },
})


@Component
export default class NxTreeEditMode extends Vue {
  @Prop() status: Status;
  @Prop() path: Path;
  @Prop() handler: (x: HandlerArg) => any;
  @Prop() isRoot: boolean;
  @Prop() isContainer: boolean;
  @Prop() value: Content
  render(h): VNode {
    return h(
      "div",
      {
        'class': {
          NxTreeEditMode: true
        },
        ref: "w"
      },
      [this.isContainer ? h('fakeSlot', [this.$slots.default]) : this.$slots.default]
    );
  }
}
</script>
<style lang="stylus">
.NxTreeEditMode
    display   flex
    flex-flow column nowrap
    margin-left 2em
</style>
