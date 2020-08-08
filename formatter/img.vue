<template>
  <img :src="value"/>
</template>
<script>
  const l = $ll('@c/formatter/img.vue')
  export default {
    name: 'imgFormatter',
    props: ['value'],
  }
</script>
