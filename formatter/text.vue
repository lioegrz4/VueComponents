<template>
  <span>
    {{value}}
  </span>
</template>
<script>
  const l = $ll('@c/formatter/text.vue')
  export default {
    name: 'textFormatter',
    props: ['value'],
  }
</script>
