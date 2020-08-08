import { modelMerge } from './utils'
import { all, k, pluck, getIn } from '@u/lambda'
const l                = $ll('@c/widget/upload.js')
export default (h, self) => {
  let prop = self.def.prop
  return h('el-upload',
           {
             props: {
               action          : '',
               'before-upload' : (file) => {
                 let cond = [
                   {
                     pred: file.size / 1024 / 1024 < 2,
                     msg : '上传头像图片大小不能超过 2MB!'
                   },
                   {
                     pred: ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) >= 0,
                     msg : '请上传jpg, png格式的图片'
                   }
                 ]
                 return all(cond, pluck('pred'), k(true),
                            i => {
                              self.$message.error(i.msg)
                              return false
                            })
               },
               'http-request'  : async ({file}) => {
                 try {
                   let data = new FormData()
                   data.append('imageFiles', file)
                   Object.keys(self.def.attrs).forEach(x => {
                     data.append(x, self.def.attrs[x])
                   })
                   let {list, message} = await getIn($req, self.def.target.split('.'))({data})
                   self.value[prop]    = list[0]['img_url']
                   self.$message({
                                   showClose: true,
                                   message,
                                   type     : 'success'
                                 })
                 } catch ({message}) {
                   self.$message({
                                   showClose: true,
                                   message,
                                   type     : 'error'
                                 })
                 }
               },
               'show-file-list': false
             },
             on   : {
               //'mouseover': self.isHover = true
             },
             style: {
               border      : `1px dashed ${self.isHover ? '#20a0ff' : '#d9d9d9'}`,
               borderRadius: '6px',
               cursor      : 'pointer',
               position    : 'relative',
               overflow    : 'hidden'
             }
           },
           [ self.value[prop]
              ? h('img',
                  {
                    domProps: {src: self.value[prop]},
                    style   : {
                      width  : '80px',
                      height : '80px',
                      display: 'block'
                    }
                  })
              : h('i',
                  {
                    'class': ['el-icon-plus'],
                    style  : {
                      fontSize  : '28px',
                      color     : '#8c939d',
                      width     : '80px',
                      height    : '80px',
                      lineHeight: '80px',
                      textAlign : 'center'
                    }
                  })
            ]
  )
}
