<template>
  <div class="logo">
    {{value}}
  </div>
</template>
<script>
export default {
  props: ["value"],
  name: "logo"
};
</script>
<style scoped>
.logo {
  border: none;
  margin: 0;
  height: 50px;
  line-height: 50px;
  min-width: 95px;
}
</style>