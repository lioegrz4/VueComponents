<template>
  <span>
    当前不可提现资金： <span style="color:red">{{amount}}</span> 元
  </span>
</template>
<script>
  export default {
    name: 'formatterAccNwd',
    props: ['amount']
  }
</script>
