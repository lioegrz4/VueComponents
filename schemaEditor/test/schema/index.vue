<template>
  <div>
    <a ref="download" style="position: fixed">下载</a>
    <editor :value="inst"
            @input="save"
            :schema="schema">
      <template slot-scope="props">
      </template>
    </editor>
  </div>
</template>
<script>
  import editor from '@c/schemaEditor/index.vue'
  import yaml from 'js-yaml'

  export default {
    name      : 'SrcBusinessSandboxSchemaSchemaIndexVue',
    components: {editor},
    props     : [],
    data () {
      return {
        schema: {
          types   : {
            'default': {
              candidate : true,
              exclude   : ['title', 'description', 'maintainer'],
              style     : {
                color: 'grey',
              },
              type      : 'object',
              properties: {
                title      : {
                  type : 'string',
                  title: '标题',
                },
                description: {
                  type : 'string',
                  title: '描述',
                },
              },
            },
            'object': {
              candidate: true,
              terminal : true,
              exclude  : ['properties'],
              style    : {
                color: 'blue',
              },
              type      : 'object',
            },
            'string': {
              candidate: true,
              terminal : true,
              style    : {
                color: 'green',
              },
              type      : 'object',
            },
            'array': {
              candidate: true,
              terminal : true,
              style    : {
                color: 'orange',
              },
              type      : 'object',
            },
          },
        },
        inst  : {
          types: {
            'config/storage': {
              candidate: true,
              style    : {
                color: 'orange',
              },
              terminal : true,
            },
            'default'       : {
              candidate : true,
              exclude   : ['title', 'description', 'maintainer'],
              style     : {
                color: 'grey',
              },
              type      : 'object',
              properties: {
                title      : {
                  type : 'string',
                  title: '标题',
                },
                description: {
                  type : 'string',
                  title: '描述',
                },
              },
            },
            host            : {
              type      : 'object',
              candidate : true,
              style     : {
                color: 'blue',
              },
              properties: {
                value      : {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
              },
              terminal  : true,
              valid     : null,
            },
            httpMethod      : {
              type  : 'string',
              'enum': ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
            },
            url             : {type: 'string'},
            jsonType        : {type: 'object'},
            endPoint        : {
              candidate : true,
              type      : 'object',
              style     : {
                color: 'red',
              },
              terminal  : true,
              properties: {
                cache      : {
                  type : 'boolean',
                  title: '缓存',
                },
                title      : {
                  type : 'string',
                  title: '标题',
                },
                description: {
                  type : 'string',
                  title: '描述',
                },
                maintainer : {
                  title   : '维护者',
                  type    : 'string',
                  'enum'  : ['杨旗', '李宁', '王虎', '王成磊'],
                  required: true,
                },
                req        : {
                  title     : '请求',
                  type      : 'object',
                  properties: {
                    method: {type: 'httpMethod'},
                    url   : {type: 'url'},
                  },
                },
                'in'       : {
                  title: '参数',
                  type : 'array',
                  items: {
                    type      : 'object',
                    properties: {
                      name       : {type: 'string'},
                      type       : {type: 'jsonType'},
                      require    : {type: 'boolean'},
                      'default'  : {type: 'string'},
                      description: {type: 'string'},
                    },
                  },
                },
                out        : {
                  title: '返回值',
                  type : 'enum',
                  enums: {
                    '200': {
                      type      : 'object',
                      properties: {
                        description: {type: 'string'},
                        schema     : {type: 'type'},
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
    },
    methods   : {
      save (v) {
        this.inst = v

        let a      = this.$refs.download
        let blob   = new Blob([yaml.safeDump(this.inst)], {'type': 'application/octet-stream'})
        a.href     = window.URL.createObjectURL(blob)
        a.download = 'conf.yml'
      },
    },
  }
</script>
