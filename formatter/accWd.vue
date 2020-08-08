<template>
  <span>
    当前可提现资金： <span style="color:red">{{amount}}</span> 元
  </span>
</template>
<script>
  export default {
    name: 'formatterAccWd',
    props: ['amount']
  }
</script>
