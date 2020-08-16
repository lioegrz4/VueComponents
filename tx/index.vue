<script lang=ts>
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { Text, iText, Cursor } from "./types";
import { fromJS, List, Map, Record } from "immutable";
import keyToInstruction from "./keymap";
import execInstruction from "./instruction";

@Component
export default class Tx extends Vue {
  @Prop() value: Text;
  @Prop() editable: boolean;
  cursor: Cursor = [0, 0, 0];

  history: Array<iText> = [fromJS(this.value)];
  get _v(): iText {
    return _.last(this.history);
  }
  set _v(v) {
    this.history.push(v);
  }
  getValue() {
    return this._v.toJS();
  }

  keysSequences = new Array();
  @Watch("keysSequences")
  ksChange(val, oldVal) {
    if (val.length === 0) return
    let instruction = keyToInstruction(val);
    execInstruction({
      instruction,
      cursor: this.cursor,
      value: this._v,
      history: this.history
    });
    if (instruction[0] !== 'waiting') this.keysSequences = new Array()
  }

  render(h: CreateElement): VNode {
    let self = this;
    return h(
      "div",
      {
        class: ["tx-container"],
        domProps: {
          contentEditable: true
          //tabIndex: 0
        },
        on: {
          click(ev) {
            //self.$el.focus();
          },
          keyup: ev => {
            // 如果触发事件的元素不是事件绑定的元素
            if (ev.target !== ev.currentTarget) return;
            ev.stopPropagation();
            ev.preventDefault();
            // let {shiftKey, metaKey, ctrlKey, altKey, key, keyCode} = ev
            this.keysSequences.push(ev);
          },
          input: ev => {
            console.log('input', ev.data)
            //debugger
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

