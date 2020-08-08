<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";

import { manifest, Content } from "./manifest";
import editorWrapper from "./editorWrapper.vue";

@Component
export default class Nx extends Vue {
  @Prop() payload: Content;
  @Prop() path: Array<string | number> | undefined;
  @Prop() recursion: boolean;
  @Prop() editable: boolean;
  manifest = manifest;
  data = this.editable && !this.path ? _.cloneDeep(this.payload) : this.payload
  render(h: CreateElement): VNode {
    let comp = manifest[this.data.type].component;
    let attrs = {
      recursion: this.recursion,
      editable: this.editable
    };
    let children =
      this.data.children &&
      this.data.children.map((x, ix) => {
        return h("Nx", {
          props: {
            payload: x,
            path: this.path
              ? this.path.concat(["children", ix])
              : ["children", ix],
            ...attrs
          }
        });
      });
    let self = h(
      comp,
      {
        props: { value: this.data.value, ...attrs }
      },
      children
    );
    return this.editable
      ? h(
          editorWrapper,
          {
            props: { path: this.path }
          },
          [self]
        )
      : self;
  }
}
</script>
