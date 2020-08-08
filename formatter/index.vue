<script>
  import components from './manifest.yml'

  const l = $ll('@c/formatter/index.vue')
  export default {
    name: "formatter",
    beforeCreate(){
      for (let i of components) {
        this.$options.components[i] = require(`./${i}.vue`)
      }
    },
    props: ['value', 'format'],
    data: () => ({}),
    methods: {},
    render(h){
      let props = typeof this.value === 'object' ? this.value : {value: this.value}
      return h(this.$options.components[this.format], {props})
    },
  }

</script>
