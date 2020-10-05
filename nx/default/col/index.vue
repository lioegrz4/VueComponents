<template lang="pug">
    .column-container
        slot
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";

@Component
export default class ColumnContainer extends Vue {
}
</script>
<style lang="stylus">
.column-container
  display   flex
  flex-flow column nowrap
  flex      1 0 auto
</style>
