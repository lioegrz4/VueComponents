<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { Text, iText, Cursor } from "./types";
import { fromJS, List, Map, Record } from "immutable";

@Component
export default class Tx extends Vue {
  @Prop() value: Text;
  @Prop() editable: boolean;
  history: Array<iText> = [fromJS(this.value)];
  cursor: Cursor = [0, 0, 0];
  get _v(): iText {
    return _.last(this.history);
  }
  set _v(v) {
    this.history.push(v);
  }
  getValue() {
    return this._v.toJS();
  }
  render(h: CreateElement): VNode {
    return h(
      "div",
      {
        class: ["tx-container"],
        on: {
          click(ev) {
            console.log(ev);
          },
          keyup: (ev) => {
            // 如果触发事件的元素不是事件绑定的元素
            // 则返回
            if (ev.target !== ev.currentTarget) return;
            // 如果按下去的不是 enter 键或者
            // 没有同时按下 shift 键
            // 则返回
            if (!ev.shiftKey || ev.keyCode !== 13) return;
            // 阻止 事件冒泡
            ev.stopPropagation();
            // 阻止该元素默认的 keyup 事件
            ev.preventDefault();
            console.log(ev);
          }
        }
      },
      this._v
        .map(x =>
          h(
            "div",
            { class: ["tx-line"] },
            x!
              .map(y =>
                h(
                  "div",
                  { class: ["tx-span"] },
                  {
                    string: [y],
                    object: []
                  }[typeof y]
                )
              )
              .toJS()
          )
        )
        .toJS()
    );
  }
}
</script>
<style>
.tx-container {
  display: flex;
  flex-flow: column nowrap;
  flex: 1 1 100%;
  justify-content: flex-start;
  align-items: stretch;
}
.tx-line {
  display: flex;
  flex-flow: row wrap;
  flex: 0 0 auto;
  justify-content: flex-start;
  align-items: baseline;
}
.tx-span {
  display: flex;
  flex-flow: column;
}
</style>

