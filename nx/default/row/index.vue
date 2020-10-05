<template lang="pug">
    .common-container
        slot
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";

@Component
export default class RowContainer extends Vue {
}
</script>
<style lang="stylus">
.common-container
    display   flex
    flex-flow row wrap
</style>
