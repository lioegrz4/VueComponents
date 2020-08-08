<template>
    <div style="display: flex">
        <input type="checkbox" v-model="NxEditable"/>
        <Nx :payload="NxValue" :editable="NxEditable"></Nx>
        <NxDock v-if="NxEditable" style="padding: 0.5em;"></NxDock>
    </div>
</template>
<script>
import NxData    from "./components/nx/example"

export default {
    data(){
        return {
            NxValue = NxData,
            NxEditable = true
        }
    }
}
</script>
