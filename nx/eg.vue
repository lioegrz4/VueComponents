<template lang="pug">
    .nx-editor
        div
            select(v-model="NxEditMode" style="align-self: flex-start")
                option(v-for="i in ['none', 'structural', 'linear', 'tree']" :key="i") {{i}}
            button(@click="history.pop()") undo
        div
            Nx(v-model="NxValue" :editMode="NxEditMode")
            NxPropsPanel
            NxDock(v-if="NxEditMode==='structural'" style="padding: 0.5em;")
        div: div(v-for="(i, ix) in history" :key="ix"
                 @click="history.push(i)"
                ) {{i.time}}
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import _ from "lodash/fp";
import { fromJS, List, Map, Record } from "immutable";
import Vue from "vue";
import Nx from "./index.vue";
import NxDock from "./dock.vue";
import NxPropsPanel from "./propsPanel.vue";

@Component({
  components: { Nx, NxDock, NxPropsPanel }
})
export default class NxEG extends Vue {
  history: Array<any> = [
    {
      time: new Date(),
      value: fromJS(NxData)
    }
  ];
  historyLength: number = 10;
  get NxValue() {
    return _(this.history).last().value.toJS();
  }
  set NxValue(v) {
    if (this.history.length >= this.historyLength) this.history.shift();
    console.log(this.history);
    this.history.push({
      time: new Date(),
      value: fromJS(v)
    });
  }
  NxEditMode: string = "structural";
  log = console.log.bind(console);
}

const NxData = {
  kind: "col",
  children: [
    {
      kind: "row",
      children: [
        {
          kind: "txt",
          props: {
            value: 789
          }
        }
      ]
    },
    {
      kind: "row",
      children: [
        {
          kind: "txt",
          props: {
            value: 111
          }
        },
        {
          kind: "img",
          props: {
            value: 'https://www.haskell.org/static/img/haskell-logo.svg?etag=ukf3Fg7-'
          }
        },
        {
          kind: "txt",
          props: {
            value: "asdf"
          }
        }
      ]
    },
    {
      kind: 'row',
      children: [
        {
          kind: 'txt',
          props: {
            value: '1'
          }
        },
        {
          kind: 'txt',
          props: {
            value: '2'
          }
        },
        {
          kind: 'txt',
          props: {
            value: '3'
          }
        },
        {
          kind: 'txt',
          props: {
            value: '4'
          }
        }
      ]
    }
  ]
};
</script>
<style>
.nx-editor {
  display: flex;
  flex-flow: column nowrap;
}
.nx-editor > * {
  display: flex;
}
</style>

