<template lang="pug">
    .linear-container
        slot
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import ExVue from "vue";

@Component
export default class LinearContainer extends ExVue {
}
</script>
<style>
.linear-container {
  display: flex;
  flex-flow: column nowrap;
}
</style>
