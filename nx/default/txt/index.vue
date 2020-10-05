<template lang="pug">
span {{value}}
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
<style lang="stylus">
</style>
