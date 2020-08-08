<template>
  <div style="display: flex; flex-grow: 1; flex-flow: column; justify-content: space-between">
    <div style="display: flex; flex-flow: row; justify-content: space-between">
      <img src="/static/img/logo2.1e48f8a.png" height="52" width="78">
      <div style="border-left: solid 1px rgb(223, 227, 236)"></div>
      苹果店长 （真实姓名：{{name}}）
    </div>
    <div style="border-bottom: solid 1px rgb(223, 227, 236)"></div>
    <div>
      注册日期：{{date}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'formatterMemberInfo',
    props: ['name', 'date']
  }
</script>
