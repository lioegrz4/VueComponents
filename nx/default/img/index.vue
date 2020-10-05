<template lang="pug">
  img.img(:src="value")
</template>
<script>
export default {
  props: ["value"],
  name: "img"
};
</script>
<style lang="stylus" scoped>
</style>
