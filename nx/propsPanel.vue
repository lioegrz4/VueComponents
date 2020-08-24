<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { manifest, Manifest, Content, getProps } from "./manifest";
import { HandlerArg, Path, Status } from "./types";

@Component
export default class NxPropsPanel extends Vue {
  manifest: { [k in string]: Manifest } = manifest;
  render(h: CreateElement): VNode {
      return h('div')
  }
}
</script>
<style>

</style>