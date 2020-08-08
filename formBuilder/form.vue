<template>
  <el-form ref="model"
           :model="model"
           :rules="rules"
           :inline="inline"
           :label-position="labelPosition"
           :label-width="width"
           :class="defaults.clz">
    <slot name="header"></slot>
    <x-form-item v-for="(i, idx) in schema"
                 @input="onInput"
                 :value="model"
                 :inline="inline"
                 :info="info"
                 :key="idx"
                 :def="i"
                 :idx="idx">
    </x-form-item>
    <slot></slot>
    <el-form-item v-if="!thin">
      <el-button type="primary" @click="submitForm('model')">{{ defaults.sText }}</el-button>
      <el-button @click="resetForm('model')">{{ defaults.rText }}</el-button>
    </el-form-item>
    <slot name="footer"></slot>
  </el-form>
</template>
<script>
  import {treeEach} from '@u/tree'
  import {debounce} from 'lodash'
  import xFormItem from '@c/formItem.vue'
  const l = $ll('@c/form.vue')
  export default {
    name: 'xForm',
    components: {xFormItem},
    props: [ 'def'   , 'value'     , 'thin'
           , 'clazz' , 'width'     , 'labelPosition'
           , 'inline', 'submitText', 'resetText'
           , 'payload'
           ],
    data() {
      return {
        defaults: {
          clz: this.clazz || ['xRuleForm', 'el-col', 'el-col-6', 'el-col-offset-3'],
          sText: this.submitText || '提交',
          rText: this.resetText || '重置',
        },
        schema: this.def,
        info: this.value || {},
        model: {},
        rules: {},
      }
    },
    created(){
      this.schema.forEach(x => {
        treeEach(x, i => {
          if (i.prop) {
            if (i.type === 'formatter') {
              this.$set(this.info, i.prop, i.payload)
            } else {
              this.$set(this.model, i.prop, i.value)
            }
          }
        })
      })
      this.schema.forEach(x => {
        treeEach(x, i => {
          if (i.prop) {
            this.rules[i.prop] = i.valid
          }
        })
      })
      this.$watch('model', this.onChange, {deep: true})
    },
    methods: {
      onInput({prop, value}){
        this.model[prop] = value
      },
      onChange: debounce(function (newVal, oldVal){
        if (this.thin) {
          this.$emit('change', newVal)
        }
      }, 300) ,
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.model)
          } else {
            this.$emit('invalid')
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  .xRuleForm{
    width: 43.5em;
  }
  .xRuleForm .el-form-item {
    margin-bottom: 1.5em;
  }
</style>
