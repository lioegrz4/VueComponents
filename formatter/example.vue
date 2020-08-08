<template>
  <span>
    formatter/example
    <div>
      {{a}}
    </div>
    {{b}}
    <div>
      {{c}}
    </div>
  </span>
</template>
<script>
  export default {
    name: 'formatter-example',
    props: ['a', 'b', 'c']
  }
</script>
