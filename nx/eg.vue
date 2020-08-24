<template>
    <div>
        <select v-model="NxEditMode" style="align-self: flex-start">
          <option v-for="i in ['none','structural', 'linear']" :key="i">{{i}}</option>
        </select>
        <div style="display: flex">
          <Nx :value="NxValue" :editMode="NxEditMode"></Nx>
          <NxPropsPanel></NxPropsPanel>
          <NxDock v-if="NxEditMode==='structural'" style="padding: 0.5em;"></NxDock>
        </div>
    </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import Nx from "./index.vue";
import NxDock from "./dock.vue";
import NxPropsPanel from "./propsPanel.vue"

@Component({
  components: { Nx, NxDock, NxPropsPanel }
})
export default class NxEG extends Vue {
  NxValue = NxData
  NxEditMode : string = 'structural'
};

const NxData = {
  kind: "container",
  props: {
    x: 123
  },
  children: [{
      kind: "container",
      props: {
        y: 456
      },
      children: [{
        kind: "logo",
        props: {
          value: 789
        }
      }]
    },
    {
      kind: "container",
      props: {
        z: 111
      },
      children: [{
        kind: "logo",
        props: {
          value: 111
        }
      }]
    }
  ]
}
</script>
