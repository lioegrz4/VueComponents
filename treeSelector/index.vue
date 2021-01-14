<template lang="pug">
.f.v(v-if="value")
    .f.h.io.box.shadow
        label.form-checkbox
            input(type="checkbox" :indeterminate.prop="value.status===3" v-bind="{checked: value.status===2}"
                 @input="onSelect(value.status, $event)")
            i.form-icon
            slot(v-bind="value")
    .f.v(v-for="(v, k) in value.children")
        treeSelector.mg(:value="v" :path="[...path, 'children', k]" @input="onInput" :agg="agg")
            template(slot-scope="x")
                slot(v-bind="x")
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { namespace, Getter, Action } from "vuex-class";
import _ from "lodash/fp";

@Component({
  name: "treeSelector"
})
export default class extends Vue {
  @Prop() value;
  @Prop({ default() { return [] } }) path;
  @Prop() agg
  /* status 使用二元组 (有选中，有未选) 表示
    则可能状态如下：
        全选 (t, f) 2
        半选 (t, t) 3
        未选 (f, t) 1
        非法/初始 (f, f) 0
    一组状态的总体状态`按位或`即可
        全为2或1时，结果不变；有其它任何值，结果为3
    点选时：
        全选 切换为 未选
        其它 切换为 全选
    即：
        state === 2 ? 1 : 2
    */
  get leaf() {
      return !this.value.children || this.value.children.length === 0;
  }
  onSelect(v, ev) {
    let status = v === 2 ? 1 : 2;
    this.value.status = status;
    this.flushChildren(status, this.value);
    this.$emit("input", { path: this.path, status, leaf: this.leaf });
  }
  refreshAggregation(v, c) {
      if (typeof this.agg !== 'function') return
      let leaf = !v.children || v.children.length === 0
      this.$set(v, '_aggregation', this.agg(leaf, v, c))
  }
  onInput({ path, status: s, leaf }) {
    // 向上传递，当前节点必然不是 leaf，
    let status = this.value.children.reduce((acc, x) => acc | x.status, 0);
    this.value.status = status;
    if (typeof this.agg==='function') this.$set(this.value, '_aggregation', this.agg(false, this.value))
    this.$emit("input", { path, leaf, status });
  }
  flushChildren(s, v) {
    v.children.forEach(x => {
      if ((s | x.status) !== s) {
        x.status = s;
        this.flushChildren(s, x);
      }
    });
    this.refreshAggregation(v, s===2)
  }
}
</script>
<style lang="stylus" scoped>
.mg {
    margin: 0.2em 0em 0.2em 2em;
}
</style>