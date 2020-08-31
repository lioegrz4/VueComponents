<script>
import _ from "lodash/fp";
let L = _.noConflict();

export default {
  name: "FlowContainer",
  props: {
    doneText: {
      default: "完成"
    },
    nextText: {
      default: "下一步"
    },
    submitMethod: {
      default: "submitUp"
    }
  },
  data() {
    let items = this.$slots.default
        .map( (x, ix) => x.tag
              ? {
                  label: L.get(["data", "attrs", "label"])(x),
                  done: false,
                  ready: false,
                  ix,
                  ...L.get(["data", "attrs"])(x)
                }
              : undefined
            )
        .filter(L.identity)
    return {
      items,
      currentTab: null,
      nextTab: null,
    };
  },
  computed: {
    todo() {
      return _.find(x => !x.done)(this.items) || {};
    },
    firstUnReady() {
      return _.find(x => !x.ready)(this.items) || {};
    },
    end() {
      return _.last(this.items)
    },
    current() {
      let ix = _.findIndex({label: this.currentTab || this.todo.label})(this.items)
      this.nextTab = this.items[ix+1] && this.items[ix+1].label
      return this.items[ix]
    }
  },
  methods: {
    onStateChange(ix, prop, v = true) {
      if (!v) this.currentTab = null
      _.find({ix})(this.items)[prop] = v
    },
    async onNext() {
      this.onStateChange(this.current.ix, "done");
      if (this.end.ix === this.current.ix) {
        let ref = this.$refs[this.end.ix].$children[0]
        let fn = ref[this.submitMethod].bind(ref)
        this.$emit('done', await fn())
      } else {
        this.currentTab = this.nextTab
      }
    },
    onTabClick(v) {
      this.currentTab = v
    }
  },
  render(h) {
    let self = this;
    return (
      <el-tabs type="border-card" class="flow-container"
               activeName={this.current.label}
               on-input={this.onTabClick} >
        {this.items.map(x => {
          let n = this.$slots.default[x.ix];
          n.componentOptions.ref = x.ix
          // 在子组件上监听事件
          if (!n.componentOptions) return;
          n.componentOptions.listeners = _.assign(
            n.componentOptions.listeners,
            {
              done(v) {
                self.onStateChange(x.ix, "ready", v);
                self.onStateChange(x.ix, "done", v);
              },
              ready(v) {
                self.onStateChange(x.ix, "ready", v);
              }
            }
          );
          return (
            <el-tab-pane key={x.ix} disabled={x.ix > this.firstUnReady.ix}
                         label={x.label} name={x.label} ref={x.ix}>
              {n}
            </el-tab-pane>
          );
        })}
        <div class="flow-action_bar">
          { this.end.label === this.currentTab
            ? <el-button disabled={!this.current.ready}
                         type="success" round
                         on-click={this.onNext} >
                {this.doneText}
              </el-button>
            : <el-button disabled={!this.current.ready}
                         type="primary" round
                         on-click={this.onNext} >
                {this.nextText}
              </el-button> }

        </div>
      </el-tabs>
    );
  }
};
</script>
<style>
.flow-container .el-tabs__content {
  position: relative;
  flex: 1 1 0;
  overflow-y: auto;
}
.flow-container .flow-action_bar {
  display: flex;
  width: 100%;
  bottom: .5rem;
  justify-content: center;
  align-items: center;
  position: absolute;
}
.el-tabs__item.is-disabled {
  color: rgb(222, 222, 222) !important;
}
</style>
