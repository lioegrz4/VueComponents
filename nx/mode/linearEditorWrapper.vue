<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { manifest, Manifest, Content } from "../manifest";
import { HandlerArg, Path, Status } from "../types";

const getPos = ({ offsetX: x, offsetY: y }, { height, width }) => {
  return {
    left: x < width / 2,
    top: y < height / 2,
    center: {
      h: x < width * 2 / 3 && x > width / 3,
      v: y < height * 2 / 3 && y > height / 3
    }
  };
};

@Component
export default class NxLinearEditorWrapper extends Vue {
  @Prop() status: Status;
  @Prop() path: Path;
  @Prop() handler: (x: HandlerArg) => any;
  @Prop() isRoot: boolean;
  @Prop() isContainer: boolean;
  @Prop() value: Content
  readyForDrop: boolean = false;
  get active(): boolean {
    return _.isEqual(this.path, _(this.status.currentPath).last());
  }
  get borderStyle() {
    return this.readyForDrop ? "dashed" : "solid";
  }
  render(h): VNode {
    return h(
      "div",
      {
        class: {
          NxLinearEditorWrapper: true,
          active: this.active
        },
        style: {
          minHeight: this.isRoot && "100px"
        },
        domProps: {
          draggable: true
        },
        on: {
          mouseenter: ev => {
            this.handler({
              type: "mouseenter",
              path: this.path,
              payload: {
                target: this.$refs.w as Element
              }
            });
          },
          mouseleave: ev => {
            this.handler({
              type: "mouseleave",
              path: this.path,
              payload: {
                target: this.$refs.w as Element
              }
            });
          },
          dragstart: ev => {
            ev.stopPropagation();
            ev.dataTransfer.setData(
              "text/json",
              JSON.stringify({ id: "main", path: this.path })
            );
          },
          dragleave: ev => {
            ev.preventDefault();
            this.readyForDrop = false;
          },
          dragover: ev => {
            ev.preventDefault();
            if (this.isContainer) {
              ev.stopPropagation();
              this.readyForDrop = true;
            }
          },
          drop: ev => {
            if (this.isContainer) {
              ev.stopPropagation();
              let data = ev.dataTransfer.getData("text/json");
              this.readyForDrop = false;
              this.handler({
                type: "drop",
                path: this.path,
                payload: {
                  ...JSON.parse(data),
                  pos: getPos(ev, this.$el.getBoundingClientRect())
                }
              });
            }
          }
        },
        ref: "w"
      },
      [ this.$slots.default ]
    );
  }
}
</script>
<style>
.NxLinearEditorWrapper {
  display: flex;
  position: relative;
}
</style>
