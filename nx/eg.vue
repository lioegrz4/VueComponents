<template>
    <div style="display: flex">
        <input type="checkbox" v-model="NxEditable"/>
        <Nx :value="NxValue" :editable="NxEditable"></Nx>
        <NxDock v-if="NxEditable" style="padding: 0.5em;"></NxDock>
    </div>
</template>
<script>
import Nx from "./index.vue";
import NxDock from "./dock.vue";

export default {
  name: "nxEG",
  components: { Nx, NxDock },
  data() {
    return {
      NxValue: NxData,
      NxEditable: true
    };
  }
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
