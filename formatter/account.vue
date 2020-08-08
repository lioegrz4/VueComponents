<template>
  <div>
    <div>
      可用资金：{{available}} 元
    </div>
    <div>
      冻结资金：{{freeze}} 元
    </div>
    <div>
      消费积分：{{points}} 点
    </div>
  </div>
</template>
<script>
  export default {
    name: 'formatterAccount',
    props: ['available', 'freeze', 'points']
  }
</script>
