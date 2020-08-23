<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";
import { manifest, Manifest, Content, getProps } from "./manifest";
import { HandlerArg, Path, Status } from "./types";

@Component
export default class NxEditorDock extends Vue {
  manifest: { [k in string]: Manifest } = manifest;
  render(h: CreateElement): VNode {
    return h(
      "div",
      {
        style: { display: "flex", flexFlow: "column nowrap" }
      },
      _.keys(this.manifest).map(x =>
        h(
          "div",
          {
            style: { display: "flex", fontSize: "2em" },
            domProps: {
              draggable: true
            },
            on: {
              dragstart: ev => {
                ev.stopPropagation();
                ev.dataTransfer.setData(
                  "text/json",
                  JSON.stringify({
                    id: "dock",
                    kind: x
                  }) ); }} },
          [
            x,
            h(
              "span",
              {
                style: { fontSize: "1em", color: "grey", padding: "0.3em" }
              },
              ["[", _.keys(getProps(x)).join(","), "]"]
            ) ] ) ) ); }
}
</script>
<style>

</style>