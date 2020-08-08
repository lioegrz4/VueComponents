<template>
    <div style="display: flex">
        <input type="checkbox" v-model="NxEditable"/>
        <Nx :payload="NxValue" :editable="NxEditable"></Nx>
        <NxDock v-if="NxEditable" style="padding: 0.5em;"></NxDock>
    </div>
</template>
<script>
import Nx from "./index.vue";
import NxDock from "./dock.vue";

export default {
  name: "nxText",
  components: { Nx, NxDock },
  data() {
    return {
      NxValue: NxData,
      NxEditable: true
    };
  }
};

const NxData = {
  type: "container",
  props: {
    x: 123
  },
  children: [{
      type: "container",
      props: {
        y: 456
      },
      children: [{
        type: "logo",
        props: {
          value: 789
        }
      }]
    },
    {
      type: "container",
      props: {
        z: 111
      },
      children: [{
        type: "logo",
        props: {
          value: 111
        }
      }]
    }
  ]
}

</script>
