<template>
  <div :style='x'>
    <div>
      {{name}}
    </div>
    <div :style="sep"></div>
    <div>
      成长值：{{score}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'formatterMemberLevel',
    props: ['name', 'score'],
    data(){
      return {
        x: {
          display: 'flex',
          flexFlow: 'column',
          flex: '1 0 auto',
          justifyContent: 'space-between',
        },
        sep: {
          borderBottom: 'rgb(223, 227, 236) 1px solid',
          flex: '1 0 auto'
        }
      }
    }
  }
</script>
