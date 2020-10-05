<template>
  <div class="schema-editor-item" :style="styleHintLine">

    <div v-if="display"
         class="schema-editor-item-header">
      <!-- 展开状态图标 -->
      <div :style="styleHeaderHint">{{styleFoldHint}}</div>

      <div style="display: flex; flex-flow: column">
        <div class="schema-editor-item-desc">
          <!-- 标题 -->
          <span>{{value.title}}</span>
          <!-- 描述，悬停标题可见 -->
          <span class="tip">{{value.description}}</span>
        </div>

        <div style="display: flex; flex-flow: row">
          <!-- 切换展开状态 -->
          <button :style="styleHeaderTag"
                  @click="foldState = !foldState">{{prop}}
          </button>
          <!-- 详情 -->
          <button :style="styleHeaderMore"
                  @click="$emit('cmd', ({type: 'focus', payload: path}))">...
          </button>
          <!-- 增加子节点 -->
          <insert-item v-if="!isTerminal" v-bind="{path}" @cmd="passCmd">
          </insert-item>
          <!-- 删除节点 -->
          <button @click="$emit('cmd', {type:'delete', payload: path})">x</button>
        </div>
      </div>
    </div>

    <!-- 递归显示下一级 -->
    <template v-if="foldState && hasChild">
      <schema-editor-item v-for="(v, k) in value"
                          :path="[...path, k]"
                          :schema="schema"
                          :value="v"
                          @cmd="passCmd"
                          :terminated="isTerminal"
                          :excluded="isExclude"
                          :parentType="itemType"
                          :parentTreeType="treeType"
                          :expandDefault="expandDefault"
                          :key="k">
      </schema-editor-item>
    </template>


  </div>
</template>
<script>
  import { get } from 'lodash/fp'
  import insertItem from './insertItem.vue'

  /*
   treeType
   | 0 none
   | 1 object
   | 2 array
   */
  let colorPreset = ['#b3f6d8',
                     '#acebf6',
                     '#b0bbf6',
                     '#f1c8f6',
                     '#f6c1c1']
  export default {
    name    : 'SchemaEditorItem',
    components: {insertItem},
    props   : ['schema', 'value', 'path',
               'expand', 'expandDefault',
               'parentType', 'parentTreeType', 'typeInference',
               'terminated', 'excluded'],
    data () {
      let hintColor = colorPreset[this.path.length % colorPreset.length]
      return {
        hintColor,
        foldState      : this.expand || this.expandDefault,
        styleHintLine  : {
          borderLeft: `dotted 1px ${hintColor}`
        },
        styleHeaderHint: {
          fontFamily: 'monospace',
          color     : hintColor
        }
      }
    },
    computed: {
      styleHeaderTag () {
        return this.typeSchema.style || {}
      },
      styleHeaderMore () {
        return {
          color: this.isTerminal ? 'blue' : 'lightgrey'
        }
      },
      styleFoldHint () {
        let c = this.isTerminal
          && ( !this.typeSchema.exclude
            || this.typeSchema.exclude.length === 0)
        if (c) {
          return '─'
        } else {
          if (this.foldState) {
            return '┼'
          } else {
            return '═'
          }
        }
      },
      prop () {
        if (this.parentTreeType === 2) {
          return this.typeSchema && this.value[this.typeSchema.tag]
        }
        return this.path[this.path.length - 1]
      },
      treeType () {
        if (typeof this.value !== 'object') return 0
        if (Array.isArray(this.value)) return 2
        return 1
      },
      itemType () {
        // return this.value.type || this.parentType || 'default'
        let inferT
        if (typeof this.typeInference === 'function') {
          inferT = this.typeInference({value: this.value, type: this.value.type, parentType: this.parentType})
        }
        return inferT || this.value.type || 'default'
      },
      typeSchema () {
        return this.schema.types[this.itemType] || {}
      },
      isTerminal () {
        return this.typeSchema && this.typeSchema.terminal
      },
      isExclude () {
        return this.typeSchema
          && this.typeSchema.exclude
          && this.typeSchema.exclude.indexOf(this.prop) >= 0
      },
      display () {
        // 父级是终结类型，当前级(子级)不显示
        if (this.terminated) {
          return this.isExclude
        } else {
          return !this.isExclude
        }
      },
      hasChild () {
        return this.treeType > 0 && this.display
      }
    },
    methods : {
      passCmd (v) {
        this.$emit('cmd', v)
      }
    },
    created () {
    }
  }
</script>
<style>
  .schema-editor-item {
    display: flex;
    flex-flow: column nowrap;
    margin-left: 2em;
  }

  .schema-editor-item-header {
    display: flex;
    align-items: center;
  }

  .schema-editor-item-desc {
    position: relative;
    color: gray;
    font-size: .5em;
  }

  .schema-editor-item-desc > .tip {
    position: absolute;
    display: none;
    color: whitesmoke;
    background-color: rgba(0, 0, 0, .8);
    border-radius: 5px;
    padding: 5px;
    transition: all 1s ease 0s;
  }

  .schema-editor-item-desc:hover > .tip {
    display: flex;
  }
</style>
