<template lang="pug">
.f.v
    .f.h.io.box.shadow
        checkbox(@input="onSelect(value.status)")
        .f {{value.status}}
        .f {{value.name}}
    .f.v(v-for="(v, k) in value.children")
        treeSelect.mg(:value="v" :path="[...path, 'children', k]"
                      @input="onInput"
                     )
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch }   from "vue-property-decorator"
import { namespace, Getter, Action }           from 'vuex-class'
import _                                       from "lodash/fp"

@Component({
    name: "treeSelector",
})
export default class extends Vue {
    @Prop() value
    @Prop({default(){return []}}) path
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
    //@Prop({default(){return 0}}) status
    onSelect(v){
        let status = v===2 ? 1 : 2
        this.value.status = status
        let leaf = !this.value.children || this.value.children.length === 0
        if (!leaf) this.flushChildren(status, this.value)
        this.$emit('input', {path: this.path, status, leaf} )
    }
    onInput({path, status: s, leaf}){
        let status = leaf ? s : this.value.children.reduce((acc,x)=> acc | x.status, 0)
        this.value.status = status
        this.$emit('input', { path, leaf, status })
    }
    flushChildren(s, v){ // s : 1|2
        v.children.forEach(x => {
            if ((s | x.status) !== s) {
                x.status = s
                this.flushChildren(s, x)
            }
        })
    }
}
</script>
<style lang="stylus" scoped>
.mg
    margin 0.2em 0em 0.2em 2em
</style>