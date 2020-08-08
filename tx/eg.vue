<template>
    <div>
        <input type="checkbox" v-model="editable"/>
        <tx :value="text" :editable="editable"></tx>
    </div>
</template>

<template>
  <Tx :value="text"></Tx>
</template>
<script lang=ts>
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { VNode, CreateElement } from "vue/types";
import _ from "lodash";

import Tx from './index.vue'
import { Text } from './types'


@Component({
    components: { Tx }
})
export default class TxEG extends Vue {
    text: Text = [
        ['a', 'b', 'c', {}, 'asdfkljlkjlsajd flksdja flkasdjf lksajf klsadjf lksadjf klsdjf sdkaljf skldafj sdklafj sdklafj sdklf'],
        ['d', {}, 'e', 'f', 'asdfjklsadjfklsjdaklfjlskakljasdkjflkasdjfkljasdklfjklsadjfklsdjfj'],
        [],
    ]
    editable: boolean = true
}
</script>
