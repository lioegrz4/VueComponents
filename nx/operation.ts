import { Content, getProps, getNode } from "./manifest";
import { Status, Path } from "./types";
import _ from 'lodash/fp';

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

function handleDragDock({ self, data, src:target, pos, kind, type }) {
    let e = getNode(target)(data)
    if (!e.children) {self.$set(e, 'children', [])}
    e.children.push({props:{}, kind})
}
function handleDragMain({ self, data, src:target, pos, path:src }) {
    let sp = _.flow(_.initial, getNode)(src)(data)
    let t = getNode(target)(data)
    let s = getNode(src)(data)
    t.children.push(s)
    self.$delete(sp, _.last(src))
}
