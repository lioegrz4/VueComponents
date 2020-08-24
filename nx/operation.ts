import { Content, getProps } from "./manifest";
import { Status, Path } from "./types";
import _ from 'lodash';

interface OpCtx {
    data: Content
    status: Status
    type: string
    src: Path
    payload: any
    self: any
}

export default (ctx: OpCtx) => {
    let { data, status, type, src, payload, self } = ctx
    let arg = _(data).get(src, { props: {} })
    switch (type) {
        case 'mouseenter':
            status.currentPath.push(src)
            break
        case 'mouseleave':
            status.currentPath.pop()
            break
        case '添加':
            // console.log(type, src, payload)
            break
        case '修改':
            handleModify({
                args: getProps(arg.kind),
                params: arg.props,
                src
            })
            break
        case '删除':
            self.$delete(_(data).get(src.slice(0, -1)), _(src).last())
            break
        case 'drop':
            let fn: any = payload.id === 'main'
                ? handleDragMain
                : payload.id === 'dock'
                && handleDragDock
            // handleDragDock 时，以下两个对象都有 type 字段。`事件类型`被`组件类型`覆盖
            fn({ ...ctx, ...payload })
            break
        default:
            console.log(`无效操作 ${type}`)
    }
}

function handleModify({args, params, src}) {
    console.log('实参', params)
    console.log('形参', args)
    console.log('src', src)
}

function handleDragDock({ self, data, src:target, pos, kind }) {
    let e = _(data).get(target)
    if (!e.children) {self.$set(e, 'children', [])}
    e.children.push({props:{}, kind})
}
function handleDragMain({ self, data, src:target, pos, path:src }) {
    console.log(pos, 'target', target, 'src', src)
}
