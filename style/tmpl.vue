<template lang="pug">

</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch }   from "vue-property-decorator"
import { namespace, Getter, Action }           from 'vuex-class'
import _                                       from "lodash/fp"

@Component({
    name: "",
})
export default class extends Vue {
    @Prop() value
    @Emit() input(v) {
        return v
    }
}
</script>
<style lang="stylus" scoped>

</style>