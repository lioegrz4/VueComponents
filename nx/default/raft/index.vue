<template lang="pug">
    .raft-container
        slot
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import ExVue from "vue";

@Component
export default class Raft extends ExVue {
  @Prop() value;
}
</script>
<style>
.raft-container > * {
  transition: all 1s ease;
}
.raft-container > *:hover {
  transform: translateX(10%);
}
</style>