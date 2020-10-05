<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { manifest, Manifest, Content } from "../manifest";
import { HandlerArg, Path, Status } from "../types";

const editorBar = (h: CreateElement, self) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        position: "absolute",
        padding: "0.5em",
        right: 0,
        backgroundColor: "orange",
        color: "white",
        borderBottomLeftRadius: "6px"
      }
    },
    ["修改", "删除"].map(x => {
      return h(
        "button",
        {
          style: {
            padding: "0.2em",
            margin: "0"
          },
          on: {
            click(ev) {
              self.handler({
                type: x,
                path: self.path,
                payload: {
                  target: self.$refs.w as Element
                }
              });
            }
          }
        },
        [x]
      );
    })
  );
};

const colorize = v =>
  [[200, 0, 0], [0, 200, 0], [0, 0, 200]][(v * 4) % 3].join(",");
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
export default class NxStructuralEditMode extends Vue {
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
          NxStructuralEditMode: true,
          active: this.active
        },
        style: {
          border: this.active
            ? `4px ${this.borderStyle} orange`
            : `4px ${this.borderStyle} rgba(${colorize(this.path.length)},0.5)`,
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
      [this.$slots.default, this.active && !this.isRoot && editorBar(h, this)]
    );
  }
}
</script>
<style lang="stylus">
.NxStructuralEditMode
  display   flex
  flex      1 0 auto
  position  relative
</style>
