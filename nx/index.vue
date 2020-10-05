<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash/fp";

import { manifest, Manifest, Content } from "./manifest";
import { Status, Path, HandlerArg } from "./types";
import structuralEditorWrapper from "./mode/structuralEditorWrapper.vue";
import linearEditorWrapper from "./mode/linearEditorWrapper.vue";
import operation from "./operation";

const VERBOSE = false

@Component
export default class Nx extends Vue {
  @Prop({ default: () => new Array() })
  path: Path;
  @Prop() value: Content;
  @Prop() status: Status;
  @Prop() components: {[k:string]: Manifest} | undefined;
  @Prop() recursion: boolean;
  @Prop() editMode: "structural" | "linear" | "tree" | "none" | undefined;
  @Prop() handler: (x: HandlerArg) => any;
  get isRoot(): boolean {
    return this.path.length === 0;
  }
  get isContainer(): boolean {
    return this.manifest[this.value.kind].container;
  }
  get editorWrapper() {
    return (
      this.editMode &&
      {
        linear: linearEditorWrapper,
        structural: structuralEditorWrapper,
        none: undefined
      }[this.editMode]
    );
  }
  manifest: { [k in string]: Manifest } = {...this.components, ...manifest} ;
  status_: Status = !this.isRoot
    ? this.status
    : {
        currentPath: []
      };

  payload_: Content = this.isRoot && this.editMode // 根元素可编辑模式下复制一份数据，避免修改原始数据
    ? this.value //_.cloneDeep(this.value)
    : this.value;
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
    if (VERBOSE) console.log(type, JSON.stringify(src), this)
    if (_.includes(type)(['添加','修改','删除','drop'])) {
      this.$emit('input', this.payload_)
    }
  }
  // 根元素向下传递 wrapperHandle，非根元素接收 handler 并向下传递
  handler_ = this.isRoot ? this.wrapperHandle : this.handler;
  render(h: CreateElement): VNode {
    let self = this;
    let concreteComponent = this.manifest[this.value.kind].component;
    let attrs = {
      recursion: this.recursion,
      status: this.status_,
      handler: this.handler_
    };
    let children =
      this.value.children &&
      this.value.children.map((x, ix) => {
        return h("Nx", {
          props: {
            value: x,
            path: [...this.path, "children", ix],
            ...attrs,
            editMode: this.editMode
          }
        });
      });
    let node = h(
      concreteComponent,
      {
        props: this.value.props
      },
      children
    );
    return this.editorWrapper
      ? h(
          this.editorWrapper,
          {
            props: {
              value: this.value,
              path: this.path,
              ...attrs,
              isRoot: this.isRoot,
              isContainer: this.isContainer
            }
          },
          [node]
        )
      : node;
  }
}
</script>
