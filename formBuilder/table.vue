<script>
  const l = $ll('@c/table.vue')
  import xTableItem from '@c/tableItem.vue'
  const click2 = (actv, columnDefine, props, self, h) => {
    let v = props.row[columnDefine.prop]
    // 激活状态
    let active
      =  (columnDefine.active)                                         // 是否默认激活
      || (columnDefine.type === 'formatter')                           // 是否 formatter 组件
      || (actv.row === props.$index && actv.col === columnDefine.prop) // 是否当前选中的单元格
    let sp = () => {
      // 整理为 modelMerge 需要的格式
      let value = {[columnDefine.prop]: v}
      return h('x-table-item', {
        props: {
          def: columnDefine,
          value,
          info: value,
        },
        on: {
          input({prop, value}){
            props.row[columnDefine.prop] = value
            self.$emit('change', {
              value,
              index: props.$index,
              prop: columnDefine.prop,
              row: props.row,
            })
          }
        },
      })
    }
    return h('div', {
      on: {
        // 点击当前单元格激活
        click(x) {
          self.active = {
            row: props.$index,
            col: columnDefine.prop,
          }
        },
        // 当前单元格回车反激活
        keyup(ev) {
          ev.preventDefault()
          if(ev.keyCode === 13) {
            self.active = {
              row: null,
              col: null,
            }
          }
        }
      }
    }, [active ? sp() : v])
  }
  export default {
    name: 'xTable',
    props: ['def', 'data'],
    data(){
      return {
        active: {
          row: null,
          col: null,
        }
      }
    },
    render(h) {
      let self = this
      return h('el-table', {
          props: {
            data: this.data,
            'row-class-name': this.def.rowClassName,
            ...this.def.header
          },
          on: this.def.on
        },
        this.def.columns.map((c, ix) => {
          if (c.type === 'selection') {
            return h('el-table-column', {
              props: {
                type: 'selection',
                ...c.attrs
              }
            })
          }
          let scopedSlots = c.type && {
              default (props) {
                return click2(self.active, c, props, self, h)
              }
            }
          return h('el-table-column', {
            props: {
              prop: c.prop,
              label: c.label,
              key: ix,
              ...c.attrs,
            },
            scopedSlots,
          })
        })
      )
    }
  }
</script>
<style>
  .el-table__row > td , .el-table__row > td > div.cell{
    margin: 0;
    padding: 0;
  }
</style>
