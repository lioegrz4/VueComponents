<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";

import { manifest, Manifest, Content } from "./manifest";
import { Status, Path, HandlerArg } from "./types";
import editorWrapper from "./editorWrapper.vue";
import operation from "./operation";

@Component
export default class Nx extends Vue {
  @Prop({ default: () => new Array() })
  path: Path;
  @Prop() payload: Content;
  @Prop() status: Status;
  @Prop() recursion: boolean;
  @Prop() editable: boolean;
  @Prop() handler: (x: HandlerArg) => any;
  get isRoot(): boolean {
    return this.path.length === 0;
  }
  manifest: { [k in string]: Manifest} = manifest;
  // 根元素可编辑模式下复制一份数据，避免修改原始数据
  payload_: Content = this.isRoot && this.editable
    ? _.cloneDeep(this.payload)
    : this.payload;
  // 根元素向下传递 wrapperHandle，非根元素接收 handler 并向下传递
  handler_ = this.isRoot ? this.wrapperHandle : this.handler;
  //
  status_: Status = !this.isRoot
    ? this.status
    : {
        currentPath: []
      };
  wrapperHandle(x: HandlerArg) {
    let { type, path: src, payload } = x;
    operation({
      self: this,
      data: this.payload_,
      status: this.status_,
      type,
      src,
      payload
    });
  }
  render(h: CreateElement): VNode {
    let self = this;
    let comp = this.manifest[this.payload_.type].component;
    let attrs = {
      recursion: this.recursion,
      editable: this.editable
    };
    let children =
      this.payload_.children &&
      this.payload_.children.map((x, ix) => {
        return h("Nx", {
          props: {
            payload: x,
            handler: this.handler_,
            path: [...this.path, "children", ix],
            status: this.status_,
            ...attrs
          }
        });
      });
    let node = h(
      comp,
      {
        props: { ...this.payload_.props, ...attrs }
      },
      children
    );
    return this.editable
      ? h(
          editorWrapper,
          {
            props: {
              path: this.path,
              status: this.status_,
              handler: this.handler_,
              isRoot: this.isRoot,
              isContainer: this.manifest[this.payload_.type].container
            }
          },
          [node]
        )
      : node;
  }
}
</script>
