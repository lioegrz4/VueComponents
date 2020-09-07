<template lang="pug">
    .common-container
        slot
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import ExVue from "vue";

@Component
export default class Container extends ExVue {
  @Prop() x;
  @Prop() y;
  @Prop() z;
}
</script>
<style>
.common-container {
  display: flex;
  flex-flow: column nowrap;
}
</style>