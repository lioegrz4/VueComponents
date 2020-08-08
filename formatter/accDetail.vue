<template>
  <div class="acc-detail">
    <div v-for="i in Object.keys(prop)">
      <div class="acc-detail title">{{prop[i]}}</div>
      <span class="acc-detail emphasis">{{$props[i]}}</span> 元
    </div>
  </div>
</template>
<script>
  const l = $ll('@c/formatter/accDetail.vue')
  export default {
    name: 'formatterAccDetail',
    props: ['avail', 'unavail', 'freeze', 'income', 'exhd'],
    data: () => ({
      prop: {
        avail : '账户可提现资金',
        unavail : '账户不可提现资金',
        freeze: '账户冻结资金',
        income: '账户收入累计资金',
        exhd: '账户支出累计资金',
      }
    }),
  }
</script>
<style scoped>
  .acc-detail {
    display: flex;
    background-color: #e7e7e7;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    padding: .3em;
    border-radius: 5px;
  }

  .acc-detail.title {
    color: grey;
    font-size: 1.2em;
  }

  .acc-detail.emphasis {
    display: inline-flex;
    color: red;
  }

</style>
