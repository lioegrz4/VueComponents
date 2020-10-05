<template>
  <div>
    <editor v-model="formDef" :schema="schema"></editor>
  </div>
</template>
<script>
  import { formSchema, tableSchema } from '@c/schemaBuilder.js'
  import editor from '../../index.vue'
  let formDef = formSchema(form => {

    form.dynamic('dy').label('动态列表')
        .columns(x => {
          x.input('name').col({span: 5})
          x.switch('gender').label('性别').col({span: 5})
           .options({
                      onText   : '男'
                      , offText: '女'
                    })
          x.datePacker('birthday').col({span: 8})
        })
        .value([
                 {name: '张三', gender: false, birthday: 'Thu Jun 15 2017 00:00:00 GMT+0000 (UTC)'},
                 {name: '李四', gender: true, birthday: 'Thu Jun 15 2017 00:00:00 GMT+0000 (UTC)'},
                 {name: '王五', gender: true, birthday: 'Thu Jun 15 2017 00:00:00 GMT+0000 (UTC)'},
               ])

    form.input('name').label('活动名称').value('你猜')
        .hint('LOREM_IPSUM.text')
        .valid({required: true, message: '请输入活动名称', trigger: 'blur'}
          , {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        )

    form.imgUpload('logo').label('上传图片')
        .target('system.setting.site.upload')
        .attrs({
                 module : 'backend'
                 , btype: 'system'
               })

    form.select('region').label('活动区域')
        .placeholder('请选择活动区域')
        .value('beijing')
        .options({
                   label  : '区域一'
                   , value: 'shanghai'
                 }
          , {
                   label  : '区域二'
                   , value: 'beijing'
                 }
        )
        .valid({
                 required : true
                 , message: '请选择活动区域'
                 , trigger: 'change'
               })

    form.row().label('活动时间').required(true)
        .children(col => {
          col.datePacker('date1').col({span: 11})
             .attrs({
                      type         : 'date'
                      , plackholder: '选个日期'
                      , style      : 'width: 50%'
                    })
             .value('Thu Jun 15 2017 00:00:00 GMT+0000 (UTC)')
             .valid({
                      type      : 'date'
                      , required: true
                      , message : '请选择日期'
                      , trigger : 'change'
                    })
          col.separator().col({span: 2, 'class': 'line'})
          col.timePacker('date2').col({span: 11})
             .attrs({
                      type         : 'fixed-time'
                      , placeholder: '选择时间'
                      , style      : "width: 100%;"
                    })
             .value('2017-06-22T22:33:00.000Z')
             .valid({
                      type      : 'date'
                      , required: true
                      , message : '请选择时间'
                      , trigger : 'change'
                    })
        })

    form.switch('delivery').label('即时配送').value(true)
        .options({
                   onText   : '是'
                   , offText: '否'
                 })

    form.tags('tags').label('属性').value(['甲', '乙', '丙', '丁'])

    form.checkbox('type').label('活动性质')
        .value([])
        .options({
                   label : '美食/餐厅线上活动'
                   , name: 'type'
                 }
          , {
                   label : '地推活动'
                   , name: 'type'
                 }
          , {
                   name   : 'type'
                   , label: '线下主题活动'
                 }
          , {
                   name   : 'type'
                   , label: '单纯品牌曝光'
                 }
        )
        .valid({
                 type      : 'array'
                 , required: true
                 , message : '请至少选择一个活动性质'
                 , trigger : 'change'
               })

    form.radio('resource').label('特殊资源')
        .options('线上品牌商赞助'
          , '线下场地免费')
        .valid({
                 required : true
                 , message: '请选择活动资源'
                 , trigger: 'change'
               })

    form.textarea('desc').label('活动形式')
        .placeholder('请输入')
        .valid({required: true, message: "请填写活动形式", trigger: "blur"})

    form.rate('rate').label('评分').value(3)
        .options("很差", "差", "还行", "好", "很好")

    form.datePacker('3').attrs({
                                 type         : 'date'
                                 , placeholder: '选择日期'
                                 , style      : "width: 100%;"
                               })
        .value('Thu Jun 15 2017 00:00:00 GMT+0000 (UTC)')
        .valid({type: "date", required: true, message: "请选择日期", trigger: "change"})
  })
  export default {
    name      : 'SrcBusinessSandboxSchemaFormIndexVue',
    components: {editor},
    data(){
      return {
        formDef,
        schema: {
          types: {
            dynamic      : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
              exclude : ['columns'],
              style   : {
                color: 'green',
              },
              properties  : {
                columns: {
                  type : 'array',
                  items: {
                    type: 'type'
                  }
                }
              }
            },
            row          : {
              type    : 'object',
              tag     : 'label',
              terminal: true,
              style   : {
                color: 'blue',
              },
              exclude : ['children'],
              properties  : {
                children: {
                  type : 'array',
                  items: {
                    type: 'type'
                  }
                }
              }
            },
            input        : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            'switch'     : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            'date-packer': {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            'time-packer': {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            select       : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            radio        : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            checkbox     : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            textarea     : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            rate         : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            tags         : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
            imgUpload    : {
              type    : 'object',
              tag     : 'prop',
              terminal: true,
            },
          }
        }
      }
    },
    computed  : {},
    methods   : {},
  }
</script>
