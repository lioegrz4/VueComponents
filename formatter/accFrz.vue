<template>
  <span>
    当前冻结资金： <span style="color:red">{{amount}}</span> 元
  </span>
</template>
<script>
  export default {
    name: 'formatterAccFrz',
    props: ['amount']
  }
</script>
